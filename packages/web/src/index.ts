import { render } from "react-dom";
import { applyMiddleware, compose as reduxCompose, createStore } from "redux";
import thunk from "redux-thunk";
import { getApi } from "./api";
import { Root } from "./components/root";
import "./index.scss";
import { getBundles } from "./localizations";
import { rootReducer } from "./reducers";

const isProd = process.env.NODE_ENV === "production";
const compose: typeof reduxCompose = (!isProd && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || reduxCompose;

const store = createStore(
  rootReducer,
  compose(applyMiddleware(thunk.withExtraArgument({ api: getApi() }))),
);

const bundles = getBundles();

render(Root(store, bundles), document.getElementById("root"));
