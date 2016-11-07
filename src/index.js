/**
 * PO License
 * @OWNER: José Moreira
 * @COPYRIGHTER: José Moreira
 */

import generateMultibanco from './generate-multibanco'

const DEFAULT_OPTIONS = {
  rejectDeepDecimalValues: false,
  generateReferenceOnly: false,
  webhook: false
}

export class IfThenPay {

  constructor ( options ) {
    this.options = {
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

    if ( typeof options.webhook == 'object' ) {
      if ( typeof options.webhook.url != 'string' ) {
        throw new TypeError( "options.webhook.url must be a valid url without the trailling slash. Ex: '/webhook'" )
      }

      if ( typeof options.webhook.server == undefined ) {
        throw new TypeError( "options.webhook.server must be an express server object" )
      }

      if ( typeof options.webhook.callback != 'function' ) {
        throw new TypeError( "options.webhook.callback must be a function" )
      }

      if ( typeof options.webhook.preSharedKey != 'function' ) {
        throw new TypeError( "options.webhook.preSharedKey must be a 50 chars key (they claim this as the AntiPhishingKey)" )
      }
    }

  }

  generate ( value, id = 0 ) {
    const { entity, subentity } = this.options

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

    return this.generateReferenceOnly ? reference : { entity, reference, value }
  }

  async middleware ( req, res ) {
    const { entity, webhook: { preSharedKey, callback } } = this.options

    try {

      if ( preSharedKey !== req.query( 'chave' ) ) {
        throw new Error( "preSharedKey didn't match" )
      }

      if ( entity !== req.query( 'entidade' ) ) {
        throw new Error( "entity didn't match" )
      }

      const reference = req.query( 'referencia' )

      if ( ! reference.match(/[0-9](9)/) ) {
        throw new Error( "reference didn't match" )
      }

      if ( subentity !== reference.substr( 0, subentity.length ) ) {
        throw new Error( "subentity didn't match" )
      }

      const value = req.query( 'value' )

      // seems we can pass this up to the callback
      // first, we'll gonna fetch the ID from the reference and pass all the
      // data needed for the callback
      const id = reference.substr( subentity.length, 7 /*( 9 - 2 )*/ - subentity.length )

      await callback({ entity, subentity, id, reference, value })

    } catch ( err ) {
      res.status( 500 ).send()
    }

    res.status( 200 ).send()
  }
}
