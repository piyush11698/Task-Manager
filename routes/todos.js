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

    let newTask = await Tasks.create({
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
    let todobyId = await Tasks.findByPk(req.params.id) 
        todobyId.Title = req.body.title
        todobyId.Description = req.body.description
        todobyId.DueDate = req.body.duedate
        todobyId.Status = req.body.status
        todobyId.Priority = req.body.priority
    await todobyId.save()
    res.redirect('/todos')
})


// route.get('/:id/notes', async(req,res) => {
//     const tasknotes = await Tasks.findByPk(req.params.id)
//     res.render('index',{tasknotes})
// })

// route.post('/:id/notes', async(req,res) => {
//     const taskNotes = await Tasks.create({
//         Notes:req.body.Notes
//     })

//     await taskNotes.save()
//     res.redirect('/todos')
// })


module.exports = route