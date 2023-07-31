module.exports.run = (client, message, args, userMsg) => {
  try {
    message.reply(`Help command! Prefix: r!

    [Relist Website](https://axorax.github.io/relist/)
    
    r!help -> Shows this command
    r!vote -> Vote confirmation for a bot
    r!submit-bot <bot-id> <bot-prefix> -> Submit a bot
    r!login -> Login with your account (anyone can use the relist api to add revolt login to their site and then you need to paste r!login <code> which is displayed on the site)`);
  } catch (e) {
    console.log(e);
  }
};
