const fs = require('fs').promises;
const path = require('path');

const EMPLOYEES_FILE = path.join(__dirname, '..', 'employees.json');

async function readEmployees() {
    try {
        const data = await fs.readFile(EMPLOYEES_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // If file doesn't exist or is empty, return empty array
        return [];
    }
}

async function writeEmployees(employees) {
    try {
        await fs.writeFile(EMPLOYEES_FILE, JSON.stringify(employees, null, 2));
    } catch (error) {
        throw new Error('Failed to write employees data');
    }
}

module.exports = {
    readEmployees,
    writeEmployees
};