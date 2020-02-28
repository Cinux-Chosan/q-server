const path = require("path");

/**
 * Check if it's hidden.
 */

const isHidden = (root, filePath) => {
  filePath = filePath.substr(root.length).split(path.sep);
  for (let i = 0; i < filePath.length; i++) {
    if (filePath[i][0] === ".") return true;
  }
  return false;
};

const isDev = process.env.NODE_ENV === "dev";

const isAccessible= (root, absPath) => !path.relative(root, absPath).startsWith('..')

module.exports = exports = {
  isHidden,
  isDev,
  isAccessible
};
