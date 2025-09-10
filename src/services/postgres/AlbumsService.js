const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { mapDBToAlbumModel } = require('../../utils');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };
    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Failed to add album');
    }

    return result.rows[0].id;
  }

  async getAlbums() {
    const result = await this._pool.query('SELECT id, name, year FROM albums');

    return result.rows.map(mapDBToAlbumModel);
  }

  async getAlbumById(id) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album not found');
    }

    return result.rows.map(mapDBToAlbumModel)[0];
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Failed to update album. Id not found');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Failed to delete album. Id not found');
    }
  }

  async addAlbumCover(id, coverUrl) {
    const query = {
      text: 'UPDATE albums SET cover = $1 WHERE id = $2 RETURNING id',
      values: [coverUrl, id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Failed to add cover album');
    }
  }

  async addAlbumLikes(userId, albumId) {
    const userQuery = {
      text: 'SELECT id FROM users WHERE id = $1',
      values: [userId],
    };
    const userResult = await this._pool.query(userQuery);

    if (!userResult.rows.length) {
      throw new NotFoundError('User not found');
    }

    const albumQuery = {
      text: 'SELECT id FROM albums WHERE id = $1',
      values: [albumId],
    };
    const albumResult = await this._pool.query(albumQuery);

    if (!albumResult.rows.length) {
      throw new NotFoundError('Album not found');
    }

    const userAlbumLikesQuery = {
      text: 'SELECT * FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };
    const userAlbumLikesResult = await this._pool.query(userAlbumLikesQuery);

    if (userAlbumLikesResult.rows.length > 0) {
      throw new InvariantError('Album could not be liked more than once');
    }

    const id = `useralbumlikes-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
      values: [id, userId, albumId],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Album could not be liked');
    }

    await this._cacheService.delete(`albums:${albumId}`);

    return result.rows;
  }

  async deleteAlbumLikes(userId, albumId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
      values: [userId, albumId],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Album could not be unliked');
    }

    await this._cacheService.delete(`albums:${albumId}`);
  }

  async getAlbumLikes(albumId) {
    try {
      const result = await this._cacheService.get(`albums:${albumId}`);

      return {
        result: JSON.parse(result),
        fromCache: true,
      };
    } catch {
      const query = {
        text: `SELECT users.id, users.username
        FROM users
        JOIN user_album_likes ON users.id = user_album_likes.user_id
        WHERE user_album_likes.album_id = $1`,
        values: [albumId],
      };
      const result = await this._pool.query(query);

      await this._cacheService.set(`albums:${albumId}`, JSON.stringify(result.rows));

      return {
        result: result.rows,
        fromCache: false,
      };
    }
  }
}

module.exports = AlbumsService;
