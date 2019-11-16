/* Creates a unique ID with an optional prefix. */

let id = 0;

export default function makeElementID(prefix = 'jar') {
  id += 1;
  return `${prefix}-${id}`;
}
