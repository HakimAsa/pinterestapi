import 'colors'
import bcrypt from 'bcryptjs'

import User from './src/models/user.models.js'
import Comment from './src/models/comment.models.js'
import Board from './src/models/board.models.js'
import Pin from './src/models/pin.models.js'
import db from './src/startup/db.js'

// ✅ Connect to MongoDB
db()

const seedDB = async () => {
  await User.deleteMany({}) // Clear the user collection
  await Comment.deleteMany({}) // Clear the comment collection
  await Board.deleteMany({}) // Clear the board collection
  await Pin.deleteMany({}) // Clear the pin collection

  // Create sample users
  const users = []
  const hashedPassword = await bcrypt.hash('password123', 10) // Hash the password once for all users

  for (let i = 1; i <= 10; i++) {
    users.push({
      email: `user${i}@example.com`,
      displayName: `User ${i}`,
      username: `user${i}`,
      profilePicture: `https://picsum.photos/id/${i}/200/200`,
      password: hashedPassword, // Use the same hashed password for all users
    })
  }

  const savedUsers = await User.insertMany(users) // Save all users at once

  // Create sample boards
  const boards = []
  for (const user of savedUsers) {
    for (let i = 1; i <= 10; i++) {
      boards.push({
        title: `Board ${i}`,
        user: user._id,
      })
    }
  }

  const savedBoards = await Board.insertMany(boards) // Save all boards at once

  // Create sample pins
  const pins = []
  for (const user of savedUsers) {
    const userBoards = savedBoards.filter(
      (board) => board.user.toString() === user._id.toString()
    )

    for (let p = 1; p <= 10; p++) {
      const mediaSize = Math.random() < 0.5 ? '800/1200' : '800/600'
      pins.push({
        title: `Pin ${p} by ${user.username}`,
        description: `This pin ${p} created by ${user.username}`,
        media: `https://picsum.photos/id/${p + 10}/${mediaSize}`,
        board: userBoards[p - 1]._id,
        user: user._id,
        link: `https://example.com/pin${p}`,
        tags: [`tag${p}`, 'sample', user.username],
        height: mediaSize === '800/1200' ? 1200 : 600,
        width: 800,
      })
    }
  }
  const savedPins = await Pin.insertMany(pins)

  // Create sample comments
  const comments = []
  for (const user of savedUsers) {
    for (let c = 1; c <= 10; c++) {
      const randomPin = savedPins[Math.floor(Math.random() * savedPins.length)]
      comments.push({
        description: `Comment ${c} by ${user.username}: This is a great pin!`,
        user: user._id,
        pin: randomPin._id,
      })
    }
  }

  await Comment.insertMany(comments)
  console.log(
    `✅ Seed completed: ${savedUsers.length} users, ${savedBoards.length} boards, ${savedPins.length} pins, ${comments.length} comments.`
  )
}

seedDB()
  .then(() => {
    console.log('🌱 Seeding done.')
    process.exit(0)
  })
  .catch((err) => {
    console.error('❌ Seeding error:', err)
    process.exit(1)
  })
