const ClientError = require('../../exceptions/ClientError');

class playlistSongsHandler {
  constructor(service, playlistService, songsService, playlistSongActivitiesService, validator) {
    this._service = service;
    this._playlistService = playlistService;
    this._songsService = songsService;
    this._playlistSongActivitiesService = playlistSongActivitiesService;
    this._validator = validator;

    this.postSongByIdPlaylistHandler = this.postSongByIdPlaylistHandler.bind(this);
    this.getSongByIdPlaylistHandler = this.getSongByIdPlaylistHandler.bind(this);
    this.deleteSongByIdPlaylistHandler = this.deleteSongByIdPlaylistHandler.bind(this);
  }

  //  add song in playlist
  async postSongByIdPlaylistHandler(request, h) {
    try {
      this._validator.validatePlaylistSongsPayload(request.payload);
      const { songsId } = request.payload;
      const { id: credentialId } = request.auth.credential;
      const { id: playlistId } = request.params;
      await this._playlistService.verifyPlaylistAccess(playlistId, credentialId);
      await this._songsService.getSongById(songsId);
      const SongsId = await this._service.addSongsInPlaylist(playlistId, songsId);
      await this._playlistSongActivitiesService.addActivities(playlistId, songsId, credentialId, 'add');
      const response = h.response({
        status: 'success',
        message: 'Berhasil menambahkan lagu pada playlist',
        data: { SongsId },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      //  Server error
      const response = h.response({
        status: 'error',
        message: 'Maaf terjadi kegagalan di server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  //  get songs from playlist byid
  async getSongByIdPlaylistHandler(request, h) {
    try {
      const { id: credentialId } = request.auth.credentials;
      const { id: playlistId } = request.params;
      await this._playlistService.verifyPlaylistAccess(playlistId, credentialId);
      const playlist = await this._playlistService.getPlaylistById(playlistId);
      const songs = await this._songsService.getSongsByPlaylistId(playlistId);
      playlist.songs = songs;
      return {
        status: 'success',
        data: { playlist },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      //  Server error
      const response = h.response({
        status: 'error',
        message: 'Maaf terjadi kegagalan di server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  //  delete playlist based on id
  async deleteSongByIdPlaylistHandler(request, h) {
    try {
      this._validator.validatePlaylistSongsPayload(request.payload);
      const { songsId } = request.payload;
      const { id: playlistId } = request.params;
      const { id: credentialId } = request.auth.credentials;
      await this._playlistService.verifyPlaylistAccess(playlistId, credentialId);
      await this._service.deleteSongsInPlaylist(playlistId, songsId);
      await this._playlistSongActivitiesService.addActivities(playlistId, songsId, credentialId, 'delete');
      return {
        status: 'success',
        message: 'Lagu berhasil dihapus pada playlist',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      //  Server error
      const response = h.response({
        status: 'fail',
        message: 'Maaf terjadi kegagalan di server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = playlistSongsHandler;
