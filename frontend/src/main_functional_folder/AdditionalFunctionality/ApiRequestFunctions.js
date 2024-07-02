import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../AdditionalFunctionality/AdditionalFunctionality_styles/ProjectBlock_style.css";
import axios from "axios";
import Cookies from "js-cookie";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {InputGroup} from "react-bootstrap";
import Form from "react-bootstrap/Form";
// import fileDownload from 'js-file-download';


export const apiRequestFunctions = () => {

    const token = Cookies.get("access_token");
    const LimitChecking = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/premium/limit-checking/', {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            if (response.status === 200) {
                return false;
            }
        } catch (error) {
            if (error.response.status === 429) {
                return true;
            } else {
                console.error('Error with limit checking -> ', error);
                throw error;
            }
        }
    };

    const handleLimit = async (type, direction) => {

        await axios.post('http://127.0.0.1:8000/api/premium/limit-changing/', {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }).then(response => {
            if (response.status === 200) {
                window.location.href = `/${type}/${direction}`;
            }
        }).catch(error => {
            console.error("Error with handling limits -> ", error);
        });
    }

    const GetUserProjects = async () => {

        try {
            const response = await axios.get('http://127.0.0.1:8000/api/files/', {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            return response.data;
        } catch (error) {
            if (error.response.status === 404) {
                return [];
            } else {
                console.error('Error fetching user projects:', error);
                throw error;
            }
        }
    };

    return { LimitChecking, handleLimit, GetUserProjects };

}

export const EditFileMenu = () => {
    const token = Cookies.get("access_token");

    const DeleteUserFile = async (fileName, setIsLoading) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete ${fileName}?`);

        if (confirmDelete) {
            setIsLoading(true);
            try {
                const response = await axios.delete('http://127.0.0.1:8000/api/files/delete/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    data: {
                        fileName: fileName
                    }
                });
                if (response.status === 200) {
                    alert('The file was successfully deleted!')
                    window.location.reload();
                }
            } catch (error) {
                if (error.response.status === 404) {
                    alert(`Error -> There is no file in DB!\nThe file was not deleted!\n ${error.response.status}\nConnect 
                    with Tech support`);
                } else {
                    alert(`Error -> The file was not deleted!\n ${error.response.status} \nConnect with Tech support`);
                }
            }
        }
    };

    const EditFileName = ({fileId, fileName, setIsLoading, show, onHide}) => {

        const [newFileName, setNewFileName] = useState(fileName || "");

        const changeNameRequest = async () => {
            const parts = fileName.split('.');
            const extension = parts[parts.length - 1];
            setIsLoading(true);

            await axios.patch(`http://127.0.0.1:8000/api/files/edit-name/?file_id=${fileId}`, {
                newFileName: newFileName + '.' + extension,
            },{
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }).then(response => {
                if (response.status === 200) {
                    alert(`File name changed successfully!`);
                    window.location.reload();
                }
            }).catch(error => {
                let errorMessage = error.response.data.error || JSON.stringify(error.response.data);
                alert(`Something went wrong! :(\nError: ${errorMessage}\nStatus: ${error.response.status}`);
            })
        };

        const handleNewFileName = (event) => {
            setNewFileName(event.target.value);
        };

        return (
            <Modal
                show={show}
                onHide={onHide}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Edit file name
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>Warning:</h4>
                    <p>
                        You are responsible for any modifications made to the file and its name, which may be used by the
                        "Open Visualization" service and the company "PolyTex" as needed. All risks associated with the provided
                        data and files are borne by you. However, the company guarantees the security and confidentiality of
                        your uploaded files and data. Your files and data will not be distributed without your consent.
                    </p>
                    {/*<p>{fileName}</p>*/}
                     <InputGroup className="change-name-modal-input mb-3">
                        <InputGroup.Text id="inputGroup-sizing-default">
                            New file name:
                        </InputGroup.Text>
                        <Form.Control
                            aria-label="Default"
                            aria-describedby="inputGroup-sizing-default"
                            value={newFileName}
                            onChange={handleNewFileName}
                            placeholder="Enter new file name"
                        />
                    </InputGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={changeNameRequest}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    };
    
    const EditFileFunctions = ({fileId, fileFunctions, setIsLoading, show, onHide}) => {
        const allKeys = ['chart', 'map', 'statistics', 'prediction'];

        // Ініціалізація стану на основі fileFunctions
        const initialCheckedFunctions = allKeys.reduce((acc, key) => {
            acc[key] = fileFunctions.includes(key);
            return acc;
        }, {});

        const [checkedFunctions, setCheckedFunctions] = useState(initialCheckedFunctions);

        const handleCheckboxChange = (event) => {
            const { id, checked } = event.target;
            setCheckedFunctions({
                ...checkedFunctions,
                [id]: checked
            });
        };

        const changeFunctionsRequest = async () => {
            const newFunctions = Object.keys(checkedFunctions).filter(key => checkedFunctions[key]);
            setIsLoading(true);

            await axios.patch(`http://127.0.0.1:8000/api/files/edit-functions/?file_id=${fileId}`, {
                functions: newFunctions,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }).then(response => {
                if (response.status === 200) {
                    alert('File functions changed successfully!');
                    window.location.reload();
                }
            }).catch(error => {
                let errorMessage = 'An error occurred';
                if (error.response) {
                    // Отримуємо дані помилки з відповіді сервера
                    errorMessage = error.response.data.error || JSON.stringify(error.response.data);
                } else if (error.request) {
                    // Запит був зроблений, але відповідь не отримана
                    errorMessage = 'No response received from server';
                } else {
                    // Щось пішло не так при налаштуванні запиту
                    errorMessage = error.message;
                }
                alert(`Something went wrong! :(\nError: ${errorMessage}\nStatus: ${error.response.status}`);
            })
        };

        return (
            <Modal
                show={show}
                onHide={onHide}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Edit file functions
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="formFile" className="add-file-form mb-3">
                        <h4>Informing:</h4>
                        <p>
                            You have the option to choose one or more functionalities for visualizing and working with your data:
                            charts, maps, statistics, and data forecasting. It is mandatory to select at least one functionality.
                            <br/>
                            - Charts visualize your data in a graphical format;
                            <br/>
                            - Interactive maps present your data on a map;
                            <br/>
                            - Statistics display your data in a statistical table.
                            <br/>
                            - Data forecasting predicts likely future values based on your
                            provided data.
                            <br/>
                            Please make your selections carefully to ensure optimal use of the "Open Visualization"
                            service. We wish you a productive experience with our service.
                        </p>
                        <h4>Addition:</h4>
                        <p>
                            You can change function when you want.
                        </p>
                        <h6>Select the functionality you will work with: </h6>
                        <Form.Group controlId="formFile" className="add-function-checkbox-container mb-3">
                            <Form.Check
                                type="checkbox"
                                id='chart'
                                label='Charts'
                                checked={checkedFunctions.chart}
                                onChange={handleCheckboxChange}
                                className="add-file-custom-checkbox chart-checkbox"
                            />
                            <Form.Check
                                type="checkbox"
                                id='map'
                                label='Maps'
                                checked={checkedFunctions.map}
                                onChange={handleCheckboxChange}
                                className="add-file-custom-checkbox map-checkbox"
                            />
                            <Form.Check
                                type="checkbox"
                                id='statistics'
                                label='Statistics'
                                checked={checkedFunctions.statistics}
                                onChange={handleCheckboxChange}
                                className="add-file-custom-checkbox statistics-checkbox"
                            />
                            <Form.Check
                                type="checkbox"
                                id='prediction'
                                label='Data Prediction'
                                checked={checkedFunctions.prediction}
                                onChange={handleCheckboxChange}
                                className="add-file-custom-checkbox prediction-checkbox"
                            />
                        </Form.Group>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={changeFunctionsRequest}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    };

    const DownloadFileRequest = async (fileId, fileName) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/files/download/?file_id=${fileId}`);

             if (response.status === 200) {
                 const url = response.data.url;
                 const fileResponse = await axios.get(url, {
                     responseType: 'blob',  // Get answer as Blob
                 });

                 const downloadUrl = window.URL.createObjectURL(new Blob([fileResponse.data]));
                 const link = document.createElement('a');

                 link.href = downloadUrl;
                 link.setAttribute('download', fileName);  // Add file name to attribute
                 document.body.appendChild(link);
                 link.click();
                 link.remove();
                 window.URL.revokeObjectURL(downloadUrl);  // URL cleaning

                 alert('Thank you for using our service! :)');
             }

        } catch (error) {
            let errorMessage = 'An error occurred';
            let statusCode = 'Unknown';

            if (error.response) {
                // Error from server with response
                errorMessage = error.response.data.error || JSON.stringify(error.response.data);
                statusCode = error.response.status;
            } else if (error.request) {
                // The request is made, but no response is received
                errorMessage = 'No response received from server';
            } else {
                // Something went wrong while setting up the query
                errorMessage = error.message;
            }

            alert(`Something went wrong! :(\nError: ${errorMessage}\nStatus: ${statusCode}`);
        }
    };

    return { DeleteUserFile, EditFileName, EditFileFunctions, DownloadFileRequest };
}
