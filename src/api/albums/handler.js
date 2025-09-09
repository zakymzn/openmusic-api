const autoBind = require("auto-bind");
const config = require('../../utils/config');

class AlbumsHandler {
  constructor(albumsService, songsService, storageService, albumsValidator, imagesValidator) {
    this._albumsService = albumsService;
    this._songsService = songsService;
    this._storageService = storageService;
    this._albumsValidator = albumsValidator;
    this._imagesValidator = imagesValidator;

    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this._albumsValidator.validateAlbumPayload(request.payload);

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
    this._albumsValidator.validateAlbumPayload(request.payload);

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

  async postAlbumsCoverHandler(request, h) {
    const { id } = request.params;
    const { cover } = request.payload;

    this._imagesValidator.validateImageHeaders(cover.hapi.headers);

    const filename = await this._storageService.writeFile(cover, cover.hapi);
    const coverUrl = `http://${config.app.host}:${config.app.port}/albums/covers/${filename}`

    await this._albumsService.addAlbumCover(id, coverUrl);

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    });

    response.code(201);

    return response;
  }
}

module.exports = AlbumsHandler;
