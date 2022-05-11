/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumn('playlist', {
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,

    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('playlist');
};
