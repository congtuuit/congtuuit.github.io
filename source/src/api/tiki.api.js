
import http from "../utils/http";


const getListing = () => {
    const url = 'https://tiki.vn/api/personalish/v1/blocks/listings?limit=48&include=advertisement&aggregations=2&trackity_id=a6383088-ff0c-f07f-7273-5f9cde8be4de&category=4221&page=1&urlKey=dien-tu-dien-lanh'
    return http.get(url);
};

const tikiApi = {
    getListing,
}
export default tikiApi;
