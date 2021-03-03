const { getAll, getSingle, postSingle } = require('../helpers/query');
const winston = require('../../config/winston');

class GenericHandler {
  constructor(tableName, postAttributes) {
    this.tableName = tableName;
    this.postAttributes = postAttributes;
  }

  postResource(db) {
    return async (req, res) => {
      try {
        const newData = await postSingle(db, req.postData, `INSERT INTO ${this.tableName}(${this.postAttributes.join(',')}) VALUES (?, ?, ?, ?, ?, ?, ?)`);
        const row = await getSingle(db, `SELECT * FROM ${this.tableName} WHERE rideID='${newData.lastID}'`);
        return res.send(row);
      } catch (err) {
        winston.error(err);
        return res.status(500).send({
          error_code: 'SERVER_ERROR',
          message: 'Unknown error',
        });
      }
    };
  }

  getSingleResource(db) {
    return async (req, res) => {
      try {
        const row = await getSingle(db, `SELECT * FROM ${this.tableName} WHERE rideID='${req.params.id}'`);
        if (!row) {
          return res.status(404).send({
            error_code: `${this.tableName.toUpperCase()}_NOT_FOUND_ERROR`,
            message: `Could not find any ${this.tableName}`,
          });
        }
        return res.send(row);
      } catch (err) {
        winston.error(err);
        return res.status(500).send({
          error_code: 'SERVER_ERROR',
          message: 'Unknown error',
        });
      }
    };
  }

  getResourceList(db) {
    return async (req, res) => {
      try {
        let { pageIndex, itemsPerPage } = req.query;
        itemsPerPage = parseInt(itemsPerPage, 10) || 1;
        pageIndex = parseInt(pageIndex, 10) || 1;
        const pageIndexNumber = pageIndex > 0 ? pageIndex : 1;
        const skip = (pageIndexNumber - 1) * itemsPerPage;
        const limit = `${skip},${itemsPerPage}`;

        const row = await getSingle(db, `SELECT count(*) as numRows FROM ${this.tableName}`);
        const { numRows } = row;
        const numPages = Math.ceil(numRows / itemsPerPage);

        const items = await getAll(db, `SELECT * FROM ${this.tableName} LIMIT ${limit}`);
        const responsePayload = {
          items,
        };
        responsePayload.pagination = {
          pageIndex: pageIndexNumber,
          previous: pageIndexNumber > 1 ? pageIndexNumber - 1 : '#',
          next: pageIndexNumber < numPages ? pageIndexNumber + 1 : '#',
          itemsPerPage,
          totalItems: numRows,
          currentItemCount: items.length,
          totalPages: Math.ceil(numRows / itemsPerPage),
        };
        return res.json(responsePayload);
      } catch (err) {
        winston.error(err);
        return res.status(500).send({
          error_code: 'SERVER_ERROR',
          message: 'Unknown error',
        });
      }
    };
  }
}

module.exports = GenericHandler;
