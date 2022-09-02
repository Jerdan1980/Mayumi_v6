const { SlashCommandBuilder, IntegrationApplication } = require('discord.js');
const Diploma = require('../../models/diplomaModel.js');

const { google } = require('googleapis');
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const TOKEN_PATH = '../../gapi-token.json';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('diploma')
		.setDescription('Everything diploma!')
		.addSubcommand(subcommand => 
			subcommand.setName('view')
				.setDescription('Returns YOUR diplomas!'))
		.addSubcommand(subcommand =>
			subcommand.setName('get')
				.setDescription('Returns ALL diplomas (with optional filters)!')
				.addStringOption(option => 
					option.setName('user_name')
						.setDescription('Enter user\'s name!'))
				.addStringOption(option =>
					option.setName('competition')
						.setDescription('Enter competition name!'))
				.addUserOption(option =>
					option.setName('user')
						.setDescription('Enter Discord ID!'))
				.addStringOption(option =>
					option.setName('category')
						.setDescription('Category diploma')))
		.addSubcommand(subcommand => 
			subcommand.setName('award')
				.setDescription('Awards a diploma!')
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
						.setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand.setName('remove')
				.setDescription('Removes a diploma!')
				.addStringOption(option =>
					option.setName('diploma_id')
						.setDescription('ID of diploma')
						.setRequired(true)))
		.addSubcommand(subcommand => 
			subcommand.setName('edit')
				.setDescription('Edits a diploma')
				.addStringOption(option =>
					option.setName('diploma_id')
						.setDescription('ID of diploma')
						.setRequired(true))
				.addStringOption(option => 
					option.setName('user_name')
						.setDescription('Enter user\'s name!'))
				.addStringOption(option =>
					option.setName('competition')
						.setDescription('Enter competition name!'))
				.addUserOption(option =>
					option.setName('user')
						.setDescription('Enter Discord ID!'))
				.addStringOption(option =>
					option.setName('category')
						.setDescription('Category diploma')))
		.addSubcommand(subcommand =>
			subcommand.setName('bulk-award')
				.setDescription('Bulk award diplomas')),
	async execute(interaction) {
		const cmd = interaction.options.getSubcommand();

		if (cmd == 'view') {
			Diploma.find({ userID: interaction.member.user.id }, async function (err, data) {
				if (data.length == 0) {
					await interaction.reply({ content: 'You have no diplomas yet!', ephemeral: true });
					return 0;
				}
				// else
				await interaction.reply({ content: `You have ${data.length} diplomas. Tabulating...`, ephemeral: true });
				printDiplomas(interaction, data, true);
			});
			return 0;
		}
		// else

		// everything else is admin, so make sure they have permission
		if (['262425476822204421', '535566086259736596', '204679685114691584'].indexOf(interaction.member.user.id) == -1) {
			//jeremy, ayame, stabell
			await interaction.reply('Access Denied');
			return 0;
		}

		//await interaction.reply(`Your subcommand was: \`${subcommand}\``);

		let query = {};
		let name, comp, user, cate;
		switch (cmd) {
			case 'get':
				name = interaction.options.getString('user_name');
				comp = interaction.options.getString('competition');
				user = interaction.options.getUser('user');
				cate = interaction.options.getString('category');
				if (name) query.name = name;
				if (comp) query.competition = comp;
				if (user) query.userID = user.id;
				if (cate) query.category = cate;

				Diploma.find(query, async function (err, data) {
					if (data.length == 0) {
						await interaction.reply('No diplomas found!')
						return 0;
					}
					await interaction.reply(`Tabulating data... (${data.length} items found)`);
					printDiplomas(interaction, data, false);
				});
				break;
			case 'award':
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
				break;
			case 'remove':
				Diploma.findByIdAndDelete(interaction.options.getString('diploma_id'), async function (err, diploma) {
					await interaction.reply(`Removed: \`${diploma._id}: ${diploma.name} "${diploma.category}" (${diploma.competition})\``);
				});
				break;
			case 'edit':
				name = interaction.options.getString('user_name');
				comp = interaction.options.getString('competition');
				user = interaction.options.getUser('user');
				cate = interaction.options.getString('category');
				if (name) query.name = name;
				if (comp) query.competition = comp;
				if (user) query.userID = user.id;
				if (cate) query.category = cate;

				Diploma.findByIdAndUpdate(interaction.options.getString('diploma_id'), query, { new: true }, async function (err, diploma) {
					if (err) {
						await interaction.reply('Something went wrong!');
						return 0;
					}
					await interaction.reply(`Updated: \`${diploma._id}: ${diploma.name} "${diploma.category}" (${diploma.competition})\``);
				});
				break;
			case 'bulk-award':
				const auth = new google.auth.GoogleAuth({
					keyFile: 'gapi-token.json',
					scopes: SCOPES,
				});
				google.options({auth: auth});
				const sheets = google.sheets({version: 'v4'});
				sheets.spreadsheets.values.get({
					spreadsheetId: '1IvUGlmQ6ApxmWFGOIm7EqZltBsFkBxCWYfom2DnDcSw',
					range: 'Sheet1!A2:D'
				}, async function (err, res) {
					if (err) {
						await interaction.reply("Something went wrong!");
						return console.log('The API returned an error: ' + err);
					}
					let arr = res.data.values.map((row) => {
						let payload = {
							name: row[0],
							competition: row[1],
							category: row[3],
						}
						if (row[2] != '') 
							payload.userID = row[2];
						return payload;
					});
					Diploma.insertMany(arr, async function (err, docs) {
						if (err) {
							await interaction.reply("Something went wrong!");
							return console.log('The API returned an error: ' + err)
						}
						console.log(docs);
						await interaction.reply(`${docs.length} diplomas added`);
					})
				})
				break;
		}
	},
};

async function printDiplomas(interaction, data, hidden) {
	for (let base = 0; base < (data.length / 10); base++) {
		let str = `Diplomas (${base + 1} of ${Math.ceil(data.length / 10)}):\n\`\`\`\n`;
		for (let i = 0; (i < 10) && ((base * 10) + i < data.length); i++) {
			const item = data[(base * 10) + i]
			str += `${(base * 10) + i + 1}. ${item._id}: ${item.name} "${item.category}" (${item.competition})\n`;
		}
		str += '```';
		await interaction.followUp({ content: str, ephemeral: hidden });
	}
}