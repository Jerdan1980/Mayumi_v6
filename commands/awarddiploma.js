const { SlashCommandBuilder } = require('@discordjs/builders');
const { IntegrationApplication } = require('discord.js');
const Diploma = require('../models/diplomaModel.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('awarddiploma')
		.setDescription('Creates a diploma!')
		.addStringOption(option => 
			option.setName('user_name')
				.setDescription('Enter user\'s name!')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('competition')
				.setDescription('Enter competition name!')
				.setRequired(true))
		.addUserOption(option =>
			option.setName('user')
				.setDescription('Enter Discord ID!')
				.setRequired(true))
		.addStringOption(option =>
				option.setName('category')
					.setDescription('Category diploma')
					.setRequired(true)
					.addChoice('Honors', 'Honors')
					.addChoice('High Honors', 'High Honors')
					.addChoice('Damper', 'Damper')),
	async execute(interaction) {
		//console.log(interaction.member.user);
		if (['262425476822204421', '535566086259736596', '204679685114691584'].indexOf(interaction.member.user.id) == -1) {
			//jeremy, ayame, stabell
			await interaction.reply('Access Denied');
			return 0;
		}

		let saveDiploma = new Diploma({
			name: interaction.options.getString('user_name'),
			competition: interaction.options.getString('competition'),
			userID: interaction.options.getUser('user').id,
			category: interaction.options.getString('category')
		});

		saveDiploma.save(async function (err, diploma) {
			if (err) {
				await interaction.reply(`Something went wrong...\n\`\`\`\n${err}\n\`\`\``);
				console.log(err);
				return 0;
			}
			await interaction.reply(`${diploma.name} awarded **${diploma.category}** for _${diploma.competition}_.\nCertification ID: \`${diploma._id}\``);
		});
	},
};