'use strict';
var fs = require('fs'),
	self = exports,
	inited = false,
	lm = require('./utils/logger');

exports.init = (config) => {
	if (inited) return;
	inited = true;

	self.config = config;

	lm.init(config);
	self.logger = lm.root;

	self.initDir('/utils', 'utils');
};

exports.initDir = ( dir, key ) => {
	let self = exports[key] = {};
	let models_path = __dirname + dir;
	fs.readdirSync(models_path).forEach(function (file) {
		if (~file.indexOf('js')) {
			self[file.substring(0, file.length - 3)] = require(models_path + '/' + file);
		}
	});
};
