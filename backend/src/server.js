require('dotenv').config()
const express = require('express')
const app = express()
app.use(express.json())

app.get('/', (req, res) => {
    res.json({message: "Server đang chạy"})
})

const PORT = process.env.PORT 
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`)
})