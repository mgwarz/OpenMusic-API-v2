const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class playlistSongsService {
  constructor() {
    this._pool = new Pool();
  }

  //  add song to playlist
  async addSongsPlaylist({
    playlistId, songsId,
  }) {
    const id = `playlist_song-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlist_song VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songsId],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan pada playlist.');
    }
    return result.rows[0].id;
  }

  //  get playlist from user owner
  async getPlaylist(owner) {
    const query = {
      text: 'SELECT playlist.id, playlist.name, users.username FROM playlist LEFT JOIN users ON users.id = playlist.owner LEFT JOIN collaborations ON collaborations.playlist_id = playlist.id WHERE playlist.owner = $1 OR collaborations.user_id = $1',
      values: [owner],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  //  delete songs in playlist
  async deleteSongsPlaylist(playlistId, songsId) {
    const query = {
      text: 'DELETE FROM playlist_song WHERE playlist_id = $1, AND songs_id = $2 RETURNING id',
      values: [playlistId, songsId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Lagu gagal dihapus pada playlist.');
    }
    return result.rows[0].id;
  }
}

module.exports = playlistSongsService;
