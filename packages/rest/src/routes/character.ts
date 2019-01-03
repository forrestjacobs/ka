import { getCharacter } from "@ka/data";
import { Router } from "express";
import { jsonHandler } from "./handlers";

export const router = Router();
router.get("/:literal", jsonHandler(({params}) => getCharacter(params.literal)));
