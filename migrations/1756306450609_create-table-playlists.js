const shorthands = undefined;

const up = (pgm) => {
  pgm.createTable("playlists", {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    name: {
      type: 'TEXT',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"users"',
      onDelete: 'CASCADE',
    },
  });
};

const down = (pgm) => {
  pgm.dropTable('playlists');
};

module.exports = { shorthands, up, down };