const express = require('express');
const connectDB = require('./config/db')
const path = require('path');

const app = express();
//connect DB
connectDB();

//Init Middleware
app.use(express.json({ extended: false })); 

//app.get('/',(req,res) => res.send('API running'));

// Define Routes
app.use('/api/users',require('./Route/Api/users'));
app.use('/api/auth',require('./Route/Api/auth'));
app.use('/api/posts',require('./Route/Api/posts'));
app.use('/api/profile',require('./Route/Api/profile'));

//Serve static assets in production 
if(process.env.NODE_ENV === 'production'){
    // Set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(_dirname, 'client', 'build', 'index.html'));
    })
}

const PORT = process.env.PORT || 5000;

app.listen(PORT,() => console.log('Server Started in port ${PORT}'))