import { getCharacter, searchForCharacters } from "@ka/data";
import { Router } from "express";
import { jsonHandler } from "./handlers";

export const router = Router();
router.get("/", jsonHandler(async ({query}) => query.q === undefined ? undefined : await searchForCharacters(query.q)));
router.get("/:literal", jsonHandler(({params}) => getCharacter(params.literal)));
