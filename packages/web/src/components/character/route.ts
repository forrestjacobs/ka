import { fetchCharacter } from "../../actions";
import { Route } from "../route";
import { CharacterPage } from "./page";

export const characterRoute: Route = {
  exact: true,
  path: "/character/:literal",
  component: CharacterPage,
  loadData: ({ dispatch, match }): Promise<void> => {
    const { literal } = match.params as { literal: string };
    return dispatch(fetchCharacter(literal));
  }
};
