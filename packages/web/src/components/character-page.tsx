import React, { useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";
import { CharacterComponent } from "./character";
import { useActions, useMapState } from "./use-redux";
import { Page, mapAsyncStateToPage } from "./util-pages";
import { AsyncState } from "../async";
import { Character } from "@ka/base";

export function CharacterPage({
  match
}: RouteComponentProps<{ literal: string }>): JSX.Element {
  const literal = match.params.literal;

  const character = useMapState(
    (state): AsyncState<Character> => state.entities.characters[literal]
  );
  const { fetchCharacter } = useActions();
  useEffect((): void => {
    fetchCharacter(literal);
  }, [fetchCharacter, literal]);

  return mapAsyncStateToPage(
    character,
    (c): JSX.Element => (
      <Page title={literal}>
        <CharacterComponent character={c} />
      </Page>
    )
  );
}
