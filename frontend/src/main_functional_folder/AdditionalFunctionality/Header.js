import React, {useEffect, useState} from "react";
import '../main_page_dir_styles/Header.css'
import UserLogo from '../../front_additions/user.png'
import {Link} from "react-router-dom";
import Logo from "../../front_additions/Logo.jpg"
import getUserToken from "./RefreshTokenAuthentication";

const Header = () => {

     const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect( () => {
        const fetchData = async () => {
            try {
                const token = await getUserToken();
                if (token) {
                    setIsLoggedIn(true);
                }
            } catch (error) {
                console.error('Error with getting user token -> ', error);
                // Можливо, додаткові дії при помилці, наприклад, перенаправлення на сторінку входу
            }
        };

        fetchData();
    }, []);

    const headerDirection = (direction) => {
      window.location.href = `/${direction}`
    };

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
                        <img src={UserLogo} alt="user-icon" className="user-page-icon" onClick={() => headerDirection('user')} />
                    </>
                ) : (
                    <>
                        <button className="login-button" onClick={() => headerDirection('login')}>
                            Log in
                        </button>
                        <button className="register-button" onClick={() => headerDirection('registration')}>
                            Sign up
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Header;