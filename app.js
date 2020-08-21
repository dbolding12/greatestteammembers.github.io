const Manager = require('./lib/Manager');
const Engineer = require('./lib/Engineer');
const Intern = require('./lib/Intern');
const inquirer = require('inquirer');
const jest = require("jest");
const fs = require('fs');
const render = require('./lib/htmlRenderer');
const path = require('path');

const OUTPUT_DIR = path.resolve(__dirname, 'output');
const outputPath = path.join(OUTPUT_DIR, 'team.html');

const teamMembers = []; 
const idArr = []; 

const askQuestions = employeeType => [
  {
    type: 'input',
    name: 'name',
    message: `What is your ${employeeType}'s first and last name?`,
    default: "Zoe Bolding"
  },
  {
    type: 'input',
    name: 'id',
    message: `What is your ${employeeType}'s employee id?`,
    default: "10282"
  },
  {
    type: 'input',
    name: 'email',
    message: `What is your ${employeeType}'s email?`,
    default: "zbolding@gmail.com"
  }
];

const createTeam = () => {
  const createManager = async () => {
    const answer = await inquirer.prompt([
       ...askQuestions('manager'),
      {
        type: 'input',
        name: 'officeNumber',
        message: "What is your office number?",
        default: "089"
      }
    ]);

    const { name, id, email, officeNumber } = answer;
    const manager = new Manager(name, id, email, officeNumber);

    teamMembers.push(manager);
    idArr.push(id);

    createTeam();
  };

  const addEngineer = async () => {
    const answer = await inquirer.prompt([
       ...askQuestions('engineer'),
      {
        type: 'input',
        name: 'github',
        message: "What is your GitHub username?",
        default: "dbolding12"
      }
    ]);

    const { name, id, email, github } = answer;
    const engineer = new Engineer(name, id, email, github);

    teamMembers.push(engineer);
    idArr.push(id);

    createTeam();
  };

  const addIntern = async () => {
    const answer = await inquirer.prompt([
        ...askQuestions('intern'),
      {
        type: 'input',
        name: 'school',
        message: "What school do you attend?",
        default: "Georgia Institute of Technology"
      }
    ]);

    const { name, id, email, school } = answer;
    const intern = new Intern(name, id, email, school);

    teamMembers.push(intern);
    idArr.push(id);

    createTeam();
  };

  const createTeam = async () => {
    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'addTeam',
        message: 'Add another Team Member?',
        choices: [
                  "Engineer", 
                  "Intern", 
                  "Done adding to the Team"
                 ]
      }
    ]);
// Same as if else statement
    switch (answer.addTeam) { 
      case 'Engineer':
        addEngineer();
        break;

      case 'Intern':
        addIntern();
        break;

      default:
        fs.writeFileSync(outputPath, render(teamMembers), 'utf-8'); //Create HTML
        break;
    }
  };

  createManager();
};

  createTeam();