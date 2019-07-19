import { fetchSearchResults } from "../../actions";
import { Route } from "../route";
import { SearchPage } from "./page";

export const searchRoute: Route = {
  exact: true,
  path: "/search",
  component: SearchPage,
  loadData: ({ dispatch, location }): Promise<void> => {
    const q = location.query.q;
    if (q !== undefined && typeof q === "string") {
      return dispatch(fetchSearchResults(q));
    }
    return Promise.resolve();
  }
};
