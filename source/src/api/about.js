
import http from "../utils/http-common";
const controller = "about";

const getAbout = () => {
    return http.get(`/${controller}/1`);
};

const aboutDataService = {
    getAbout,
}
export default aboutDataService;
