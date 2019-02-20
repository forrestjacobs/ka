import { render } from "react-dom";
import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import { getApi } from "./api";
import { Root } from "./components/root";
import { rootReducer } from "./reducers";

const isProd = process.env.NODE_ENV === "production";
const enhancer = applyMiddleware(thunk.withExtraArgument({ api: getApi() }));

const store = createStore(rootReducer, isProd ? enhancer : composeWithDevTools(enhancer));

render(Root(store), document.getElementById("root"));
