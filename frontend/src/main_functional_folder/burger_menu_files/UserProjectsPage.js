import React, {useEffect, useState} from "react";
import Header from "../AdditionalFunctionality/Header";
import "../auth/auth_style/user_page_style.css";
import "./burger_menu_styles/UserProjects_CSS.css";
import OffCanvas from "./Offcanvas";
import { apiRequestFunctions } from "../AdditionalFunctionality/ApiRequestFunctions";
import AddUserFile from '../AdditionalFunctionality/AddUserFile';
import ProjectBlock from "../AdditionalFunctionality/ProjectBlocks";


function UserProjectsPage() {
    const [userProjects, setUserProjects] = useState([]);
    const { GetUserProjects } = apiRequestFunctions();
    const [showModal, setShowModal] = useState(false);
    const Add = 'https://open-visualization-s3-storage.s3.us-east-2.amazonaws.com/ProjectFiles/add.png';

    useEffect(() => {
        const projectCheck = async () => {
            const projects = await GetUserProjects();
            try {
                setUserProjects(projects);

            } catch (error) {
                alert(`Error -> ${error}`);
            }
        };

        projectCheck().catch(error => {
            console.error(`Error during execution -> ${error}`);
        });

    }, []);

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
                            {userProjects.map((project, index) => (
                                <div key={index} >
                                    {/*<div className="files-button-block">*/}
                                        <ProjectBlock
                                            userProject={project}
                                            // onHandleFunctionClick={() => handleFunctionButton()}
                                            // onHandleEditClick={() => handleEditButton(project)}
                                        />
                                    {/*</div>*/}
                                </div>
                            ))}
                            <button
                                className="add-new-file-block"
                                onClick={() => setShowModal(true)}
                            >
                                <img src={Add} alt="add-new-file-img" className="add-new-file-img" />
                                <h2>Add new File</h2>
                            </button>
                            <AddUserFile
                                show={showModal}
                                onHide={() => setShowModal(false)}
                            >
                            </AddUserFile>
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