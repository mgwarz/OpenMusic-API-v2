const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class playlistSongService {
  constructor() {
    this._pool = new Pool();
  }

  //  add song to playlist
  async addSongsPlaylist({
    playlistId, songId,
  }) {
    const id = `playlist_song-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlist_song VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan pada playlist.');
    }
    return result.rows[0].id;
  }

  //  delete songs in playlist
  async deleteSongByIdPlaylist(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlist_song WHERE playlist_id = $1, AND songs_id = $2 RETURNING id',
      values: [playlistId, songId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Lagu gagal dihapus pada playlist.');
    }
    return result.rows[0].id;
  }
}

module.exports = playlistSongService;
