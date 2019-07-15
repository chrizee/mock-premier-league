const request = require('supertest');
const app = require('../../app');
const searchRoute = '/api/v1/search';
const searchTeamWithCorrectName = '?entity=teams&name=chel';
const searchTeamWithWrongName = '?entity=teams&nae=chel';
const searchFixtureWithCorrectDate = '?entity=fixture&matchDate=2022-12-12 12:45:30';
jest.setTimeout(10000);

describe('Test the search controller', () => {    

    describe('/GET search', () => {
        test('it should return 200 when entity is team and name is correctly set', (done) => {
            request(app)
                .get(searchRoute + searchTeamWithCorrectName)
                .set('Content-Type', 'application/json')
                .then(response => {
                    expect(response.statusCode).toBe(200);
                    done();
                })
                .catch(err => done(err))
        });
        
        test('it should return 200 with an empty array when entity is team and name is wrongly set', (done) => {
            request(app)
                .get(searchRoute + searchTeamWithWrongName)
                .set('Content-Type', 'application/json')
                .then(response => {
                    expect(response.statusCode).toBe(200);
                    done();
                })
                .catch(err => done(err))
        });

        test('it should return 200 when fixture is searched with a correct field', (done) => {
            request(app)
                .get(searchRoute + searchFixtureWithCorrectDate)
                .set('Content-Type', 'application/json')
                .then(response => {
                    expect(response.statusCode).toBe(200);
                    done();
                })
                .catch(err => done(err))
        });
        
    })
    
});