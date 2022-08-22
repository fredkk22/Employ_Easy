const inquirer = require('inquirer');
const mysql = require('mysql2');
const {allManage} = require('../index');
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    }
);

function deleteDepartment() {
    inquirer
    .prompt({
        type: 'input',
        message: 'Which department would you like to remove?',
        name: 'deleteDepartment'
    })
    .then((data) => {
        db.query(`DELETE FROM department WHERE name = ?;`, data.deleteDepartment, function (err) {
            if (err) {
                console.log(err);
            }
            console.log(`${data.deleteDepartment} has been removed from the database!`);
            allManage();
        })
    })
};

function deleteRole() {
    inquirer
    .prompt({
        type: 'input',
        message: 'Which role would you like to remove?',
        name: 'deleteRole'
    })
    .then((data) => {
        db.query(`DELETE FROM role WHERE title = ?;`, data.deleteRole, function (err) {
            if (err) {
                console.log(err);
            }
            console.log(`${data.deleteRole} has been removed from the database!`);
            allManage();
        })
    })
};

function deleteEmployee() {
    inquirer
    .prompt([
        {
            type: 'input',
            message: 'Enter the first name of the employee you would like to remove:',
            name: 'delEmployeeFirst'
        },
        {
            type: 'input',
            message: 'Enter the last name of the employee you would like to remove:',
            name: 'delEmployeeLast'
        }
    ])
    .then((data) => {
        db.query(`DELETE FROM employee WHERE first_name = ? AND last_name = ?;`, [data.delEmployeeFirst, data.delEmployeeLast], function (err) {
            if (err) {
                console.log(err);
            }
            console.log(`${data.delEmployeeFirst} ${data.delEmployeeLast} has been removed from the database!`);
            allManage();
        })
    })
};

function deleteManager() {
    inquirer
    .prompt({
        type: 'input',
        message: 'Which manager would you like to remove? (NOTE: If your manager is assigned an employee, he/she will not be removed)',
        name: 'deleteManager'
    })
    .then((data) => {
        db.query(`DELETE FROM manager WHERE name = ?;`, data.deleteManager, function (err) {
            if (err) {
                console.log(err);
            }
            console.log(`${data.deleteManager} has been removed from the database!`);
            allManage();
        })
    })
};

module.exports = { deleteDepartment, deleteRole, deleteEmployee, deleteManager };