import { Character } from "@ka/base";
import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { AsyncState } from "../../async";
import { MapAsyncState } from "../map-async-state";
import { Page } from "../page";
import { useMapState } from "../use-redux";
import { CharacterComponent } from "./component";

export function CharacterPage({
  match
}: RouteComponentProps<{ literal: string }>): JSX.Element {
  const literal = match.params.literal;

  const characterState = useMapState(
    (state): AsyncState<Character> | undefined =>
      state.entities.characters[literal],
    [literal]
  );

  return (
    <MapAsyncState page state={characterState}>
      {(character): JSX.Element => (
        <Page title={literal}>
          <CharacterComponent character={character} />
        </Page>
      )}
    </MapAsyncState>
  );
}
