module.exports = {
	name: 'starboardNoSelfStar',
	starboard: true,
	async execute(emoji, message, user) {
		try {
			await user.send(`You cannot ${emoji} your own messages in _${message.client.guilds.resolve(message.guildId).name}_.`);
		} catch (error) {
			console.log(error);
		}
	}
}
