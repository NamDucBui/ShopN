require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const connectMongoDB = require('./config/mongo')
const { prisma } = require('./config/prisma')
const app = express()

app.use(express.json())
app.use(cors())
app.use(morgan('dev'))

const productRoute = require('./routes/product.routes')

connectMongoDB();

app.get('/', (req, res) => {
    res.json({ message: "Server đang chạy" })
})

app.use('/api/products', productRoute)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`)
})