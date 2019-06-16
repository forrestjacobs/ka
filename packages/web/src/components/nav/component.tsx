import React from "react";
import { useMessages } from "../../messages";
import { NavLink } from "react-router-dom";
import { SearchForm } from "../search/form";

export function Nav(): JSX.Element {
  const messages = useMessages();
  return (
    <nav className="pt-3 pb-5 d-print-none">
      <h1 className="navbar navbar-light">
        <NavLink className="navbar-brand" exact to="/">
          {messages.title()}
        </NavLink>
      </h1>
      <SearchForm />
    </nav>
  );
}
