const Joi = require('joi');

const playlistSongsPayloadSchema = Joi.object({
  songsId: Joi.string().required(),
});

module.exports = { playlistSongsPayloadSchema };
