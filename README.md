# Desafío

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
- [My process](#my-process)
  - [Built with](#built-with)
  - [Useful resources](#useful-resources)

## Overview

### The challenge

- Reuse the webapp "Rock, Paper, Scissors" and add the necessary screens to be able to play online with another person. Use this [design](https://www.figma.com/file/eFWnPjb6jXbNQlHFwL1rQI/dwf-m6-desaf%C3%ADo?node-id=0%3A1) as a reference.

- The backend must:
  - Communicate using [restful principles](https://ninenines.eu/docs/en/cowboy/2.9/guide/rest_principles/).
  - Allow to create gamerooms.
  - Allow to play (i.e. start and finish games) and keep the room score forever.
  - Have a documented API with Postman and with the link to the documentation in the Readme.md. [API Documentation](https://documenter.getpostman.com/view/17951846/UVXbseNH).
  - Upload the application to Heroku and add the link to the game in the Readme.md. [GAME LINK](https://dwf-m6-hand-game.herokuapp.com/)

## My process

### Built with

- DB Realtime (Real Time Data Base - Firestore)
- DB NoSQL (Firestore)
- ExpressJS
- Flexbox

### Useful resources

- [Firebase Docs](https://firebase.google.com/docs/database/security)

- [CORS](https://www.npmjs.com/package/cors)

  - Cross-Origin Resource Sharing (CORS) is a mechanism that uses additional HTTP headers to allow a user agent to obtain permission to access selected resources from a server in a different origin (domain) to which it belongs.

- [Vaadin Router](https://www.npmjs.com/package/@vaadin/router)

  - It uses the widely adopted express.js syntax for routes (/users/:id) to map URLs to Web Component views

- [Nano Id](https://www.npmjs.com/package/nanoid)

  - A tiny, secure, URL-friendly, unique string ID generator for JavaScript.

- [Express](https://www.npmjs.com/package/express)

  - Provides mechanisms for: Writing request handlers with different HTTP verbs in different URL paths (routes).

- [Nodemon](https://www.npmjs.com/package/nodemon)

  - Nodemon is a tool that helps develop node.js based applications by automatically restarting the node application when file changes in the directory are detected.

- [HTTP response status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
