const path = require("path");

/**
 * Check if it's hidden.
 */

function isHidden(root, filePath) {
  filePath = filePath.substr(root.length).split(path.sep);
  for (let i = 0; i < filePath.length; i++) {
    if (filePath[i][0] === ".") return true;
  }
  return false;
}


module.exports = exports = {
  isHidden
}