import {
  getMe,
  login,
  register,
  resetPassword,
  sendPasswordRecoverEmail,
  updatePrefs,
  updateUser,
} from "../user.api";
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
  describe("getMe", () => {
    const responseFromServer = {
      _id: "some-id",
      name: "Alaa",
      email: "alaa@test.com",
      token: "some-token",
      preferences: {},
    };
    it("should make a call to /me to get user profile", async () => {
      nock("http://localhost:5000", {
        reqheaders: {
          "Content-Type": "application/json",
        },
      })
        .get("/api/users/me")
        .reply(200, responseFromServer);

      const result = await getMe();
      expect(result).toEqual(responseFromServer);
    });

    it("should save the response in localStorage", async () => {
      const spyLocalStorageSet = jest.spyOn(localStorage, "setItem");

      nock("http://localhost:5000", {
        reqheaders: {
          "Content-Type": "application/json",
        },
      })
        .get("/api/users/me")
        .reply(200, responseFromServer);

      const result = await getMe();
      expect(result).toEqual(responseFromServer);

      expect(spyLocalStorageSet).toHaveBeenCalledWith(
        "user",
        JSON.stringify(responseFromServer)
      );
      expect(spyLocalStorageSet).toHaveBeenCalledTimes(1);
    });

    it("should get user from localStorage if the request fails", async () => {
      const spyLocalStorageGet = jest.spyOn(localStorage, "getItem");

      nock("http://localhost:5000", {
        reqheaders: {
          "Content-Type": "application/json",
        },
      })
        .get("/api/users/me")
        .reply(200);

      await getMe();

      expect(spyLocalStorageGet).toHaveBeenCalledWith("user");
      expect(spyLocalStorageGet).toHaveBeenCalledTimes(1);
    });
  });

  describe("updateUser", () => {
    it("should make a call to PUT /api/users", async () => {
      const userUpdate = {
        email: "alaa@test.com",
        preferences: {
          start: new Date().toISOString(),
        },
      };
      nock("http://localhost:5000", {
        reqheaders: {
          "Content-Type": "application/json",
        },
      })
        .put("/api/users", userUpdate)
        .reply(200, {
          _id: "some-id",
          name: "Alaa",
          email: "alaa@test.com",
          token: "some-token",
          preferences: { start: new Date() },
        });

      await updateUser(userUpdate);
    });

    it("should save the response to localstorage", async () => {
      const userUpdate = {
        email: "alaa@test.com",
        preferences: {
          start: new Date().toISOString(),
        },
      };
      const response = {
        _id: "some-id",
        name: "Alaa",
        email: "alaa@test.com",
        token: "some-token",
        preferences: { start: new Date() },
      };

      nock("http://localhost:5000", {
        reqheaders: {
          "Content-Type": "application/json",
        },
      })
        .put("/api/users", userUpdate)
        .reply(200, response);

      const spyLocalStorageSet = jest.spyOn(localStorage, "setItem");

      await updateUser(userUpdate);

      expect(spyLocalStorageSet).toHaveBeenCalledWith(
        "user",
        JSON.stringify(response)
      );
      expect(spyLocalStorageSet).toHaveBeenCalledTimes(1);
    });

    it("should return user from localstorage if response doesn't return data", async () => {
      const userUpdate = {
        email: "alaa@test.com",
        preferences: {
          start: new Date().toISOString(),
        },
      };

      nock("http://localhost:5000", {
        reqheaders: {
          "Content-Type": "application/json",
        },
      })
        .put("/api/users", userUpdate)
        .reply(200);

      const spyLocalStorageGet = jest.spyOn(localStorage, "getItem");

      await updateUser(userUpdate);

      expect(spyLocalStorageGet).toHaveBeenCalledWith("user");
      expect(spyLocalStorageGet).toHaveBeenCalledTimes(1);
    });
  });

  describe("updatePrefs", () => {
    it("should make a call to PUT /api/users/prefs", async () => {
      const userUpdate = {
        start: new Date().toISOString(),
      };
      nock("http://localhost:5000", {
        reqheaders: {
          "Content-Type": "application/json",
          Authorization: `Bearer some-token`,
        },
      })
        .put("/api/users/prefs", userUpdate)
        .reply(200, {
          preferences: { start: new Date() },
        });

      await updatePrefs({ token: "some-token", preferences: userUpdate });
    });

    it("should save the response to localstorage", async () => {
      const userUpdate = {
        start: new Date().toISOString(),
      };
      const response = {
        preferences: { start: new Date() },
      };
      nock("http://localhost:5000", {
        reqheaders: {
          "Content-Type": "application/json",
          Authorization: `Bearer some-token`,
        },
      })
        .put("/api/users/prefs", userUpdate)
        .reply(200, response);

      const spyLocalStorageSet = jest.spyOn(localStorage, "setItem");

      await updatePrefs({ token: "some-token", preferences: userUpdate });

      expect(spyLocalStorageSet).toHaveBeenCalledWith(
        "user",
        JSON.stringify(response)
      );
      expect(spyLocalStorageSet).toHaveBeenCalledTimes(1);
    });

    it("should return user from localstorage if response doesn't return data", async () => {
      const userUpdate = {
        start: new Date().toISOString(),
      };

      nock("http://localhost:5000", {
        reqheaders: {
          "Content-Type": "application/json",
          Authorization: `Bearer some-token`,
        },
      })
        .put("/api/users/prefs", userUpdate)
        .reply(200);

      const spyLocalStorageGet = jest.spyOn(localStorage, "getItem");
      await updatePrefs({ token: "some-token", preferences: userUpdate });

      expect(spyLocalStorageGet).toHaveBeenCalledWith("user");
      expect(spyLocalStorageGet).toHaveBeenCalledTimes(1);
    });
  });

  describe("sendPasswordRecoverEmail", () => {
    it("should call POST /api/users/recover", () => {
      nock("http://localhost:5000", {
        reqheaders: {
          "Content-Type": "application/json",
        },
      })
        .put("/api/users/recover", { email: "a@test.com" })
        .reply(200);

      sendPasswordRecoverEmail("a@test.com");
    });
  });

  describe("resetPassword", () => {
    it("should call POST /api/users/reset", () => {
      nock("http://localhost:5000", {
        reqheaders: {
          "Content-Type": "application/json",
        },
      })
        .put("/api/users/reset", { email: "a@test.com" })
        .reply(200);

      resetPassword("a@test.com");
    });
  });
});
