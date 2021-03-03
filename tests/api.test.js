const request = require('supertest');

const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(':memory:');

const app = require('../src/app')(db);
const buildSchemas = require('../src/schemas');

describe('API tests', () => {
  before((done) => {
    db.serialize((err) => {
      if (err) {
        return done(err);
      }

      buildSchemas(db);

      return done();
    });
  });

  const validRide = {
    start_lat: 80,
    start_long: 170,
    end_lat: 80,
    end_long: 120,
    rider_name: 'bambang',
    driver_name: 'paijo',
    driver_vehicle: 'kijang',
  };

  describe('GET /health', () => {
    it('should return health', (done) => {
      request(app)
        .get('/health')
        .expect('Content-Type', /text/)
        .expect(200, done);
    });
  });

  describe('POST /rides', () => {
    it('should post new rides', (done) => {
      request(app)
        .post('/rides')
        .send(validRide)
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });

  describe('POST /rides', () => {
    it('should fail to post rides invalid start_lat', (done) => {
      request(app)
        .post('/rides')
        .send({
          ...validRide,
          start_lat: 10000,
        })
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });

  describe('POST /rides', () => {
    it('should fail to post rides invalid end_lat', (done) => {
      request(app)
        .post('/rides')
        .send({
          ...validRide,
          end_lat: 10000,
        })
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });

  describe('POST /rides', () => {
    it('should fail to post rides invalid driver_vehicle', (done) => {
      request(app)
        .post('/rides')
        .send({
          ...validRide,
          driver_vehicle: 10000,
        })
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });

  describe('POST /rides', () => {
    it('should fail to post rides invalid rider_name', (done) => {
      request(app)
        .post('/rides')
        .send({
          ...validRide,
          rider_name: 10000,
        })
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });

  describe('POST /rides', () => {
    it('should fail to post rides invalid driver_name', (done) => {
      request(app)
        .post('/rides')
        .send({
          ...validRide,
          driver_name: 10000,
        })
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });

  describe('GET /rides', () => {
    it('should return get list of rides', (done) => {
      request(app)
        .get('/rides')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });

  describe('GET /rides/:id', () => {
    it('should return single rides with specified id', (done) => {
      request(app)
        .get(`/rides/${1}`)
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });

  describe('GET /rides/:id', () => {
    it('should fail to get reder invalid id', (done) => {
      request(app)
        .get('/rides/random')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });
});
