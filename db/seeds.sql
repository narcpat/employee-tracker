USE employee_tracker;
INSERT INTO department(name)
VALUES ('Engineering'),
       ('Finance'),
       ('HR')

INSERT INTO role(title, salary, department_id)
VALUES ('Engineering',50000,1),
       ('Finance', 45000,2),
       ('HR', 35000,3)

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES ('John', 'Wick',1, NULL),
       ('Hilary', 'Clinton',2, 1),
       ('Elvis', 'Smith',3, 1)       