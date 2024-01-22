import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../Header";
import Logout from "./logout";
import "./auth_style/user_page_style.css"
import OffCanvas from "./offcanvas";
import Edit from "../../front_additions/edit.png"
import PremiumStatus from "../premium/premium_status";


const UserProfile = () => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {

        const token = getCookie("access_token");
        console.log('Token: ', token)

        if (token) {
            getUserData(token);
        }
    }, []);

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
    };

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

    return (
        <div className="user-page-main">
            <Header />

            <div className="user-data-container">
                <div className="info-menu-block">
                    <OffCanvas />
                    <div className="user-data">
                        {userData ? (
                            <div>
                                 <h2>{userData.first_name} {userData.last_name} <PremiumStatus userId = {userData.id}/></h2>
                            </div>
                            ) : (
                            <p>Loading user data...</p>
                        )}
                    </div>
                     <img src={Edit} alt="edit" className="edit-button"/>
                </div>
                <div className="button-block">
                    <Logout />
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
