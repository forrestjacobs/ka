import { json, urlencoded } from "body-parser";
import express from "express";
import { router } from "./routes";

export const app = express();

app.use(urlencoded({ extended: true }));
app.use(json());

app.use("/api/", router);
