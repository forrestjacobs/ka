import React from "react";
import { Link } from "react-navi";
import { useMessages } from "../../messages";
import { SearchForm } from "../search/form";

export function Nav(): JSX.Element {
  const messages = useMessages();
  return (
    <nav className="nav-component">
      <h1>
        <Link exact href="/">
          {messages.title()}
        </Link>
      </h1>
      <SearchForm />
    </nav>
  );
}
