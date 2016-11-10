/**
 * PO License
 * @OWNER: José Moreira
 * @COPYRIGHTER: José Moreira
 */

import generateMultibanco from './generate-multibanco'

const DEFAULT_OPTIONS = {
  rejectDeepDecimalValues: false,
  generateReferenceOnly: false,
}

class IfThenPay {

  constructor ( options ) {
    options = this.options = {
      ...DEFAULT_OPTIONS,
      ...options
    }

    if ( typeof options.entity == 'number' ) {
      options.entity = ""+options.entity
    }

    if ( typeof options.entity != 'string' || options.entity.length !== 5 ) {
      throw new TypeError( "options.entity should be a 5 chars string" )
    }

    if ( typeof options.subentity == 'number' ) {
      options.subentity = ""+options.subentity
    }

    if ( typeof options.subentity != 'string' || options.subentity.length > 3 ) {
      throw new TypeError( "options.subentity should be a under 3 chars string" )
    }

  }

  generate ( value, id = 0 ) {
    const { entity, subentity, generateReferenceOnly } = this.options

    // Arguments validation
    if ( typeof id != 'number' ) {
        throw new TypeError( "id must be a number" )
    }

    if ( typeof value != 'number' || value <= 0 || value >= 1000000  ) {
      throw TypeError( "value should be a float between 0 and 1.000.000" )
    }

    if ( this.options.rejectDeepDecimalValues ) {
      if ( value !== value.toFixed(2) ) {
        throw new TypeError( "value should NOT have more than two decimal numbers" )
      }
    } else {
      value = +value.toFixed(2)
    }

    const reference = generateMultibanco( entity, subentity, value, id )

    return generateReferenceOnly ? reference : { entity, reference, value }
  }

}

module.exports = IfThenPay
