export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://mongo:27017/clean-node-api',
  PORT: process.env.PORT || 7777,
  jwtSecret: process.env.jwtSecret || 'ta58@sx9AwlndmZpl!hWq452#'
}