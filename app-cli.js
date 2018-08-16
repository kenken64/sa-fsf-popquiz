var prompt = require('prompt');
const request = require('request');

const API_URL = "http://localhost:1337/";
const QUIZ_API_URL = `${API_URL}quiz`;
const CHECK_ANSWER_API_URL = `${API_URL}check-answer`;

// Start prompt operation
prompt.start();
var finalPopQuiz;

request(QUIZ_API_URL, function (error, response, body) {
    var popQuiz = JSON.parse(body);
    console.log(popQuiz.length + "\n");
    var randQuizSelection = Math.floor(Math.random() * Math.floor(popQuiz.length));
    console.log(randQuizSelection + "\n");
    finalPopQuiz = popQuiz[randQuizSelection];
    console.log(popQuiz[randQuizSelection]._id + "\n");
    console.log(popQuiz[randQuizSelection].question + "\n");
    
    popQuiz[randQuizSelection].answers.forEach(element => {
        console.log(element.selection + ". "  + element.value + "\n");
    });
});

setTimeout(function(){
    // Get two properties from the user: username and password 
    prompt.get(['answer'], function (err, result) {
        // Log the results to commandline console 
        console.log('  answer: ' + result.answer);
        console.log('  _id: ' + finalPopQuiz._id);
        var inputAnswer = {
            id: finalPopQuiz._id,
            answer: result.answer
        }
        console.log(CHECK_ANSWER_API_URL);
        request({
            url: CHECK_ANSWER_API_URL,
            method: "POST",
            json: inputAnswer
        }, function(error, response, body){
            console.log(body);
            console.log(typeof(body.result));
            if(body.result === true){
                console.log("BINGO !");
            }else{
                console.log("TRY AGAIN !");
            }
            process.exit(1);
        })
    });
}, 2000)
