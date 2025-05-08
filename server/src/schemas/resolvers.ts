import User from '../models/User.js';
import { signToken } from '../services/auth.js';
import { IResolvers } from '@graphql-tools/utils';
import fetch from 'node-fetch';

const resolvers: IResolvers = {
  Query: {
    getSingleUser: async (_parent: any, { id, username }: { id: string; username: string }, _context:any) => {
      const foundUser = await User.findOne({
        $or: [{ _id: id }, { username: username }],
      });

      if (!foundUser) {
        throw new Error('Cannot find a user with this id!');
      }

      return foundUser;
    },

     searchGoogleBooks: async (_parent, { query }, _context) => {
      try {
        console.log('Searching Google Books API for:', query);
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch books from Google Books API');
        }
        const data = await response.json();
        console.log('Google Books API response:', data);
        if (!data.items || !Array.isArray(data.items)) {
          return [];
        }
        return data.items.map((book: any) => ({
          bookId: book.id,
          volumeInfo: {
            title: book.volumeInfo.title,
            authors: book.volumeInfo.authors || ['No author to display'],
            description: book.volumeInfo.description || 'No description available',
            imageLinks: {
              thumbnail: book.volumeInfo.imageLinks?.thumbnail || ''
            },
            infoLink: book.volumeInfo.infoLink || ''
          }
        }));
      } catch (error) {
        console.error('Error in searchGoogleBooks:', error);
        throw new Error('Failed to search for books');
      }
    },
    getMe: async (_parent, _args, context) => {
      if (context.user) {
        return await User.findById(context.user._id);
      }
      throw new Error('You need to be logged in!');
    }
  },

 
  Mutation: {
    createUser: async (_parent: any, { input }: { input: any }, _context: any) => {
      const user = await User.create(input);

      if (!user) {
        throw new Error('Something is wrong!');
      }

      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },
    login: async (_parent: any, { username, email, password }: { username: string; email: string; password: string }, _context: any) => {
      const user = await User.findOne({ $or: [{ username: username }, { email: email }] });

      if (!user) {
        throw new Error("Can't find this user");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new Error('Wrong password!');
      }

      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },
    saveBook: async (_parent: any, { userId, bookInput }: { userId: string; bookInput: any }, _context: any) => {
      try {
        // First check if the book already exists
        const user = await User.findById(userId);
        if (!user) {
          throw new Error('User not found');
        }

        // Check if the book is already saved
        const bookExists = user.savedBooks.some(book => book.bookId === bookInput.bookId);
        if (bookExists) {
          return user; // Return the user without adding the duplicate book
        }

        // If book doesn't exist, add it
        const updatedUser = await User.findOneAndUpdate(
          { _id: userId },
          { $push: { savedBooks: bookInput } },
          { new: true, runValidators: true }
        );
        return updatedUser;
      } catch (err) {
        console.log(err);
        throw new Error('Error saving book');
      }
    },
    deleteBook: async (_parent: any, { userId, bookId }: { userId: string; bookId: string }, _context: any) => {
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        { $pull: { savedBooks: { bookId: bookId } } },
        { new: true }
      );

      if (!updatedUser) {
        throw new Error("Couldn't find user with this id!");
      }

      return updatedUser;
    },
  },
};

export default resolvers;