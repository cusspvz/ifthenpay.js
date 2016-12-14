import QueryString from 'querystring'

export function generateMiddleware ( ifthenpay ) {
  return async ( req, res ) => {
    const { entity, webhook: { preSharedKey, callback } } = ifthenpay.options

    try {
      const qsi = req.url.indexOf( '?' )

      if ( qsi === -1 ) {
        throw new Error( "Unable to find query string" )
      }

      // Parse querystring
      const query = QueryString.parse( req.url.substr( qsi + 1 ) ) || {}

      // Start consuming data from the querystring

      if ( preSharedKey !== query.chave ) {
        throw new Error( "preSharedKey didn't match" )
      }

      if ( entity !== query.entidade ) {
        throw new Error( "entity didn't match" )
      }

      const reference = query.referencia

      if ( ! reference.match(/[0-9](9)/) ) {
        throw new Error( "reference didn't match" )
      }

      if ( subentity !== reference.substr( 0, subentity.length ) ) {
        throw new Error( "subentity didn't match" )
      }

      const value = query.valor

      // seems we can pass this up to the callback
      // first, we'll gonna fetch the ID from the reference and pass all the
      // data needed for the callback
      const id = reference.substr( subentity.length, 7 /*( 9 - 2 )*/ - subentity.length )

      await callback({ entity, subentity, id, reference, value })

    } catch ( err ) {
      res.statusCode = 500
      res.statusMessage = 'Internal Server Error'
      res.end()
    }

    res.statusCode = 200
    res.statusMessage = 'OK'
    res.end()
  }
}

export default generateMiddleware
