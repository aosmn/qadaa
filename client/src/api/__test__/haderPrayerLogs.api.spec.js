import {
  getDayLogs,
  getLogs,
  postOfflinePrayers,
  updateLogs,
} from "../haderPrayerLogs.api";
import nock from "nock";

const dayPrayers = [
  {
    fajr: true,
    dhuhr: false,
    asr: false,
    maghrib: false,
    isha: false,
    _id: "650ea392e86b2a021378ced9",
    user: "60a526f01f3b3d00041f9467",
    day: "2023-09-23T08:36:32.080Z",
    createdAt: "2023-09-23T08:36:34.460Z",
    updatedAt: "2023-09-23T08:36:34.460Z",
    __v: 0,
  },
];
describe("prayerLogs api", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  describe("getLogs", () => {
    it("should make a call to GET /api/dayPrayers", async () => {
      nock("http://localhost:5000", {
        reqheaders: {
          "Content-Type": "application/json",
        },
      })
        .get("/api/dayPrayers")
        .reply(200, dayPrayers);

      const response = await getLogs();
      expect(response).toEqual(dayPrayers);
    });
  });

  describe("getDayLogs", () => {

    const dayQuery = "2023-09-23T00:00:00.000Z";
    const dayResponse = dayPrayers.filter((i) => i.day === dayQuery);

    it("should make a call to GET /api/dayPrayers/day", async () => {
      nock("http://localhost:5000", {
        reqheaders: {
          "Content-Type": "application/json",
        },
      })
        .get("/api/dayPrayers/day?day=2023-09-23T08:36:32.080Z")
        .reply(200, dayResponse);

      const response = await getDayLogs("2023-09-23T08:36:32.080Z");
      expect(response).toEqual(dayResponse);
    });

    it("should save the response to localStorage", async () => {
      nock("http://localhost:5000", {
        reqheaders: {
          "Content-Type": "application/json",
        },
      })
        .get(`/api/dayPrayers/day?day=${dayQuery}`)
        .reply(200, dayResponse);
      const spyLocalStorageSet = jest.spyOn(localStorage, "setItem");
      const response = await getDayLogs(dayQuery);
      expect(response).toEqual(dayResponse);
      expect(spyLocalStorageSet).toHaveBeenCalled();
      expect(spyLocalStorageSet).toHaveBeenCalledTimes(1);
    });

    it("should get the prayers from localStorage if the request fails", async () => {
      nock("http://localhost:5000", {
        reqheaders: {
          "Content-Type": "application/json",
        },
      })
        .get(`/api/dayPrayers/day?day=${dayQuery}`)
        .reply(200);

      const spyLocalStorageGet = jest.spyOn(localStorage, "getItem");
      await getDayLogs(dayQuery);
      expect(spyLocalStorageGet).toHaveBeenCalledWith("today-hader");
      expect(spyLocalStorageGet).toHaveBeenCalledTimes(1);
    });
  });

  describe("updateLogs", () => {
    it("should make a call to POST /api/prayers", async () => {
      nock("http://localhost:5000", {
        reqheaders: {
          "Content-Type": "application/json",
        },
      })
        .post("/api/dayPrayers/", {
          day: "2023-09-23T00:00:00.000Z",
          prayer: "fajr",
          done: true,
        })
        .reply(200, dayPrayers[0]);
      const response = await updateLogs("2023-09-23T00:00:00.000Z", "fajr", true);
      expect(response).toEqual(dayPrayers[0]);
    });
  });

  describe("postOfflinePrayers", () => {
    it("should make a call to POST /api/dayPrayers/set", async () => {
      nock("http://localhost:5000", {
        reqheaders: {
          "Content-Type": "application/json",
        },
      })
        .put("/api/dayPrayers/set", {
          day: "2023-09-23T00:00:00.000Z",
          prayers: { fajr: true, dhuhr: false, asr: false, maghrib: false, isha: false },
        })
        .reply(200, dayPrayers[0]);

      const response = await postOfflinePrayers("2023-09-23T00:00:00.000Z", {
        fajr: true,
        dhuhr: false,
        asr: false,
        maghrib: false,
        isha: false,
      });
      expect(response).toEqual(dayPrayers[0]);
    });
  });
});
