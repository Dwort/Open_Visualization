import React, { useState } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import Header from "../AdditionalFunctionality/Header";
import "./auth_style/user_page_style.css"
import Back from "../../front_additions/arrow-left.png"
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form"
import {Link, useLocation} from "react-router-dom";
import PasswordChange from "../../front_additions/change-password.png"
import "./auth_style/logout.css"
import {InputGroup} from "react-bootstrap";
import DeleteAccount from "./delete_account";



const EditUserData = () => {
    const location = useLocation();
    const userData = location.state?.userData;

    const [firstName, setFirstName] = useState(() => userData.user_data.first_name || '');
    const [lastName, setLastName] = useState(() => userData.user_data.last_name || '');
    const [email, setEmail] = useState(() => userData.user_data.email || '');

    const handleFirstNameChanges = (event) => {
        setFirstName(event.target.value);
    };

    const handleLastNameChanges = (event) => {
        setLastName(event.target.value);
    };

    const handleEmailChanges = (event) => {
        setEmail(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = Cookies.get("access_token");

        await axios.patch("http://127.0.0.1:8000/api/user/data-edit/", {
            first_name: firstName,
            last_name: lastName,
            email: email,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then(response => {
            if (response.status === 200) {
                alert("Data successfully changed. Wait 1 minute and new data will represent in your cabinet");
                window.location.href = "/user"
            }
        }).catch(error => {
            alert("Error with data changing. Try again later or contact with tech support")
        });


    };

    return (
        <div className="user-page-main">
            <Header />
            <div className="user-data-container edit-container">
                <Link to="/user">
                    <Button variant="custom" className="custom-offcanvas-button edit-changes">
                        <img src={Back} alt="back" className="back-button" title="Back to user page" />
                    </Button>
                </Link>
                <div className="user-data edit-data-block">
                    <Form onSubmit={handleSubmit} className="edit-form-container">

                        <InputGroup className="input-group-head-container">
                            <InputGroup.Text className="input-grout-edit-text">First name:</InputGroup.Text>
                            <Form.Control
                              required type="text" value={firstName} onChange={handleFirstNameChanges}
                            />
                        </InputGroup>

                        <InputGroup className="input-group-head-container">
                            <InputGroup.Text className="input-grout-edit-text">Last name:</InputGroup.Text>
                            <Form.Control
                              required type="text" value={lastName} onChange={handleLastNameChanges}
                            />
                        </InputGroup>

                        <InputGroup className="input-group-head-container">
                            <InputGroup.Text className="input-grout-edit-text">Email:</InputGroup.Text>
                            <Form.Control
                              required type="email" value={email} onChange={handleEmailChanges}
                            />
                        </InputGroup>

                        <Button variant="primary" type="submit" title="Submit new data" className="edit-submit-button"
                            >Submit</Button>

                        <p>*Be careful with data editing! Some data or your settings can be corrupted!</p>
                    </Form>
                </div>
                <div className="bottom-buttons">
                    <img src={PasswordChange} alt="edit" className="password-button" title="Edit password"/>
                    {/*<button className="logout-button" title="Delete account">Delete account</button>*/}
                    <DeleteAccount />
                </div>
            </div>
        </div>
    );
};

export default EditUserData;
