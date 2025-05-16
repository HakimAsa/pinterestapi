import mongoose from 'mongoose'
export default () => {
  const db = process.env.MONGO_URI || 'mongodb://localhost:27017/akimpin'
  mongoose
    .connect(db, {})
    .then(() => {
      console.log(`MongoDB connected at ${db}...`.cyan.underline.bold)
    })
    .catch((err) => {
      console.error(err.message.red.underline.bold)
      process.exit(1)
    })
}
