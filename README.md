# WEBAPPDEV-WS2020-G1

This project is a student project at FH Joanneum. It is carried out as a combined exercise of the lectures Agile Project Management and Web Application Development.

## Project Goal

The goal of this project is to develop a new project management tool for the FH JOANNEUM.
With this tool, users should have the possibility to view and search for information.
Our group is assigned to manage and display information regarding ongoing or finished projects.

## Getting started

Install the latest version of Node.js for your OS. You can find more info on the [official Node.js webpage][node].

After that you need to clone the repository on your local machine. You can achieve that with the following command:

```shell
git clone https://github.com/SnickersVsMars/webapp-ws20-projects.git
```

Make sure you're on the master branch, since this represents the most recent and tested version of the application.

After cloning the project, you can open the project in your preferred IDE. Before running the project you need to download the required packages by running `npm i` in a terminal in the project's root.

After successfully downloading the packages you can start the server with `npm start`. This will start the server with Nodemon to enable hot reload.

Other commands:

-   Start the Cypress Test Runner: `npm run cy:open`
-   Run tests: `npm run cy:test`

## Project information

### Description

The aim of this project is to allow us first insights into agile project management using the framework SCRUM as well as learning the basics of web application development and working in a team.
The project is split in 3 sprints, each of which lasting approximately a month. Each sprint will introduce new user stories, that need do be finished until the end of the last sprint.
Following the SCRUM principle, the user stories we chose for a sprint will be split in specific tasks and implemented by the team.
After the implementation the developed features need to be tested by us as well as the by another team. In return our team will peer test another team's implementation as well.
At the end of each sprint every team presents the results from another group.

### Authors

Michael Lamprecht  
Christian Sitzwohl  
Marian Korošec  
Samuel Angerer  
Islam Hemida  
Martin Guevara-Kunerth

### Technology

The technologies used for this project are

Frontend:

-   HTML/CSS/JS
-   [Bootstrap 4][bootstrap]
-   jQuery
-   AJAX

Backend:

-   [NodeJS][node]
    -   [Express Server][express]
-   MySQL

Testing:

-   [Cypress][cypress]

#### Formatter

We use a combination of [EditorConfig][editorconfig] and [Prettier][prettier] to keep our code clean.

[node]: https://nodejs.org/
[bootstrap]: https://getbootstrap.com/
[express]: http://expressjs.com/
[cypress]: https://www.cypress.io/
[editorconfig]: https://editorconfig.org/
[prettier]: https://prettier.io/
