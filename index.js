const express = require('express');
const app = express();
const port = process.env.PORT || 5050;
const cors = require('cors');
const bodyParser = require('body-parser');
const objectID = require('mongodb').ObjectID;


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(cors())
require('dotenv').config()


app.get('/', (req, res) => {
  res.send('Hello World!')
})


//Connenting with mongodb database

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dbk4b.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("mega_shop").collection("shops");
  
    //get items from mongodb
    app.get('/getItems',(req,res)=>{
        collection.find({})
        .toArray((err,documents)=>{
            res.send(documents)
        })
    })

    //getdata using email
    app.get('/ShowItems',(req,res)=>{
      collection.find({email: req.query.email})
      .toArray((err,documents)=>{
          res.send(documents)
      })
  })

    //post ordered items
    app.post('/addOrders',(req,res)=>{
      const theInfo = req.body;
      collection.insertOne(theInfo)
      .then(result =>{
        console.log(result);
      })
    })

    //add new items
    app.post('/addProducts',(req,res)=>{
      const newProduct = req.body;
      console.log(newProduct);
      collection.insertOne(newProduct)
      .then(result =>{
        console.log(result.insertedCount);
      })
    })

    //delete ordered items
    app.delete('/deleteOrderItem/:id',(req,res)=>{
      const id = objectID(req.params.id)
      collection.findOneAndDelete({_id: id})
      .then(result =>{
        console.log('deleted');
      })
    })

});




app.listen(port, () => {
  console.log('port started successfully')
})