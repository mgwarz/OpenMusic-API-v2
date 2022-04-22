const PlaylistHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlist',
  version: '1.0.0',
  register: async (server, { service, validator, playlistsongvalidator }) => {
    const playlistHandler = new PlaylistHandler(service, validator, playlistsongvalidator);
    server.route(routes(playlistHandler));
  },
};
