import express from 'express';
import db from './config/connection.js'
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from './schemas/index.js';
import { authenticateToken } from './services/auth.js';
import path from 'path'; 
import { fileURLToPath } from 'url'; 


const server = new ApolloServer({
  typeDefs,
  resolvers
});

const startApolloServer = async () => {
  await server.start(); 
  const __filename=fileURLToPath(import.meta.url); 
  const __dirname=path.dirname(__filename); 
  
  // Connect to MongoDB using the environment variable
  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    console.error('MONGODB_URI environment variable is not set');
    process.exit(1);
  }

  try {
    await db; 
    console.log('Connected to MongoDB successfully!');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }

  const PORT = process.env.PORT || 3001;
  const app = express();


  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.use('/graphql', expressMiddleware(server, {
    context: async ({ req }) => {
      const context = await authenticateToken({ req });
      return context;
    }
  })); 

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../../client/dist')));

    // TODO: Uncomment this code once you have built out queries and mutations in the client folder
    app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
};

startApolloServer();
