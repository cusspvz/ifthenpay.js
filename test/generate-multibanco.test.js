import { generateMultibanco } from '../src/generate-multibanco'
import { expect } from 'chai'

const USE_CASES = [

  /*
    Entidade: 99999
    SubEntidade: 999
    ID: 123
    Valor: 123€
    Referencia: 999 012 373
   */
  [ '99999', '999', 123, '123', '999012373' ],

  /*
    Entidade: 99999
    SubEntidade: 999
    ID: 123
    Valor: 321€
    Referência: 999 012 337
   */
  [ '99999', '999', 321, '123', '999012337' ],

]

describe( "generate-multibanco", () => {

  // USE_CASES
  describe( "Cases", () => {

    USE_CASES.forEach(function ( use_case, i ) {
      it( `should pass use case #${i} -> ${use_case[4]}`, () => {
        expect(
          generateMultibanco( use_case[0], use_case[1], use_case[2], use_case[3] )
        ).to.be.equal( use_case[4] )
      })
    })

  })

})
