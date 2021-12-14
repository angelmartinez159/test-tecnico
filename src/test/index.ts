import supertest from 'supertest';
import { expect, assert } from 'chai';
import app from '../index';

const request = supertest(app);

describe('GET: /trm', () => {
    it('should return success and JSON response if query is good', async () => {
        let query = '?source=USD&target=GBP';

        let response: any = await request.get('/trm/' + query);

        expect(response.status).to.equal(200);
        assert.typeOf(response.body, 'object');
        assert.typeOf(response.body.data, 'object');
        expect(response.body.result).to.equal('success');
    });

    it('should return error object if query is wrong', async () => {
        let query = '?source=XXSX&target=SOME';

        let response: any = await request.get('/trm/' + query);

        expect(response.status).to.not.equal(200);
        assert.typeOf(response.body, 'object');
        expect(response.body).to.haveOwnProperty('message');
        expect(response.body).to.haveOwnProperty('status');
        expect(response.body).to.haveOwnProperty('code');
    });

    it('should return error object if query is not provided', async () => {
        let response: any = await request.get('/trm/');

        expect(response.status).to.not.equal(200);
        assert.typeOf(response.body, 'object');
        expect(response.body).to.haveOwnProperty('message');
        expect(response.body).to.haveOwnProperty('status');
        expect(response.body).to.haveOwnProperty('code');
    });

    it('should return object inserted if everything is good', async () => {
        let query = '?source=USD&target=UYU';

        let response: any = await request.get('/trm/' + query);

        expect(response.status).to.equal(200);
        assert.typeOf(response.body, 'object');
        assert.typeOf(response.body.data, 'object');
        expect(response.body.result).to.equal('success');
        expect(response.body.data).to.haveOwnProperty('rate');
        expect(response.body.data).to.haveOwnProperty('target');
        expect(response.body.data).to.haveOwnProperty('source');
        expect(response.body.data).to.haveOwnProperty('time');
        expect(response.body.data).to.haveOwnProperty('_id');
    });
});

describe('GET: /trm/list', () => {
    it('should return success and JSON response if query is good', async () => {
        let query = '?from=0&limit=10';

        let response: any = await request.get('/trm/list' + query);

        expect(response.status).to.equal(200);
        assert.typeOf(response.body, 'object');
        assert.typeOf(response.body.data, 'array');
        expect(response.body.result).to.equal('success');
    });

    it('should return a good paginated data object', async () => {
        let query = '?from=0&limit=1';

        let response: any = await request.get('/trm/list' + query);

        expect(response.status).to.equal(200);
        assert.typeOf(response.body, 'object');
        assert.typeOf(response.body.data, 'array');
        expect(response.body.result).to.equal('success');
        expect(response.body.data).to.lengthOf(1);
    });

    it('should return error object if pagination query is wrong', async () => {
        let query = '?from=asd&limit=asd';

        let response: any = await request.get('/trm/list' + query);

        expect(response.status).to.not.equal(200);
        assert.typeOf(response.body, 'object');
        expect(response.body).to.haveOwnProperty('message');
        expect(response.body).to.haveOwnProperty('status');
        expect(response.body).to.haveOwnProperty('code');
    });

    it('should return error object if pagination query was no provided', async () => {
        let response: any = await request.get('/trm/list');

        expect(response.status).to.not.equal(200);
        assert.typeOf(response.body, 'object');
        expect(response.body).to.haveOwnProperty('message');
        expect(response.body).to.haveOwnProperty('status');
        expect(response.body).to.haveOwnProperty('code');
    });

    it('should return only expected currencies if was provided into query', async () => {
        let query = '?from=0&limit=10&source=USD&target=UYU';
        let response: any = await request.get('/trm/list' + query);

        expect(response.status).to.equal(200);
        assert.typeOf(response.body, 'object');
        assert.typeOf(response.body.data, 'array');
        expect(response.body.result).to.equal('success');
        assert.isAtMost(
            response.body.data.length,
            10,
            'data length is less than or equal to limit query'
        );
        expect(
            response.body.data.every(
                (trm: any) => trm.source === 'USD' && trm.target === 'UYU'
            )
        ).to.be.true;
    });
});
