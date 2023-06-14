const express = require('express');
const app = express();
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors({
  origin: '*'
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/', function (req, res) {
  let data = fs.readFileSync('TestData.json');
  data = JSON.parse(data);
  let wordList = data.wordList;
  let arr = ['verb', 'adverb', 'noun', 'adjective'];
  let sendData = [];
  for (let i = 0; i < arr.length; i++) {
    let value = wordList[Math.floor(Math.random() * wordList.length)];
    while (value.pos !== arr[i]) {
      value = wordList[Math.floor(Math.random() * wordList.length)];
    }
    sendData.push({ id: value.id, word: value.word });
  }
  for (let i = 0; i < 6; i++) {
    let value = wordList[Math.floor(Math.random() * wordList.length)];
    let valueRepeated = sendData.filter((value1) => value1.id === value.id);
    while (valueRepeated.length !== 0) {
      value = wordList[Math.floor(Math.random() * wordList.length)];
      valueRepeated = sendData.filter((value1) => value1.id === value.id);
    }

    sendData.push({ id: value.id, word: value.word });
  }
  res.send(sendData);
});

app.post('/', (req, res) => {
  let score = req.body.score;
  let data = fs.readFileSync('TestData.json');
  data = JSON.parse(data);
  let scores = data.scoresList;
  let belowScores = scores.filter((item) => item < score);
  let rank = ((belowScores.length / scores.length) * 100);
  rank=parseFloat(rank).toFixed(2);
  res.send({ rank: `${rank}%` });
});

app.post('/:id',(req,res)=>{
  let answer = req.body.answer;
  let data = fs.readFileSync('TestData.json');
  data = JSON.parse(data);
  let wordList = data.wordList;
  let word=wordList.find((word)=>word.id === parseInt(req.params.id))
      if(word.pos === answer){
        res.send({answer:'correct'})
      }else{
        res.send({answer:'false'})
      }
  // res.send('aaaaaaaaaaa')
})

app.listen(3000)
