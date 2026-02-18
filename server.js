// Employee Payroll System
const express = require('express');
const path = require('path');
const { readEmployees, writeEmployees } = require('./modules/fileHandler');
const app = express();
const PORT = 3000;

// Set view engine to EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// --- Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// --- Routes ---

// Dashboard - Display all employees
app.get('/', async (req, res) => {
    try {
        const employees = await readEmployees();
        // Calculate tax and net salary for each employee
        const employeesWithCalculations = employees.map(emp => ({
            ...emp,
            tax: emp.basicSalary * 0.12,
            netSalary: emp.basicSalary - (emp.basicSalary * 0.12)
        }));
        res.render('index', { employees: employeesWithCalculations });
    } catch (error) {
        console.error('Error reading employees:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Show add employee form
app.get('/add', (req, res) => {
    res.render('add');
});

// Add new employee
app.post('/add', async (req, res) => {
    try {
        const { name, department, basicSalary } = req.body;

        // Validation
        if (!name || !department || !basicSalary || basicSalary < 0) {
            return res.status(400).send('Invalid input data');
        }

        const employees = await readEmployees();
        const newEmployee = {
            id: Date.now(),
            name: name.trim(),
            department: department.trim(),
            basicSalary: Number(basicSalary)
        };

        employees.push(newEmployee);
        await writeEmployees(employees);

        res.redirect('/');
    } catch (error) {
        console.error('Error adding employee:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Delete employee
app.get('/delete/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        let employees = await readEmployees();
        employees = employees.filter(emp => emp.id !== id);
        await writeEmployees(employees);
        res.redirect('/');
    } catch (error) {
        console.error('Error deleting employee:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Show edit employee form
app.get('/edit/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const employees = await readEmployees();
        const employee = employees.find(emp => emp.id === id);
        if (!employee) {
            return res.status(404).send('Employee not found');
        }
        res.render('edit', { employee });
    } catch (error) {
        console.error('Error fetching employee for edit:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Update employee
app.post('/edit/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { name, department, basicSalary } = req.body;

        // Validation
        if (!name || !department || !basicSalary || basicSalary < 0) {
            return res.status(400).send('Invalid input data');
        }

        let employees = await readEmployees();
        const index = employees.findIndex(emp => emp.id === id);
        if (index === -1) {
            return res.status(404).send('Employee not found');
        }

        employees[index] = {
            id,
            name: name.trim(),
            department: department.trim(),
            basicSalary: Number(basicSalary)
        };

        await writeEmployees(employees);
        res.redirect('/');
    } catch (error) {
        console.error('Error updating employee:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Employee Payroll System running on http://localhost:${PORT}`);
});