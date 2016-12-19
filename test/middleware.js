import IfThenPay from '../src/if-then-pay'
import Express from 'express'
import supertest from 'supertest'
import http from 'http'

const ENTITY = '99999'
const SUB_ENTITY = '999'
const PRE_SHARED_KEY = '1234567890987654321234567890'

describe( "IfThenPay", () => {
  describe( "IfThenPay.middleware", () => {

    function registerTests ( SERVER ) {
      let last_call_context = {}

      const req = supertest(SERVER)
      const ifthenpay = new IfThenPay({
        entity: ENTITY,
        subentity: SUB_ENTITY,
        webhook: {
          autosetup: true,
          server: SERVER,
          url: '/',
          preSharedKey: PRE_SHARED_KEY,
          callback: function ( context ) {
            last_call_context = context
          },
        }
      })

      it( 'should reply 500 response without query', ( done ) => {
        req
        .get('/')
        .expect( 500, done )
      })

    }

    describe( "node http server", () => {
      registerTests( http.createServer() )
    })

    describe( "express http server", () => {
      registerTests( Express() )
    })

  })
})
