const up = (pgm) => {
  pgm.addColumn('albums', {
    cover: {
      type: 'TEXT',
    },
  });
};

const down = (pgm) => {
  pgm.dropColumn('albums', 'cover');
};

module.exports = { up, down };
