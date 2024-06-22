const express = require('express');
const router = express.Router();

router.get('/:id', async (req, res) => {
	let userObject;
	try {
		const { id } = req.params;
		const { data } = req.query;
		const user = await client.users.fetch(id);
		const profile = await user.fetchProfile();
		const properties = ['id', 'animatedAvatarURL', 'avatar', 'avatarURL', 'badges', 'bot', 'createdAt', 'defaultAvatarURL', 'discriminator', 'displayName', 'flags', 'online', 'permission', 'presence', 'privileged', 'relationship', 'status', 'username'];
		const profileProps = ['content', 'background'];

		if (data) {
			const requestedProperties = data.split(',');
			userObject = requestedProperties.reduce((obj, property) => {
				if (properties.includes(property)) {
					obj[property] = user[property];
				}
				return obj;
			}, {});
			profileProps.forEach((e) => {
				if (requestedProperties.includes(e)) {
					userObject[e] = profile[e];
				}
			});
		} else {
			userObject = properties.reduce((obj, property) => {
				obj[property] = user[property];
				return obj;
			}, {});
			profileProps.forEach((e) => {
				userObject[e] = profile[e];
			});
		}
	} catch (error) {
		userObject = {
			status: 404,
			message: 'User not found!'
		};
	}

	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET');
	res.status(200).json(userObject);
});

router.get('/:property/:id', async (req, res) => {
	let data;
	try {
		const { property, id } = req.params;
		const user = await client.users.fetch(id);
		data = user[property];
	} catch (error) {
		data = {
			status: 404,
			message: 'User not found!'
		};
	}
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET');
	res.status(200).json(data);
});

module.exports = router;
