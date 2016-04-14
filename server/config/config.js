'use strict';

/** * Environment variables and application configuration. */
var path = require('path'),
	_ = require('lodash');

var baseConfig = {
	app: {
		root: path.normalize(__dirname + '/../..'),
		env: process.env.NODE_ENV || 'dev'
	}
};

// environment specific config overrides
var platformConfig = {
	dev: {
		log: {
			level : 'debug',
			path: __dirname + "/../../logs/stockprice.log",
		},

		twilio : {
		  account_sid : "ACd26c1e9d1a8b4f7db20f568656852dc1",
		  auth_token : "1b356383abf7c55a090096d9ae4f94b8"
		},

		app: {
			port: 9950,
			uploadDir: __dirname + "/../../uploads",
			//stockquote api: http://dev.markitondemand.com/MODApis
			//stockpriceApi : "http://dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol={SYMBOL}"
			//stockpriceApi : "http://download.finance.yahoo.com/d/quotes?s={SYMBOL}&f=sb2b3jk"
			stockpriceApi : "http://marketdata.websol.barchart.com/getQuote.json?key=0702eb00e7bd34eac41338a641c46732&symbols={SYMBOL}"
		}
	},

	beta: {
		log: {
			level : 'debug',
			path: __dirname + "/../../logs/stockprice.log",
		},

		twilio : {
		  account_sid : "ACd26c1e9d1a8b4f7db20f568656852dc1",
		  auth_token : "1b356383abf7c55a090096d9ae4f94b8"
		},

		app: {
			port: 9950,
			uploadDir: __dirname + "/../../uploads",
			//stockquote api: http://dev.markitondemand.com/MODApis
			//stockpriceApi : "http://dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol={SYMBOL}"
			//stockpriceApi : "http://download.finance.yahoo.com/d/quotes?s={SYMBOL}&f=sb2b3jk"
			stockpriceApi : "http://marketdata.websol.barchart.com/getQuote.json?key=0702eb00e7bd34eac41338a641c46732&symbols={SYMBOL}"
		}
	},

	prod: {}
};

// override the base configuration with the platform specific values
module.exports = _.merge(baseConfig, platformConfig[baseConfig.app.env]);
