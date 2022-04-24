/* eslint-disable no-dupe-keys */
require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

// songs
const song = require('./api/song');
const SongService = require('./services/postgres/SongService');
const SongsValidator = require('./validator/songs');

// albums
const album = require('./api/album');
const AlbumsValidator = require('./validator/albums');
const AlbumService = require('./services/postgres/AlbumService');

// users
const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');

// authentications
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticatiosService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');

// playlist
const playlist = require('./api/playlist');
const playlistValidator = require('./validator/playlist');
const PlaylistService = require('./services/postgres/playlistService');

// playlist song
const playlistSongs = require('./api/playlist-song');
const playlistSongsValidator = require('./validator/playlist-song');
const PlaylistSongsService = require('./services/postgres/playlistSongsService');

// collaborations
const collaborations = require('./api/collaborations');
const CollaborationsService = require('./services/postgres/collaborationsService');
const CollaborationsValidator = require('./validator/collaborations');

const init = async () => {
  const albumService = new AlbumService();
  const songService = new SongService(albumService);
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const collaborationsService = new CollaborationsService();
  const playlistService = new PlaylistService();
  const playlistSongsService = new PlaylistSongsService(CollaborationsService);

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
    debug: {
      request: ['error'],
    },
  });

  // plugin eksternal
  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  server.auth.strategy('musicapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  // plugin internal
  await server.register([
    {
      plugin: song,
      options: {
        service: songService,
        validator: SongsValidator,
      },
    },
    {
      plugin: album,
      options: {
        service: albumService,
        validator: AlbumsValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: playlist,
      options: {
        service: playlistService,
        validator: playlistValidator,
      },
    },
    {
      plugin: playlistSongs,
      options: {
        songService,
        playlistService,
        playlistSongsService,
        validator: playlistSongsValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        service: {
          collaborationsService,
          playlistService,
          usersService,
        },
        validator: CollaborationsValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};
init();
