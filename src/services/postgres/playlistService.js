const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class playlistService {
  constructor() {
    this._pool = new Pool();
  }

  // add playlist
  async addPlaylist({
    name, owner,
  }) {
    const id = `playlist-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlist VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  // get playlist from owner
  async getPlaylist(owner) {
    const query = {
      text: `SELECT playlist.id, playlist.name, users.username
                 FROM playlist LEFT JOIN users ON users.id = playlist.owner
                 LEFT JOIN collaborations ON collaborations.playlist_id = playlist.id
                 WHERE playlist.owner = $1 OR collaborations.user_id = $1`,
      values: [owner],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  // get playlist by id
  async getPlaylistById(id) {
    const query = {
      text: `SELECT playlist.id, playlist.name, users.username FROM playlist
                LEFT JOIN users ON users.id = playlist.owner
                WHERE playlist.id = $1`,
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan. Id salah');
    }
    return result.rows[0];
  }

  // delete playlist by id
  async deleteplaylistById(id) {
    const query = {
      text: 'DELETE FROM playlist WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Playlist gagal dihapus. Id salah');
    }
  }

  // verify playlist owner
  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM playlist WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    const playlist = result.rows[0];
    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses source ini');
    }
  }

  // verify playlist access
  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
    }
  }
}
module.exports = playlistService;
