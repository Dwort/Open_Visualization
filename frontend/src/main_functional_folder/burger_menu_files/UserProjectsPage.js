import React, {useEffect, useState} from "react";
// import axios from "axios";
// import Cookies from "js-cookie";
import Header from "../AdditionalFunctionality/Header";
import "../auth/auth_style/user_page_style.css";
import "./burger_menu_styles/UserProjects_CSS.css";
import OffCanvas from "./Offcanvas";
// import {Link} from "react-router-dom";
import Add from "../../front_additions/add.png";
import LimitProcessing from "../AdditionalFunctionality/LimitProcessing";
import AddUserFile from '../AdditionalFunctionality/AddUserFile';


function UserProjectsPage() {
    const [userProjects, setUserProjects] = useState([]);
    const [updatePageFlag, setUpdatePageFlag] = useState(true);

    const { GetUserProjects } = LimitProcessing();

    /////////////////////////////////////

    const [showModal, setShowModal] = useState(false);

    /////////////////////////////////////

    useEffect(() => {
        const projectCheck = async () => {
            try {
                const projects = await GetUserProjects();
                setUserProjects(projects);
                setUpdatePageFlag(false);
            } catch (error) {
                alert(`Error -> ${error}`);
            }
        };

        projectCheck().catch(error => {
            console.error(`Error during execution -> ${error}`);
        });

    }, [updatePageFlag]);



    return (
         <div className="user-page-main">
            <Header />
            <div className="user-data-container">
                <OffCanvas />
                <h1>My Projects</h1>
                <div className="title-line-projects"></div>

                <div className={`user-projects-block ${userProjects.length > 0 ? 'align-start' : 'align-center'}`}>

                    { userProjects.length > 0 ? (
                        <div className="blocks">
                            <p>Some Text</p>
                            <p>Other text</p>
                        </div>
                    ) : (
                        <>
                            <button
                                className="img-button-container"
                                onClick={() => setShowModal(true)}
                            >
                                <img src={Add} alt="add-img" className="add-project-img" />
                                <h2>Add new file</h2>
                            </button>
                            <AddUserFile
                                show={showModal}
                                onHide={() => setShowModal(false)}
                            >
                            </AddUserFile>
                        </>
                    )}
                </div>
            </div>
         </div>
    );
}

export default UserProjectsPage;