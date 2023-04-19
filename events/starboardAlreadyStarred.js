module.exports = {
	name: 'starboardAlreadyStarred',
	starboard: true,
	async execute(emoji, message, user) {
		try {
			await user.send(`This message is already in _${message.client.guilds.resolve(message.guildId).name}_'s starboard.`);
		} catch (error) {
			console.log(error);
		}
	}
}
