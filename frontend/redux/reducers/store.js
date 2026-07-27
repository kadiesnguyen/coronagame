import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import reducer from "./index";
const middleware = [thunk];
if (process.env.NODE_ENV !== "development") {
  // middleware.push(createLogger());
}

export const store = createStore(reducer, applyMiddleware(...middleware));
