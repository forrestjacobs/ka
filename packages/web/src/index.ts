import { render } from "react-dom";
import { applyMiddleware, createStore, compose as reduxCompose } from "redux";
import thunk from "redux-thunk";
import { getApi } from "./api";
import { Root } from "./components/root";
import "./index.scss";
import { rootReducer } from "./reducers";

interface WindowWithReduxDevtools {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof reduxCompose;
}

const compose =
  (process.env.NODE_ENV !== "production" &&
    ((window as unknown) as WindowWithReduxDevtools)
      .__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  reduxCompose;

const store = createStore(
  rootReducer,
  compose(applyMiddleware(thunk.withExtraArgument({ api: getApi() })))
);

render(Root(store), document.getElementById("root"));
