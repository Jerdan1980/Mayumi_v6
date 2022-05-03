require('dotenv').config();
const fs = require('node:fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const CODSCommands = [];
const EasyModoCommands = [];

const CommonCommandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of CommonCommandFiles) {
	const command = require(`./commands/${file}`);
	CODSCommands.push(command.data.toJSON());
	EasyModoCommands.push(command.data.toJSON());
}

const EasyModoCommandFiles = fs.readdirSync('./commands/EasyModo').filter(file => file.endsWith('.js'));
for (const file of EasyModoCommandFiles) {
	const command = require(`./commands/EasyModo/${file}`);
	EasyModoCommands.push(command.data.toJSON());
}

const CODSCommandFiles = fs.readdirSync('./commands/CODS').filter(file => file.endsWith('.js'));
for (const file of CODSCommandFiles) {
	const command = require(`./commands/CODS/${file}`);
	CODSCommands.push(command.data.toJSON());
	if (process.argv[2] === "dev")
		EasyModoCommands.push(command.data.toJSON());
}

//console.log('CODS: ', CODSCommands);
//console.log();
//console.log('EasyModo: ', EasyModoCommands);

const rest = new REST({ version: '9' }).setToken(process.env.discordToken);

rest.put(Routes.applicationGuildCommands(process.env.clientID, process.env.CODSID), { body: CODSCommands })
	.then(() => console.log('Successfully registered application commands to CODS.'))
	.catch((error) => {
		console.error
	});

rest.put(Routes.applicationGuildCommands(process.env.clientID, process.env.EasyModoID), { body: EasyModoCommands })
	.then(() => console.log('Successfully registered application commands to EasyModo.'))
	.catch((error) => {
		console.error
	});
