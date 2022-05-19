const { SlashCommandBuilder } = require('@discordjs/builders');
const Gamedig = require('gamedig');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server-status')
		.setDescription('Returns status of Ark and MC servers!'),
	async execute(interaction) {
		await interaction.reply("Querying servers...");

		Gamedig.query({
			type: 'arkse',
			host: '73.35.12.208',
			port: '7777'
		}).then(async function (state) {
			await interaction.followUp(`Ark Server: **${state.name}** is online (${state.players.length}/${state.maxplayers} players)`);
			console.log(state);
		}).catch(async function (error) {
			await interaction.followUp("Ark Server is offline");
			console.log(error);
		});

		Gamedig.query({
			type: 'minecraft',
			host: '73.35.12.208:25565'
		}).then(async function (state) {
			await interaction.followUp(`MC Server: **${state.name}** is online (${state.players.length}/${state.maxplayers} players)`);
			console.log(state)
		}).catch(async function (error) {
			await interaction.followUp("MC Server is offline");
			console.log(error);
		});
	},
};