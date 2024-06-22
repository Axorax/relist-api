module.exports.run = (client, message, args, userMsg) => {
	try {
		if (message.channel.server && message.channel.server.id != '01J0ZR94GCE3XB5RQETD4SRGSE') {
			return message.reply(`Join the official server to use this command! You can find the server [invite here.](https://github.com/axorax/socials) Scroll down to the Revolt server part.`);
		} else if (args[0] == undefined || args[1] == undefined) {
			return message.reply(`Invalid usage!
      
      <bot-id> <bot-prefix>`);
		}
		submit([
			{
				title: '🤖 • Bot Submission',
				description: `Bot ID: \`${args[0]}\`
      Ping: <@${args[0]}>
      Invite Link: https://app.revolt.chat/bot/${args[0]}
      Prefix: \`${args[1]}\`
      Author: \`${message.author.id}\`
      Author Ping: <@${args[0]}>`
			}
		]);
		log([
			{
				title: '✨ LOG • Bot Submission',
				description: `ID: \`${args[0]}\``
			}
		]);
	} catch (e) {
		console.log(e);
	}
};
