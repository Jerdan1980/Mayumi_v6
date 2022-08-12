const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('id')
		.setDescription('Returns your Discord ID!'),
	async execute(interaction) {
		const userID = interaction.member.user.id;
		await interaction.reply({
			content: `Your Discord ID is: \`${userID}\``,
			ephemeral: true
		});
	},
};
