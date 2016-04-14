'use strict';

let spcommon = require('sp-common');
let parse = require( 'co-body' );
let request = require( 'co-request' );

// register koa routes
exports.initSecured = function (app) {
	app.post('/v1/stockprice', getStockprice );
};

function processTickerResp( ticker, res ) {
	let body = "Ticker,Price\n";
	ticker = ticker.toUpperCase();
	switch( res.status.code ) {
		case 200:
			body += `${res.results[0].symbol},${res.results[0].lastPrice}`;
			break;
		case 204:	// found nothing
			body += `${ticker},unknown`;
			break;
		case 400:
			body += `${ticker},invalid req`;
			break;
		default:
			body += `${ticker},error!retry after a while`;
			break;
	};

	return body;
}

/*
{ ToCountry: 'US',\n  ToState: 'NJ',\n  SmsMessageSid: 'SM6adf8293a09924d0a50654a7eb112150',\n  NumMedia: '0',\n  ToCity: 'HASBROUCK HEIGHTS',\n  FromZip: '',\n  SmsSid: 'SM6adf8293a09924d0a50654a7eb112150',\n  FromState: 'Alberta',\n  SmsStatus: 'received',\n  FromCity: '',\n  Body: 'symbol goog',\n  FromCountry: 'CA',\n  To: '+12018905502',\n  ToZip: '07604',\n  NumSegments: '1',\n  MessageSid: 'SM6adf8293a09924d0a50654a7eb112150',\n  AccountSid: 'ACd26c1e9d1a8b4f7db20f568656852dc1',\n  From: '+15873280233',\n  ApiVersion: '2010-04-01' } */
function * getStockprice(next) {
	let config = spcommon.config;

	try {
		let body = yield parse( this );
		//body = JSON.parse( body );
		this.log.info( "get stock price ", body );
		body = body.Body;
		this.log.info( "get stock price ", body );
		body = spcommon.utils.util.parseBody( body );

		let ticker = body[0][body[0].length-1];
		let getstockprice = config.app.stockpriceApi.replace( "\{SYMBOL\}", ticker );
		let res = yield request( {
			url : getstockprice,
			method : "GET"
		} );

		let tickerinfo = JSON.parse( res.body );
		this.log.info( "tickerinfo ", res.statusCode, tickerinfo );
		this.status = 200;
		this.body = processTickerResp( ticker, tickerinfo );
		yield next;
	} catch (err) {
		this.log.error({err:err});
		this.status = 200;
		this.body = processTickerResp( ticker, { status : { code : 500 } } );
		this.app.emit('error', err, this);
	}
}
