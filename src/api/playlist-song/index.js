const PlaylistSongsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlistSongs',
  version: '1.0.0',
  register: async (server, {
    songService,
    playlistService,
    playlistSongsService,
    validator,
  }) => {
    const playlistSongsHandler = new PlaylistSongsHandler(
      songService,
      playlistService,
      playlistSongsService,
      validator,
    );
    server.route(routes(playlistSongsHandler));
  },
};
