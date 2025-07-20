const express = require('express');
const FS = require('node:fs');
// const test = require('node:test');
const app = express();
const PORT = 8080;


app.use(express.json())
app.use(express.static('public'));

app.get('/question/:id', (req, res) => {
    const id = req.params.id;

    FS.readFile(__dirname+'/test.json', (err, data) => {
        if(err){
            return res.status(500).json({
                "sucsess": false,
                "error": "No Data"
            })
        }
        const response = JSON.parse(data);
        const question = response.find(elem => elem.id === id);

        if(!question){
            return res.status(404).json({
            "sucess": false,
            "error": "Not Found"
        })
        }
        
        return res.status(200).json({
            "sucess": true,
            question
        })
    })
})

app.get('/testData', (req, res) => {
    FS.readFile(__dirname+'/test.json', (err, data) => {
        if(err){
            return res.status(500).json({
                "sucsess": false,
                "error": "No Data"
            })
        }
        const response = JSON.parse(data);
        let testData = [];

        for(let i=0; i<response.length; i++){
            let single ={};
            single.id = response[i].id;
            single.que = response[i].que;
            single.options = response[i].options

            testData.push(single)
        }
        return res.status(200).json({
            "sucess": true,
            testData
        })
    })
})

app.post('/verify', (req, res) => {
    const { queId, ans } = req.body;

    if(!queId || !ans){
        return res.status(400).json({
            "sucsess": false,
            "error": "Bad request from client"
        })
    }
    FS.readFile(__dirname+'/answers.json', (err, data) => {
        if(err){
            return res.status(500).json({
                "sucsess": false,
                "error": "No Data"
            })
        }

        const response = JSON.parse(data);
        
        let isCorrect = false;
        for(let i=0; i<response.length; i++){
            if(queId === response[i].id){
                if(ans === response[i].ans){
                    isCorrect = true;
                }
                else {
                    isCorrect = false;
                }
            }
        }

        return res.status(200).json({
            "success": true,
            "isCorrect": isCorrect
        })
    })
})

app.get('/allAnswers', (req, res) => {
    FS.readFile(__dirname+'/answers.json', (err, data) => {
        if(err){
            return res.status(500).json({
                "sucsess": false,
                "error": "No Data"
            })
        }
        const response = JSON.parse(data);
        let answers = [];

        for(let i=0; i<response.length; i++){
            let singleAns ={};
            singleAns.id = response[i].id;
            singleAns.ans = response[i].ans;

            answers.push(singleAns)
        }
        return res.status(200).json({
            "sucess": true,
            answers
        })
    })
})

app.listen(PORT, () => {
    console.log(`Server is runnning pn http://localhost:${PORT}`);
})