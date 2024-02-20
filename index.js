const sequelize = require('./config/connection')
const inquirer = require('inquirer')

const start = async () => {

    const viewDepartment = async () => {
        const response = await sequelize.query('SELECT * FROM department')
        return (response[0])
    }

    const viewRole = async () => {
        const response = await sequelize.query('SELECT * FROM role')
        return (response[0])
    }

    const viewEmployee = async () => {
        const response = await sequelize.query('SELECT * FROM employee')
        return (response[0])
    }

    const addDepartment = async (name) => {
        console.log(name)
        const response = await sequelize.query(`INSERT INTO department (name) VALUES ('${name}')`)
    }

    const addRole = async (role) => {
        const response = await sequelize.query(`INSERT INTO role (title, salary, department_id) VALUES ('${role.title}', ${role.salary}, ${role.department_id})`)
    }

    const addEmployee = async (employee) => {
        const response = await sequelize.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${employee.firstName}', '${employee.lastName}', ${employee.roleId}, ${employee.managerId})`)
    }

    const updateEmployeeRole = async (updatedRole) => {
        const response = await sequelize.query(`UPDATE employee SET role_id = ${updatedRole.roleId} WHERE id = ${updatedRole.employeeId}`)
    }

    let isRunning = true
    while (isRunning) {
        const response = await inquirer.prompt([
            {
                type: 'list',
                message: 'Choose and option below: ',
                name: 'select',
                choices: ['View departments', 'View roles', 'View employees', 'Add department', 'Add role', 'Add employee', 'Update employee role', 'Quit']
            }
        ])

        switch (response.select) {
            case 'View departments':
                console.log(await viewDepartment())
                break
            case 'View roles':
                console.log(await viewRole())
                break
            case 'View employees':
                console.log(await viewEmployee())
                break
            case 'Add department':
                const dept = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'department',
                        message: 'Enter the name of the department'
                    }
                ])
                const departments = await viewDepartment()
                const dep_name = []
                for (i in departments) {
                    dep_name.push(departments[i].name)
                }
                while (dept.department.length > 30 || dep_name.includes(dept.department)) {
                    if (dep_name.includes(dept.department)) {
                        console.log("That department already exists.")
                    }
                    dept = await inquirer.prompt([
                        {
                            type: 'input',
                            name: 'department',
                            message: 'Enter the name of the department (up to 30 characters): '
                        }
                    ])
                }
                addDepartment(dept.department)
                break
            case 'Add role':
                const role = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'title',
                        message: 'Enter the title (up to 30 characters): '
                    },
                    {
                        type: 'input',
                        name: 'salary',
                        message: 'Enter the salary: '
                    },
                    {
                        type: 'list',
                        message: 'Select the department: ',
                        name: 'department_id',
                        choices: (await viewDepartment()).map((dep) => {
                            return { name: dep.name, value: dep.id }
                        })
                    }
                ])
                addRole(role)
                break
            case 'Add employee':
                const employee = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'firstName',
                        message: 'Enter the first name of the employee (up to 30 characters): '
                    },
                    {
                        type: 'input',
                        name: 'lastName',
                        message: 'Enter the last name of the employee (up to 30 characters): '
                    },
                    {
                        type: 'list',
                        name: 'roleId',
                        message: 'Select the role of the employee: ',
                        choices: (await viewRole()).map((roles) => {
                            return { title: roles.title, value: roles.id }
                        })
                    },
                    {
                        type: 'list',
                        name: 'managerId',
                        message: "Select this employee's manager: ",
                        choices: (await viewEmployee()).map((employees) => {
                            return { name: employees.first_name + ' ' + employees.last_name, value: employees.id }
                        })
                    }
                ])
                addEmployee(employee)
                break
            case 'Update employee role':
                const updatedRole = await inquirer.prompt([
                    {
                        type: 'list',
                        name: 'employeeId',
                        message: "Select the employee's name: ",
                        choices: (await viewEmployee()).map((employees) => {
                            return { name: employees.first_name + ' ' + employees.last_name, value: employees.id }
                        })
                    },
                    {
                        type: 'list',
                        name: 'roleId',
                        message: 'Select the new role for this employee: ',
                        choices: (await viewRole()).map((roles) => {
                            return { name: roles.title, value: roles.id }
                        })
                    }
                ])
                updateEmployeeRole(updatedRole)
                break
            case 'Quit':
                isRunning = false
                break
        }
    }
}

sequelize.sync({ force: false }).then(start)