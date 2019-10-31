const express = require('express');
var cors = require('cors');

const app = express();

// Routes
const authRoute = require('./routes/auth');
const postsRoute = require('./routes/posts');
const invoicesRoute = require('./routes/invoice');

app.use(cors({
	exposedHeaders: ["auth-token"] // expose authentication token header
}));

// Route Middleware
app.use(express.json());
app.use('/api/user', authRoute);
app.use('/api/posts', postsRoute);
app.use('/api/invoice', invoicesRoute);


app.listen(5000, () => { console.log('API up and running') });