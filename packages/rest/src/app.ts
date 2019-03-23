import dotenv from "dotenv";
dotenv.config();

import { json, urlencoded } from "body-parser";
import cors from "cors";
import express from "express";
import { router } from "./routes";

export const app = express();

app.use(cors());
app.use(urlencoded({ extended: true }));
app.use(json());

app.use("/api/", router);
