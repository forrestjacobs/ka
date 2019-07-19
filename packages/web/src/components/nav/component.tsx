import React from "react";
import { NavLink } from "react-router-dom";
import { useMessages } from "../../messages";
import { SearchForm } from "../search/form";

export function Nav(): JSX.Element {
  const messages = useMessages();
  return (
    <nav className="nav-component">
      <h1>
        <NavLink exact to="/">
          {messages.title()}
        </NavLink>
      </h1>
      <SearchForm />
    </nav>
  );
}
