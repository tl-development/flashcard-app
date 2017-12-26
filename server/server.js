const express=require('express');
const bodyParser=require('body-parser');
const path=require('path');
const http=require('http');
const appPORT=process.env.PORT || 8080;

const Db = require('./cardDb.js');
const db=Db.mongooseDatabase;

const app=express();
app.use('/static',express.static(path.join(__dirname,'/../build/static')));
app.use(bodyParser.json());

const server=http.createServer(app);

app.post('/card/all', (req, res) => {
   Db.findAllCards(function (err, data) {
    if (err) {
        res.statusCode=500;
        res.end(JSON.stringify({message:'An error occurred while trying to fetch the note.'}));
    } else {
        console.log(data);
        res.statusCode=200;
        res.end(JSON.stringify(data));
    }
   });
});

app.post('/card/save', (req, res) => {
    console.log(req.body);
    const { name, content, isVisible, owner, tags } = req.body;
    Db.saveCard(req.body, function (err, data) {
        if (err) {
            console.log(err);
            res.statusCode=500;
            res.end(JSON.stringify({message:'An error occurred while trying to fetch the note.'}));
    } else {
        res.statusCode=200;
        res.end(JSON.stringify({"message":"Card saved successfully."}));
    }
    })
});

app.post('/*', (req, res) => {
    res.statusCode=500;
    res.end(JSON.stringify({error:'Invalid route.'}));
});

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname+'/../build/index.html'));
});

server.listen(appPORT);