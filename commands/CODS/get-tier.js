const { SlashCommandBuilder } = require('@discordjs/builders');
const { google } = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const TOKEN_PATH = '../../gapi-token.json';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('get-tier')
		.setDescription('Returns your current CODS tier!'),
	async execute(interaction) {
		const auth = new google.auth.GoogleAuth({
			keyFile: 'gapi-token.json',
			scopes: SCOPES,
		});
		//google.options({auth: auth});
		getTier(auth, interaction)
	},
};

async function getTier(auth, interaction) {
  const sheets = google.sheets({version: 'v4'});
  sheets.spreadsheets.values.get({
    spreadsheetId: '1ps4XIdwJGIEhmiSOQ-4US781NZlBlMZIr8WEAfR9KK4',
    range: 'Sheet1!A2:C',
		auth: auth
  }, async function (err, res) {
    if (err) {
			await interaction.reply("Something went wrong!");
			return console.log('The API returned an error: ' + err);
		}
		const uid = interaction.member.user.id;
    const data = res.data.values.find(row => row[0] == uid);
    if (data) {
      await interaction.reply(`Your tier is: **${data[1]}**\nYour decay status is: \`${data[2] ?? 'N/A'}\``)
    } else {
      await interaction.reply("Could not find your tier. Consider signing up?")
    }
  });
}