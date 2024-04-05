import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import snackbarReducer from "./ducks/snackbar";
const reducer = combineReducers({
  snackbar: snackbarReducer,
});
const store = configureStore({reducer:reducer});
export default store;
