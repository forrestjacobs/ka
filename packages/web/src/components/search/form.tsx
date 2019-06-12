import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { useMessages } from "../../messages";

export const SearchForm = withRouter(
  ({ history, location }): JSX.Element => {
    const [q, setQ] = useState("");

    useEffect((): void => {
      if (location.pathname === "/search") {
        const q = location.query.q;
        if (q !== undefined && typeof q === "string") {
          setQ(q);
        }
      }
    }, [location]);

    const messages = useMessages();

    function onSearchSubmit(e: React.FormEvent<unknown>): void {
      e.preventDefault();
      history.push({
        pathname: "/search",
        query: { q }
      });
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
);
