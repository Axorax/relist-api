module.exports.run = (client, message, args, userMsg) => {
	try {
        num = Math.floor(Math.random() * 6) + 1;
        message.channel.sendMessage({
            embeds: [
              {
                title: `Dice Roll - ${num}`,
                description: `:game_die: Dice landed on **${num}**`,
              },
            ],
          });
	} catch (e) {
		console.log(e);
	}
};
