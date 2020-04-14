const express = require('express')
const {db} = require('./db')
// const {Tasks} = require('./db')
const todoRoute = require('./routes/todos')

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.use('/todos', todoRoute)


db.sync()
    // .then(() => {
    //     Tasks.bulkCreate([
    //         {Title:'cricket',Description:'play cricket'},
    //         {Title:'Learn TypeScript',Description:'Typescript enums'},
    //         {Title:'complete assignment',Description:'Assignment Task Manager'}
    //     ])
    // })
    .then(() => {
        app.listen(3456)
    })
    .catch((err) => {
        console.log(err)
    })
