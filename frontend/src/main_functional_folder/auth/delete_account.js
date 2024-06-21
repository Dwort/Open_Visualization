import React from "react";
import axios from "axios";
import "./auth_style/logout.css"
import Cookies from "js-cookie";


const DeleteAccount = () => {
    const handleDelete = async () => {

        const confirmDelete = window.confirm("Are you sure you want to delete your account?");

        if (confirmDelete) {
            const token = Cookies.get("access_token")

            try {
                const response = await axios.delete('http://127.0.0.1:8000/api/user/delete/',{
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if(response.status === 200) {
                    Cookies.remove("access_token")
                    alert("Account successfully deleted. Bye!")
                    window.location.href = '/';
                } else {
                    alert("Error with account deletion. Try again or contact with Tech Support!\n" + response.status)
                }
            } catch (error) {
                alert("Bad Request!" + error.status)
            }
        }
    }
    return (
        <div>
            <button
                className="logout-button"
                title="Delete account"
                onClick={handleDelete}
            >
                Delete account
            </button>
        </div>
    );
};

export default DeleteAccount;