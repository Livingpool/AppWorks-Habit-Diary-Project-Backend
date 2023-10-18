const express = require('express')
//const bodyParser = require('body-parser')
const path = require('path')
const cors = require('cors')

const mongoose = require('mongoose')

require('dotenv').config()


const api_sunny= require("./api_sunny")


const uri = process.env.MONGO_URI
const options = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
}

// 連接到 MongoDB
mongoose
	.connect(uri, options)
	.then(() => {
		console.log('MongoDB is connected')
	})
	.catch((err) => {
		console.log(err)
	})

const app = express()

// Middleware
const PORT = 3000
app.use(express.json())
app.use(cors())

// app.use('/post',api_sunny)
app.use('/', api_sunny)

// 如果需要設置CORS
// const corsOptions = {
// 	origin: [
// 	  'http://www.example.com',
// 	  'http://localhost:8080',
// 	],
// 	methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
// 	allowedHeaders: ['Content-Type', 'Authorization'],
// };
  
// app.use(cors(corsOptions));

// Default router
app.get('*', (req, res) => {
	res.status(404).json({ error: 'Page did not exist' })
})

app.use((err, req, res, next) => {
	const status = err.status || 500
	if (status === 500) {
		console.log('The server errored when processing a request')
		console.log(err)
	}

	res.status(status)
	res.send({
		status: status,
		message: err.message,
	})
})

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`)
})
