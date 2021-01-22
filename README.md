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

The aim of this project is to enable us to get first insights into agile project management using the framework SCRUM as well as learning the basics of web application development and working in a team.
The project is split into 3 sprints, each of which lasting approximately a month. Each sprint will introduce new user stories that need to be finished until the end of the last sprint.  
Following the SCRUM principle, the user stories we chose for a sprint will be split in specific tasks and implemented by the team.  
After the implementation, the developed features need to be tested by us as well as by another team. In return our team will peer test another team's implementation.  
At the end of each sprint every team presents the results from another group.

### User Stories

#### List Overview -> Sprint 1

This user story calls for an overview list of components in the project management tool, in our case, projects.

This user story was implemented in Sprint 1.

#### Search -> Sprint 3

This user story revolves around searching and filtering in the overview list. It allows you to filter components by their respective fields or search for any property in the component.

This user story was implemented in Sprint 3.

#### Detail View -> Sprint 1

In this user story, a component in the project management tool should have its own view to show the component's more specific details.

This user story was implemented in Sprint 1.

#### Add new data -> Sprint 2

As part of this user story, it should be possible to add new componentes, in our case projects, to the management tool.

This user story was implemented in Sprint 2.

#### Edit existing data -> Sprint 3

Existing components should be editable after implementing this user story.

This user story was implemented in Sprint 3.

#### Frontend validation -> Sprint 2

This user story requires data, either added or edited, to be validated on the front-end before the actual change.

This user story was implemented in Sprint 2.

#### Input validation server side -> Sprint 3

This user story requires data, either added or edited, to be validated in the back-end before the actual change.

Even though this user story was only introduced in the second Sprint Review, it was already implemented in Sprint 2 as part of the previous validation user story.

#### Export PDF -> Sprint 3

In this user story, a printable version of the component's overview and detail page should be created and then downloaded as PDF. An additional requirement was, that the PDF is generated on the server.

This user story was implemented in Sprint 3.

#### File upload -> Sprint 3

The last user story adds the requirement to handle file uploads in the project management tool. We chose to implement that story in the way of attachments for projects.

This user story was implemented in Sprint 3.

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
