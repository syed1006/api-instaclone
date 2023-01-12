const app = require('./app');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

//configuring .env
dotenv.config();
//connect to DB
mongoose.connect(process.env.DATABASE_URL,{ useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log('connected to DB')
})


app.listen(3000, () => console.log('Server is running......'));

