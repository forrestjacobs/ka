import React from "react";
import { hydrate } from "react-dom";
import { Router } from "react-router-dom";
import { applyMiddleware, createStore, compose } from "redux";
import thunk from "redux-thunk";
import { api } from "./api/rest";
import { Root } from "./components/root";
import { rootReducer } from "./reducers";
import { createBrowserHistory } from "history";
import { stringify, parse } from "query-string";
import qhistory from "qhistory";
import { AsyncStatus } from "./async";

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

const status =
  window.__PRELOADED_STATUS__ !== undefined
    ? window.__PRELOADED_STATUS__
    : AsyncStatus.IN_PROGRESS;

hydrate(
  <Router history={history}>
    <Root store={store} status={status} />
  </Router>,
  document.getElementById("root")
);
