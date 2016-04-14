'use strict';

let spcommon = require('sp-common');
let parse = require( 'co-body' );
let request = require( 'co-request' );

// register koa routes
exports.initSecured = function (app) {
	app.post('/v1/stockprice', getStockprice );
};

function processTickerResp( ticker, res ) {
	let body = `Ticker,Price\n${ticker.toUpperCase()},`;
	switch( res.status.code ) {
		case 200:
			body += res.results[0].lastPrice;
			break;
		case 204:	// found nothing
			body += "unknown";
			break;
		case 400:
			body += "invalid req";
			break;
		default:
			body += "error!retry after a while";
			break;
	};

	return body;
}

function * getStockprice(next) {
	let config = spcommon.config;

	let body = yield parse( this );
	body = spcommon.utils.util.parseBody( body );

	let ticker = body[0][body[0].length-1];
	let getstockprice = config.app.stockpriceApi.replace( "\{SYMBOL\}", ticker );
	this.log.info( "get stock price ", body, getstockprice );
	try {
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
