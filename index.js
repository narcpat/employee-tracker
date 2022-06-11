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
      "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name, CONCAT(e2.first_name, ' ', e2.last_name) AS 'manager name' FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee AS e2 ON e2.manager_id = e2.id"
    )
    .then(([response]) => {
      console.table(response);
      beginPrompts();
    });
}

beginPrompts();
