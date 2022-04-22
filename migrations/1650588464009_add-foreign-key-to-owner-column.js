/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  // membuat user baru.
  pgm.sql("INSERT INTO users(id, username, password, fullname) VALUES ('old_playlist', 'old_playlist', 'old_playlist', 'playlist')");

  // mengubah nilai owner pada note yang owner-nya bernilai NULL
  pgm.sql("UPDATE playlist SET owner = 'old_playlist' WHERE owner = NULL");

  // give constraint foreign key to owner  column id from users table
  pgm.addConstraint('playlist', 'fk_playlist.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  // delete constraint fk_playlist.owner_users.id to notes become a table
  pgm.dropConstraint('playlist', 'fk_playlist.owner_users.id');

  // change owner value old_playlist to playlist  NULL
  pgm.sql("UPDATE playlist SET owner = NULL WHERE owner = 'old_playlist'");

  // delete new user
  pgm.sql("DELETE FROM users WHERE id = 'old_playlist'");
};
