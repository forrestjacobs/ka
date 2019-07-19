import { Location } from "history";
import { matchRoutes } from "react-router-config";
import { Dispatch } from "../actions";
import { characterRoute } from "./character/route";
import { homeRoute } from "./home/route";
import { NotFoundPage } from "./not-found/page";
import { AsyncRoute, Route } from "./route";
import { searchRoute } from "./search/route";

export const routes: Route[] = [
  homeRoute,
  characterRoute,
  searchRoute,
  { component: NotFoundPage }
];

const asyncRoutes = routes.filter(
  (route): route is AsyncRoute => "loadData" in route
);

export async function loadData(
  location: Location,
  dispatch: Dispatch
): Promise<void> {
  await Promise.all(
    matchRoutes(asyncRoutes, location.pathname).map(
      ({ route, match }): Promise<void> =>
        (route as AsyncRoute).loadData({ location, match, dispatch })
    )
  );
}
