
import http from "../utils/http-common";

const controller = "user";

const getAllUser = () => {
    return http.get(`/${controller}/get-all-user`);
};

const userDataService = {
    getAllUser,
}
export default userDataService;
