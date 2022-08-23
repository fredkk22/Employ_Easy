const inquirer = require('inquirer');
const mysql = require('mysql2');
const { allManage } = require('../index');
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    }
);

function addDepartment() {
    inquirer
        .prompt([
            {
                type: 'input',
                message: "What is the name of the department?",
                name: "departmentAdd"
            }
        ])
        .then((data) => {
            db.query(`INSERT INTO department (name) VALUES (?);`, data.departmentAdd, function (err) {
                if (err) {
                    console.error(err);
                }
                console.log(`Added ${data.departmentAdd} to department table`);
                allManage();
            });
        });
};

function addRole() {
    inquirer
        .prompt([
            {
                type: 'input',
                message: "What is the name of the role?",
                name: "roleAdd"
            },
            {
                type: 'input',
                message: "What is the salary for this role?",
                name: "salaryAdd"
            },
            {
                type: 'input',
                message: "What department does the role belong to?",
                name: "addToDepartment"
            }
        ])
        .then((data) => {
            db.query(`SELECT * FROM department WHERE name = ?;`, data.addToDepartment, function (err, results) {
                if (err) {
                    console.error(err);
                }
                db.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?);`,
                    [data.roleAdd, data.salaryAdd, results[0].id],
                    function (err) {
                        if (err) {
                            console.error(err);
                        }
                        console.log(`Added ${data.roleAdd} to role table`);
                        allManage();
                    });
            });
        });
};

function addEmployee() {
    inquirer
        .prompt([
            {
                type: 'input',
                message: "What is the employee's first name?",
                name: "employeeFirstAdd"
            },
            {
                type: 'input',
                message: "What is the employee's last name?",
                name: "employeeLastAdd"
            },
            {
                type: 'input',
                message: "What is the employee's role?",
                name: "addToRole"
            },
            {
                type: 'input',
                message: "Who is the employee's manager?",
                name: "addToManager"
            }
        ])
        .then((data) => {
            db.promise().query("SELECT * FROM role WHERE title = ?;", data.addToRole)
                .then(([results]) => {
                    db.promise().query("SELECT * FROM manager WHERE name = ?;", data.addToManager)
                        .then(([results2]) => {
                            db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);`,
                                [data.employeeFirstAdd, data.employeeLastAdd, results[0].id, results2[0].id],
                                function (err) {
                                    if (err) {
                                        console.error(err);
                                    }
                                    console.log(`${data.employeeFirstAdd} ${data.employeeLastAdd} added to employee table`);
                                    allManage();
                                });
                        })
                })
                .catch((err) => console.log(err))
        });
};

function addManager() {
    inquirer
        .prompt({
            type: 'input',
            message: 'What is the name of the new manager?',
            name: 'newManager'
        })
        .then((data) => {
            db.query(`INSERT INTO manager (name) VALUES (?);`, data.newManager, function (err) {
                if (err) {
                    console.log(err);
                }
                console.log(`${data.newManager} has been added to the database!`);
                allManage();
            });
        });
};

function updateEmployeeRole() {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'What is the first name of the employee?',
                name: 'updateEmployeeFirst'
            },
            {
                type: 'input',
                message: 'What is the last name of the employee?',
                name: 'updateEmployeeLast'
            },
            {
                type: 'input',
                message: "What is the employee's new role?",
                name: 'updateNewRole'
            }
        ])
        .then((data) => {
            db.promise().query("SELECT * FROM role WHERE title = ?;", data.updateNewRole)
                .then(([results]) => {
                    db.query(`UPDATE employee SET employee.role_id = ? WHERE employee.first_name = ? AND employee.last_name = ?;`,
                        [results[0].id, data.updateEmployeeFirst, data.updateEmployeeLast], (err) => {
                            if (err) {
                                console.log(err);
                            }
                            console.log(`${data.updateEmployeeFirst} ${data.updateEmployeeLast}'s role has been set to ${results[0].title}!`);
                            allManage();
                        })
                })
                .catch((err) => {
                    console.log(err);
                })
            
        })
}

module.exports = { addDepartment, addRole, addEmployee, addManager, updateEmployeeRole }