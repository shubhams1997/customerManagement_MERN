require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// My routes
const authRouters = require('./routes/auth');
const userRouters = require('./routes/user');
const categoryRouters = require('./routes/category');
const brandRouters = require('./routes/brand');
const productRouters = require('./routes/product');
const complaintRouters = require('./routes/complaint');
const financetRouters = require('./routes/finance');
const seriesRouters = require('./routes/series');

const app = express();
const port = 8000;

// Middlewares
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use('/api', authRouters);
app.use('/api', userRouters);
app.use('/api', categoryRouters);
app.use('/api', brandRouters);
app.use('/api', productRouters);
app.use('/api', complaintRouters);
app.use('/api', financetRouters);
app.use('/api', seriesRouters);

mongoose
	.connect(process.env.DATABASE_PATH, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false
	})
	.then(() => {
		console.log('DB is Connected!');
	})
	.catch((err) => console.error('Database is not connected'));

app.get('/', (req, res) => {
	console.log(req.query);
	return res.send(JSON.stringify(req.query));
});
http.createServer(app).listen(port, '0.0.0.0');
