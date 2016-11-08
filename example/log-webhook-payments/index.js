var IfThenPay = require( 'ifthenpay' )
var http = require( 'http' )

var SERVER = http.createServer().listen(80)

var ENTITY = process.env.ENTITY || '99999'
var SUB_ENTITY = process.env.SUB_ENTITY || '999'
var PRE_SHARED_KEY = process.env.PRE_SHARED_KEY || '123456789012345678901234567890'

var ifthenpay = new IfThenPay({
  entity: ENTITY,
  subentity: SUBENTITY,
  webhook: {
    server: SERVER,
    preSharedKey: PRE_SHARED_KEY,
    callback: function ( context ) {
      console.log( context )
    }
  }
})
