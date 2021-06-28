//jshint esversion: 6


// Modules Used ---
const express = require('express'); // node js extention
const bodyParser = require('body-parser'); // user input reading
const mongoose = require('mongoose'); // mongoDb extention


// Integrating all modules basic functions ---
const app = express();
app.set('view engine', "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
mongoose.connect('mongodb://localhost:27017/todoListDB', { useNewUrlParser: true, useUnifiedTopology: true });


// Item Schema for adding data ---
const itemSchema = new mongoose.Schema({ task: String });
// Model (Collectiong) creating (DB) ---
let tasksModel = mongoose.model("default", itemSchema);


// Adds data to a collection in DB ---
addItem = (collection, value) => {

    // Collection Switching/creating ---
    tasksModel = mongoose.model(collection, itemSchema);
    
    // Adding data to the created collection
    const task = new tasksModel({ task: value });
    tasksModel.insertMany([task]);
};


// Removes Data from a Collection ---
rmItem = (collection, value) => {
    
    // Switching to the collection ---
    tasksModel = mongoose.model(collection, itemSchema);
    
    // Deleting the data from the collection ---
    tasksModel.deleteOne({ task: value }, (err) => { });
};


// Make Title from custom link ----
returnLink = (data) => {

    // Creating title shown to user ----
    let titleSave = '';
    let showTitle = data.split('-');
    for (let value of showTitle) { titleSave += " " + value[0].toUpperCase() + value.slice(1).toLowerCase(); }
    showTitle = titleSave.replace(' ', '');

    // Creating title used for creating collections ----
    let saveData = data.toLowerCase().split(' ').join('-');

    return { sT: showTitle, sD: saveData };
};


// Gives Current Date in formated Form ---
getCurrentDate = () => {
    const day = new Date();
    const options = {
        day: "numeric",
        month: "long",
        weekday: "long"
    };
    return day.toLocaleDateString('en-US', options);
};


// Main Page ----
app.get('/', (req, res) => {

    // Getting the current Date
    formatedDay = getCurrentDate();
    
    // Creating/Switching Collection(Todo) default
    tasksModel = mongoose.model('default', itemSchema);

    // Gives time to all the processes above to complete
    setTimeout(() => {
        // Read data from default collection list
        tasksModel.find({}, (err, data) => {
            
            // Display the data readed from collection list
            res.render('index', { listHeading: formatedDay, listOfTaks: data });
        });
    }, 200);
});


// Custom Pages --
app.get('/:title', (req, res) => {
    // Get title from the user custom link --
    let title = returnLink(req.params.title);
    // Create/Switch collection --
    tasksModel = mongoose.model(title.sD, itemSchema);
    
    // Gives time to all the processes above to complete
    setTimeout(() => {
        
        // Read data from custom collection list
        tasksModel.find({}, (err, data) => {

            // Display the data readed from collection list
            res.render('custom', { listHeading: title.sT + " List", listOfTaks: data, title: title.sD });
        });
    }, 200);
});


// Grabs data user send from website ---
app.post('/', (req, res) => {

    // Gets the subdir from which the user send data (https://link/subdir)
    let subDir = req.headers.referer.split('/');
    subDir = subDir[subDir.length - 1];

    // Checks if user data given is not null
    if (req.body.task !== '') {
        
        // Check if user send data from the main directory (default)
        if (subDir == "") {
            addItem('default', req.body.task); // add data to default collection list 
        }        
        // Else if user send data from the custom directory
        else {
            addItem(subDir, req.body.task); // add data to custom collection list 
        }
    }
    
    // Redirect to the same page ---
    res.redirect('/' + subDir);
});


// Remove Data From the Main Collection ---
app.post('/remove', (req, res) => {

    // Gets task which to remove(when clicked deleted button)
    const rmWord = req.rawHeaders[9];
    
    // Remove that item where the task matches with rmWord
    rmItem('default', rmWord);

    // redirect to the Main Page --
    res.redirect('/');
});


// Remove Data From the Custom Collection ---
app.post('/:title/remove', (req, res) => {

    // Get title from the user custom link --
    let title = returnLink(req.params.title);
    // Gets task which to remove(when clicked deleted button)
    const rmWord = req.rawHeaders[9];
    
    // Remove that item where the task matches with rmWord
    rmItem(title.sD, rmWord);

    // redirect to the Main Page --
    res.redirect('/' + title.sD.toLowerCase());
});


// Express server ----
app.listen('4444', () => { console.log("Started Server"); });