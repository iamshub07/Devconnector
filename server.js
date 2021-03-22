const express = require('express');
const connectDB = require('./config/db')

const app = express();
//connect DB
connectDB();

//Init Middleware
app.use(express.json({ extended: false })); 

app.get('/',(req,res) => res.send('API running'));

// Define Routes
app.use('/api/users',require('./Route/Api/users'));
app.use('/api/auth',require('./Route/Api/auth'));
app.use('/api/posts',require('./Route/Api/posts'));
app.use('/api/profile',require('./Route/Api/profile'));

const PORT = process.env.PORT || 5000;

app.listen(PORT,() => console.log('Server Started in port ${PORT}'))