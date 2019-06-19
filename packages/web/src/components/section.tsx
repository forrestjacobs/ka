import React, { createContext, createElement, ReactNode } from "react";

// Thanks to https://medium.com/@Heydon/managing-heading-levels-in-design-systems-18be9a746fa3

const LevelContext = createContext(1);

function Level({ children }: { children: ReactNode }): JSX.Element {
  return (
    <LevelContext.Consumer>
      {(level): JSX.Element => (
        <LevelContext.Provider value={level + 1}>
          {children}
        </LevelContext.Provider>
      )}
    </LevelContext.Consumer>
  );
}

export function Section(props: React.HTMLProps<HTMLElement>): JSX.Element {
  return (
    <Level>
      <section {...props} />
    </Level>
  );
}

export function Article(props: React.HTMLProps<HTMLElement>): JSX.Element {
  return (
    <Level>
      <article {...props} />
    </Level>
  );
}

export function Heading(props: React.HTMLProps<HTMLDivElement>): JSX.Element {
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
