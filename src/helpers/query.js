async function dbAll(db, query) {
  return new Promise((resolve, reject) => {
    db.all(query, (err, rows) => {
      if (err) { return reject(err); }
      return resolve(rows);
    });
  });
}

async function dbGet(db, query) {
  return new Promise((resolve, reject) => {
    db.get(query, (err, rows) => {
      if (err) { return reject(err); }
      return resolve(rows);
    });
  });
}

async function dbPost(db, postData, query) {
  return new Promise((resolve, reject) => {
    db.run(query, postData, function getCreatedRide(err) {
      if (err) { return reject(err); }
      return resolve(this);
    });
  });
}

exports.getAll = dbAll;
exports.getSingle = dbGet;
exports.postSingle = dbPost;
