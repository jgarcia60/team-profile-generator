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
        //generate new Intern object
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
        //generate new Manager object
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
        //generates new Engineer object
        const engineer = new Engineer(name, id, email, github);
        arrayOfEmployees.push(engineer);
        // console.log("Engineer prompt:");
        // console.log(arrayOfEmployees);
        lastCall(arrayOfEmployees);
    });
   
}

//this function ends the prompts or keeps adding employees to team profile
function lastCall(arrayOfEmployees) {
    const lastQ = [
        {
            type: 'input',
            message: 'Would you like to add more employees? (Y/N)',
            name: 'addMore',
        }
    ]
    inquirer.prompt(lastQ).then((response) => {
        if (response.addMore === 'Y' || response.addMore === 'y') {
            //call initial prompt function again
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


//ask the preliminary question of the role, then go into role-specific questions
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
//call initial prompt function
init(questions, arrayOfEmployees);