const {Router} = require('express')
const {Tasks,Notes} = require('../db')
const { Op } = require('sequelize')


const route = Router()

route.get('/', async(req,res)=>{
    let todos;

   // filter by date in ascending
   if(req.body.filters=="dateAsc"){
   todos = await Tasks.findAll({  
    order: [
              ['DueDate','ASC'],
       ]
   })
    return res.render('index',{tasks:todos});
       }

    // filter by date in descending
    if(req.body.filters=="dateDesc"){
    todos = await Tasks.findAll({
    order: [
                  ['DueDate','DESC'],
              ]
          })
     return res.render('index',{tasks:todos});
       }

     // filter by priority high to low
     if(req.body.filters=="priority"){
     todos = await Tasks.findAll({
     order: [
                   ['Priority','ASC'],
               ]
           })
     return res.render('index',{tasks:todos});
       }

    // filter status wise 
     if(req.body.filters=="status"){
     todos = await Tasks.findAll({
     order: [
                  ['Status','ASC'],
              ]
          })
    return res.render('index',{tasks:todos});
       }
       todos=await Tasks.findAll();
     res.render('index',{tasks:todos});
    });

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

route.route('/:id/notes')
    .get(async (req, res) => {
        const todo = await Tasks.findByPk(req.params.id);
        if (isNaN(parseInt(req.params.id))) {
            return res.status(400).send({error: 'todo id must be an integer'});
        }
 
        if (!todo) {
            return res.status(404).send({error:'No todo found with id = ' + req.params.id});
        }
        
        // Get All notes related to this todo
        const notes = await Notes.findAll({
            attributes : ['description'],
            where : {taskId : { [Op.eq] : req.params.id}}
        });
 
 
        res.render('notes',{todo:todo, notes:notes});
    })
    .post(async (req, res) => {
        let todo = await Tasks.findByPk(req.params.id);
        if (!todo) {
            return res.status(404).send({error:'No todo found'});
        }
        let note=new Notes({
            description:req.body.description,
            taskId:req.params.id
        })
 
        await note.save();
        res.redirect('/todos');
    });



module.exports = route