/**
 * PO License
 * @OWNER: José Moreira
 * @COPYRIGHTER: José Moreira
 */

export function cutPad ( number, length ) {
  return ( "" + number ).padStart( length, '0' ).substr( length * -1, length )
}

export default cutPad
