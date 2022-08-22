const mysql = require('mysql2');
const cTable = require('console.table');
const {allManage} = require('../index');
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    }
);

function viewDepartments() {
    db.query(`SELECT * FROM department;`, function (err, results) {
        if (err) {
            console.error(err);
        }
        console.table(results);
        allManage();
    });
}

function viewRoles() {
    db.query(`SELECT * FROM role;`, function (err, results) {
        if (err) {
            console.error(err);
        }
        console.table(results);
        allManage();
    });
}

function viewEmployees() {
    db.query(`SELECT * FROM employee;`, function (err, results) {
        if (err) {
            console.error(err);
        }
        console.table(results);
        allManage();
    });
}

function viewEmpByDept() {
    db.promise().query(`SELECT role.department_id, employee.first_name, employee.last_name, employee.id
    FROM employee
    RIGHT JOIN role ON employee.role_id = role.id
    ORDER BY role.department_id;`)
    .then(([results]) => {
        console.table(results);
        allManage();
    })
}

function viewEmpByManager() {
    db.promise().query(`SELECT employee.manager_id, manager.name, employee.first_name, employee.last_name, employee.id 
    FROM employee
    LEFT JOIN manager ON employee.manager_id = manager.id
    ORDER BY manager.id;`)
    .then(([results]) => {
        console.table(results);
        allManage();
    })
}

module.exports = { viewDepartments, viewRoles, viewEmployees, viewEmpByDept, viewEmpByManager };