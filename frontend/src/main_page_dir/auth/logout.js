import React from "react";
import axios from "axios";
import "./auth_style/logout.css"

const Logout = () => {
    const handleLogout = async () => {

        document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

        try {
            const response = await axios.get('http://127.0.0.1:8000/api/user/logout/');

            if(response.status === 200) {
                document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                window.location.href = '/';
            } else {
                console.error("Error with deleting Access Token through API")
            }
        } catch (error) {
            console.log('Error with Token deleting', error)
        }
    }
    return (
        <div>
            <button
                className="logout-button"
                onClick={handleLogout}
            >
                Log out
            </button>
        </div>
    );
};

export default Logout;