const {Router} = require('express')
const {Tasks} = require('../db')

const route = Router()

route.get('/', async(req,res) => {
    const tasks = await Tasks.findAll()
    res.send(tasks)
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

    res.send(task)
})

route.post('/', async(req,res) => {
    if(typeof req.body.Title !== 'string'){
        return res.status(400).send({error: 'Title must be provided'})
    }

    if(typeof req.body.Description !== 'string'){
        return res.status(400).send({error: 'Description must be provided'})
    }

    if(req.body.Status === 'complete'){
        req.body.Status = 'complete'
    } else{
        req.body.Status = 'incomplete'
    }

    if(req.body.Priority === 'high'){
        req.body.Priority = 'high'
    } else if(req.body.Priority === 'low'){
        req.body.Priority = 'low'
    } else{
        req.body.Priority = 'medium'
    }

    // if(isNaN(Date.parse(req.body.DueDate))){
    //     return res.status(400).send({error:'Enter valid date'})
    // }

    const newTask = await Tasks.create({
        Title: req.body.Title,
        Description: req.body.Description,
        DueDate: req.body.DueDate,
        Status: req.body.Status,
        Priority: req.body.Priority
    })

    res.status(201).send( newTask)
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