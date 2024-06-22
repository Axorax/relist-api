module.exports.run = (client, message, args, userMsg) => {
	try {
        message.channel.sendMessage({
            embeds: [
              {
                title: `Coin flip`,
                description: `:coin: Coin landed on **${new Date().getMilliseconds() % 2 === 0 ? 'heads' : 'tails'}**`,
              },
            ],
          });
	} catch (e) {
		console.log(e);
	}
};
