# Ethereum ATM with Account Names

This is a fork of the Starter Next/Hardhat Project with additional features to manage account names associated with Ethereum addresses. The project provides a simple ATM-like interface that allows users to deposit, withdraw, and manage account names.

This project is made for demonstration purposes and the submission on Metacrafters

## Getting Started

To run this project on your computer, follow these steps:

1. Clone this repository to your local machine.

2. Inside the project directory, open a terminal and run the following command to install the required dependencies:

   ```bash
   npm install

    Open two additional terminals in your preferred code editor.

    In the second terminal, start a local Ethereum node using Hardhat by running the following command:

    bash

npx hardhat node

In the third terminal, deploy the smart contract to the local Ethereum network with the following command:

bash

npx hardhat run --network localhost scripts/deploy.js

Back in the first terminal, start the front-end application by running:

bash

    npm run dev

    The project will now be running locally and can be accessed in your web browser at http://localhost:3000/.

Features

    Account Creation: Users can create accounts and associate them with their Ethereum addresses.

    Account Names: Account names can be set or reset by users.

    Balance Management: Users can deposit and withdraw Ethereum from their accounts.

    Maximum Balance: The smart contract enforces a maximum balance limit.

