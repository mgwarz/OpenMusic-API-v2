/* eslint-disable object-curly-newline */
/* eslint-disable camelcase */

const mapDBToModelSong = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  inserted_at,
  updated_at,
  name,
  album_id,
  song_id,
  username,
  owner,
  playlist_id,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  insertedAt: inserted_at,
  updatedAt: updated_at,
  name,
  albumId: album_id,
  songId: song_id,
  username,
  owner,
  playlistId: playlist_id,
});

module.exports = { mapDBToModelSong };
