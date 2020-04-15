const {Router} = require('express')
const {Tasks} = require('../db')

const route = Router()

route.get('/', async(req,res) => {
    const tasks = await Tasks.findAll({
        order:[
            ['DueDate','ASC']
        ]
    })
    res.render('index',{tasks})
})

route.get('/:id', async(req,res) => {
    if(isNaN(Number(req.params.id))){
        return res.status(400).send({
            error: 'Task id must be an integer'
        })
    }

    const task = await Tasks.findByPk(req.params.id)

    if(!task){
        return res.status(404).send({
            error: 'No Task found with id = ' + req.params.id
        })
    }

    res.render('EditTask',{task})
})

route.post('/', async(req,res) => {
    if(typeof req.body.title !== 'string'){
        return res.status(400).send({error: 'Title must be provided'})
    }

    if(typeof req.body.description !== 'string'){
        return res.status(400).send({error: 'Description must be provided'})
    }

    // if(isNaN(Date.parse(req.body.DueDate))){
    //     return res.status(400).send({error:'Enter valid date'})
    // }

    const newTask = await Tasks.create({
        Title: req.body.title,
        Description: req.body.description,
        DueDate: req.body.duedate,
        Priority: req.body.priority
    })

    if(req.body.status === 'on'){
        newTask.Status = 'Complete' 
    }


    await newTask.save()
    res.redirect('/todos')
})


route.patch('/:id', async(req,res) => {
    // if(isNaN(Number(req.params.id))){
    //     return res.status(400).send({
    //         error: 'Task id must be an integer'
    //     })
    // }
    const todobyId = await Tasks.findOne({ where: {id : req.params.id}}) 

    todobyId.Title = req.body.Title
    todobyId.Description = req.body.Description
    todobyId.DueDate = req.body.DueDate
    todobyId.Status = req.body.Status
    todobyId.Priority = req.body.Priority

    const updatedValue = await todobyId.save()

    res.send(updatedValue)

    // if(!updatedTask){
    //     return res.status(404).send({
    //         error: 'No Task found with id = ' + req.params.id
    //     })
    // }
})

module.exports = route