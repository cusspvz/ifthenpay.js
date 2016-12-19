/**
 * PO License
 * @OWNER: José Moreira
 * @COPYRIGHTER: José Moreira
 */

import generateMultibanco from './generate-multibanco'
import generateMiddleware from './generate-middleware'

const DEFAULT_OPTIONS = {
  rejectDeepDecimalValues: false,
  generateReferenceOnly: false,
  webhook: false
}

export class IfThenPay {

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

    if ( typeof options.webhook == 'object' && options.webhook.autosetup ) {
      if ( typeof options.webhook.url != 'string' ) {
        options.webhook.url = false
      }

      if ( typeof options.webhook.server == undefined ) {
        throw new TypeError( "options.webhook.server must be an express server object" )
      }

      if ( typeof options.webhook.callback != 'function' ) {
        throw new TypeError( "options.webhook.callback must be a function" )
      }

      if ( typeof options.webhook.preSharedKey != 'string' || options.webhook.preSharedKey.length > 50 ) {
        throw new TypeError( "options.webhook.preSharedKey must be a max 50 chars key (they claim this as the AntiPhishingKey)" )
      }

      this.mountMiddleware()
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

  middleware () {
    return generateMiddleware( this )
  }

  mountedMiddleware = false
  mountMiddleware () {
    if ( this.mountedMiddleware ) {
      throw new Error( "Seems we already mounted middleware on server" )
    }

    const { url, server } = this.options.webhook

    // Express Router / Restify
    if ( typeof server.use == 'function' ) {
      server.get( url, this.middleware() )
    } else if ( typeof server.on == 'function' ) {
      server.on( 'request', this.middleware() )
    } else {
      throw new Error( "Unable to auto-mount middleware on server" )
    }

    this.mountedMiddleware = true
  }
}

export default IfThenPay
