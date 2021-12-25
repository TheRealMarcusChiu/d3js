/**
 * @param {number} x
 * @param {number} mean
 * @param {number} std
 * @returns {number}
 */
function dnorm(x, mean=0, std=1) {
  var s2 = std * std;
  return Math.pow(Math.E,-Math.pow(x - mean, 2)/(2*s2))/Math.sqrt(2*Math.PI*s2);
}

/**
 * @param {number} mean
 * @param {number} std
 * @returns {number}
 */
function rnorm(mean=0, std=1) {
    // Standard Normal variate using Box-Muller transform.
    var u1 = Math.random(); // Converting [0,1) to (0,1)
    var u2 = Math.random();
    var z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return z0 * std + mean;
}
