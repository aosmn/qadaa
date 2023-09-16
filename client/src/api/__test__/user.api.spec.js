import { login, register } from "../user.api";
import nock from "nock";

describe("user api", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  describe("register", () => {
    it("should make a call to POST /api/users", async () => {
      nock("http://localhost:5000", {
        reqheaders: {
          "Content-Type": "application/json",
        },
      })
        .post("/api/users", {
          name: "Alaa",
          email: "alaa@test.com",
          password: "password",
        })
        .reply(201, {
          _id: "some-id",
          name: "Alaa",
          email: "alaa@test.com",
          token: "some-token",
          preferences: {},
        });

      await register({
        name: "Alaa",
        email: "alaa@test.com",
        password: "password",
      });
    });

    it("should save the response to localstorage", async () => {
      nock("http://localhost:5000", {
        reqheaders: {
          "Content-Type": "application/json",
        },
      })
        .post("/api/users", {
          name: "Alaa",
          email: "alaa@test.com",
          password: "password",
        })
        .reply(201, {
          _id: "some-id",
          name: "Alaa",
          email: "alaa@test.com",
          token: "some-token",
          preferences: {},
        });
      const spyLocalStorageSet = jest.spyOn(localStorage, "setItem");

      await register({
        name: "Alaa",
        email: "alaa@test.com",
        password: "password",
      });

      expect(spyLocalStorageSet).toHaveBeenCalled();
      expect(spyLocalStorageSet).toHaveBeenCalledTimes(1);
    });

    it("should return user from localstorage if response doesn't return data", async () => {
      nock("http://localhost:5000", {
        reqheaders: {
          "Content-Type": "application/json",
        },
      })
        .post("/api/users", {
          name: "Alaa",
          email: "alaa@test.com",
          password: "password",
        })
        .reply(200);
      const spyLocalStorageGet = jest.spyOn(localStorage, "getItem");

      await register({
        name: "Alaa",
        email: "alaa@test.com",
        password: "password",
      });

      expect(spyLocalStorageGet).toHaveBeenCalledWith("user");
      expect(spyLocalStorageGet).toHaveBeenCalledTimes(1);
    });
  });

  describe("login", () => {
    it("should make a call to POST /api/users/login", async () => {
      nock("http://localhost:5000", {
        reqheaders: {
          "Content-Type": "application/json",
        },
      })
        .post("/api/users/login", {
          email: "alaa@test.com",
          password: "password",
        })
        .reply(200, {
          _id: "some-id",
          name: "Alaa",
          email: "alaa@test.com",
          token: "some-token",
          preferences: {},
        });

      await login({
        email: "alaa@test.com",
        password: "password",
      });
    });

    it("should save the response to localstorage", async () => {
      nock("http://localhost:5000", {
        reqheaders: {
          "Content-Type": "application/json",
        },
      })
        .post("/api/users/login", {
          email: "alaa@test.com",
          password: "password",
        })
        .reply(201, {
          _id: "some-id",
          name: "Alaa",
          email: "alaa@test.com",
          token: "some-token",
          preferences: {},
        });
      const spyLocalStorageSet = jest.spyOn(localStorage, "setItem");

      await login({
        email: "alaa@test.com",
        password: "password",
      });

      expect(spyLocalStorageSet).toHaveBeenCalledWith(
        "user",
        JSON.stringify({
          _id: "some-id",
          name: "Alaa",
          email: "alaa@test.com",
          token: "some-token",
          preferences: {},
        })
      );
      expect(spyLocalStorageSet).toHaveBeenCalledTimes(1);
    });

    it("should return user from localstorage if response doesn't return data", async () => {
      nock("http://localhost:5000", {
        reqheaders: {
          "Content-Type": "application/json",
        },
      })
        .post("/api/users/login", {
          email: "alaa@test.com",
          password: "password",
        })
        .reply(200);
      const spyLocalStorageGet = jest.spyOn(localStorage, "getItem");

      await login({
        email: "alaa@test.com",
        password: "password",
      });

      expect(spyLocalStorageGet).toHaveBeenCalledWith("user");
      expect(spyLocalStorageGet).toHaveBeenCalledTimes(1);
    });
  });
});
