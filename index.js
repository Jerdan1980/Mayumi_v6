require('dotenv').config();
// Require the necessary discord.js classes
const fs = require('node:fs');
const { Client, Collection, GatewayIntentBits, InteractionType } = require('discord.js');
const mongoose = require('mongoose');
const { mainModule } = require('node:process');
const walk = require('@root/walk');

main();
async function main() {
	await mongoose.connect(`mongodb+srv://${process.env.mongoDBuser}:${process.env.mongoDBpass}@${process.env.mongoDBurl}?retryWrites=true&w=majority`)
		.then(() => console.log('Connected to Database!'))
		.catch(err => console.error(err));
}

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Allows access to commands in other files
client.commands = new Collection();

// Imports files
walk.walk('./commands', walkCommandsFunc);
async function walkCommandsFunc(err, pathname, dirent) {
	//console.log(pathname, dirent);
	if (dirent.name.endsWith('.js')) {
		const command = require(`./${pathname}`);
		// Set a new item in the Collection
		// With the key as the command name and the value as the exported module
		client.commands.set(command.data.name, command);
	}
}

walk.walk('./events', walkEventsFunc);
async function walkEventsFunc(err, pathname, dirent) {
	if (dirent.name.endsWith('.js')) {
		const event = require(`./${pathname}`);
		if (event.once) {
			client.once(event.name, (...args) => event.execute(...args));
		} else {
			client.on(event.name, (...args) => event.execute(...args));
		}
	}
}

client.on('interactionCreate', async interaction => {
	if (interaction.type !== InteractionType.ApplicationCommand) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// Login to Discord with your client's token
client.login(process.env.discordToken);