import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { AnyAction, Store } from "redux";
import { CharacterPage } from "./character-page";
import { HomePage } from "./home-page";
import { NotFound } from "./util-pages";

export function Root(store: Store<any, AnyAction>): JSX.Element {
  return (
    <Provider store={store}>
      <Router>
        <>
          <h1>Ka</h1>
          <form>
            <input type="search" />
          </form>
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/character/:literal" component={CharacterPage} />
            <Route component={NotFound} />
          </Switch>
        </>
      </Router>
    </Provider>
  );
}
