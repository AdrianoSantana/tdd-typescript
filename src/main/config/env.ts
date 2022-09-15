export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/clean-node-api',
  port: process.env.port || 5050,
  jwtSecret: process.env.jwtSecret || 'ta58@sx9AwlndmZpl!hWq452#'
}