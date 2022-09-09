# Mayumi

A multipurpose bot designed for the CODS and Easy Modo servers.

[Invite Mayumi](https://discord.com/api/oauth2/authorize?client_id=316084155182219265&permissions=2416036928&scope=bot%20applications.commands)

## Development

### Requirements

- Node.js version 16.19 or higher
- A GCP account with a Google Sheets API enabled and a GAPI token
- A Discord Application setup for bots
- A Discord Server
- Internet access

### Quick Start

1. Copy the `sample.env` file, rename it `.env`, and fill out the relevant information.
2. Download your GAPI token, name it `gapi-token.json`, and move it to the root directory
3. Open terminal in the root directory and run `npm install`
4. Use one of 2 methods to deploy commands:
   - Run `npm run deploy-dev` to deploy all commands into the "EasyModo" server listed in the `.env` file. This is mainly used for development.
   - Run `npm run deploy-prod` to deploy commands only to their specific servers.
5. Use one of 2 methods to start/stop the bot
   - To have the bot restart whenever a file is changed, run `npm run start-dev`. Press `ctrl+C` several times to stop the process. Keep in mind the bot **will close** when you close terminal.
   - To run the bot in the background, instead run `npm start`. Closing the terminal **will not** end the process. Open terminal in the root directory and run `npm stop` to end the process. Any logs can be found in the newly-made `logs.txt`

### File structure

 - `/commands`: Holds any commands. Any in this folder will be deployed to all servers.
   - `/CODS`: Holds commands for CODS specifically. Will be deployed to EasyModo when `deploy-dev` is ran.
   - `/EasyModo`: Holds commands for EasyModo specifically.
 - `/events`: Holds any discord events (such as modalSubmit)
 - `/models`: Holds mongoDB models.
 - `deploy-commands.js`: Contains code on deploying commands.
 - `index.js`: The actual bot process
 - `package.json` and `package-lock.json`: Project files