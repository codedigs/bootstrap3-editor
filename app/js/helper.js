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
 * @return {Boolean}      [description]
 */
function is_collided(A, B) {
  return A.pt.x <= (B.pt.x + B.w) &&
        (A.pt.x + A.w) >= B.pt.x &&
        A.pt.y <= (B.pt.y + B.h) &&
        (A.pt.y + A.h) >= B.pt.y;
}

Function.prototype.implements = function() {
  window.a = this;
  window.b = arguments;

  var bluePrint = this; // class
  var methods = Object.keys(bluePrint.prototype);

  var interfaces = arguments;

  for (var i in interfaces) {
    var requiredMethods = Object.keys(interfaces[i].prototype);

    for (var j in methods) {
      var index = requiredMethods.indexOf(methods[j]); // index of required methods

      if (index !== -1) {
        requiredMethods.splice(index, 1); // reduce required method
      }
    }

    if (requiredMethods.length > 0) {
      console.error("Error: " + bluePrint.name + " prototypes not meet the " + interfaces[i].name + " requirements.");
    }
  }

  return this;
};
