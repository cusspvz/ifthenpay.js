/**
 * PO License
 * @OWNER: José Moreira
 * @COPYRIGHTER: José Moreira
 */

import cutPad from './cut-pad'
import checkDigits from './check-digits'

export function generateMultibanco ( entity, subentity, value, id = 0 ) {
  const ref = subentity + cutPad(id, 7 - subentity.length)
  const chkdgts = checkDigits( entity, ref, value )

  return ref + chkdgts
}

export default generateMultibanco
