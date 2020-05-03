import { combineReducers } from "redux";
import userReducer from "./user";
import category from "./category"

export default combineReducers({
  user: userReducer,
  category : category,
});
