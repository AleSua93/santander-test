
import request from 'supertest';
import * as http from 'http';
import App from "../../app";
import MeetupsController from "../../controllers/meetups-controller";

let app: App;
let server: http.Server;
const port = 5001;

beforeAll(() => {
  app = new App([
    new MeetupsController()
  ], port);

  server = app.listen();
})

describe('Post Endpoints', () => {
  it('should create a new post', async () => {

    const res = await request(server)
      .get('/api/meetups')
      // .send({
      //   userId: 1,
      //   title: 'test is cool',
      // })

    console.log(res);

    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('post')
  })
})