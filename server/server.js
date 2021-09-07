import express from "express";
import { join } from 'path'
import { Low, JSONFile } from 'lowdb'

const app = express();
const server = app.listen(3000, console.log("Server is running"));
const date = new Date().toISOString()


// LowDB supports multiple kind of ways to save data via these adapters
const adapter = new JSONFile("./db.json");
const db = new Low(adapter);

// This reads data from out JSON file, assigining a value to db.data
await db.read();

// If db.json doesn't exist, db.data will be null; Set default data
db.data = db.data || { log: [] };
const log = db.data.log;



function myLog(req, res, next) {
    const endpoint = req.originalUrl
    db.data.log.push(`${date} ${endpoint} accessed`)
    console.log();

    db.write();

    next();
};




app.use(myLog)

//ENDPOINTS

app.get('/endpoint1', (req, res) => {
    console.log("First endpoint working");
    res.send("endpoint1 baby")
});

app.get('/endpoint2', (req, res) => {
    console.log("Second endpoint working");
    res.send("endpoint2 baby")
});

app.post('/endpoint3', (req, res) => {
    console.log("Third endpoint working");
    res.send("endpoint3 baby")
});


/// Waiting for Response
app.post('/endpoint4', (req, res) => {
    res.setTimeout(3000, function() {
        console.log('Fourth endpoint working');
        res.send("endpoint4 baby");
    })
});


/// returns a full log
app.get('/logreturn', (req, res) => {
    res.send(log.join(" --- "))
});