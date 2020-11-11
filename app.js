const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const { array } = require("yargs");

let arrayOfEmployees = [];
const questions = [
    {
        type: 'list',
        message: "What is this employee's role?",
        name: 'role',
        choices: ["Manager", "Engineer", "Intern"],
    },
    {
        type: 'input',
        message: "What is this employee's name?",
        name: 'name',
    },
    {
        type: 'input',
        message: "What is this employee's ID?",
        name: 'id',
    },
    {
        type: 'input',
        message: "What is this employee's email?",
        name: 'email',
    }
]

function internPrompt(res, arrayOfEmployees) {
    //ask for name, id, email, school
    const name = res.name;
    const id = res.id;
    const email = res.email;
    let school;
    const internQ = [
        {
            type: 'input',
            message: "What is this employee's school?",
            name: 'school',
        },
    ];
    inquirer.prompt(internQ).then((response) => {
        console.log(response);
        school = response.school;
        const intern = new Intern(name, id, email, school);
        arrayOfEmployees.push(intern);
        // console.log("Intern prompt:");
        // console.log(arrayOfEmployees);
        lastCall(arrayOfEmployees);
    });
    
}

function managerPrompt(res, arrayOfEmployees) {
    //ask for name, id, email, school
    const name = res.name;
    const id = res.id;
    const email = res.email;
    let officeNumber;
    const managerQ = [
        {
            type: 'input',
            message: "What is this manager's office number?",
            name: 'officeNumber',
        },
    ];
    inquirer.prompt(managerQ).then((response) => {
        officeNumber = response.officeNumber;
        const manager = new Manager(name, id, email, officeNumber);
        arrayOfEmployees.push(manager);
        // console.log("Manager prompt:");
        // console.log(arrayOfEmployees);
        lastCall(arrayOfEmployees);
    });
    
}

function engineerPrompt(res, arrayOfEmployees) {
    //ask for name, id, email, school
    const name = res.name;
    const id = res.id;
    const email = res.email;
    let github;
    const engineerQ = [
        {
            type: 'input',
            message: "What is this employee's github username?",
            name: 'github',
        },
    ];
    inquirer.prompt(engineerQ).then((response) => {
        github = response.github;
        const engineer = new Engineer(name, id, email, github);
        arrayOfEmployees.push(engineer);
        // console.log("Engineer prompt:");
        // console.log(arrayOfEmployees);
        lastCall(arrayOfEmployees);
    });
   
}

function lastCall(arrayOfEmployees) {
    const lastQ = [
        {
            type: 'input',
            message: 'Would you like to add more employees? (Y/N)',
            name: 'addMore',
        }
    ]
    inquirer.prompt(lastQ).then((response) => {
        if (response.addMore === 'Y') {
            init(questions, arrayOfEmployees);
        } else {
            //finish making the HTMLs
            console.log("Check the output folder for the team.html file!");
            const template = render(arrayOfEmployees);
            fs.writeFile(outputPath, template, function(err) {
                if (err) throw err;
            });
        }
    })
}
//include 3 functions, one for intern, manager, and engineer. First question is the employees role
//use an if block to call a function to use a specific inquirer for the given role

// last question is "Would you like to add any more employees?"" If yes, call inquirer
//again. If no, then use the array of employee objects and call render()
function init(questions, arrayOfEmployees) {
    inquirer.prompt(questions).then((response) => {
        if (response.role === 'intern' || response.role === 'Intern') {
            arrayOfEmployees = internPrompt(response, arrayOfEmployees);
        } else if (response.role === 'Manager' || response.role === 'manager') {
            arrayOfEmployees = managerPrompt(response, arrayOfEmployees);
        } else if (response.role === 'Engineer' || response.role === 'engineer') {
            arrayOfEmployees = engineerPrompt(response, arrayOfEmployees);
        }
    });
};

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
init(questions, arrayOfEmployees);