"use strict";

exports.parseBody = parseBody;

function parseBody( body ) {
  body = body.trim();
  body = body.split( "\n" );
  body = body.map( line => line.split( " " ) );
  return body;
}
