module.exports.run = (client, message, args, userMsg) => {
	try {
        message.channel.sendMessage({
            embeds: [
              {
                title: `yesno`,
                description: `**${Date.now() % 2 === 0 ? 'yes' : 'no'}**`,
              },
            ],
          });
	} catch (e) {
		console.log(e);
	}
};
