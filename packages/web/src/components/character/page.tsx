import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { CharacterComponent } from "./component";
import { useMapState } from "../use-redux";
import { Page } from "../util-pages";
import { unwrap } from "../../async";
import { Character } from "@ka/base";

export function CharacterPage({
  match
}: RouteComponentProps<{ literal: string }>): JSX.Element {
  const literal = match.params.literal;

  const character = useMapState(
    (state): Character => unwrap(state.entities.characters[literal])
  );

  return (
    <Page title={literal}>
      <CharacterComponent character={character} />
    </Page>
  );
}
