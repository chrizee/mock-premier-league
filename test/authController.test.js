const request = require('supertest');
const app = require('../app');
const User = require('../src/v1/models/User');

const dynamicUser = {name: 'john', email: Date.now() + "john@example.com", password: "password"};
const staticUser = {name: 'john', email: "john@example.com", password: "password"};
const registerRoute = '/api/v1/auth/register';
const loginRoute = '/api/v1/auth/login';

jest.setTimeout(10000);

describe('Test the auth controller', () => {
    beforeAll(() => {
        return User.deleteMany({}, () => {});
    });

    afterAll(() => {
        return User.deleteMany({}, () => {});
    });

    describe('/POST register', () => {
        test('it should return 422 if nothing is specified', (done) => {
            request(app)
                .post(registerRoute)
                .send({})
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .then(response => {
                    expect(response.statusCode).toBe(422);
                    done();
                })
                .catch(err => done(err))
        });

        test('it should return 422 if name is not specified', (done) => {
            request(app)
                .post(registerRoute)
                .send({email: Date.now() + "john@example.com", password: "password"})
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .then(response => {
                    expect(response.statusCode).toBe(422);
                    done();
                })
                .catch(err => done(err))
        });
        test('it should return 422 if email is not specified', (done) => {
            request(app)
                .post(registerRoute)
                .send({name: "john doe", password: "password"})
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .then(response => {
                    expect(response.statusCode).toBe(422);
                    done();
                })
                .catch(err => done(err))
        });
        test('it should return 422 if password is not specified', (done) => {
            request(app)
                .post(registerRoute)
                .send({name: "john doe", email: Date.now() + "john@example.com"})
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .then(response => {
                    expect(response.statusCode).toBe(422);
                    done();
                })
                .catch(err => done(err))
        });
        test('it should return 200 if everything is specified', (done) => {
            request(app)
                .post(registerRoute)
                .send(staticUser)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .then(response => {
                    expect(response.statusCode).toBe(201);
                    expect(response.body).toHaveProperty("user");
                    expect(response.body).toHaveProperty("token");
                    done();
                })
                .catch(err => done(err))
        });
        test('it should return 400 if user already exist', (done) => {
            request(app)
                .post(registerRoute)
                .send(staticUser)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .then(response => {
                    expect(response.statusCode).toBe(400);
                    done();
                })
                .catch(err => done(err))
        });
    })

    describe('/POST login', () => {       
        test('is should login a registered user with correct credentials and return 200', (done) => {
            request(app)
                .post(loginRoute)
                .send(staticUser)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .then(response => {
                    expect(response.statusCode).toBe(200);
                    expect(response.body).toHaveProperty("user");
                    expect(response.body).toHaveProperty("token");
                    done();
                })
                .catch(err => done(err))
        });

        test('is should return 422 if email is not specified', (done) => {
            request(app)
                .post(loginRoute)
                .send({password: staticUser.password})
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .then(response => {
                    expect(response.statusCode).toBe(422);
                    done();
                })
                .catch(err => done(err))
        });

        test('is should return 422 if password is not specified', (done) => {
            request(app)
                .post(loginRoute)
                .send({email: staticUser.email})
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .then(response => {
                    expect(response.statusCode).toBe(422);
                    done();
                })
                .catch(err => done(err))
        });

        test('is should return 400 if user does not exist', (done) => {
            request(app)
                .post(loginRoute)
                .send(dynamicUser)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .then(response => {
                    expect(response.statusCode).toBe(400);
                    done();
                })
                .catch(err => done(err))
        });

        test('is should return 400 if password does not match', (done) => {
            request(app)
                .post(loginRoute)
                .send({email: staticUser.email, password: "non"})
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .then(response => {
                    expect(response.statusCode).toBe(400);
                    done();
                })
                .catch(err => done(err))
        });
        
    })
    
});