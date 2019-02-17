import { getCharacter, searchForCharacters } from "@ka/data";
import { Router } from "express";
import { jsonHandler } from "./handlers";

export const router = Router();
router.get("/", jsonHandler(async ({query}) => query.q ? await searchForCharacters(query.q) : undefined));
router.get("/:literal", jsonHandler(({params}) => getCharacter(params.literal)));
