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
  db.query(`SELECT * FROM role`, (err, res) => {
    if (err) {
      console.log("An error occurred");
    }
    const listRole = res.map(roles => ({
      name: roles.title,
      value: roles.id,
    }));

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
          choices: listRole,
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
  db.query(`SELECT * FROM department`, (err, res) => {
    const listDepartments = res.map(departments => ({
      name: departments.name,
      value: departments.id,
    }));

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
        {
          type: "list",
          name: "department_id",
          message: "Please select the department ID for this new role.",
          choices: listDepartments,
        },
      ])
      .then(response => {
        let result = db.query(`INSERT INTO role SET ?`, {
          title: response.title,
          salary: response.salary,
          department_id: response.department_id,
        });
        beginPrompts();
      });
  });
}

function addDepartments() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "Please enter the name of the new department.",
      },
    ])
    .then(response => {
      let result = db.query(`INSERT INTO department SET ?`, {
        name: response.name,
      });
      beginPrompts();
    });
}

function deleteEmployee() {
  db.query(`SELECT * FROM employee`, (err, res) => {
    // console.log(res)
    const listEmployee = res.map(employees => ({
      name: employees.first_name + " " + employees.last_name,
      value: employees.id,
    }));

    inquirer
      .prompt([
        {
          type: "list",
          name: "employee",
          message:
            "Please select the employee(s) that you would like to delete.",
          choices: listEmployee,
        },
      ])
      .then(response => {
        let result = db.query(`DELETE FROM employee WHERE id = ?`, [
          response.employee,
        ]);
        beginPrompts();
      });
  });
}

function deleteDepartment() {
  db.query(`SELECT * FROM department`, (err, res) => {
    const listDepartments = res.map(departments => ({
      name: departments.name,
      value: departments.id,
    }));

    inquirer
      .prompt([
        {
          type: "list",
          name: "department",
          message: "Please select the department you would like to delete.",
          choices: listDepartments,
        },
      ])
      .then(response => {
        let result = db.query(`DELETE FROM department WHERE id = ?`, [
          response.department,
        ]);
        beginPrompts();
      });
  });
}

function deleteRole() {
  db.query(`SELECT * FROM role`, (err, res) => {
    const listRoles = res.map(roles => ({
      name: roles.title,
      value: roles.id,
    }));

    inquirer
      .prompt([
        {
          type: "list",
          name: "role",
          message: "Please select the role you would like to delete.",
          choices: listRoles,
        },
      ])
      .then(response => {
        let result = db.query(`DELETE FROM role WHERE id = ?`, [response.role]);
        beginPrompts();
      });
  });
}

function updateRole() {
  db.query(`SELECT * FROM employee`, (err, res) => {
    // console.log(res)
    const listEmployee = res.map(employees => ({
      name: employees.first_name + " " + employees.last_name,
      value: employees.id,
    }));

    db.query(`SELECT * FROM role`, (err, res) => {
      if (err) {
        console.log("An error occurred");
      }
      const listRole = res.map(roles => ({
        name: roles.title,
        value: roles.id,
      }));

      inquirer
        .prompt([
          {
            type: "list",
            name: "update",
            message: "Select an employee to update Role",
            choices: listEmployee,
          },
          {
            type: "list",
            name: "role",
            message: "Select a new role",
            choices: listRole,
          },
        ])
        .then(response => {
          let result = db.query(
            `UPDATE employee SET role_id = ? WHERE id = ?`,
            [response.role, response.update]
          );

          beginPrompts();
        });
    });
  });
}

beginPrompts();
