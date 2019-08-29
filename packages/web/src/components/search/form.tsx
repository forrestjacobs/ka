import { parse, stringify } from "query-string";
import React, { useEffect, useState } from "react";
import { useActive, useCurrentRoute, useNavigation } from "react-navi";
import { useMessages } from "../../messages";

export function SearchForm(): JSX.Element {
  const [q, setQ] = useState("");
  const isOnSearch = useActive("/search");
  const route = useCurrentRoute();
  const nav = useNavigation();

  useEffect((): void => {
    if (isOnSearch) {
      const q = parse(route.url.search).q;
      if (q !== undefined && typeof q === "string") {
        setQ(q);
      }
    }
  }, [isOnSearch, route]);

  const messages = useMessages();

  function onSearchSubmit(e: React.FormEvent<unknown>): void {
    e.preventDefault();
    nav.navigate(`/search?${stringify({ q })}`);
  }

  function onQChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setQ(e.target.value);
  }

  return (
    <form method="get" action="/search" onSubmit={onSearchSubmit}>
      <div className="input-group">
        <input
          value={q}
          onChange={onQChange}
          type="search"
          name="q"
          id="q"
          aria-label={messages.search.field()}
          className="form-control"
        />
        <div className="input-group-append">
          <button className="btn btn-outline-primary" type="submit">
            {messages.search.button()}
          </button>
        </div>
      </div>
    </form>
  );
}
