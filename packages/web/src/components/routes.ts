import { NotFoundPage } from "./util-pages";
import { Route, AsyncRoute } from "./route";
import { homeRoute } from "./home/route";
import { characterRoute } from "./character/route";
import { searchRoute } from "./search/route";
import { matchRoutes } from "react-router-config";
import { Location } from "history";
import { Dispatch } from "../actions";

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
