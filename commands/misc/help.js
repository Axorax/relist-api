module.exports.run = (client, message, args, userMsg) => {
	try {
		message.reply(`Help command! Prefix: r!

    r!help -> Shows this command
    r!vote -> Vote confirmation for a bot
    r!submit-bot <bot-id> <prefix> -> Submit a bot
    r!login -> Login with your account (anyone can use the relist api to add revolt login to their site and then you need to paste r!login <code> which is displayed on the site)
	r!add-bot <bot-id> <prefix> -> Add a bot to the database (owner only)
	r!dice -> Roll a dice
	r!yesno -> Yes or No
	r!coinflip -> Flip a coin`);
	} catch (err) {
		console.error(err);
	}
};
