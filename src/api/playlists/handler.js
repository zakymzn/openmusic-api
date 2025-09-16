const autoBind = require('auto-bind');

class PlaylistsHandler {
  constructor(service, playlistsValidator, playlistSongsValidator) {
    this._service = service;
    this._playlistsValidator = playlistsValidator;
    this._playlistSongsValidator = playlistSongsValidator;

    autoBind(this);
  }

  async postPlaylistHandler(request, h) {
    this._playlistsValidator.validatePlaylistPayload(request.payload);

    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    const playlistId = await this._service.addPlaylist({ name, owner: credentialId });
    const response = h.response({
      status: 'success',
      data: {
        playlistId,
      },
    });

    response.code(201);

    return response;
  }

  async getPlaylistsHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { result: playlists, fromCache } = await this._service.getPlaylists(credentialId);
    const response = h.response({
      status: 'success',
      data: {
        playlists,
      },
    });

    if (fromCache) {
      response.header('X-Data-Source', 'cache');
    }

    return response;
  }

  async deletePlaylistByIdHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistOwner(id, credentialId);
    await this._service.deletePlaylistById(id);

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
  }

  async postSongToPlaylistHandler(request, h) {
    this._playlistSongsValidator.validatePlaylistSongPayload(request.payload);
    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistAccess(playlistId, credentialId);
    await this._service.addSongToPlaylist(playlistId, songId);
    await this._service.addPlaylistActivities(playlistId, songId, credentialId, 'add');

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke playlist',
    });

    response.code(201);
    return response;
  }

  async getSongsFromPlaylistHandler(request, h) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistAccess(playlistId, credentialId);
    const playlist = await this._service.getPlaylistById(playlistId);
    const { result: songs, fromCache } = await this._service.getSongsFromPlaylist(playlistId);
    const response = h.response({
      status: 'success',
      data: {
        playlist: {
          id: playlistId,
          name: playlist.name,
          username: playlist.username,
          songs: [...songs],
        }
      },
    });

    if (fromCache) {
      response.header('X-Data-Source', 'cache');
    }

    return response;
  }

  async deleteSongFromPlaylistHandler(request) {
    this._playlistSongsValidator.validatePlaylistSongPayload(request.payload);
    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistAccess(playlistId, credentialId);
    await this._service.deleteSongFromPlaylist(playlistId, songId);
    await this._service.addPlaylistActivities(playlistId, songId, credentialId, 'delete');

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    };
  }

  async getPlaylistActivitiesHandler(request) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistAccess(playlistId, credentialId);
    const activities = await this._service.getPlaylistActivities(playlistId);

    return {
      status: 'success',
      data: {
        playlistId,
        activities,
      },
    };
  }
}

module.exports = PlaylistsHandler;