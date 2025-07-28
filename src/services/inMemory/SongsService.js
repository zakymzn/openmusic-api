const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

class SongsService {
  constructor() {
    this._songs = [];
  }

  addSong({ title, year, genre, performer, duration = null, albumId = null }) {
    const id = "song-" + nanoid(16);
    const newSong = {
      id,
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    };

    this._songs.push(newSong);

    const isSuccess = this._songs.filter((song) => song.id === id).length > 0;

    if (!isSuccess) {
      throw new InvariantError("Failed to add song");
    }

    return id;
  }

  getSongs() {
    return this._songs.map(({ id, title, performer }) => ({
      id,
      title,
      performer,
    }));
  }

  getSongById(id) {
    const song = this._songs.filter((s) => s.id === id)[0];

    if (!song) {
      throw new NotFoundError("Song not found");
    }

    return song;
  }

  editSongById(
    id,
    { title, year, genre, performer, duration = null, albumId = null },
  ) {
    const index = this._songs.findIndex((song) => song.id === id);

    if (index === -1) {
      throw new NotFoundError("Failed to update song. Id not found");
    }

    this._songs[index] = {
      ...this._songs[index],
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    };
  }

  deleteSongById(id) {
    const index = this._songs.findIndex((song) => song.id === id);

    if (index === -1) {
      throw new NotFoundError("Failed to delete song. Id not found");
    }

    this._songs.splice(index, 1);
  }
}

module.exports = SongsService;
