import { checkDigits } from '../src/check-digits'
import { expect } from 'chai'

const USE_CASES = [

  /*
    Entidade: 99999
    Referência: 999 012 373
    Valor: 123€
   */
  [ '99999', '9990123', 123, '73' ],

  /*
    Entidade: 99999
    Referência: 999 012 337
    Valor: 321€
   */
  [ '99999', '9990123', 321, '37' ],

]

describe( "check-digits", () => {

  // TYPES
  describe( "Types", () => {

    it( "should fail if provided with an entity as a number", () => {
      expect(() => checkDigits( 99999, '9999999', 50.00 ) ).to.throw( Error )
    })

    it( "should fail if provided with a ref as a number", () => {
      expect(() => checkDigits( '99999', 9999999, 50.00 ) ).to.throw( Error )
    })

    it( "should fail if provided with a value as a number", () => {
      expect(() => checkDigits( '99999', '9999999', '50.00' ) ).to.throw( Error )
    })

    it( "should NOT fail if everything is as it should", () => {
      expect(() => checkDigits( '99999', '9999999', 50.00 ) ).to.not.throw( Error )
    })

  })

  // USE_CASES
  describe( "Cases", () => {

    USE_CASES.forEach(function ( use_case, i ) {
      it( `should pass use case #${i} -> ${use_case[3]}`, () => {
        expect(
          checkDigits( use_case[0], use_case[1], use_case[2])
        ).to.be.equal( use_case[3] )
      })
    })

  })

})
