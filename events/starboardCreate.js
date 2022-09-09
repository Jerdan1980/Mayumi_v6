module.exports = {
	name: 'starboardCreate',
	starboard: true,
	async execute(data) {
		const channel = data.manager.client.channels.cache.get(data.channelId);
		channel.send(`This channel is now a starboard!`);
	}
}