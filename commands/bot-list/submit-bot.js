module.exports.run = (client, message, args, userMsg) => {
  try {
    if (
      message.channel.server &&
      message.channel.server.id != "01GVK81S6KZJF5E0EVDGD75AHH"
    ) {
      return message.reply(
        `Join [this server](https://app.revolt.chat/invite/01GVK81S6KZJF5E0EVDGD75AHH) to use this command!`
      );
    } else if (args[0] == undefined || args[1] == undefined) {
      return message.reply(`Invalid usage!
      
      <bot-id> <bot-prefix>`);
    }
    submit([
      {
        title: "🤖 • Bot Submission",
        description: `Bot ID: \`${args[0]}\`
      Ping: <@${args[0]}>
      Invite Link: https://app.revolt.chat/bot/${args[0]}
      Prefix: \`${args[1]}\`
      Author: \`${message.author.id}\`
      Author Ping: <@${args[0]}>`,
      },
    ]);
    log([
      {
        title: "✨ LOG • Bot Submission",
        description: `ID: \`${args[0]}\``,
      },
    ]);
  } catch (e) {
    console.log(e);
  }
};
