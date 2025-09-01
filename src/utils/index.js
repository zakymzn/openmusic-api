const mapDBToAlbumModel = ({ id, name, year }) => ({
  id,
  name,
  year,
});

const mapDBToSongModel = ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  album_id,
}) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId: album_id,
});

const mapDBToPlaylistModel = ({ id, name, username }) => ({
  id,
  name,
  username,
});

module.exports = { mapDBToAlbumModel, mapDBToSongModel, mapDBToPlaylistModel };
