import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, NavLink, Route, Switch } from "react-router-dom";
import { AnyAction, Store } from "redux";
import { CharacterPage } from "./character-page";
import { HomePage } from "./home-page";
import { SearchPage } from "./search-page";
import { NotFound } from "./util-pages";

export function Root(store: Store<any, AnyAction>): JSX.Element {
  return (
    <Provider store={store}>
      <Router>
        <div className="container">
          <nav className="pt-3 pb-5">
            <div className="navbar navbar-light">
              <NavLink className="navbar-brand" exact to="/">Ka</NavLink>
            </div>
            <form method="get" action="/search">
              <div className="form-row">
                <div className="col-10">
                  <input type="search" name="q" id="q" placeholder="Search" aria-label="Search"
                    className="form-control mr-sm-2" />
                </div>
                <div className="col-2">
                  <button className="btn btn-outline-primary" type="submit">Search</button>
                </div>
              </div>
            </form>
          </nav>
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/character/:literal" component={CharacterPage} />
            <Route exact path="/search" component={SearchPage} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </Router>
    </Provider>
  );
}
