import React, {useEffect, useState} from "react";
import axios from "axios";
import Header from "../Header";
import Logout from "./logout";
import "./auth_style/user_page_style.css"
import OffCanvas from "../burger_menu_files/offcanvas";
import Edit from "../../front_additions/edit.png"
import Spark from "../../front_additions/shining.png"
import ErrorImg from "../../front_additions/404.gif"


function get_token_export(){
    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
    };
    return getCookie("access_token")
}

export {get_token_export};

const UserProfile = () => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const token = get_token_export();

        if (token) {
            getUserData(token);
        }
    }, []);

    const getUserData = async (token) => {
        try {

            const response = await axios.get("http://127.0.0.1:8000/api/user/", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setUserData(response.data);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const get_premium_type = () =>{
        if (userData['user_premium'] === 'Junior') {
            return 'premium-block-purple';
        } else if (userData['user_premium'] === 'Middle') {
            return 'premium-block-blue';
        } else if (userData['user_premium'] === 'Senior') {
            return 'premium-block-green';
        } else {
            return 'premium-block-transparent';
        }
    };

    return (
        <div className="user-page-main">
            <Header />
            <div className="user-data-container">
                <OffCanvas />
                <div className="user-data">
                    {userData ? (
                        <div className="available-data-container">
                            <div className="available-data-head">
                                <h2>{userData['user_data'].first_name} {userData['user_data'].last_name}</h2>
                                {
                                    userData['user_premium'] !== '' ?
                                        <div className={`premium-status ${get_premium_type()}`}>
                                            <img src={Spark} alt="shining" className="sparkling-block"/>
                                            <h4>{userData['user_premium'] && <span className="premium-block-text">{userData['user_premium']}</span>}</h4>
                                        </div>
                                    : null
                                }
                            </div>
                            <div className="user-data-line"></div>
                            <div className="available-data-body">
                                <p>User ID: {userData['user_data'].id && <span className="user-information-block">&nbsp;&nbsp;{userData['user_data'].id}</span>}</p>
                                <p>Email: {userData['user_data'].email && <span className="user-information-block">&nbsp;&nbsp;{userData['user_data'].email}</span>}</p>
                                <p>Date of joined: {userData['user_data'].data_joined && <span className="user-information-block">&nbsp;&nbsp;{userData['user_data'].data_joined}</span>}</p>
                            </div>
                        </div>
                        ) : (
                            <div className="error-load-data-container">
                                <img src={ErrorImg} alt="gif" className="image-gif" />
                                <h3>Oops... Something went wrong!</h3>
                                <p>If data does not load within 2 or more minutes. Reload page or contact with Technical
                                    support.</p>
                            </div>
                    )}
                </div>
                <img src={Edit} alt="edit" className="edit-button"/>
                <div className="button-block">
                    <Logout />
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
