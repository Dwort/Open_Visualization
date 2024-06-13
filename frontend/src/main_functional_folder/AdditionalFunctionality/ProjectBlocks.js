import React from "react";
import Card from "react-bootstrap/Card";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AdditionalFunctionality_styles/ProjectBlock_style.css";


const imgDict = {
    "text/plain": 'https://open-visualization-s3-storage.s3.us-east-2.amazonaws.com/ProjectFiles/txt-file.png',
    "application/pdf": 'https://open-visualization-s3-storage.s3.us-east-2.amazonaws.com/ProjectFiles/pdf.png',
    "application/vnd.ms-excel": 'https://open-visualization-s3-storage.s3.us-east-2.amazonaws.com/ProjectFiles/xls.png',
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": 'https://open-visualization-s3-storage.s3.us-east-2.amazonaws.com/ProjectFiles/xlsx.png',
}
const editDots = 'https://open-visualization-s3-storage.s3.us-east-2.amazonaws.com/ProjectFiles/dots.png'

const ProjectBlock = ({userProject, onHandleFunctionClick, onHandleEditClick}) => {

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

    return (
        <Card
            className="card-projects-container"
            style={getBorderColorStyles()}
            onClick={onHandleFunctionClick}
        >
            <Card.Img variant="top" src={imgDict[userProject.file_type]} className="card-img-block"/>
            <Card.Body className="card-body-container">
                <div className="edit-dots-block">
                    {/*<button className="edit-file-button">*/}
                        <img
                            alt="edit-dots"
                            src={editDots}
                            className="edit-dots-img"
                            onClick={(e) => {
                                e.stopPropagation(); // Запобігає спрацюванню onClick на картці
                                onHandleEditClick();
                            }}
                        />
                    {/*</button>*/}
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
    );
}

export default ProjectBlock;

// <img src={imageUrl} alt="PDF Icon" />
// <p>File Name: {project.file_name}</p>
//                                         <p>File Type: {project.file_type}</p>
//                                         <p>S3 File Link: {project.s3_file_link}</p>
//                                         <p>File Functions: {Array.isArray(project.file_functions) ? project.file_functions.join(', ') : ''}</p>
//                                         <p>Uploading Date: {project.uploading_date}</p>kkk