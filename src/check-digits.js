/**
 * PO License
 * @OWNER: José Moreira
 * @COPYRIGHTER: José Moreira
 */

import cutPad from './cut-pad'

export const HASH_CALC = [ 51, 73, 17, 89, 38, 62, 45, 53, 15, 50, 5, 49, 24, 81, 76, 27, 90, 9, 30, 3 ]

export function checkDigits ( entity, ref, value ) {

  // Arguments validation

  if ( typeof entity != 'string' || entity.length !== 5 ) {
    throw TypeError( "entity should be a 5 chars string" )
  }

  if ( typeof ref != 'string' || ref.length !== 7 ) {
    throw TypeError( "ref should be a 7 chars string" )
  }

  if ( typeof value != 'number' || value <= 0 || value >= 1000000  ) {
    throw TypeError( "value should be a float between 0 and 1.000.000" )
  } else {
    value = cutPad( Math.floor( value * 100 ), 8 )
  }

  // Init helper variables

  var chk_string = entity + ref + value
  var chk_val = 0

  // Just to be sure...
  if ( chk_string.length !== 20 ) {
    throw new Error( "Something went wrong but it shouldn't" )
  }

  // Calculate value
  for ( var i in HASH_CALC ) {
    chk_val += (+chk_string[i]) * HASH_CALC[i]
  }

  // Return the two check digits
  return cutPad( 98 - ( chk_val % 97 ), 2 )
}

export default checkDigits
