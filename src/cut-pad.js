/**
 * PO License
 * @OWNER: José Moreira
 * @COPYRIGHTER: José Moreira
 */

import padStart from 'pad-start'

export function cutPad ( number, length ) {
  return padStart( "" + number, length, '0' ).substr( length * -1, length )
}

export default cutPad
