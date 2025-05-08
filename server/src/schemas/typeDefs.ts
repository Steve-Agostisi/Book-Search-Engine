
import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Book {
    bookId: String!
    title: String!
    authors: [String]
    description: String!
    image: String
    link: String
  }

  type VolumeInfo {
    title: String
    authors: [String]
    description: String
    imageLinks: ImageLinks
    infoLink: String
  }

  type ImageLinks {
    thumbnail: String
  }

  type SearchBook {
    bookId: String
    volumeInfo: VolumeInfo
  }

  type User {
    _id: ID!
    username: String!
    email: String!
    password: String!
    savedBooks: [Book]
    bookCount: Int
  }

  input BookInput {
    bookId: String!
    title: String!
    authors: [String]
    description: String!
    image: String
    link: String
  }

  input UserInput {
    username: String!
    email: String!
    password: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    getSingleUser(id: ID, username: String): User
    searchGoogleBooks(query: String!): [SearchBook]
    getMe: User
  }

  type Mutation {
    createUser(input: UserInput!): AuthPayload
    login(username: String, email: String, password: String!): AuthPayload
    saveBook(userId: ID!, bookInput: BookInput!): User
    deleteBook(userId: ID!, bookId: String!): User
  }
`;

export default typeDefs;
