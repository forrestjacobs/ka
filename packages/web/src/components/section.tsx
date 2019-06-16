import React, { createContext, createElement } from "react";

// Thanks to https://medium.com/@Heydon/managing-heading-levels-in-design-systems-18be9a746fa3

const LevelContext = createContext(1);

export function Section(
  props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
): JSX.Element {
  return (
    <LevelContext.Consumer>
      {(level): JSX.Element => (
        <LevelContext.Provider value={level + 1}>
          <section {...props} />
        </LevelContext.Provider>
      )}
    </LevelContext.Consumer>
  );
}

export function Heading(
  props: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >
): JSX.Element {
  return (
    <LevelContext.Consumer>
      {(level): JSX.Element => {
        return level <= 6 ? (
          createElement(`h${level}`, props)
        ) : (
          <div role="heading" aria-level={level} {...props} />
        );
      }}
    </LevelContext.Consumer>
  );
}
