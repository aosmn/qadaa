import { getFatwas } from "../fatwas.api";
import nock from "nock";

const fatwas = [{
  brief:
    "It should be borne in mind that it is obligatory upon every Muslim to perform the missed number of Fardh and Waajib (Witr) prayers (Salaat) since the time one has reached the age of puberty. This has been proven from many narrations-a few are as follows:\nAnas ibn Maalik (Allah be pleased with him) narrates that the messenger of Allah (peace and blessings be upon him) mentions:'Whoever forgets to pray a Salaah, it is obligatory upon him/her that he/she pray that Salaah when he remembers. There is no other way that this can be made up.' (Bukhari , Hadith 597)\nLikewise the messenger of Allah (peace and blessings be upon him) mentions:\n'Whenever one of you misses a Salaah due to sleeping or due to negligence, it is obligatory upon him/her that he/she pray the Salaah when he remembers it because Allah has metioned, “Perform Salah when you remember me”'(Muslim,Hadith 1569)",
  createdAt: "2021-08-04T09:28:36.440Z",
  description:
    "It should be borne in mind that it is obligatory upon every Muslim to perform the missed number of Fardh and Waajib (Witr) prayers (Salaat) since the time one has reached the age of puberty.",
  lan: "en",
  question:
    "I have missed many salaah in the past and have been trying to pray my qaza namaz’s since the last 5 years. i do try and keep record but sometimes i become lazy and lose record of how much i have prayed, how can i finish off my qaza namaz",
  src: "My Islam",
  title: "How to make up missed Salah",
  updatedAt: "2021-08-04T09:28:36.440Z",
  url: "https://www.myislaam.com/question/make-missed-salah/",
  __v: 0,
  _id: "610a5dc4ff702bde063d050b",
}];

describe("fatwas api", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  describe("getFatwas", () => {
    it("should make a call to GET /api/fatwas", async () => {
      nock("http://localhost:5000", {
        reqheaders: {
          "Content-Type": "application/json",
        },
      })
        .get(
          "/api/fatwas?lan=en"
        )
        .reply(200, fatwas);

      const response = await getFatwas("en");
      expect(response).toEqual(fatwas);
    });
  });
});
