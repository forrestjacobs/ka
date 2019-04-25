import { HooksProvider } from "@epeli/redux-hooks";
import React from "react";
import { BrowserRouter as Router, NavLink, Route, Switch } from "react-router-dom";
import { AnyAction, Store } from "redux";
import { MessagesProvider, useMessages } from "../messages";
import { CharacterPage } from "./character-page";
import { HomePage } from "./home-page";
import { SearchForm, SearchPage } from "./search-page";
import { NotFoundPage } from "./util-pages";

export function Root(store: Store<any, AnyAction>): JSX.Element {
  return (
    <MessagesProvider value="en">
      <HooksProvider store={store}>
        <Router>
          <div className="container">
            <Nav />
            <Switch>
              <Route exact path="/" component={HomePage} />
              <Route exact path="/character/:literal" component={CharacterPage} />
              <Route exact path="/search" component={SearchPage} />
              <Route component={NotFoundPage} />
            </Switch>
          </div>
        </Router>
      </HooksProvider>
    </MessagesProvider>
  );
}

function Nav(): JSX.Element {
  const messages = useMessages();
  return (
    <nav className="pt-3 pb-5 d-print-none">
      <div className="navbar navbar-light">
        <NavLink className="navbar-brand" exact to="/">
          {messages.title()}
        </NavLink>
      </div>
      <SearchForm />
    </nav>
  );
}
