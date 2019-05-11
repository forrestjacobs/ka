import { getCharacter, searchForCharacters } from "@ka/data";
import request from "supertest";
import { app } from "../app";

jest.mock("@ka/data");

test("It should search for characters", async () => {
  (searchForCharacters as jest.Mock).mockImplementation((literal: string) => Promise.resolve([{ literal }]));

  const response = await request(app).get("/character?q=%E6%97%A5");
  expect(response.body).toEqual([{ literal: "日" }]);
});

test("It should get characters", async () => {
  (getCharacter as jest.Mock).mockImplementation((literal: string) => Promise.resolve({ literal }));

  const response = await request(app).get("/character/%E6%97%A5");
  expect(response.body).toEqual({ literal: "日" });
});

test("It should 404 when character is not available", async () => {
  (getCharacter as jest.Mock).mockImplementation(() => Promise.resolve(undefined));

  const response = await request(app).get("/character/0");
  expect(response.status).toEqual(404);
});
