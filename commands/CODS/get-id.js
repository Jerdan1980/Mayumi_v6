const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('get-id')
		.setDescription('Returns your participant ID!'),
	async execute(interaction) {
		const userID = interaction.member.user.id;
		await interaction.reply(`Your participant id is: \`${userID.substring(userID.length - 6)}\``);
	},
};