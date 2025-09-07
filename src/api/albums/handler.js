const autoBind = require("auto-bind");

class AlbumsHandler {
  constructor(albumsService, songsService, validator) {
    this._albumsService = albumsService;
    this._songsService = songsService;
    this._validator = validator;

    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);

    const albumId = await this._albumsService.addAlbum(request.payload);
    const response = h.response({
      status: "success",
      data: {
        albumId,
      },
    });

    response.code(201);

    return response;
  }

  async getAlbumsHandler() {
    const albums = await this._albumsService.getAlbums();

    return {
      status: "success",
      data: {
        albums,
      },
    };
  }

  async getAlbumByIdHandler(request) {
    const { id } = request.params;
    const album = await this._albumsService.getAlbumById(id);
    const songs = await this._songsService.getSongsByAlbumId(id);
    album.songs = songs;

    return {
      status: "success",
      data: {
        album,
      },
    };
  }

  async putAlbumByIdHandler(request) {
    this._validator.validateAlbumPayload(request.payload);

    const { id } = request.params;

    await this._albumsService.editAlbumById(id, request.payload);

    return {
      status: "success",
      message: "Album successfully updated",
    };
  }

  async deleteAlbumByIdHandler(request) {
    const { id } = request.params;

    await this._albumsService.deleteAlbumById(id);

    return {
      status: "success",
      message: "Album successfully deleted",
    };
  }
}

module.exports = AlbumsHandler;
