const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const connectDB = require('./config/db')

// Load config
dotenv.config({ path: './config/config.env' })

connectDB()

const app = express()

// Body parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(express.static(path.join(__dirname, 'public')))

const PORT = process.env.PORT || 3000

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)