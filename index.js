const inquirer = require("inquirer");
const db = require("./db/connection");

require("console.table");

function beginPrompts() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "options",
        message: "What would you like to do?",
        choices: [
          "Add a department",
          "Add a role",
          "Add an employee",
          "View department",
          "View role",
          "View employee",
          "Delete an employee",
          "Delete a role",
          "Delete a department",
          "Update employee role",
          "Exit",
        ],
      },
    ])
    .then(function (response) {
      switch (response.options) {
        case "Add a department":
          addDepartments();
          break;

        case "Add a role":
          addRole();
          break;

        case "Add an employee":
          addEmployee();
          break;

        case "View department":
          viewDepartments();
          break;

        case "View role":
          viewRole();
          break;

        case "View employee":
          viewEmployees();
          break;

        case "Delete an employee":
          deleteEmployee();
          break;

        case "Delete a role":
          deleteRole();
          break;

        case "Delete a department":
          deleteDepartment();
          break;

        case "Update employee role":
          updateRole();
          break;

        default:
          process.exit();
      }
    });
}

function viewDepartments() {
  db.promise()
    .query("SELECT * FROM department")
    .then(([response]) => {
      console.table(response);
      beginPrompts();
    });
}

function viewRole() {
  db.promise()
    .query(
      "SELECT * FROM role LEFT JOIN department ON role.department_id = department.id"
    )
    .then(([response]) => {
      console.table(response);
      beginPrompts();
    });
}

function viewEmployees() {
  db.promise()
    .query(
      `SELECT 
      employee.id, 
      employee.first_name, 
      employee.last_name, 
      role.title, 
      role.salary, 
      department.name, 
      CONCAT(e2.first_name, " " ,e2.last_name) AS 'manager name' FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee AS e2 ON employee.manager_id = e2.id`
    )
    .then(([response]) => {
      console.table(response);
      beginPrompts();
    });
}

function addEmployee() {
  db.query("SELECT * FROM role", (err, data) => {
    let all_role_ids = data.map(role => role.id);
    console.log(all_role_ids);
    inquirer
      .prompt([
        {
          type: "input",
          name: "first_name",
          message: "Please enter employee's first name.",
        },
        {
          type: "input",
          name: "last_name",
          message: "Please enter employee's last name.",
        },
        {
          type: "list",
          name: "role_id",
          message: "Please select employee's role by ID.",
          choices: all_role_ids,
        },
        {
          type: "list",
          name: "manager_id",
          message: "Please select employee's manager by ID.",
          choices: [1, 2, 3],
        },
      ])
      .then(response => {
        let result = db.query(`INSERT INTO employee SET ?`, {
          first_name: response.first_name,
          last_name: response.last_name,
          role_id: response.role_id,
          manager_id: response.manager_id,
        });
        beginPrompts();
      });
  });
}

function addRole() {
  db.query("SELECT * FROM department", (err, data) => {
    let all_department_ids = data.map(department => department.id);
    console.log(all_department_ids);
    inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "Please enter the title for this role.",
        },
        {
          type: "input",
          name: "salary",
          message: "Please enter the salary for this role.",
        },
      ])
      .then(response => {
        let result = db.query(`INSERT INTO role SET ?`, {
          title: response.title,
          salary: response.salary,
        });
        beginPrompts();
      });
  });
}

beginPrompts();
