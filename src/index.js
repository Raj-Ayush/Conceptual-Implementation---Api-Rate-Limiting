const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const port = 3000
const posts = require('./initialData')
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());


app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())
// your code goes here
let initialMax = null;
let noOfApiCalls = 0;
app.get('api/posts',(req, res) => {
    if(noOfApiCalls >= 5){
        res.status(429).send({message: "Exceed Number of API calls"});
        return;
    }
    const parsedMax = Number(req.query.max || 10);
    const max = parsedMax > 20 ? 10: parsedMax; 
    let finalMax = max;
    if(initialMax !== null){
        finalMax = Math.min(initialMax, finalMax); 
    }
    const topMax = posts.filter((value, idx) => idx < finalMax);
    res.send(topMax);
    if(initialMax === null){
        initialMax = max;
        noOfApiCalls++;
        setTimeout(() =>{
            initialMax = null;
            noOfApiCalls = 0;
        }, 30*1000);
    }
    else{
        noOfApiCalls++;
    }
})

app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;
