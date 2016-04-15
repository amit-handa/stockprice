'use strict';

var spcommon = require( 'sp-common' ),
	l = spcommon.logger.child( {'module': __filename.substring(__dirname.length+1, __filename.length-3)} ),
	fs = require( 'fs' ),
	responseTime = require("koa-response-time"),
	route = require('koa-router');

module.exports = function (app) {
	app.use( function * ( next ) {
		this.req.connection.setTimeout( 0 );
		this.req.connection.setNoDelay( true );
		try {
			yield next;
		} catch( err ) {
      l.error( { err: err } );
      this.status = err.status || 500;
      this.body = err.message;
      this.app.emit( 'error', err, this );
		}
	} );

	app.use( responseTime() );

	app.use( function*( next ) {
		this.log = l;
		l.debug("got req ", this.request);
		yield next;
	} );

	let secRouter = route();
	fs.readdirSync('./server/controllers').forEach( function (file) {
		let controller = require('../controllers/' + file);

		if( controller.initSecured )
			controller.initSecured( secRouter );
	});

	app.use( secRouter.routes() );
};
