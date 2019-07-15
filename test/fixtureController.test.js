const request = require('supertest');

const app = require('../app');
const Team = require('../src/v1/models/team');
const Fixture = require('../src/v1/models/fixture');
const User = require('../src/v1/models/User');

const teamRoute = '/api/v1/teams';
const fixtureRoute = '/api/v1/fixtures';
const team = {name: 'chelsea'};
const dynamicTeamA = {name: Date.now()+'chelsea'};
const dynamicTeamB = {name: Date.now()+'man city'};
const staticUser = {name: 'john', email: "john@example.com", password: "password"};
const adminUser = {name: 'john', email: "john2@example.com", password: "password", is_admin: true};
const registerRoute = '/api/v1/auth/register';
const registerAdminRoute = '/api/v1/auth/admin/register';
const matchDate = '2022-12-12 12:45:30';

let userToken, adminToken, teamA, teamB;
jest.setTimeout(10000);

describe("Test the fixture controller", () => {
    let fixture;
    beforeAll( async (done) => {
        try {
            //initialize db with a user, admin and two teams for the test
            const userResponse = await request(app).post(registerRoute).send(staticUser).set('Content-Type', 'application/json');            
            userToken = userResponse.body.token;
            const adminRepsponse = await request(app).post(registerAdminRoute).send(adminUser).set('Content-Type', 'application/json')
            adminToken = adminRepsponse.body.token;
            const teamAResponse = await  request(app).post(teamRoute).send(dynamicTeamA).set('Authorization', 'Bearer ' + adminToken).set('Content-Type', 'application/json')
            teamA = teamAResponse.body.team;
            const teamBResponse = await  request(app).post(teamRoute).send(dynamicTeamB).set('Authorization', 'Bearer ' + adminToken).set('Content-Type', 'application/json')
            teamB = teamBResponse.body.team;
            await Fixture.deleteMany({});
            done();    
        } catch (error) {
            done(error);
        }
    });

    afterAll(() => {
        User.deleteMany({}, () => {});
        Team.deleteMany({}, () => {});
        return Fixture.deleteMany({}, () => {});
    });

    describe('Fixture controller POST', () => {       
        test("it should save fixture with 201 if admin specifies all fields to create a fixture", (done) => {
            request(app)
                .post(fixtureRoute)
                .send({homeTeamId: teamA['_id'], awayTeamId: teamB['_id'], matchDate: matchDate })
                .set('Authorization', 'Bearer ' + adminToken)
                .set('Content-Type', 'application/json')
                .then(response => {
                    fixture = response.body.fixture['_id'];
                    expect(response.statusCode).toBe(201);
                    done();
                })
                .catch(err => done(err))
            })
    })

    
    describe("Uses a sample fixture for testing", () => {    
        describe('/GET fixture', () => {
            test("it should return 401 if user is not authenticated", (done) => {
                request(app)
                    .get(fixtureRoute)
                    .set('Accept', 'application/json')
                    .set('Content-Type', 'application/json')
                    .then(response => {
                        expect(response.statusCode).toBe(401);
                        done();
                    })
                    .catch(err => done(err))
            })

            test("it should get all the fixtures with 200 if normal user is authenticated", (done) => {
                request(app)
                    .get(fixtureRoute)
                    .set('Authorization', 'Bearer ' + userToken)
                    .set('Content-Type', 'application/json')
                    .then(response => {
                        expect(response.statusCode).toBe(200);
                        done();
                    })
                    .catch(err => done(err))
            })

            test("it should get all the fixtures with 200 if admin user is authenticated", (done) => {
                request(app)
                    .get(fixtureRoute)
                    .set('Authorization', 'Bearer ' + adminToken)
                    .set('Content-Type', 'application/json')
                    .then(response => {
                        expect(response.statusCode).toBe(200);
                        done();
                    })
                    .catch(err => done(err))
            })
        })

        describe('/GET /completed fixture', () => {                    
            test("it should return 401 if user is not authenticated", (done) => {
                request(app)
                    .get(fixtureRoute + '/completed')
                    .set('Accept', 'application/json')
                    .set('Content-Type', 'application/json')
                    .then(response => {
                        expect(response.statusCode).toBe(401);
                        done();
                    })
                    .catch(err => done(err))
            })

            test("it should get all the completed fixtures with 200 if normal user is authenticated", (done) => {
                request(app)
                    .get(fixtureRoute + '/completed')
                    .set('Authorization', 'Bearer ' + userToken)
                    .set('Content-Type', 'application/json')
                    .then(response => {
                        expect(response.statusCode).toBe(200);
                        done();
                    })
                    .catch(err => done(err))
            })

            test("it should get all the completed fixtures with 200 if admin user is authenticated", (done) => {
                request(app)
                    .get(fixtureRoute + '/completed')
                    .set('Authorization', 'Bearer ' + adminToken)
                    .set('Content-Type', 'application/json')
                    .then(response => {
                        expect(response.statusCode).toBe(200);
                        done();
                    })
                    .catch(err => done(err))
            })
        })
        
        describe('/GET /pending fixture', () => {            

            test("it should return 401 if user is not authenticated", (done) => {
                request(app)
                    .get(fixtureRoute + '/pending')
                    .set('Accept', 'application/json')
                    .set('Content-Type', 'application/json')
                    .then(response => {
                        expect(response.statusCode).toBe(401);
                        done();
                    })
                    .catch(err => done(err))
            })

            test("it should get all the pending fixtures with 200 if normal user is authenticated", (done) => {
                request(app)
                    .get(fixtureRoute + '/pending')
                    .set('Authorization', 'Bearer ' + userToken)
                    .set('Content-Type', 'application/json')
                    .then(response => {
                        expect(response.statusCode).toBe(200);
                        done();
                    })
                    .catch(err => done(err))
            })

            test("it should get all the pending fixtures with 200 if admin user is authenticated", (done) => {
                request(app)
                    .get(fixtureRoute + '/pending')
                    .set('Authorization', 'Bearer ' + adminToken)
                    .set('Content-Type', 'application/json')
                    .then(response => {
                        expect(response.statusCode).toBe(200);
                        done();
                    })
                    .catch(err => done(err))
            })
        })
        
        describe('/GET /:id fixture', () => {           
            test("it should return 401 if user is not authenticated", (done) => {
                request(app)
                    .get(fixtureRoute + '/' + fixture)
                    .set('Accept', 'application/json')
                    .set('Content-Type', 'application/json')
                    .then(response => {
                        expect(response.statusCode).toBe(401);
                        done();
                    })
                    .catch(err => done(err))
            })

            test("it should get that fixture with 200 if normal user is authenticated", (done) => {
                request(app)
                    .get(fixtureRoute + '/' + fixture)
                    .set('Authorization', 'Bearer ' + userToken)
                    .set('Content-Type', 'application/json')
                    .then(response => {
                        expect(response.statusCode).toBe(200);
                        done();
                    })
                    .catch(err => done(err))
            })

            test("it should return 500 if the fixture is invalid", (done) => {
                request(app)
                    .get(fixtureRoute + '/123')
                    .set('Authorization', 'Bearer ' + userToken)
                    .set('Content-Type', 'application/json')
                    .then(response => {
                        expect(response.statusCode).toBe(500);
                        done();
                    })
                    .catch(err => done(err))
            })

            test("it should get that fixture with 200 if admin user is authenticated", (done) => {
                request(app)
                    .get(fixtureRoute + '/' + fixture)
                    .set('Authorization', 'Bearer ' + adminToken)
                    .set('Content-Type', 'application/json')
                    .then(response => {
                        expect(response.statusCode).toBe(200);
                        done();
                    })
                    .catch(err => done(err))
            })
        })
        
        
        describe('/POST fixture', () => {        
            test("it should return 401 if user is not admin", (done) => {
                request(app)
                    .post(fixtureRoute)
                    .send({homeTeamId: teamA['_id'], awayTeamId: teamB['_id'], matchDate: matchDate })
                    .set('Authorization', 'Bearer ' + userToken)
                    .set('Content-Type', 'application/json')
                    .then(response => {
                        expect(response.statusCode).toBe(401);
                        done();
                    })
                    .catch(err => done(err))
            })
            
            test("it should return 422 if homeTeamId is not specified", (done) => {
                request(app)
                    .post(fixtureRoute)
                    .send({awayTeamId: teamB['_id'], matchDate: matchDate })
                    .set('Authorization', 'Bearer ' + adminToken)
                    .set('Content-Type', 'application/json')
                    .then(response => {
                        expect(response.statusCode).toBe(422);
                        done();
                    })
                    .catch(err => done(err))
            })

            test("it should return 422 if awayTeamId is not specified", (done) => {
                request(app)
                    .post(fixtureRoute)
                    .send({homeTeamId: teamA['_id'], matchDate: matchDate })
                    .set('Authorization', 'Bearer ' + adminToken)
                    .set('Content-Type', 'application/json')
                    .then(response => {
                        expect(response.statusCode).toBe(422);
                        done();
                    })
                    .catch(err => done(err))
            })

            test("it should return 422 if matchDate is not specified", (done) => {
                request(app)
                    .post(fixtureRoute)
                    .send({homeTeamId: teamA['_id'], awayTeamId: teamB['_id']})
                    .set('Authorization', 'Bearer ' + adminToken)
                    .set('Content-Type', 'application/json')
                    .then(response => {
                        expect(response.statusCode).toBe(422);
                        done();
                    })
                    .catch(err => done(err))
            })

            test("it should return 422 if home and away team are the same", (done) => {
                request(app)
                    .post(fixtureRoute)
                    .send({homeTeamId: teamA['_id'], awayTeamId: teamA['_id'], matchDate: matchDate })
                    .set('Authorization', 'Bearer ' + adminToken)
                    .set('Content-Type', 'application/json')
                    .then(response => {
                        expect(response.statusCode).toBe(422);
                        done();
                    })
                    .catch(err => done(err))
            })

            test("it should return 422 if home and away team are invalid ids", (done) => {
                request(app)
                    .post(fixtureRoute)
                    .send({homeTeamId: 123, awayTeamId: 456, matchDate: matchDate })
                    .set('Authorization', 'Bearer ' + adminToken)
                    .set('Content-Type', 'application/json')
                    .then(response => {
                        expect(response.statusCode).toBe(422);
                        done();
                    })
                    .catch(err => done(err))
            })        

            test("it should return 400 if fixture already exist for those teams", (done) => {
                request(app)
                    .post(fixtureRoute)
                    .send({homeTeamId: teamA['_id'], awayTeamId: teamB['_id'], matchDate: matchDate })
                    .set('Authorization', 'Bearer ' + adminToken)
                    .set('Content-Type', 'application/json')
                    .then(response => {
                        expect(response.statusCode).toBe(400);
                        done();
                    })
                    .catch(err => done(err))
            })        
        })
        
        describe("/PUT fixtures", () => {           
            test('it should return 401 if user is not admin', (done) => {
                request(app)
                    .put(fixtureRoute + '/' + fixture)
                    .send({awayTeamScore: 2, homeTeamScore: 4})
                    .set('Authorization', 'Bearer ' + userToken)
                    .set('Content-Type', 'application/json')
                    .then(response => {
                        expect(response.statusCode).toBe(401);
                        done();
                    })
                    .catch(err => done(err))
            })

            
            test('it should return 422 if score is negative', (done) => {
                request(app)
                    .put(fixtureRoute + '/' + fixture)
                    .send({homeTeamScore: -2, awayTeamScore: -1 })
                    .set('Authorization', 'Bearer ' + adminToken)
                    .set('Content-Type', 'application/json')
                    .then(response => {
                        expect(response.statusCode).toBe(422);
                        done();
                    })
                    .catch(err => done(err))
            })

            
            test('it should return 422 if we try to reschedule and end match at the same time', (done) => {
                request(app)
                    .put(fixtureRoute + '/' + fixture)
                    .send({homeTeamScore: 2, awayTeamScore: 1, matchDate })
                    .set('Authorization', 'Bearer ' + adminToken)
                    .set('Content-Type', 'application/json')
                    .then(response => {
                        expect(response.statusCode).toBe(422);
                        done();
                    })
                    .catch(err => done(err))
            })

            test('it should return 422 if match date is not in the future', (done) => {
                request(app)
                    .put(fixtureRoute + '/' + fixture)
                    .send({matchDate: '1970-12-22' })
                    .set('Authorization', 'Bearer ' + adminToken)
                    .set('Content-Type', 'application/json')
                    .then(response => {
                        expect(response.statusCode).toBe(422);
                        done();
                    })
                    .catch(err => done(err))
            })

            test('it should return 500 if fixture is invalid', (done) => {
                request(app)
                    .put(fixtureRoute + '/' + 12456)
                    .send({matchDate})
                    .set('Authorization', 'Bearer ' + adminToken)
                    .set('Content-Type', 'application/json')
                    .then(response => {
                        expect(response.statusCode).toBe(500);
                        done();
                    })
                    .catch(err => done(err))
            })

            test('it should return 200 if match date is rescheduled', (done) => {
                request(app)
                    .put(fixtureRoute + '/' + fixture)
                    .send({matchDate})
                    .set('Authorization', 'Bearer ' + adminToken)
                    .set('Content-Type', 'application/json')
                    .then(response => {
                        expect(response.statusCode).toBe(200);
                        done();
                    })
                    .catch(err => done(err))
            })

            test('it should return 200 if scores are set', (done) => {
                request(app)
                    .put(fixtureRoute + '/' + fixture)
                    .send({homeTeamScore: 0, awayTeamScore: 5})
                    .set('Authorization', 'Bearer ' + adminToken)
                    .set('Content-Type', 'application/json')
                    .then(response => {
                        expect(response.statusCode).toBe(200);
                        done();
                    })
                    .catch(err => done(err))
            })

            test('it should return 400 if we try to update a completed fixture', (done) => {
                request(app)
                    .put(fixtureRoute + '/' + fixture)
                    .send({homeTeamScore: 0, awayTeamScore: 5})
                    .set('Authorization', 'Bearer ' + adminToken)
                    .set('Content-Type', 'application/json')
                    .then(response => {
                        expect(response.statusCode).toBe(400);
                        done();
                    })
                    .catch(err => done(err))
            })        
        }) 

        describe('/DELETE fixture', () => {        
            test('it should return 401 if user is not admin', (done) => {
                request(app)
                    .delete(fixtureRoute + '/' + fixture)                
                    .set('Authorization', 'Bearer ' + userToken)
                    .set('Content-Type', 'application/json')
                    .then(response => {
                        expect(response.statusCode).toBe(401);
                        done();
                    })
                    .catch(err => done(err))
            })

            test('it should return 500 if the fixture is invalid and does not exist', (done) => {
                request(app)
                    .delete(fixtureRoute+ '/123')
                    .set('Authorization', 'Bearer ' + adminToken)
                    .set('Content-Type', 'application/json')
                    .then(response => {
                        expect(response.statusCode).toBe(500);
                        done();
                    })
                    .catch(err => done(err))
            })

            test('it should return 200 if the fixture was deleted successfully by an admin', (done) => {                      
                request(app)
                    .delete(fixtureRoute + '/' + fixture)
                    .set('Authorization', 'Bearer ' + adminToken)
                    .set('Content-Type', 'application/json')
                    .then(response => {
                        expect(response.statusCode).toBe(200);                   
                        done();
                    })
                    .catch(err => done(err))
            })
        })
    })    
})
