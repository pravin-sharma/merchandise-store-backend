require('dotenv').config({path:'./env'})
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser =require('cookie-parser');
const cors = require('cors');

//Routes
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order');

const port = process.env.PORT || 8000;
//console.log(process.env.PORT);
const app = express();

//DB connection
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
    })
    .then(()=>{
        
        console.log("DB Connected");
    })
    .catch(err=>{
        console.log(err);
    })

//Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//My Routes
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', orderRoutes);

//Server
app.listen(port, () => {
    console.log(`Listening on port:${port}`);
})

