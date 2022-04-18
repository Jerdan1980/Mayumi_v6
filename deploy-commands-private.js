require('dotenv').config();
const fs = require('node:fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
//const { clientId, guildId, token } = require('./config.json');

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(process.env.discordToken);

rest.put(Routes.applicationGuildCommands(process.env.clientID, process.env.guildID1), { body: commands })
	.then(() => console.log('Successfully registered application commands to server 1.'))
	.catch((error) => {
		console.error
	});

	rest.put(Routes.applicationGuildCommands(process.env.clientID, process.env.guildID2), { body: commands })
	.then(() => console.log('Successfully registered application commands to server 2.'))
	.catch((error) => {
		console.error
	});