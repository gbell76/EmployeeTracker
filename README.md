# EmployeeTracker

## Usage
This application allows you to keep track of your departments, roles, and employees.

## Installition
Install postgres and set it to port 5433. Create a database named management and 3 tables in that database named department role and employee. department has a primary key named id and a name column of varchar with a length of 30. role has a primary key named id, a title column varchar(30), a salary column of type money, and deparment_id which is a foreign key that references the id column on the department table. employee has a primary key named id, a first_name varchar(30), last_name varchar(30), role_id which references the id column in the role table, and manager_id which references the id column of the employee table.

## Description
Type 'node index.js' into the command line and follow the prompts provided. You can view all your department data, view all your role data, view all employee data, view your employees by department, view your employees by manager, add a department, add a role, add an employee, update an employee's role, update an employee's manager, delete a department, delete a role, delete an employee, and view the total budget of a department. Select 'Quit' to stop.

## Credits
N/A

## Liscence
N/A

## Video Demo Link
https://drive.google.com/file/d/1cXX5VJ1lo1o4iT-d_7z_cV70hMxYDPcm/view