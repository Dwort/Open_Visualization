import React, {useEffect, useState} from "react";
import '../main_page_dir_styles/Header.css'
import UserLogo from '../../front_additions/user.png'
import {Link} from "react-router-dom";
import Logo from "../../front_additions/Logo.jpg"

const Header = () => {

     const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {

        const token = getCookie("access_token");
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
    };

    function registration () {
        window.location.href = '/registration'
    }

    function login () {
        window.location.href = '/login'
    }

    function userProfile () {
        window.location.href = '/user'
    }

    return (
        <div className="header">
            <div className="other-services">
                <Link to="/" className="logo-container">
                    <img src={Logo} alt="logo" className="head-logo"/>
                </Link>
                <a href="/#scrollToFunction">Visualization</a>
                <a href="/#scrollToAbout">About</a>
                <a href="https://google.com/">More</a>
            </div>
            <div className="sigh-action">
                <a href='/premium' >Pricing</a>
                {isLoggedIn ? (
                    <>
                        <img src={UserLogo} alt="user-icon" className="user-page-icon" onClick={userProfile} />
                    </>
                ) : (
                    <>
                        <button className="login-button" onClick={login}>
                            Log in
                        </button>
                        <button className="register-button" onClick={registration}>
                            Sign up
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Header;