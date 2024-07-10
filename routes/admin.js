const express = require('express');
const router = express.Router();
const multer = require('multer');
const ElectricModel = require("../models/ElectricModel");
const GasModel = require('../models/GasModel');
const RentModel = require("../models/rentModel");
const ServiceModel = require('../models/ServiceModel');
const CustomerModel = require('../models/CustomerModel');
const UserModel = require("../models/UserModel");
const sendEmail = require("../utils/mailer");


// Set Image Storage
const storage = multer.diskStorage({
    destination: './public/images/',
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

  
  // Init Upload
  
  const upload = multer({ storage: storage });


// Set Image Storage
// const storage = multer.diskStorage({
//     destination: './public/images/',
//     filename: function (req, file, cb) {
//         cb(null, file.originalname);


//     }
// });
// // Init Upload
// const upload = multer({
//     storage: storage
// }).single('imagePath');

// const upload = multer({
//     dest: './uploads/',
//     limits: {
//       fileSize: 10000000, // 10MB
//     },
//   });
//multiple Upload
// const upload = multer({
//     storage: storage
// }).array('imagesupld', 10);


router.use(express.static("public"));



// GET Root Route - Admin login
router.get('/', function (req, res) {
    res.sendFile(__dirname + "/login.html");
});

// GET Login Error
router.get('/login_error', function (req, res) {
    res.sendFile(__dirname + "/loginerror.html");
});

// POST Admin login
router.post("/login", async function (req, res) {

    let id = req.body.userid;
    let pass = req.body.password;
    console.log(pass);
    

    let user = await UserModel.findOne({ userID: "admin" });
    console.log(user);
    console.log(pass);
    if (pass == user.password) {
        console.log("Login Success");
        res.redirect("home");
    } else {
        res.redirect("login_error");
    }

});




// GET - Home Page
router.get('/home', function (req, res) {
    res.render("admin/admin_index", { layout: false });
});



// GET Service Page
router.get('/service', async function (req, res) {

    let servicecars = await ServiceModel.find();
    console.log(servicecars);
    res.render("admin/service.hbs", { servicecars: servicecars, layout: false });

});

// GET send email
router.get('/service/email/:mailid', async function (req, res) {

    var client_email = req.params.mailid;
    var mail_status = await sendEmail(client_email);
    console.log("Email Status - " + mail_status);
    res.redirect('/admin/service');
});



//GET Admin Index
router.get('/admin_index', async function (req, res) {
    res.render("admin/admin_index", { layout: false });
});

// GET Petrol Cars
router.get('/petrol', async function (req, res) {

    let gas_models = await GasModel.find();
    res.render("admin/petrol_list", { list: gas_models, layout: 'layout_list' });
});

// GET Electric Cars
router.get('/electric', async function (req, res) {

    let electric_models = await ElectricModel.find();
    res.render("admin/electric_list", { list: electric_models, layout: 'layout_list' });
});


// Get Add electric Cars Form Page
router.get('/addelectric', (req, res) => {
    res.render("admin/electric_form", { layout: false });
});


// POST Electric Car Form
router.post('/addelectric', async function (req, res) {

    let electric = new ElectricModel(req.body);

    result = await electric.save();
    console.log(result);

    res.redirect('/admin/electric');

});


// Delete Electric Car
router.get('/deleteelectric/:id', async function (req, res) {

    const result = await ElectricModel.findByIdAndRemove(req.params.id);
    console.log(result);

    res.redirect('/admin/electric');
});


// Edit Electric Car
router.get('/editelectric/:id', async function (req, res) {

    const electric_model = await ElectricModel.findById(req.params.id);
    console.log(electric_model);
    res.render("admin/edit_electric", { electric_model });
    
});

// Edit Electric Car Form
router.post('/editelectric', async function (req, res) {

    
    let id = req.body.id;
    console.log(id);
    
    const electric_model = await ElectricModel.findByIdAndUpdate(
        req.body.id,
        {
          $set: {
            imagePath: req.body.imagePath,
            title: req.body.title,
            t1: req.body.t1,
            t2: req.body.t2,
            year: req.body.year,
            price: req.body.price,
            priceStr: req.body.priceStr,
            topspeed: req.body.topspeed,
            time60: req.body.time60,
            range: req.body.range,
            color: req.body.color,
            interior: req.body.interior,
            wheel: req.body.wheel,
            description: req.body.description,
            safety: req.body.safety,
            rangedesc: req.body.rangedesc,
          },
        },
        {
          upsert: true,
        }
      );
    console.log(electric_model);

    res.redirect('/admin/electric');

});




// GET Gas Cars
router.get('/gas', async function (req, res) {

    let gas_models = await GasModel.find();
    res.render("admin/gas_list", { list: gas_models, layout: 'layout_list' });
});


// Get Add Gas Cars Form Page
router.get('/addgas', (req, res) => {
    res.render("admin/gas_form", { layout: false });
});

// POST Gas Car Form
router.post('/addgas', async function (req, res) {

    let gas = new GasModel(req.body);

    result = await gas.save();
    console.log(result);

    res.redirect('/admin/gas');

});


// Delete Gas Car
router.get('/deletegas/:id', async function (req, res) {

    const result = await GasModel.findByIdAndRemove(req.params.id);
    console.log(result);

    res.redirect('/admin/gas');
});


// GET rent Cars

router.get('/rent', async function (req, res) {

    let rent_models = await RentModel.find().sort({_id: -1});
    
    res.render("admin/rent_list", { list: rent_models, layout: 'layout_list' });
});
router.get('/addrent', (req, res) => {
    res.render("admin/rent_form", { layout: false });
});

// Post rent form
router.post('/addrent',upload.array('imagePath', 10), async function (req, res) {
    // upload.array('imagePath'),
    // const imagePath = req.files?.map(file => file.filename) ?? [];
    // const imagePaths = req.files?.map(file => file.filename) ?? [];
    // const imagePathString = imagePaths.join(','); // Convert array to a comma-separated string
    // upload(req, res, (err) => {

    //     if (err) {
    //         img = { err: err };
    //         console.log(img);
    //         res.render('admin/images_upload', { img: img, layout: false });
    //     }
    //     else {
    //         if (req.file == undefined) {
    //             img = { err: "No File Uploaded" }
    //             res.render('admin/images_upload', { img: img, layout: false });
    //         }
    //         else {
    //             console.log(req.file);
    //             res.redirect("/admin");
    //         }
    //     }

    // });
    // const imagePath = req.file.originalname;
    // console.log(imagePath);
    // res.render("admin/rent_form", { layout: false });
    // await upload(req, res);

  // Check if the user uploaded a file

  
// if (req.file) {
//     const imageBuffer = req.file.buffer;

    // Create a new RentModel instance

    
// const rent = new RentModel({
//     imagePath: imageBuffer,
//     contentType: req.file.mimetype,
//       title: req.body.title,
//       year: req.body.year,
//       dailyRent: req.body.dailyRent,
//       weeklyRent: req.body.weeklyRent,
//       deposit: req.body.deposit,
//       age: req.body.age,
//       price: req.body.price,
//       priceStr: req.body.price,
//       topspeed: req.body.topspeed,
//       time60: req.body.time60,
//       range: req.body.range,
//       colour: req.body.colour,
//       interior: req.body.interior,
//       wheel: req.body.wheel,
//       description: req.body.description,
//       safety: req.body.safety,
//       rangedesc: req.body.rangedesc,
//     });

    // Save the rent model to the database

    
// await rent.save();
//   } else {
    // Handle the case where the user did not upload a file
//     res.status(400).send('No file uploaded');
//   }

  // Redirect the user to the admin rent page
//   res.redirect('/admin/rent');

    const images = req.files; // Array of uploaded files

    const imagePaths = images.map(file => file.originalname.replace(/\s/g, '_'));

    
    const newDocument = {
        imagePath: imagePaths,
        // originalImageName: req.file.originalname,
      title: req.body.title,
      year: req.body.year,
      dailyRent: req.body.dailyRent,
      weeklyRent: req.body.weeklyRent,
      deposit: req.body.deposit,
      age: req.body.age,
      price: req.body.price,
      priceStr: req.body.price,
    //   topspeed: req.body.topspeed,
    //   time60: req.body.time60,
    //   range: req.body.range,
    //   colour: req.body.colour,
    //   interior: req.body.interior,
    //   wheel: req.body.wheel,
      description: req.body.description,
    //   safety: req.body.safety,
    //   rangedesc: req.body.rangedesc,
    };
    // if (imagePaths.length === 0) {
    //     throw new ValidationError('The image path array cannot be empty.');
    //   }
    // Create a new RentModel instance with the new document
    
    try {
        // Create a new RentModel instance with the new document
        const rent = new RentModel(newDocument);
  
        // Save the rent model to the database
        const result = await rent.save();
  
        // Redirect the user to the admin rent page
        res.redirect('/admin/rent');
    } catch (error) {
        // Handle any database or validation errors here
        console.error(error);
        res.status(500).send("An error occurred while saving the data.");
    }
  });

// Get Add electric Cars Form Page
router.get('/addelectric', (req, res) => {
    res.render("admin/electric_form", { layout: false });
});
// Delete Rent Car
router.get('/deleterent/:id', async function (req, res) {

    const result = await RentModel.findByIdAndRemove(req.params.id);
    console.log(result);

    res.redirect('/admin/rent');
});

// Edit Rent Car
router.get('/editrent/:id', async function (req, res) {

    const rent_model = await RentModel.findById(req.params.id);
    console.log(rent_model);
    res.render("admin/edit_rent", { rent_model });
    
});

// Edit Rent Car Form
router.post('/editrent', async function (req, res) {

    
    let id = req.body.id;
    console.log(id);
    
    const rent_model = await RentModel.findByIdAndUpdate(
        req.body.id,
        {
          $set: {
            imagePath: req.body.imagePath,
            title: req.body.title,
            year: req.body.year,
            dailyRent: req.body.dailyRent,
            weeklyRent: req.body.weeklyRent,
            deposit: req.body.deposit,
            age: req.body.age,
            price: req.body.price,
            priceStr: req.body.priceStr,
            topspeed: req.body.topspeed,
            time60: req.body.time60,
            range: req.body.range,
            colour: req.body.colour,
            interior: req.body.interior,
            wheel: req.body.wheel,
            description: req.body.description,
            safety: req.body.safety,
            rangedesc: req.body.rangedesc,
          },
        },
        {
          upsert: true,
        }
      );
    console.log(rent_model);

    res.redirect('/admin/rent');

});



// POST Electric Car Form
router.post('/addelectric', upload.array('imagePath', 10), async function (req, res) {
    const images = req.files; // Array of uploaded files
    const imagePaths = images.map(file => file.originalname.replace(/\s/g, '_'));

    const newDocument = {
        imagePath: imagePaths,
        title: req.body.title,
        t1: req.body.t1,
        t2: req.body.t2,
        year: req.body.year,
        price: req.body.price,
        priceStr: req.body.priceStr,
        topspeed: req.body.topspeed,
        time60: req.body.time60,
        range: req.body.range,
        colour: req.body.colour,
        interior: req.body.interior,
        wheel: req.body.wheel,
        description: req.body.description,
        safety: req.body.safety,
        rangedesc: req.body.rangedesc
    };

    try {
        const electric = new ElectricModel(newDocument);
        const result = await electric.save();
        console.log(result);
        res.redirect('/admin/electric');
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while saving the data.");
    }
});


// Delete Electric Car
router.get('/deleteelectric/:id', async function (req, res) {

    const result = await ElectricModel.findByIdAndRemove(req.params.id);
    console.log(result);

    res.redirect('/admin/electric');
});


// Edit Electric Car
router.get('/editelectric/:id', async function (req, res) {

    const electric_model = await ElectricModel.findById(req.params.id);
    console.log(electric_model);
    res.render("admin/edit_electric", { electric_model });
    
});

// Edit Electric Car Form
router.post('/editelectric', async function (req, res) {

    
    let id = req.body.id;
    console.log(id);
    
    const electric_model = await ElectricModel.findByIdAndUpdate(
        req.body.id,
        {
          $set: {
            imagePath: req.body.imagePath,
            title: req.body.title,
            t1: req.body.t1,
            t2: req.body.t2,
            year: req.body.year,
            price: req.body.price,
            priceStr: req.body.priceStr,
            topspeed: req.body.topspeed,
            time60: req.body.time60,
            range: req.body.range,
            color: req.body.color,
            interior: req.body.interior,
            wheel: req.body.wheel,
            description: req.body.description,
            safety: req.body.safety,
            rangedesc: req.body.rangedesc,
          },
        },
        {
          upsert: true,
        }
      );
    console.log(electric_model);

    res.redirect('/admin/electric');

});




// GET Customers
router.get('/customers', async function (req, res) {

    let customers = await CustomerModel.find();
    res.render("admin/customers_list", { list: customers, layout: false });
});

// Delete User
router.get('/deletecustomer/:id', async function (req, res) {

    const result = await CustomerModel.findByIdAndRemove(req.params.id);
    console.log(result);

    res.redirect('/admin/customers');
});









// Image Handling

// Get Upload Image Form Page
router.get('/images', (req, res) => {
    res.render("admin/images_upload", { layout: false });
});


// POST Image File
router.post('/uploadimage', (req, res) => {
    upload(req, res, (err) => {

        if (err) {
            img = { err: err };
            console.log(img);
            res.render('admin/images_upload', { img: img, layout: false });
        }
        else {
            if (req.file == undefined) {
                img = { err: "No File Uploaded" }
                res.render('admin/images_upload', { img: img, layout: false });
            }
            else {
                console.log(req.file);
                res.redirect("/admin");
            }
        }

    });

});



module.exports = router;