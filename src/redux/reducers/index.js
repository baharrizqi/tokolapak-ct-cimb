import { combineReducers } from "redux";
import userReducer from "./user";
import data from "./data"

export default combineReducers({
  user: userReducer,
  data: data,
});
