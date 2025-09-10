const up = (pgm) => {
  pgm.createTable('songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    title: {
      type: 'TEXT',
      notNull: true,
    },
    year: {
      type: 'INTEGER',
      notNull: true,
    },
    genre: {
      type: 'TEXT',
      notNull: true,
    },
    performer: {
      type: 'TEXT',
      notNull: true,
    },
    duration: {
      type: 'INTEGER',
      notNull: false,
    },
    album_id: {
      type: 'VARCHAR(50)',
      notNull: false,
    },
  });

  pgm.addConstraint('songs', 'fk_songs.album_id_albums.id', 'FOREIGN KEY(album_id) REFERENCES albums(id) ON DELETE CASCADE')
};

const down = (pgm) => {
  pgm.dropTable('songs');
};

module.exports = { up, down };