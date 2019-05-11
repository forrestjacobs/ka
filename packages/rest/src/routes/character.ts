import { Character } from "@ka/base";
import { getCharacter, searchForCharacters } from "@ka/data";
import { Router } from "express";
import { jsonHandler } from "./handlers";

export const router = Router();
router.get(
  "/",
  jsonHandler(
    async ({ query }): Promise<Character[] | undefined> =>
      query.q === undefined ? undefined : await searchForCharacters(query.q)
  )
);
router.get(
  "/:literal",
  jsonHandler(
    ({ params }): Promise<Character | undefined> => getCharacter(params.literal)
  )
);
