const mysql2 = require("mysql2");
const fs = require("fs");
var file = __dirname + "/db/seeds.sql";

const connection = mysql2.connect({
  host: "localhost",
  user: "root",
  password: "root_password1",
  database: "employee_tracker",
});

function queryDB(data) {
  connection.query(data, function (err, result) {
    if (err) {
      throw err;
    }
    console.log(result);
  });
}

connection.connect(function (err) {
  if (err) {
    console.log(err);
  }
  fs.readFile(file, "utf8", function (err, data) {
    if (err) throw err;
    queryDB(data);
  });
});
