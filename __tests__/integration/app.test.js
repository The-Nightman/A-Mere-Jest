const request = require("supertest");
const createApp = require("../../app");
const app = createApp();

describe("get /health", () => {
  test("should return HTTP Status 200 with an Ok message, current uptime and date", done => {
    request(app)
      .get("/health")
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(typeof response.body.uptime).toBe("number");
        expect(response.body.uptime).toBeGreaterThan(0);
        expect(typeof response.body.message).toBe("string");
        expect(response.body.message).toEqual("Ok");
        expect(new Date(response.body.date)).toBeInstanceOf(Date);
        expect(Number.isNaN(new Date(response.body.date).getTime())).toBe(false);
        done();
      });
  });
});
