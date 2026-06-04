require('dotenv').config();
const { ApolloServer } = require('apollo-server');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const { verificarToken } = require('./auth');

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        const token = req.headers.authorization || '';

        if (token) {
            try {
                const usuario = verificarToken(token.replace('Bearer ', ''));
                return { usuario };
            } catch (error) {
                return { usuario: null };
            }
        }
        return { usuario: null };
    }
});

server.listen().then(({ url }) => {
    console.log(`🚀 Servidor listo en ${url} 🚀`);
});