const { SlashCommandBuilder } = require('@discordjs/builders');
const { google } = require('googleapis');

const scopes = ['https://www.googleapis.com/auth/spreadsheets'];
//const TOKEN_PATH = '../../gapi-token.json';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('Returns information about your CODS!'),
	async execute(interaction) {
		const auth = new google.auth.GoogleAuth({
			keyFile: 'gapi-token.json',
			scopes: scopes,
		});
		google.options({auth: auth});

		const sheets = google.sheets({version: 'v4'});
		sheets.spreadsheets.values.get({
			spreadsheetId: process.env.currDirectory,
			range: 'Directory 2022-23!A:F',
		}, async function (err, res) {
			// check if API failed
			if (err) {
				await interaction.reply({
					content: "Something went wrong!", 
					ephemeral: true
				});
				return console.log('The API returned an error: ' + err);
			}

			// find a matching uid in the E column
			const uid = interaction.member.user.id;
			const row = res.data.values.findIndex(row => row[4] == uid);

			// if none was found, state so
			if (row == -1) {
				await interaction.reply({
					content: "Could not find your tier. Have you signed up for this years competitions?",
					ephemeral: true
				});
				return;
			}
			const data = res.data.values[row];

			// calculate decay
			let decay = '';
			if (data[1] == 0 ) {
				// Bronze tier, no decay
				decay = 'Infinite';
			} else if (data[1] >= 1 && data[1] <= 4) {
				// Silver tier, has decay
				// Silver is 1 to 4, and takes 4 comps to decay
				decay = `${data[1]}`;
			} else if (data[1] >= 5 && data[1] <= 6) {
				// Gold tier, has decay
				// Gold is 5-6, and takes 2 comps to decay
				decay = `${data[1] - 4}`;
			} else {
				decay = 'Data Not Found'
			}

			// create embed
			const tierEmbed = {
				title: "CODS Competition Information",
				description: "**__Note:__** *It is highly recommended that users not share their personal information, especially their CIN (Competitive Identification Number) on public chatrooms.*\n\nHere is your requested information:",
				color: 5814783,
				fields: [
					{
						name: "Competitive Identification Number (CIN)",
						value: `Your CIN number is \`${data[0]}\`. Do not share this with others.`
					},
					{
						name: "Competition Tier",
						value: `You will compete in \`${data[2]}\` tier.`
					},
					{
						name: "Decay Status",
						value: `You have \`${decay}\` competition(s) before you will decay to a lower tier.`
					},
					{
						name: "Email",
						value: `You have registered with us using this email: \`${data[5]}\``
					},
					{
						name: "Discord User ID",
						value: `This is a unique 18-digit number that is associated with your Discord account.  If you are registering with us for the first time, you will need this information. \n\n__Your User ID is:__ \`${interaction.user.id}\``
					}
				],
				footer: {
					text: "Please inform us through chemolyds@gmail.com OR directly message a staff member if any information must be changed."
				}
			};

			// send the message
			await interaction.reply({
				embeds: [tierEmbed],
				ephemeral: true
			});
		});
	},
};
