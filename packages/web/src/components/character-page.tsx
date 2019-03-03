import React, { useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";
import { CharacterComponent } from "./character";
import { useActions, useMapState } from "./use-redux";
import { mapAsyncStateToPage, Page } from "./util-pages";

export function CharacterPage({ match }: RouteComponentProps<{ literal: string }>): JSX.Element {
  const literal = match.params.literal;

  const character = useMapState((state) => state.entities.characters[literal]);
  const { fetchCharacter } = useActions();
  useEffect(() => { fetchCharacter(literal); }, [fetchCharacter, literal]);

  return mapAsyncStateToPage(character, (c) => (
    <Page title={literal}>
      <CharacterComponent character={c} />
    </Page>
  ));
}
