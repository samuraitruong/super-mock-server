import 'jest';
import { ApiServer } from '../server';
import bootstrapApiServer from '../bootstrap';
import request from 'supertest';

let apiServer: ApiServer;

describe('Proxy Test', () => {
  beforeEach(() => {
    apiServer = bootstrapApiServer();
  });
  describe('typicode server tests', () => {
    it('get() /demo/comments should matches with snapshot data', async () => {
      const response = await request(apiServer.app)
        .get('/demo/comments')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);
      expect(response.body).toMatchSnapshot({});
    });

    it('get() /demo/posts should matches with snapshot data', async () => {
      const response = await request(apiServer.app)
        .get('/demo/comments')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);
      expect(response.body).toMatchSnapshot({});
    });

    it('post() /demo/posts should matches with snapshot data', async () => {
      const response = await request(apiServer.app)
        .post('/demo/comments')
        .set('Accept', 'application/json')
        .send({ id: 1, body: 'some comment', postId: 1 })
        .expect('Content-Type', /json/)
        .expect(200);
      expect(response.body).toMatchSnapshot({});
    });
  });

  describe('reqres.in tests', () => {
    it.each`
      url                    | status
      ${'/api/users'}        | ${200}
      ${'/api/users?page=2'} | ${200}
      ${'/api/users/2'}      | ${200}
    `(
      'get() $url should matches with snapshot data with resposne code $status',
      async ({ url, status }) => {
        const response = await request(apiServer.app)
          .get(url)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(status);
        expect(response.body).toMatchSnapshot({});
      }
    );

    it.each`
      url             | status | data
      ${'/api/users'} | ${200} | ${{ name: 'morpheus', job: 'leader' }}
    `(
      'post() $url should matches with snapshot data with resposne code $status, data= $data',
      async ({ url, status }) => {
        const response = await request(apiServer.app)
          .post(url)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(status);
        expect(response.body).toMatchSnapshot({
          createdAt: expect.any(String),
          id: expect.any(String),
        });
      }
    );
  });

  describe.skip('restapisample/ tests', () => {
    it.each`
      url                                    | status
      ${'/restapiexample/api/v1/employees'}  | ${200}
      ${'/restapiexample/api/v1/employee/1'} | ${200}
    `(
      'get($url) should successful and match with snapshot data',
      async ({ url, status }) => {
        const response = await request(apiServer.app)
          .get(url)
          // .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(status);
        expect(response.body).toMatchSnapshot();
      }
    );
  });
});
