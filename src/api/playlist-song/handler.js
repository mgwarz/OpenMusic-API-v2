const ClientError = require('../../exceptions/ClientError');

class playlistSongsHandler {
  constructor({ playlistSongsService, playlistService, SongService }, validator) {
    this._service = playlistSongsService;
    this._PlaylistService = playlistService;
    this._songsService = SongService;
    this._validator = validator;

    this.postSongByIdPlaylistHandler = this.postSongByIdPlaylistHandler.bind(this);
    this.getSongByIdPlaylistHandler = this.getSongByIdPlaylistHandler.bind(this);
    this.deleteSongByIdPlaylistHandler = this.deleteSongByIdPlaylistHandler.bind(this);
  }

  //  add song in playlist
  async postSongByIdPlaylistHandler(request, h) {
    try {
      this._validator.validatePlaylistSongsPayload(request.payload);
      const { songId } = request.payload;
      const { id: credentialId } = request.auth.credentials;
      const { id: playlistId } = request.params;

      await this._PlaylistService.verifyPlaylistAccess(playlistId, credentialId);
      await this._songsservice.getSongById(songId);

      const SongId = await this._service.addSongsPlaylist(playlistId, songId);

      const response = h.response({
        status: 'success',
        message: 'Berhasil menambahkan lagu pada playlist',
        data: SongId,
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
        console.error(error);
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

      await this._PlaylistService.verifyPlaylistAccess(credentialId, playlistId);
      const playlist = await this._PlaylistService.getPlaylistById(playlistId);
      const songs = await this._songsService.getSongByIdPlaylist(playlistId);

      playlist.songs = songs;
      return {
        status: 'success',
        data: {
          playlist,
        },
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

      const { songId } = request.payload;
      const { id: playlistId } = request.params;
      const { id: credentialId } = request.auth.credentials;

      await this._PlaylistService.verifyPlaylistAccess(playlistId, credentialId);
      await this._service.deleteSongByIdPlaylist(playlistId, songId);

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
