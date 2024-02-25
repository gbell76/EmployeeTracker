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

    const updateManager = async (employeeManager) => {
        const response = await sequelize.query(`UPDATE employee SET manager_id = ${employeeManager.manager} WHERE id = ${employeeManager.employee}`)
    }

    const viewEmployeesByManager = async (manager) => {
        const response = await sequelize.query(`SELECT * FROM employee WHERE manager_id = ${manager}`)
        return response[0]
    }

    const viewEmployeesByDepartment = async (department) => {
        const response = await sequelize.query(`SELECT employee.id, first_name, last_name, role_id, manager_id FROM employee INNER JOIN role ON employee.role_id = role.id WHERE department_id = ${department}`)
        return response[0]
    }

    const viewBudget = async(department) => {
        const response = await sequelize.query(`SELECT SUM(salary) FROM (SELECT salary FROM employee INNER JOIN role ON employee.role_id = role.id WHERE department_id = ${department})`)
        return response[0]
    }

    const deleteDepartment = async(department) => {
        try{
            const response = await sequelize.query(`DELETE FROM department WHERE id = ${department}`)
        }catch{
            console.log('There are still roles in that department. Please delete those roles first then try deleting the department again.')
        }
    }

    const deleteRole = async(role) => {
        try{
            const response = await sequelize.query(`DELETE FROM role WHERE id = ${role}`)
        }catch{
            console.log("There are still employees in that role. Please update those employees' roles or delete these employees then try deleting the role again.")
        }
    }

    const deleteEmployee = async(employee) => {
        try{
            const response = await sequelize.query(`DELETE FROM employee WHERE id = ${employee}`)
        }catch{
            console.log("That employee is managing other employees. Please update those employees' manager or delete those employees then try deleting this employee again.")
        }
    }

    let isRunning = true
    while (isRunning) {
        const response = await inquirer.prompt([
            {
                type: 'list',
                message: 'Choose and option below: ',
                name: 'select',
                choices: ['View departments', 'View roles', 'View employees', 'View employees by manager', 'View employees by department', 'View total utilized budget of department', 'Add department', 'Add role', 'Add employee', 'Update employee role', 'Update employee manager', 'Delete department', 'Delete role', 'Delete employee', 'Quit']
            }
        ])

        switch (response.select) {
            case 'View departments':
                const departmentResponse = await viewDepartment()
                console.log('id         department name               ')
                console.log('---------- ------------------------------')
                for(i in departmentResponse){
                    let output = '                                         '
                    output = departmentResponse[i].id + output
                    output = output.slice(0, 11) + departmentResponse[i].name
                    console.log(output)
                }
                break
            case 'View roles':
                const roleResponse = await viewRole()
                console.log('id         title                          salary                department id')
                console.log('---------- ------------------------------ --------------------- -------------')
                for(i in roleResponse){
                    let output = '                                                                             '
                    output = roleResponse[i].id + output
                    output = output.slice(0, 11) + roleResponse[i].title + output.slice(11)
                    output = output.slice(0, 42) + roleResponse[i].salary + output.slice(42)
                    output = output.slice(0, 64) + roleResponse[i].department_id
                    console.log(output)
                }
                break
            case 'View employees':
                const employeeResponse = await viewEmployee()
                console.log('id         first name                     last name                      role id    manager id')
                console.log('---------- ------------------------------ ------------------------------ ---------- ----------')
                for(i in employeeResponse){
                    let output = '                                                                                              '
                    output = employeeResponse[i].id + output
                    output = output.slice(0, 11) + employeeResponse[i].first_name + output.slice(11)
                    output = output.slice(0, 42) + employeeResponse[i].last_name + output.slice(42)
                    output = output.slice(0, 73) + employeeResponse[i].role_id + output.slice(73)
                    output = output.slice(0, 84) + employeeResponse[i].manager_id
                    console.log(output)
                }
                break
            case 'Add department':
                let dept = await inquirer.prompt([
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
                const roles = await viewRole()
                const titles = []
                for(i in roles){
                    titles.push(roles[i].title)
                }
                let titleResponse = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'title',
                        message: 'Enter the title (up to 30 characters): '
                    }
                ])
                while(titleResponse.title.length > 30 || titles.includes(titleResponse.title)){
                    if(titles.includes(titleResponse.title)){
                        console.log('That role already exists.')
                    }
                    titleResponse = await inquirer.prompt([
                        {
                            type: 'input',
                            name: 'title',
                            message: 'Enter the title (up to 30 characters): '
                        }
                    ])
                }
                let salaryResponse = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'salary',
                        message: 'Enter the salary: '
                    }
                ])
                while(isNaN(salaryResponse.salary.trim()) || salaryResponse.salary.slice(0, salaryResponse.salary.length-3).includes('.')){
                    console.log('Salary must be a money value (ex. 250000.00 or 250000).')
                    salaryResponse = await inquirer.prompt([
                        {
                            type: 'input',
                            name: 'salary',
                            message: 'Enter the salary: '
                        }
                    ])
                }
                const deptResponse = await inquirer.prompt([
                    {
                        type: 'list',
                        message: 'Select the department: ',
                        name: 'department_id',
                        choices: (await viewDepartment()).map((dep) => {
                            return { name: dep.name, value: dep.id }
                        })
                    }
                ])
                const role = {
                    title: titleResponse.title,
                    salary: salaryResponse.salary,
                    department_id: deptResponse.department_id
                }
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
                            return { name: roles.title, value: roles.id }
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
            case 'Update employee manager':
                const employeeManager = await inquirer.prompt([
                    {
                        type: 'list',
                        name: 'employee',
                        message: 'Select the employee: ',
                        choices: (await viewEmployee()).map((employees) => {
                            return {name: employees.first_name + ' ' + employees.last_name, value: employees.id}
                        })
                    },
                    {
                        type: 'list',
                        name: 'manager',
                        message: 'Select the new manager: ',
                        choices: (await viewEmployee()).map((employees) => {
                            return {name: employees.first_name + ' ' + employees.last_name, value: employees.id}
                        })
                    }
                ])
                updateManager(employeeManager)
                break
            case 'View total utilized budget of department':
                const budgetResponse = await inquirer.prompt([
                    {
                        type: 'list',
                        name: 'department',
                        message: 'Select the department name: ',
                        choices: (await viewDepartment()).map((departments) => {
                            return {name: departments.name, value: departments.id}
                        })
                    }
                ])
                const budget = await viewBudget(budgetResponse.department)
                console.log('The total sum of that department is ' + budget[0].sum)
                break
            case 'View employees by manager':
                const managerResponse = await inquirer.prompt([
                    {
                        type: 'list',
                        name: 'manager',
                        message: 'Select the manager: ',
                        choices: (await viewEmployee()).map((employees) => {
                            return {name: employees.first_name + ' ' + employees.last_name, value: employees.id}
                        })
                    }
                ])
                const managedEmployees = await viewEmployeesByManager(managerResponse.manager)
                console.log('id         first name                     last name                      role id    manager id')
                console.log('---------- ------------------------------ ------------------------------ ---------- ----------')
                for(i in managedEmployees){
                    let output = '                                                                                              '
                    output = managedEmployees[i].id + output
                    output = output.slice(0, 11) + managedEmployees[i].first_name + output.slice(11)
                    output = output.slice(0, 42) + managedEmployees[i].last_name + output.slice(42)
                    output = output.slice(0, 73) + managedEmployees[i].role_id + output.slice(73)
                    output = output.slice(0, 84) + managedEmployees[i].manager_id
                    console.log(output)
                }
                break
            case 'View employees by department':
                const depResponse = await inquirer.prompt([
                    {
                        type: 'list',
                        name: 'department',
                        message: 'Select the department: ',
                        choices: (await viewDepartment()).map((departments) => {
                            return {name: departments.name, value: departments.id}
                        })
                    }
                ])
                const departmentEmployees = await viewEmployeesByDepartment(depResponse.department)
                console.log('id         first name                     last name                      role id    manager id')
                console.log('---------- ------------------------------ ------------------------------ ---------- ----------')
                for(i in departmentEmployees){
                    let output = '                                                                                              '
                    output = departmentEmployees[i].id + output
                    output = output.slice(0, 11) + departmentEmployees[i].first_name + output.slice(11)
                    output = output.slice(0, 42) + departmentEmployees[i].last_name + output.slice(42)
                    output = output.slice(0, 73) + departmentEmployees[i].role_id + output.slice(73)
                    output = output.slice(0, 84) + departmentEmployees[i].manager_id
                    console.log(output)
                }
                break
            case 'Delete department':
                const deleteDepResponse = await inquirer.prompt([
                    {
                        type: 'list',
                        name: 'department',
                        message: 'Select the department to delete: ',
                        choices: (await viewDepartment()).map((departments) => {
                            return {name: departments.name, value: departments.id}
                        })
                    }
                ])
                await deleteDepartment(deleteDepResponse.department)
                break
            case 'Delete role':
                const deleteRoleResponse = await inquirer.prompt([
                    {
                        type: 'list',
                        name: 'role',
                        message: 'Select the role to delete: ',
                        choices: (await viewRole()).map((roles) => {
                            return {name: roles.title, value: roles.id}
                        })
                    }
                ])
                await deleteRole(deleteRoleResponse.role)
                break
            case 'Delete employee':
                const deleteEmployeeResponse = await inquirer.prompt([
                    {
                        type: 'list',
                        name: 'employee',
                        message: 'Select the employee to delete: ',
                        choices: (await viewEmployee()).map((employees) => {
                            return {name: employees.first_name + ' ' + employees.last_name, value: employees.id}
                        })
                    }
                ])
                await deleteEmployee(deleteEmployeeResponse.employee)
                break
            case 'Quit':
                isRunning = false
                break
        }
    }
}

sequelize.sync({ force: false }).then(start)