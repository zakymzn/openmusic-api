const autoBind = require("auto-bind");

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postSongHandler(request, h) {
    this._validator.validateSongPayload(request.payload);

    const {
      title,
      year,
      genre,
      performer,
      duration = null,
      albumId = null,
    } = request.payload;

    const songId = await this._service.addSong({
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    });

    const response = h.response({
      status: "success",
      message: "Song successfully added",
      data: {
        songId,
      },
    });

    response.code(201);

    return response;
  }

  async getSongsHandler() {
    const songs = await this._service.getSongs();

    return {
      status: "success",
      data: {
        songs,
      },
    };
  }

  async getSongByIdHandler(request, h) {
    const { id } = request.params;
    const song = await this._service.getSongById(id);

    return {
      status: "success",
      data: {
        song,
      },
    };
  }

  async putSongByIdHandler(request, h) {
    this._validator.validateSongPayload(request.payload);

    const { id } = request.params;

    await this._service.editSongById(id, request.payload);

    return {
      status: "success",
      message: "Song successfully updated",
    };
  }

  async deleteSongByIdHandler(request, h) {
    const { id } = request.params;

    await this._service.deleteSongById(id);

    return {
      status: "success",
      message: "Song successfully deleted",
    };
  }
}

module.exports = SongsHandler;
