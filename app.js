const express = require('express');
const bodyParser = require('body-parser');
// initialize the express app object
var app = express();
// init router
var router = express.Router();

app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb'}));

// load the router into the express object
app.use('/', router);

var popQuiz = {
    question: "What is my name?",
    answers: [ 
        {selection: "a", value: "Kenneth"},
        {selection: "b", value: "Lisa"},
        {selection: "c", value: "Samuel"},
        {selection: "d", value: "Alex"}
    ],
    correctAnswer: "a"
}

router.get('/quiz', function(req,res,next){
    var acopyPopQuiz = Object.assign({}, popQuiz);
    delete acopyPopQuiz.correctAnswer;
    res.json(acopyPopQuiz);
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

app.listen(1337, function(){
    console.log("Server is running at localhost:1337");
})