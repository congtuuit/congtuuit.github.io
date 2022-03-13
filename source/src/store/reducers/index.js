
import { combineReducers } from 'redux';

import user from "./user";
import config from "./config";
import home from "../../pages/home/reducer";

export default combineReducers({
    user,
    config,
    home
});