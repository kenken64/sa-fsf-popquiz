const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const mongodb_url = 'mongodb://mguser:password123@ds121982.mlab.com:21982/safsfdb-ken';

// initialize the express app object
var app = express();
// init router
var router = express.Router();

app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb'}));

// load the router into the express object
app.use('/', router);

MongoClient.connect(mongodb_url, function(err, client){
    console.log(err);
    assert.equal(null, err);
    console.log("Connecting to mongodb ....");
    const db = client.db();
    //console.log(db);
    var quizCollection = db.collection('quiz');

    router.get('/testmg', function(req, res, next){
        
        quizCollection.insertOne(popQuiz,function(err, result){
            console.log(result);
            client.close();
            res.json(result);
        })
    })
    
    router.get('/quiz', function(req,res,next){
        quizCollection.find({}).toArray(function(err, quizes){
            console.log("from mongodb...");
            console.log(JSON.stringify(quizes));
            res.json(quizes);
        });
    });
    
    router.post('/check-answer', function(req,res,next){
        var answer = req.body;
        var isCorrect = false;
        console.log(answer.answer)
        console.log(popQuiz.correctAnswer)
        if(popQuiz.correctAnswer === answer.answer){
            console.log("CORRECT !");
            isCorrect = true
        }else{
            console.log("NOT CORRECT !");
        }
        res.json({result: isCorrect});
    });
})



app.listen(1337, function(){
    console.log("Server is running at localhost:1337");
})