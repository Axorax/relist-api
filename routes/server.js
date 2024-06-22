const express = require('express');
const router = express.Router();

router.get('/:id', async (req, res) => {
	let userObject;
	try {
		const { id } = req.params;
		const { data } = req.query;
		const user = await client.servers.fetch(id);
		const properties = ['id', 'analytics', 'animatedIconURL', 'banner', 'bannerURL', 'categories', 'channelIds', 'channels', 'createdAt', 'defaultChannel', 'defaultPermissions', 'description', 'discoverable', 'flags', 'icon', 'iconURL', 'mature', 'member', 'mentions', 'name', 'orderedChannels', 'orderedRoles', 'owner', 'ownerId', 'permission', 'roles', 'systemMessages', 'unread'];

		if (data) {
			const requestedProperties = data.split(',');
			userObject = requestedProperties.reduce((obj, property) => {
				if (properties.includes(property)) {
					obj[property] = user[property];
				}
				return obj;
			}, {});
		} else {
			userObject = properties.reduce((obj, property) => {
				obj[property] = user[property];
				return obj;
			}, {});
		}
	} catch (error) {
		userObject = {
			status: 404,
			message: 'Server not found!'
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
		const user = await client.servers.fetch(id);
		data = user[property];
	} catch (error) {
		data = {
			status: 404,
			message: 'Server not found!'
		};
	}
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET');
	res.status(200).json(data);
});

module.exports = router;
