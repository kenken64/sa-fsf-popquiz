const express = require('express'),
      bodyParser = require('body-parser'),
      MongoClient = require('mongodb').MongoClient,
      ObjectID = require('mongodb').ObjectID,
      path = require('path'),
      assert = require('assert');


const mongodb_url = process.env.MONGODB_URL | 'mongodb://mguser:password123@ds121982.mlab.com:21982/safsfdb-ken';

// initialize the express app object
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// init router
var router = express.Router();

app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb'}));

app.use(express.static(path.join(__dirname, 'public')));
// load the router into the express object
app.use('/', router);

var db;
var quizCollection;

MongoClient.connect(mongodb_url, { useNewUrlParser: true }, function(err, client){
    assert.equal(null, err);
    console.log("Connecting to mongodb ....");
    db = client.db();
    quizCollection = db.collection('quiz');

    router.post('/newQuiz', function(req, res, next){
        console.log(req.body);
        var newPopQuizForm = req.body;
        console.log(newPopQuizForm);
        var newPopQuiz = {
             question : newPopQuizForm.question,
             answers: [],
             correctAnswer: newPopQuizForm.correctAnswer
        }
        newPopQuiz.answers.push({selection: 'a', value: newPopQuizForm.answer1});
        newPopQuiz.answers.push({selection: 'b', value: newPopQuizForm.answer2});
        newPopQuiz.answers.push({selection: 'c', value: newPopQuizForm.answer3});
        newPopQuiz.answers.push({selection: 'd', value: newPopQuizForm.answer4});
        
        quizCollection.insertOne(newPopQuiz,function(err, result){
             console.log(result);
             res.redirect('/list-quizes');
        });
    })

    router.get('/show-DeleteQuiz/:id', (req, res, next) => {
        res.render('newQuizform', {});
    });

    router.get('/show-EditQuiz/:id', (req, res, next) => {
        res.render('newQuizform', {});
    });

    router.get('/show-newQuizform', (req, res, next) => {
        res.render('newQuizform', {});
    });

    router.get('/list-quizes', (req, res, next) => {
        quizCollection.find({}).project({ 'correctAnswer' : 0 }).toArray(function(err, quizes){
            console.log("from mongodb...");
            console.log(JSON.stringify(quizes));
            res.render('listQuizes', {quizes: quizes});
        });
    });
    
    router.get('/quiz', function(req,res,next){
        quizCollection.find({}).project({ 'correctAnswer' : 0 }).toArray(function(err, quizes){
            console.log("from mongodb...");
            console.log(JSON.stringify(quizes));
            res.json(quizes);
        });
    });
    
    router.post('/check-answer', function(req,res,next){
        var answer = req.body;
        var isCorrect = false;
        console.log(answer.answer);
        console.log(answer.id);
        var o_id = new ObjectID(answer.id);
        quizCollection.findOne({_id: o_id}, function(err, result){
            console.log("from mongodb...");
            console.log(JSON.stringify(result));
            console.log(result.correctAnswer)
            if(result.correctAnswer === answer.answer){
                 console.log("CORRECT !");
                 isCorrect = true
            }else{
                 console.log("NOT CORRECT !");
            }
            res.json({result: isCorrect});
        });
        
    });
})

app.listen(process.env.PORT, function(){
    console.log("Server is running at localhost:1337");
})