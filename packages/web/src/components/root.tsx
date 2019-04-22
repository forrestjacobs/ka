import { HooksProvider } from "@epeli/redux-hooks";
import React from "react";
import { IntlProvider, FormattedMessage } from "react-intl";
import { BrowserRouter as Router, NavLink, Route, Switch } from "react-router-dom";
import { AnyAction, Store } from "redux";
import { CharacterPage } from "./character-page";
import { HomePage } from "./home-page";
import { SearchForm, SearchPage } from "./search-page";
import { NotFoundPage } from "./util-pages";

export function Root(store: Store<any, AnyAction>, messages: {[locale: string]: any}): JSX.Element {
  const locale = "en-US";
  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <HooksProvider store={store}>
        <Router>
          <div className="container">
            <nav className="pt-3 pb-5 d-print-none">
              <div className="navbar navbar-light">
                <NavLink className="navbar-brand" exact to="/">
                  <FormattedMessage id="title" />
                </NavLink>
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
    </IntlProvider>
  );
}
