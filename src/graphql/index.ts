import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import resolvers from './resolver';
import typeDefs from './type-defs';
import Auth from '../auth/auth';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: Auth,
});

export default server;
