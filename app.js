const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const compression = require('compression');
require('dotenv').config();

const electricRouter = require('./routes/electric_index');
const gasRouter = require('./routes/gas_index');
const adminRouter = require('./routes/admin');
var UserModel = require("./models/CustomerModel");
const petrolRouter = require('./routes/petrol_index');
const app = express();
const PORT = process.env.PORT || 3000;


// Connecting to Mongodb
const db = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false

        });
        // const conn = await mongoose.connect('mongodb://127.0.0.1:27017/autorizz', {
        //     useNewUrlParser: true,
        //     useUnifiedTopology: true,
        //     useFindAndModify: false
        // });

        console.log("MongoDB connected");

    } catch (err) {
        console.log("MongoDB Error : Failed to connect");
        console.log(err);
        process.exit(1);
    }
}

db();
// async function insertData(data) {
//     const db = mongoose.connection; // Access the Mongoose connection
//     const collection = db.collection('user'); // Replace with your collection name
//     const result = await collection.insertOne(data);
//     console.log('Inserted a document with ID:', result.insertedId);
// }

// // Usage
// insertData({ userID: 'admin', password: 'admin' });
// Function to insert multiple documents
// async function insertManyData(data) {
//     try {
//         const db = mongoose.connection; // Access the Mongoose connection
//         const collection = db.collection('electricmodel'); // Replace with your collection name
//         const result = await collection.insertMany(data); // Use insertMany instead of insertOne
//         console.log('Inserted', result.insertedCount, 'documents');
//     } catch (error) {
//         console.error('Error inserting documents:', error);
//     }
// }

// // Usage
// const dataToInsert = [
//     {
        
//         imagePath: "images/7.JPG",
//         title: "Tesla Model Y Performance",
//         t1: "2020 Tesla Model Y",
//         t2: "Performance Edition",
//         year: 2020,
//         price: 65000,
//         priceStr: "65,000",
//         topspeed: "145",
//         time60: "3.5",
//         range: "315",
//         colour: "Solid Black Paint",
//         interior: "Cream Oakwood Interior",
//         wheel: "19'' Gemini Wheels",
//         description: "Model Y provides maximum versatility creating flexible storage for skis, furniture, luggage and a low trunk floor that makes loading and unloading easy and quick with all-Wheel Drive has two ultra-responsive, independent electric motors that digitally control torque.",
//         safety: "Safety is the most important part of the overall Model 3 design. The metal structure is a combination of aluminum and steel, for maximum strength in every area. In a roof-crush test, Model 3 resisted four times its own mass, even with an all-glass roof",
//         rangedesc: "Model 3 is fully electric, so you never need to visit a gas station again. If you charge overnight at home, you can wake up to a full battery every morning. And when you’re on the road, it’s easy to plug in along the way—at any public station or with the Tesla charging network."
//       },{
//         imagePath: "images/8.JPG",
//         title: "Tesla Model Y Long Range AWD",
//         t1: "2020 Tesla Model Y",
//         t2: "Long Range AWD Edition",
//         year: 2020,
//         price: 52000,
//         priceStr: "52,000",
//         topspeed: "135",
//         time60: "4.8",
//         range: "346",
//         colour: "Red Metallic Paint",
//         interior: "Cream Oakwood Interior",
//         wheel: "19'' Induction Wheels",
//         description: "Model Y provides maximum versatility creating flexible storage for skis, furniture, luggage and a low trunk floor that makes loading and unloading easy and quick with all-Wheel Drive has two ultra-responsive, independent electric motors that digitally control torque.",
//         safety: "Safety is the most important part of the overall Model 3 design. The metal structure is a combination of aluminum and steel, for maximum strength in every area. In a roof-crush test, Model 3 resisted four times its own mass, even with an all-glass roof",
//         rangedesc: "Model 3 is fully electric, so you never need to visit a gas station again. If you charge overnight at home, you can wake up to a full battery every morning. And when you’re on the road, it’s easy to plug in along the way—at any public station or with the Tesla charging network."
//       }
// ];

// insertManyData(dataToInsert);

// view engine setup
app.engine('.hbs', exphbs({
    defaultLayout: 'layout', extname: '.hbs',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
}));
app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(compression());

console.log("App running on Localhost:5000");


// Routing
app.get('/', (req, res) => {
    // res.redirect('/home');
    res.sendFile(__dirname + "/routes/index.html");
});


app.get('/home', function (req, res) {
    res.sendFile(__dirname + "/routes/index.html");
});

app.use('/admin', adminRouter);
app.use('/electric', electricRouter);
app.use('/gas', gasRouter);
app.use('/petrol', petrolRouter);


//Users
app.post('/customer', async (req, res) => {

    const user = new UserModel({
        name: req.body.username,
        email: req.body.useremail,
        phone: req.body.userphone
    })

    const user_res = await user.save();
    console.log(user_res);
});



// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
