import { Route } from "../route";
import { CharacterPage } from "./page";
import { fetchCharacter } from "../../actions";

export const characterRoute: Route = {
  exact: true,
  path: "/character/:literal",
  component: CharacterPage,
  loadData: ({ dispatch, match }): Promise<void> => {
    const { literal } = match.params as { literal: string };
    return dispatch(fetchCharacter(literal));
  }
};
