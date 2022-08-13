const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const express = require('express')
const app = express()
const PORT = 8000
require('dotenv').config()

let connectionString = process.env.DB_STRING


MongoClient.connect(connectionString, (err, client)=>{
    if (err) return console.error(err)
    console.log('Connedted to Database')
    const db = client.db('all-clients')
    const clientsCollection = db.collection('clients')

    // Middle
    app.set('view engin', 'ejs')
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(express.static('public'))
    app.use(bodyParser.json())

    app.get('/', (request, response)=>{
        const cursor = db.collection('clients').find().toArray()
        .then(results =>{
            response.render('index.ejs', {clients: results})
        })
        .catch(error => console.log(error))
        
            
    })

    app.post('/clients', (request, response)=>{
        clientsCollection.insertOne({name: request.body.name, address: request.body.address})
        .then(result =>{
            response.redirect('/')
        })
        .catch(error => console.error(error))
    })

    // app.put('/client', (request, response) =>{
    //     clientsCollection.findOneAndUpdate(
    //         {name: request.body.name},
    //         {
    //             $set: {
    //                 name: request.body.name,
    //                 quote: request.body.quote
    //             }
    //         },
    //         {
    //             upsert: true
    //         }
    //     )
    //     .then(result => {
    //         response.json('Success')
    //     })
    //     .catch(error => console.error(error))
    // })

    app.delete('/clients', (request, response) =>{
        clientsCollection.deleteOne(
            { name: request.body.name.toLowerCase()}
        )
        .then(result => {
            if (result.deletedCount === 0) {
                return response.json('No client to delete')
              }
              response.json(`Deleted Client`)
            })
          .catch(error => console.error(error))
    })

    app.listen(process.env.PORT || PORT, ()=>{
        console.log(`Thes server is now running on port ${PORT}`)
    })

})