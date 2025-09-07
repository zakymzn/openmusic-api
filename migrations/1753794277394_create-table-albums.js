const up = (pgm) => {
  pgm.createTable("albums", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    name: {
      type: "TEXT",
      notNull: true,
    },
    year: {
      type: "INTEGER",
      notNull: true,
    },
  });
};

const down = (pgm) => {
  pgm.dropTable("albums");
};

module.exports = { up, down };
