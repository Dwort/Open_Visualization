import React, {useState} from "react";
import {Card, OverlayTrigger, Popover, ListGroup} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AdditionalFunctionality_styles/ProjectBlock_style.css";
import { EditFileMenu } from "./ApiRequestFunctions";
import Spinner from "react-bootstrap/Spinner";


const imgDict = {
    "text/plain": 'https://open-visualization-s3-storage.s3.us-east-2.amazonaws.com/ProjectFiles/txt-file.png',
    "application/pdf": 'https://open-visualization-s3-storage.s3.us-east-2.amazonaws.com/ProjectFiles/pdf.png',
    "application/vnd.ms-excel": 'https://open-visualization-s3-storage.s3.us-east-2.amazonaws.com/ProjectFiles/xls.png',
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": 'https://open-visualization-s3-storage.s3.us-east-2.amazonaws.com/ProjectFiles/xlsx.png',
}
const editDots = 'https://open-visualization-s3-storage.s3.us-east-2.amazonaws.com/ProjectFiles/dots.png'
const editName = 'https://open-visualization-s3-storage.s3.us-east-2.amazonaws.com/ProjectFiles/edit-name.png';
const editDelete = 'https://open-visualization-s3-storage.s3.us-east-2.amazonaws.com/ProjectFiles/edit-delete.png';
const editFunctions = 'https://open-visualization-s3-storage.s3.us-east-2.amazonaws.com/ProjectFiles/edit-functions.png';
const editDownload = 'https://open-visualization-s3-storage.s3.us-east-2.amazonaws.com/ProjectFiles/edit-download.png';
const ProjectBlock = ({userProject}) => {
    const [showNameModal, setShowNameModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { DeleteUserFile, EditFileName } = EditFileMenu();

    const colorMapping = {
        statistics: '#6d06a1',
        chart: '#0000FF',
        map: '#099c0e',
        prediction: '#FF0000'
    };

    const getBorderColorStyles = () => {
        const colors = [];
        for (const funct of userProject.file_functions) {
            colors.push(colorMapping[funct]);
        }
        if (colors.length === 1) {
            return { borderColor: colors[0] };
        } else if (colors.length === 2) {
            return {
                borderTopColor: colors[0],
                borderRightColor: colors[0],
                borderBottomColor: colors[1],
                borderLeftColor: colors[1]
            };
        } else if (colors.length === 3) {
            return {
                borderTopColor: colors[0],
                borderRightColor: colors[1],
                borderBottomColor: colors[2],
                borderLeftColor: colors[2]
            };
        } else {
            return {
                borderTopColor: colors[0],
                borderRightColor: colors[1],
                borderBottomColor: colors[2],
                borderLeftColor: colors[3]
            };
        }
    };

        // TEMP FUNCTIONS FOR TEST CLICKABLE OF TWO BUTTONS. AFTER THAT DELETE THEY AND REPLACE TO FUNCTION FROM ANOTHER FILES!

    const handleFunctionButton = () => {
        console.log('Pressed card button!');
    }

    // END OF TEST FUNCTIONS

    const editButtonMenu = (
        <Popover id="popover-basic">
            <Popover.Header as="h3">Edit Menu</Popover.Header>
            <Popover.Body className="popover-body-container">
                <ListGroup className="list-group-popover-block">
                    <ListGroup.Item
                        action
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowNameModal(true);
                        }}
                    >
                        <img src={editName} alt="editName" className="edit-file-function-button"/>
                        Change name
                    </ListGroup.Item>
                    <ListGroup.Item
                        action
                        onClick={(e) => {
                            e.stopPropagation();
                        //     Add change function
                        }}
                    >
                        <img src={editFunctions} alt="editFunctions" className="edit-file-function-button"/>
                        Change functions
                    </ListGroup.Item>
                    <ListGroup.Item
                        action
                        onClick={(e) => {
                            e.stopPropagation();
                        //     Add download function
                        }}
                    >
                        <img src={editDownload} alt="editDownload" className="edit-file-function-button"/>
                        Download file
                    </ListGroup.Item>
                    <ListGroup.Item
                        action
                        onClick={() => DeleteUserFile(userProject.file_name, setIsLoading)}
                    >
                        <img src={editDelete} alt="editDelete" className="edit-file-function-button"/>
                        Delete file
                    </ListGroup.Item>
                </ListGroup>
            </Popover.Body>
        </Popover>
    );

    return (
        <>
            <Card
                className="card-projects-container"
                style={getBorderColorStyles()}
                onClick={handleFunctionButton}
            >
                <Card.Img variant="top" src={imgDict[userProject.file_type]} className="card-img-block"/>
                <Card.Body className="card-body-container">
                    <div className="edit-dots-block">
                        <OverlayTrigger trigger="focus" placement="right" overlay={editButtonMenu}>
                            <img
                                alt="edit-dots"
                                src={editDots}
                                className="edit-dots-img"
                                tabIndex="0"
                                onClick={(e) => {
                                    e.stopPropagation(); // Запобігає спрацюванню onClick на картці
                                }}
                            />
                        </OverlayTrigger>
                    </div>

                    <Card.Title className="card-title-block">{userProject.file_name}</Card.Title>
                    <Card.Text className="project-block-text">
                        {Array.isArray(userProject.file_functions) ? (
                            userProject.file_functions.map((func, index) => (
                                <span key={index} style={{ color: colorMapping[func] || 'black' }}>
                                    #{func}{index < userProject.file_functions.length - 1 ? ' ' : ''}
                                </span>
                            ))
                        ) : (
                            ''
                        )}
                    </Card.Text>
                </Card.Body>
            </Card>
            <LoadingOverlay isLoading={isLoading} />
            {showNameModal && (
                <EditFileName
                    fileName={userProject.file_name}
                    setIsLoading={setIsLoading}
                    show={showNameModal}
                    onHide={() => setShowNameModal(false)}
                />
            )}
        </>
    );
}

const LoadingOverlay = ({ isLoading }) => {
    return isLoading ? (
        <div className="loading-overlay">
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>
    ) : null;
};

export default ProjectBlock;

// <img src={imageUrl} alt="PDF Icon" />
// <p>File Name: {project.file_name}</p>
//                                         <p>File Type: {project.file_type}</p>
//                                         <p>S3 File Link: {project.s3_file_link}</p>
//                                         <p>File Functions: {Array.isArray(project.file_functions) ? project.file_functions.join(', ') : ''}</p>
//                                         <p>Uploading Date: {project.uploading_date}</p>