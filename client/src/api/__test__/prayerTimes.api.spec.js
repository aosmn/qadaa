import { getPrayerTimes, getCalculationMethods } from "../prayerTimes.api";
import nock from "nock";

const prayersTimes = {
  prayerTimes: {
    Fajr: "05:34",
    Sunrise: "07:30",
    Dhuhr: "13:35",
    Asr: "16:53",
    Sunset: "19:40",
    Maghrib: "19:40",
    Isha: "21:28",
    Imsak: "05:24",
    Midnight: "01:35",
    Firstthird: "23:36",
    Lastthird: "03:33",
  },
};
describe("prayerTimes api", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  describe("getPrayerTimes", () => {
    it("should make a call to GET /api/prayerTimes", async () => {
      nock("http://localhost:5000", {
        reqheaders: {
          "Content-Type": "application/json",
        },
      })
        .get(
          "/api/prayerTimes/?latitude=52.0678928&longitude=4.3316659&method=test"
        )
        .reply(200, prayersTimes);

      const response = await getPrayerTimes("52.0678928", "4.3316659", "test");
      expect(response).toEqual(prayersTimes);
    });

    it("should make a call to GET /api/prayerTimes with day", async () => {
      nock("http://localhost:5000", {
        reqheaders: {
          "Content-Type": "application/json",
        },
      })
        .get(
          "/api/prayerTimes/2023-09-23T00:00:00.000Z/?latitude=52.0678928&longitude=4.3316659&method=test"
        )
        .reply(200, prayersTimes);

      const response = await getPrayerTimes(
        "52.0678928",
        "4.3316659",
        "test",
        "2023-09-23T00:00:00.000Z"
      );
      expect(response).toEqual(prayersTimes);
    });
  });
  describe("getCalculationMethods", () => {
    it("should make a call to GET /api/prayerTimes/methods with day", async () => {
      nock("http://localhost:5000", {
        reqheaders: {
          "Content-Type": "application/json",
        },
      })
        .get("/api/prayerTimes/methods")
        .reply(200, ["test-calc-method"]);

      const response = await getCalculationMethods();
      expect(response).toEqual(["test-calc-method"]);
    });
  });
});
