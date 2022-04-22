/* eslint-disable object-curly-newline */
/* eslint-disable camelcase */

const mapDBToModelSong = ({ id, title, year, genre, performer, duration, album_id }) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId: album_id,
});

module.exports = { mapDBToModelSong };
