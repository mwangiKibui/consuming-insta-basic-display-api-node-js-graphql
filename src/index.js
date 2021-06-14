const express = require("express");
const cors = require("cors");
require("dotenv").config();
const PORT = process.env.PORT || 4000;
const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");

// initialize express
const app = express();

// express configs
app.use(cors()); // cors set up
app.use(express.json()); // json format
app.use(express.urlencoded({ extended: false })); // data parsing

// configure the apollo server
const server = new ApolloServer({ typeDefs, resolvers });
server.start().then(() => {
  return server.applyMiddleware({ app });
});

// routes

// getting-authorization-code
app.get("/get-auth-code", (req, res, next) => {
  return res.send(
    `<a href='https://api.instagram.com/oauth/authorize?client_id=${process.env.INSTAGRAM_APP_ID}&redirect_uri=${process.env.REDIRECT_URI}&scope=user_media,user_profile&response_type=code'> Connect to Instagram </a>`
  );
});

// start server on the PORT.
app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
