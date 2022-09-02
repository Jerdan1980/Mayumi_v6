const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('add-role')
		.setDescription('Add a role to several users at once'),
	async execute(interaction) {
		// check for valid user
		if (['262425476822204421', '535566086259736596', '204679685114691584', '445350011258011648'].indexOf(interaction.member.user.id) == -1) {
			// jeremy, ayame, stabell, dillion
			await interaction.reply('Access Denied');
			return;
		}

		// Create the modal
		const modal = new ModalBuilder()
			.setCustomId('addRoleModal')
			.setTitle('Add Role Modal');
		
		// Create the text input components
		const roleIdInput = new TextInputBuilder()
			.setCustomId('roleIdInput')
			.setLabel('Role ID:')
			.setStyle(TextInputStyle.Short)
			.setRequired(true);
		const peopleInput = new TextInputBuilder()
			.setCustomId('peopleInput')
			.setLabel("People to add (enter delimited):")
			.setStyle(TextInputStyle.Paragraph)
			.setRequired(true);
		
		// An action row only holds one text input
		//   so you need one action row per text input
		const firstActionRow = new ActionRowBuilder().addComponents(roleIdInput);
		const secondActionRow = new ActionRowBuilder().addComponents(peopleInput);
		
		// Add inputs to the modal
		modal.addComponents(firstActionRow, secondActionRow);
		
		// Show the modal to the user
		await interaction.showModal(modal);
	}
}