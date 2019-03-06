import { HooksProvider } from "@epeli/redux-hooks";
import { FluentBundle } from "fluent";
import { LocalizationProvider, Localized } from "fluent-react";
import React from "react";
import { BrowserRouter as Router, NavLink, Route, Switch } from "react-router-dom";
import { AnyAction, Store } from "redux";
import { CharacterPage } from "./character-page";
import { HomePage } from "./home-page";
import { SearchForm, SearchPage } from "./search-page";
import { NotFoundPage } from "./util-pages";

export function Root(store: Store<any, AnyAction>, languageBundles: IterableIterator<FluentBundle>): JSX.Element {
  return (
    <LocalizationProvider bundles={languageBundles}>
      <HooksProvider store={store}>
        <Router>
          <div className="container">
            <nav className="pt-3 pb-5 d-print-none">
              <div className="navbar navbar-light">
                <Localized id="title">
                  <NavLink className="navbar-brand" exact to="/"/>
                </Localized>
              </div>
              <SearchForm />
            </nav>
            <Switch>
              <Route exact path="/" component={HomePage} />
              <Route exact path="/character/:literal" component={CharacterPage} />
              <Route exact path="/search" component={SearchPage} />
              <Route component={NotFoundPage} />
            </Switch>
          </div>
        </Router>
      </HooksProvider>
    </LocalizationProvider>
  );
}
