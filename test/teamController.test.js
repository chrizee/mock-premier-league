const request = require('supertest');

const app = require('../app');
const Team = require('../src/v1/models/team');
const User = require('../src/v1/models/User');

const teamRoute = '/api/v1/teams';
const team = {name: 'chelsea'};
const dynamicTeam = {name: Date.now()+'chelsea'};
const staticUser = {name: 'john', email: "john@example.com", password: "password"};
const adminUser = {name: 'john', email: "john2@example.com", password: "password", is_admin: true};
const registerRoute = '/api/v1/auth/register';
const registerAdminRoute = '/api/v1/auth/admin/register';

let userToken, adminToken, teamId;

jest.setTimeout(10000);

describe("Test the team controller", () => {
    beforeAll( async (done) => {
        try {
            const userReesponse = await request(app).post(registerRoute).send(staticUser).set('Content-Type', 'application/json');
            userToken = userReesponse.body.token;            
            const adminResponse = await request(app).post(registerAdminRoute).send(adminUser).set('Content-Type', 'application/json');
            adminToken = adminResponse.body.token;
            await Team.deleteMany({}, () => {});
            done();
        } catch (error) {
            done(error);
        }       
    });

    afterAll(() => {
        User.deleteMany({}, () => {});
        return Team.deleteMany({}, () => {});
    });
    
    describe('/GET team', () => {
        test("it should return 401 if user is not authenticated", (done) => {
            request(app)
                .get(teamRoute)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .then(response => {
                    expect(response.statusCode).toBe(401);
                    done();
                })
                .catch(err => done(err))
        })

        test("it should get all the teams with 200 if normal user is authenticated", (done) => {
            request(app)
                .get(teamRoute)
                .set('Authorization', 'Bearer ' + userToken)
                .set('Content-Type', 'application/json')
                .then(response => {
                    expect(response.statusCode).toBe(200);
                    done();
                })
                .catch(err => done(err))
        })

        test("it should get all the teams with 200 if admin user is authenticated", (done) => {
            request(app)
                .get(teamRoute)
                .set('Authorization', 'Bearer ' + adminToken)
                .set('Content-Type', 'application/json')
                .then(response => {
                    expect(response.statusCode).toBe(200);
                    done();
                })
                .catch(err => done(err))
        })
    })

    describe('/POST team', () => {
        test("it should return 401 if user is not admin", (done) => {
            request(app)
                .post(teamRoute)
                .send(team)
                .set('Authorization', 'Bearer ' + userToken)
                .set('Content-Type', 'application/json')
                .then(response => {
                    expect(response.statusCode).toBe(401);
                    done();
                })
                .catch(err => done(err))
        })

        test("it should save team with 201 if name is specified", (done) => {
            request(app)
                .post(teamRoute)
                .send(team)
                .set('Authorization', 'Bearer ' + adminToken)
                .set('Content-Type', 'application/json')
                .then(response => {
                    teamId = response.body.team['_id'];
                    expect(response.statusCode).toBe(201);
                    done();
                })
                .catch(err => done(err))
        })

        test("it should return 422 if name is not specified", (done) => {
            request(app)
                .post(teamRoute)
                .send({})
                .set('Authorization', 'Bearer ' + adminToken)
                .set('Content-Type', 'application/json')
                .then(response => {
                    expect(response.statusCode).toBe(422);
                    done();
                })
                .catch(err => done(err))
        })       
    })

    describe("/PUT teams", () => {
        
        test('it should return 422 if name is not provided', (done) => {
            request(app)
                .put(teamRoute+ '/123')
                .send({})
                .set('Authorization', 'Bearer ' + adminToken)
                .set('Content-Type', 'application/json')
                .then(response => {
                    expect(response.statusCode).toBe(422);
                    done();
                })
                .catch(err => done(err))
        })

        test('it should return 401 if user is not admin', (done) => {
            request(app)
                .put(teamRoute+ '/123')
                .send({})
                .set('Authorization', 'Bearer ' + userToken)
                .set('Content-Type', 'application/json')
                .then(response => {
                    expect(response.statusCode).toBe(401);
                    done();
                })
                .catch(err => done(err))
        })

        test('it should return 500 if the team is invalid and does not exist', (done) => {            
            request(app)
                .put(teamRoute+ '/123')
                .send(dynamicTeam)
                .set('Authorization', 'Bearer ' + adminToken)
                .set('Content-Type', 'application/json')
                .then(response => {
                    expect(response.statusCode).toBe(500);
                    done();
                })
                .catch(err => done(err))                        
        })

        test('it should return 400 if a team with that name already exist', (done) => {                                  
            request(app)
                .put(teamRoute + '/' + teamId)
                .send(team)
                .set('Authorization', 'Bearer ' + adminToken)
                .set('Content-Type', 'application/json')
                .then((response) => {
                    expect(response.statusCode).toBe(400);
                    done();
                })
                .catch(err => done(err))
        })
    }) 
    
    describe('/DELETE team', () => {       
        test('it should return 401 if user is not admin', (done) => {
            request(app)
                .delete(teamRoute+ '/123')                
                .set('Authorization', 'Bearer ' + userToken)
                .set('Content-Type', 'application/json')
                .then(response => {
                    expect(response.statusCode).toBe(401);
                    done();
                })
                .catch(err => done(err))
        })

        test('it should return 500 if the team is invalid and does not exist', (done) => {
            request(app)
                .delete(teamRoute+ '/123')
                .set('Authorization', 'Bearer ' + adminToken)
                .set('Content-Type', 'application/json')
                .then(response => {
                    expect(response.statusCode).toBe(500);
                    done();
                })
                .catch(err => done(err))
        })

        test('it should return 200 if the team was deleted successfully by an admin', (done) => {                                  
            request(app)
                .delete(teamRoute + '/' + teamId)
                .set('Authorization', 'Bearer ' + adminToken)
                .set('Content-Type', 'application/json')
                .then((response) => {
                    expect(response.statusCode).toBe(200);
                    done();
                })
                .catch(err => done(err))
        })
    })
})