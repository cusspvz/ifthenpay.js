import IfThenPay from '../src/if-then-pay'
import supertest from 'supertest'
import http from 'http'

const ENTITY = '99999'
const SUB_ENTITY = '999'
const PRE_SHARED_KEY = '1234567890987654321234567890'

const SERVER = http.createServer()
const req = supertest(SERVER)
const ifthenpay = new IfThenPay({
  entity: ENTITY,
  subentity: SUB_ENTITY,
  webhook: {
    server: SERVER,
    preSharedKey: PRE_SHARED_KEY,
    callback: function ( context ) {
      last_call_context = context
    },
  }
})

let last_call_context = {}

describe( "IfThenPay", () => {
  describe( "IfThenPay.middleware", () => {

    it( 'should reply 500 response without query', ( done ) => {
      req
      .get('/')
      .expect( 500, done )
    })

  })
})
