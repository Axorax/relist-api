const bots = require("../../data/bots.json");
const fs = require("fs");

async function botInfo(message, id) {
  if (!Object.keys(bots).includes(id))
    return message.reply("That bot is not in our list!");
  const user = await client.users.fetch(id);
  const profile = await user.fetchProfile();
  message.channel.sendMessage({
    embeds: [
      {
        title: "🤖 • Bot Information",
        icon_url: `https://autumn.revolt.chat/avatars/${user.avatar.id}/${user.avatar.filename}`,
        description: `Username: \`${user.username}\`
      Votes: \`${bots[id].v}\`
      Created: \`${new Date(user.createdAt).toLocaleString()}\`
      Online: \`${user.online}\`
      Bio:
\`\`\`
${profile.content}
\`\`\`
      `,
      },
    ],
  });
}

module.exports.run = (client, message, args) => {
  try {
    if (message.mentionIds) {
      botInfo(message, message.mentionIds[0]);
    } else if (/[0-9A-Z]{26}/.test(args[0])) {
      botInfo(message, args[0]);
    }
  } catch (e) {
    console.log(e);
  }
};
