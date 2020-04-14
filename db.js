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
        allowNull: false,
        defaultValue: 2020-04-16
    },
    Status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'incomplete'
    },
    Priority: {
        type: Sequelize.STRING(10),
        allowNull: false,
        defaultValue: 'medium'
    }
})

module.exports = {
    db,Tasks
}