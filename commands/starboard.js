const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { query } = require('gamedig');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('starboard')
		.setDescription('Everything starboard!')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
		.addSubcommand(subcommand => 
			subcommand.setName('create')
				.setDescription('Create a starboard!')
				.addChannelOption(option =>
					option.setName('channel')
						.setDescription('The starboard channel')
						.setRequired(true))
				.addBooleanOption(option =>
					option.setName('star-bot-msgs')
						.setDescription('Allows adding bot messages to the starboard')
						.setRequired(false))
				.addBooleanOption(option => 
					option.setName('self-star')
						.setDescription('Allows users to star their own messages')
						.setRequired(false))
				.addNumberOption(option =>
					option.setName('threshold')
						.setDescription('The number of reactions required')
						.setRequired(false)))
		.addSubcommand(subcommand =>
			subcommand.setName('edit')
				.setDescription('Edit a starboard!')
				.addChannelOption(option =>
					option.setName('channel')
						.setDescription('The starboard channel')
						.setRequired(true))
				.addBooleanOption(option =>
					option.setName('star-bot-msgs')
						.setDescription('Allows adding bot messages to the starboard')
						.setRequired(false))
				.addBooleanOption(option => 
					option.setName('self-star')
						.setDescription('Allows users to star their own messages')
						.setRequired(false))
				.addNumberOption(option =>
					option.setName('threshold')
						.setDescription('The number of reactions required')
						.setRequired(false)))
		.addSubcommand(subcommand =>
			subcommand.setName('delete')
				.setDescription('Delete a starboard!')
				.addChannelOption(option =>
					option.setName('channel')
						.setDescription('The starboard channel')
						.setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand.setName('list')
				.setDescription('Lists starboards in this server!')),
	async execute(interaction) {
		// Initialize variables
		let channel, starBotMsg, selfStar, threshold, starboard;
		let opts = {};

		const cmd = interaction.options.getSubcommand();
		// List is the only one that doesn't have the channel option
		if (cmd !== 'list') {
			channel = interaction.options.getChannel('channel');

			// Both edit and create have options
			if (cmd !== 'delete') {
				// Grab options
				starBotMsg = interaction.options.getBoolean('star-bot-msgs');
				selfStar = interaction.options.getBoolean('self-star');
				threshold = interaction.options.getNumber('threshold');
				if (starBotMsg !== null) opts.starBotMsg = starBotMsg;
				if (selfStar !== null) opts.selfStar = selfStar;
				if (threshold !== null) opts.threshold = threshold;
			}
		}

		switch (cmd) {
			case 'create':
				// Check if a starboard already exists
				if (getStarboard(interaction, channel)) {
					interaction.reply(`A starboard for ${channel} already exists! Did you mean \`/starboard edit\`?`);
					return;
				}

				// Else create starboard
				interaction.client.starboardsManager.create(channel, opts);
				
				// Return a message about starboard data
				starboard = getStarboard(interaction, channel);
				interaction.reply({
					content: `${channel}`,
					embeds: [createEmbed(`Created Starboard ${channel}`, starboard)]
				});
				break;


			case 'edit':
				// Check if a starboard doesn't exist
				if (!getStarboard(interaction, channel)) {
					interaction.reply(`A starboard for ${channel} does not exist! Did you mean \`/starboard create\`?`);
					return;
				}

				// Else edit starboard
				interaction.client.starboardsManager.edit(channel.id, "⭐", opts)
				
				// Return a message about starboard data
				starboard = getStarboard(interaction, channel);
				interaction.reply({
					content: `${channel}`,
					embeds: [createEmbed(`Edited Starboard`, starboard)]
				});
				break;


			case 'delete':
				// Check if a starboard doesn't exist
				if (!getStarboard(interaction, channel)) {
					interaction.reply(`A starboard for ${channel} does not exist! You do not need to run this command!`);
					return;
				}

				// Else delete starboard
				interaction.client.starboardsManager.delete(channel.id, "⭐");
				interaction.reply(`Deleted starboard!`);
				break;


			case 'list':
				let onServer = interaction.client.starboardsManager.starboards.filter((s) => s.guildId === interaction.guildId);
				let str = `**Starboards in this server:**`;
				for (let i = 0; i < onServer.length; i++) {
					let starboard = onServer[i];
					console.log(starboard);
					str += `\n<#${starboard.channelId}>: ${starboard.options.emoji}`;
				}
				interaction.reply(str)
				break;


			default:
				interaction.reply(`Subcommand \`${cmd}\` not recognized!`);
				break;
		}
	}
}

function getStarboard(interaction, channel) {
	return interaction.client.starboardsManager.starboards.find(
		(s) => s.channelId === channel.id && s.options.emoji === "⭐",
	);
}

function createEmbed(title, starboard, channel) {
	return {
		"title": title,
		"description": "Information on your starboard:",
		"color": 0xffd500,
		"fields": [
			{
				"name": `Allow Starring Self Messages`,
				"value": starboard.options.selfStar,
			},
			{
				"name": `Allow Starring Bot Messages`,
				"value": starboard.options.starBotMsg,
			},
			{
				"name": `Threshold`,
				"value": starboard.options.threshold,
			}
		]
	}
}
