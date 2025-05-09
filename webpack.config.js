const { withExpo } = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  return await withExpo(env, argv);
};
