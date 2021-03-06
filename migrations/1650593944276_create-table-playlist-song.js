/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('playlist_song', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    songs_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });
  pgm.addConstraint('playlist_song', 'unique_playlist_id_and_songs_id', 'UNIQUE(playlist_id, songs_id)');
  pgm.addConstraint('playlist_song', 'fk_playlist_song.playlist_id_playlist.id', 'FOREIGN KEY(playlist_id) REFERENCES playlist(id) ON DELETE CASCADE');
  pgm.addConstraint('playlist_song', 'fk_playlist_song.songs_id_songs.id', 'FOREIGN KEY(songs_id) REFERENCES songs(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropTable('playlist_song');
};
