/**
 * Check if the two objects collided
 * @param  {object}  A {
 *  pt: { // point top left
 *    x: {int}, y: {int}
 *  },
 *  w: {int},
 *  h: {int}
 * }
 * @param  {object}  B {
 *  pt: { // point top left
 *    x: {int}, y: {int}
 *  },
 *  w: {int},
 *  h: {int}
 * }
 * @return {Boolean}
 */
window.is_collided = function(A, B) {
  return A.pt.x <= (B.pt.x + B.w) &&
        (A.pt.x + A.w) >= B.pt.x &&
        A.pt.y <= (B.pt.y + B.h) &&
        (A.pt.y + A.h) >= B.pt.y;
};
