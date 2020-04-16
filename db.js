const Sequelize = require('sequelize')
const db = new Sequelize({
    dialect: 'sqlite',
    storage: __dirname + '/todos.db'
})

const Tasks = db.define('todo' , {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Title: {
        type: Sequelize.STRING(40),
        allowNull: false
    },
    Description:{
        type: Sequelize.STRING(100)
    },
    DueDate: {
        type: Sequelize.DATE,
        allowNull: false
    },
    Status: {
        type: Sequelize.STRING,
        defaultValue: 'incomplete'
    },
    Priority: {
        type: Sequelize.STRING(10),
        defaultValue: 'medium'
    }
})

const Notes = db.define('note',{
    id: {
        type : Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement : true
    },
    taskId : {
        type: Sequelize.INTEGER,
        allowNull : false
    },
    description : {
        type : Sequelize.STRING(400),
    }
})

module.exports = {
    db,Tasks,Notes
}