const fs = require('fs');
const path = require('path');

class DB {
	constructor(options) {
		const { file } = options;
		this.filePath = path.join(__dirname, file);
		this.data = this.loadData();
	}

	loadData() {
		try {
			const fileData = fs.readFileSync(this.filePath, 'utf8');
			return JSON.parse(fileData);
		} catch (err) {
			return {};
		}
	}

	save() {
		try {
			const fileData = JSON.stringify(this.data);
			fs.writeFileSync(this.filePath, fileData, 'utf8');
			return this;
		} catch (err) {
			console.error('Error occurred while saving data:', err);
		}
	}

	searchValues(key, value) {
		const results = {};
		for (const id in this.data) {
			if (this.data.hasOwnProperty(id)) {
				const obj = this.data[id];
				if (obj.hasOwnProperty(key) && obj[key] === value) {
					results[id] = obj;
				}
			}
		}
		return results;
	}

	add(key, value) {
		this.data[key] = value;
		this.save();
		return this.data[key];
	}

	remove(key) {
		delete this.data[key];
		this.save();
	}

	keys() {
		return Object.keys(this.data);
	}

	values() {
		return Object.values(this.data);
	}

	search(key) {
		return this.data[key] || null;
	}
}

module.exports = DB;
