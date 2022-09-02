const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('id')
		.setDescription('Returns your Discord ID!'),
	async execute(interaction) {
		const idEmbed = {
			title: "Discord User ID",
			description: "Here is your requested information:",
			color: 5814783,
			fields: [
				{
					name: "Discord User ID",
					value: `This is a unique 18-digit number that is associated with your Discord account.  If you are registering with us for the first time, you will need this information. \n\n__Your User ID is:__ \`${interaction.user.id}\``
				}
			],
			footer: {
				text: "Please inform us through chemolyds@gmail.com OR directly message a staff member if any information must be changed."
			}
		}

		await interaction.reply({
			embeds: [idEmbed],
			ephemeral: true
		});
	},
};
