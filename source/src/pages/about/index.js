import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import InputCustom from "../../components/input";
import { useSelector } from 'react-redux';
import aboutDataService from "../../api/about";

const About = (props) => {
    const [about, setAbout] = useState({});

    useEffect(async () => {
        const response = await aboutDataService.getAbout();
        const about = response.data;
        setAbout(about);
    }, [])

    return (
        <div>
            <div>Đang cập nhật...</div>
        </div>
    );


};
export default About;