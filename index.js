require('dotenv').config();
const inquirer = require('inquirer');
const mysql = require('mysql2');
const manageChoices = [
    "Add Department",
    "Add Role",
    "Add Employee",
    "View Departments",
    "View Roles",
    "View Employees"
]
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    },
    console.log(`Connected to the employeeManager_db database.`)
);

console.log(`
________________________________

        EMPLOYEE MANAGER

         By Freddy Kwak
________________________________
`);

function allManage() {


    inquirer
        .prompt([
            {
                type: 'list',
                message: "What would you like to do?",
                choices: manageChoices,
                name: "manageChoices"
            }
        ])
        .then((data) => {
            if (data.manageChoices === manageChoices[0]) {
                addDepartment();
            } else if (data.manageChoices === manageChoices[1]) {
                addRole();
            } else if (data.manageChoices === manageChoices[2]) {
                addEmployee();
            } else if (data.manageChoices === manageChoices[3]) {
                viewDepartments();
            } else if (data.manageChoices === manageChoices[4]) {
                viewRoles();
            } else if (data.manageChoices === manageChoices[5]) {
                viewEmployees();
            }
        })
}

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
}

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
}

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
                                })
                        })
                })
                .catch((err) => console.log(err))
        })
}

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

allManage();