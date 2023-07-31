module.exports.run = (client, message, args, userMsg) => {
  try {
    if (Object.keys(loginRequests).includes(args[0])) {
      const data = loginRequests[args[0]];
      if (data.type != "submit-bot") {
        return message.reply(
          "Only SBV (submit bot verification) token can be used for this action!"
        );
      } else if (data.id != message.author.id) {
        return message.reply("Invalid user!");
      }

      submit([
        {
          title: `🤖 • ${
            data.type == "submit-bot" ? "Bot submission" : "Server submission"
          }`,
          description: `Bot ID: \`${data.bot}\`
      Ping: <@${data.bot}>
      Invite Link: https://app.revolt.chat/bot/${data.bot}
      Prefix: \`${data.prefix}\`
      Author: \`${message.author.id}\`
      Author Ping: <@${message.author.id}>
      Tags: ${data.tags}`,
        },
      ]);
      log([
        {
          title: `✨ LOG • ${
            data.type == "submit-bot" ? "Bot submission" : "Server submission"
          }`,
          description: `Bot ID: \`${data.bot}\``,
        },
      ]);

      delete loginRequests[args[0]];
      message.reply("✅ | Submitted!");
    } else {
      message.reply("Invalid SBV (submit bot verification) token!");
    }
  } catch (e) {
    console.log(e);
  }
};
