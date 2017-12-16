
let chai        = require('chai');
let chaiHttp    = require('chai-http');
let server      = require('../server');
let should      = chai.should();

chai.use(chaiHttp);

describe('2 Factor Authentication Service', () => {
    // Test create secret key
    describe('GET /create-secret-key', () => {
        it('it should create a secret key', (done) => {
            chai.request(server)
            .get('/create-secret-key')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('success');
                res.body.should.have.property('secretKey');
                res.body.should.have.property('qrCodeData');
                done();
            });
        });
    });

    // Test the verify TOTP route
    describe('POST /verify-totp', () => {
        it('it should verify a TOTP', (done) => {
            chai.request(server)
            .post('/verify-totp')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({userId: 123456, totp: 224466})
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('success', false);
                res.body.should.have.property('message', 'Invalid TOTP');
                done();
            });
        });
    });
});
  