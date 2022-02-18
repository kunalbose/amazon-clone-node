# amazon-clone-node
**The base of this project is a NodeJs server, which serves the React build pages.**
1. You have to run **npm init** or **yarn add** inside the root directory as well as in amazon-clone(React App) folder.
2. make the __build__(npm run build) inside the amazon-clone folder.
3. go to the Payment.js inside the './amazon-clone/src/' and paste your stripe public key.
4. create a .env file inside './' and create a variable named STRIPE_SECRET, paste your stripe secret key here.
5. start the server from './' of the project using **npm run start** and you have the amazon clone app ready.


Inside the amazon-clone(React Application)

- public
  - index.html - Gives the react app a place to render
  - favicon.ico - icon on the tab bar

- src | Heart of the ReactJS app
  - context - Globalstate folder, used alongside hooks
  - index.css - css file for index.js
  - index.js - loads all our compoments and lays them out
