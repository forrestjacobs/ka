import { createBrowserHistory } from "history";
import qhistory from "qhistory";
import { parse, stringify } from "query-string";
import React from "react";
import { hydrate } from "react-dom";
import { Router } from "react-router-dom";
import { applyMiddleware, compose, createStore } from "redux";
import thunk from "redux-thunk";
import { api } from "./api/rest";
import { Root } from "./components/root";
import { rootReducer } from "./reducers";

const enhancedCompose =
  (process.env.NODE_ENV !== "production" &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

const store = createStore(
  rootReducer,
  window.__PRELOADED_STATE__,
  enhancedCompose(applyMiddleware(thunk.withExtraArgument({ api })))
);

const history = qhistory(createBrowserHistory(), stringify, parse);

hydrate(
  <Router history={history}>
    <Root store={store} />
  </Router>,
  document.getElementById("root")
);
