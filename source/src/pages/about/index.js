import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import InputCustom from "../../components/input";
import { useSelector } from 'react-redux';

import userDataService from "../../api/user-data.service";

const About = (props) => {
    const [clicked, setClicked] = useState(false);
    const [username, setUsername] = useState("default");

    useEffect(() => {
        console.log("About page");
    }, [])

    const handleClick = () => {
        //const counter = useSelector(state => state.counter)
        //console.log("counter: ", counter);

        setClicked(!clicked);
        //userDataService.getAllUser();
    }

    const data = {
        id: 1,
        name: "About",
    }
    return (
        <div>
            {
                clicked ? <h1> clicked About page</h1> : <h1>About page</h1>
            }
            <p>{username}</p>
            <button onClick={() => handleClick()}>Click</button>
            <Link to={{ pathname: `/`, state1: data }}>Go to home page</Link >
            <InputCustom setUsername={setUsername} />
        </div>
    );


};
export default About;