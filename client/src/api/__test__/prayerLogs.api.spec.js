import {
  getDayLogs,
  getLogs,
  getPrayerTotals,
  postOfflinePrayers,
  setLogs,
  updateLogs,
  updateLogsAllDay,
} from "../prayerLogs.api";
import nock from "nock";

const prayersList = [
  {
    fajr: 1,
    dhuhr: 0,
    asr: 0,
    maghrib: 0,
    isha: 0,
    total: 1,
    _id: "650e76ade86b2a021378ce30",
    user: "60a526f01f3b3d00041f9467",
    day: "2023-09-23T00:00:00.000Z",
    createdAt: "2023-09-23T05:25:01.465Z",
    updatedAt: "2023-09-23T05:25:01.465Z",
    __v: 0,
  },
];
describe("prayerLogs api", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  describe("getLogs", () => {
    it("should make a call to GET /api/prayers", async () => {
      nock("http://localhost:5000", {
        reqheaders: {
          "Content-Type": "application/json",
        },
      })
        .get("/api/prayers")
        .reply(200, prayersList);

      const response = await getLogs();
      expect(response).toEqual(prayersList);
    });
  });

  describe("getDayLogs", () => {
    const dayQuery = "2023-09-23T00:00:00.000Z";
    const dayResponse = prayersList.filter((i) => i.day === dayQuery);

    it("should make a call to GET /api/prayers/day", async () => {
      nock("http://localhost:5000", {
        reqheaders: {
          "Content-Type": "application/json",
        },
      })
        .get(`/api/prayers/day?day=${dayQuery}`)
        .reply(200, dayResponse);
      const response = await getDayLogs(dayQuery);
      expect(response).toEqual(dayResponse);
    });

    it("should save the response to localStorage", async () => {
      nock("http://localhost:5000", {
        reqheaders: {
          "Content-Type": "application/json",
        },
      })
        .get(`/api/prayers/day?day=${dayQuery}`)
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
        .get(`/api/prayers/day?day=${dayQuery}`)
        .reply(200);

      const spyLocalStorageGet = jest.spyOn(localStorage, "getItem");
      await getDayLogs(dayQuery);
      expect(spyLocalStorageGet).toHaveBeenCalledWith("today");
      expect(spyLocalStorageGet).toHaveBeenCalledTimes(1);
    });
  });

  describe("getPrayerTotals", () => {
    const totals = [
      {
        _id: "60a526f01f3b3d00041f9467",
        fajr: 1185,
        dhuhr: 1184,
        asr: 1184,
        maghrib: 1184,
        isha: 1184,
        total: 5921,
      },
    ];

    it("should make a call to GET /api/prayers/totals", async () => {
      nock("http://localhost:5000", {
        reqheaders: {
          "Content-Type": "application/json",
        },
      })
        .get("/api/prayers/totals")
        .reply(200, totals);
      const response = await getPrayerTotals();
      expect(response).toEqual(totals);
    });

    it("should save the response to localStorage", async () => {
      nock("http://localhost:5000", {
        reqheaders: {
          "Content-Type": "application/json",
        },
      })
        .get("/api/prayers/totals")
        .reply(200, totals);

      const spyLocalStorageSet = jest.spyOn(localStorage, "setItem");
      const response = await getPrayerTotals(totals);
      expect(response).toEqual(totals);
      expect(spyLocalStorageSet).toHaveBeenCalled();
      expect(spyLocalStorageSet).toHaveBeenCalledTimes(1);
    });

    it("should get the response from localStorage if the request fails", async () => {
      nock("http://localhost:5000", {
        reqheaders: {
          "Content-Type": "application/json",
        },
      })
        .get("/api/prayers/totals")
        .reply(200);

      const spyLocalStorageSet = jest.spyOn(localStorage, "getItem");
      await getPrayerTotals(totals);
      expect(spyLocalStorageSet).toHaveBeenCalledWith("totals");
      expect(spyLocalStorageSet).toHaveBeenCalledTimes(1);
    });
  });

  describe("updateLogs", () => {
    it("should make a call to POST /api/prayers", async () => {
      nock("http://localhost:5000", {
        reqheaders: {
          "Content-Type": "application/json",
        },
      })
        .post("/api/prayers/", {
          day: "2023-09-23T00:00:00.000Z",
          prayer: "fajr",
          count: 2,
        })
        .reply(200, prayersList[0]);
      const response = await updateLogs("2023-09-23T00:00:00.000Z", "fajr", 2);
      expect(response).toEqual(prayersList[0]);
    });
  });

  describe("updateLogsAllDay", () => {
    it("should make a call to POST /api/prayers/all", async () => {
      nock("http://localhost:5000", {
        reqheaders: {
          "Content-Type": "application/json",
        },
      })
        .post("/api/prayers/all", { day: "2023-09-23T00:00:00.000Z", count: 2 })
        .reply(200, prayersList[0]);
      const response = await updateLogsAllDay("2023-09-23T00:00:00.000Z", 2);
      expect(response).toEqual(prayersList[0]);
    });
  });

  describe("setLogs", () => {
    it("should make a call to POST /api/prayers/set", async () => {
      nock("http://localhost:5000", {
        reqheaders: {
          "Content-Type": "application/json",
        },
      })
        .post("/api/prayers/set", {
          day: "2023-09-23T00:00:00.000Z",
          prayers: { fajr: 1, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 },
        })
        .reply(200, prayersList[0]);
      const response = await setLogs("2023-09-23T00:00:00.000Z", {
        fajr: 1,
        dhuhr: 0,
        asr: 0,
        maghrib: 0,
        isha: 0,
      });
      expect(response).toEqual(prayersList[0]);
    });
  });

  describe("postOfflinePrayers", () => {
    it("should make a call to POST /api/prayers/set", async () => {
      nock("http://localhost:5000", {
        reqheaders: {
          "Content-Type": "application/json",
        },
      })
        .put("/api/prayers/set", {
          day: "2023-09-23T00:00:00.000Z",
          prayers: { fajr: 1, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 },
        })
        .reply(200, prayersList[0]);

      const response = await postOfflinePrayers("2023-09-23T00:00:00.000Z", {
        fajr: 1,
        dhuhr: 0,
        asr: 0,
        maghrib: 0,
        isha: 0,
      });
      expect(response).toEqual(prayersList[0]);
    });
  });
});
