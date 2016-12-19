require( 'babel-polyfill' )

var IfThenPay = require( 'ifthenpay' ).IfThenPay
var http = require( 'http' )


var PORT = process.env.PORT || 8901
var ENTITY = process.env.ENTITY || '99999'
var SUB_ENTITY = process.env.SUB_ENTITY || '999'
var PRE_SHARED_KEY = process.env.PRE_SHARED_KEY || '123456789012345678901234567890'

var SERVER = http.createServer().listen(PORT)

var ifthenpay = new IfThenPay({
  entity: ENTITY,
  subentity: SUB_ENTITY,
  webhook: {
    autosetup: true,
    server: SERVER,
    preSharedKey: PRE_SHARED_KEY,
    callback: function ( context ) {
      console.log( context )
    }
  }
})
