import { render } from "react-dom";
import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import { getApi } from "./api";
import { Root } from "./components/root";
import { rootReducer } from "./reducers";

const store = createStore(rootReducer, composeWithDevTools(
  applyMiddleware(
    thunk.withExtraArgument({ api: getApi() }),
  ),
));

render(Root(store), document.getElementById("root"));
