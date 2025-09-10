const AlbumsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'albums',
  version: '1.0.0',
  register: async (server, { albumsService, songsService, storageService, albumsValidator, imagesValidator }) => {
    const albumsHandler = new AlbumsHandler(albumsService, songsService, storageService, albumsValidator, imagesValidator);

    server.route(routes(albumsHandler));
  },
};
