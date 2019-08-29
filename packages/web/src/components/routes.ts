import { mount } from "navi";
import { characterRoute } from "./character/route";
import { homeRoute } from "./home/route";
import { searchRoute } from "./search/route";

export const routes = mount({
  "/": homeRoute,
  "/character/:literal": characterRoute,
  "/search": searchRoute
});
