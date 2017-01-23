var expect = require('chai').expect;

var Sequelize = require('sequelize');

var db = require('../../../server/db');

var supertest = require('supertest');

describe('Database Route', function() {
    var app
    var loggedInAgent;
    beforeEach('Sync DB', function() {
        return db.sync({
            force: true
        });
    });

    beforeEach('Create app', function() {
        app = require('../../../server/app')(db);
    });

    loggedInAgent = supertest.agent(app);
    describe('systems', function() {

        var systemInfo = {
            system_name: `test system`
        };

        describe('/GET system', () => {
            it('it should GET all the systems', (done) => {
                loggedInAgent.get('/systems')
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('array');
                        res.body.length.should.be.eql(2);
                        done();
                    });
            });
        });

    });

})