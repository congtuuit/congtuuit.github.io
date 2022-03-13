import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import tikiApi from "../../api/tiki.api";

//var htmlContent = require('../../static-pages/coupon.html');

const Home = (props) => {
    useEffect(async () => {
        //const tikiResponse = await tikiApi.getListing();
        //console.log("tikiResponse >>", tikiResponse)
    }, []);

    return (
        <div>
            <h4>
                Website cập nhật liên tục các mã giảm giá, khuyến mãi từ Tiki.vn, shopee, Lazada,...
            </h4>
            <br />
            <h5><a href="/khuyen-mai/coupon.html">DANH SÁCH COUPON ĐANG MỞ</a></h5>
            <br />
            <h5><a href="/khuyen-mai/voucher.html">SĂN MÃ KHUyẾN MÃI</a></h5>
        </div>
    );
};
export default Home;