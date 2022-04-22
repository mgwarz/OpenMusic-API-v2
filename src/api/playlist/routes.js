const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlists',
    handler: handler.postPlaylistHandler,
    options: {
      auth: 'musicapp_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists',
    handler: handler.getPlaylistHandler,
    options: {
      auth: 'musicapp_jwt',
    },
  },
  {
    method: 'DeLETE',
    path: '/playlists',
    handler: handler.deletePlaylistHandler,
    options: {
      auth: 'musicapp_jwt',
    },
  },
];

module.exports = routes;
