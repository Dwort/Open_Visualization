import React from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import {useState, useEffect} from "react";
import "../burger_menu_files/burger_menu_styles/UserProjects_CSS.css";
import {InputGroup} from "react-bootstrap";
import Cookies from "js-cookie";
import axios from "axios";
import Spinner from 'react-bootstrap/Spinner';


function AddUserFile(props) {
    const [currentFunctionIndex, setCurrentFunctionIndex] = useState(0);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const [fileFunctions, setFileFunctions] =useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const functions = [
        () => <FileChoosing selectedFile={selectedFile} setSelectedFile={setSelectedFile} />,
        () => <FileNameChange selectedFile={selectedFile} setFileName={setFileName} />,
        () => <VisualizationChoosing setFileFunctions={setFileFunctions} />
    ];

    const handleBackClick = () => {
        if (currentFunctionIndex > 0) {
            setCurrentFunctionIndex(currentFunctionIndex - 1);
        }
    };

    const handleNextClick = () => {
        if (currentFunctionIndex < functions.length - 1) {
            setCurrentFunctionIndex(currentFunctionIndex + 1);
        }
    };

    const fileUploading = async () => {
        const formData = new FormData();
        const token = Cookies.get('access_token');

        const parts = selectedFile.name.split('.');
        const extension = parts[parts.length - 1];

        formData.append("file", selectedFile, fileName ? (fileName + '.' + extension) : selectedFile.name);
        formData.append("fileType", selectedFile.type);
        formData.append("fileFunctions", JSON.stringify(fileFunctions));

        setIsLoading(true);

        await axios.post('http://127.0.0.1:8000/api/files/add/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                }
        }).then(() => {
            props.onHide();
            window.location.reload();
            alert(`Congratulation! File ${fileName ? fileName : selectedFile.name} was successfully added! \n
                   If you can't see it, just reload page.`);
        }).catch(error => {
            if (error.response) {
            // Сервер відповів зі статусом, який виходить за межі діапазону 2xx
                alert(`Error with file uploading: ${error.response.status}\n${JSON.stringify(error.response.data)}\nTry again or connect with Tech support!`);
            } else if (error.request) {
                // Запит був зроблений, але відповідь не отримана
                alert('No response received from server. Please try again or contact Tech support.');
            } else {
                // Щось сталось при налаштуванні запиту, що викликало помилку
                alert(`Error with file uploading: ${error.message}\nTry again or connect with Tech support!`);
            }
        });
    };

    return (
        <Modal
          {...props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          className="add-file-modal-container"
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                  Add new file
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {functions[currentFunctionIndex]()}
            </Modal.Body>

            <Modal.Footer className="add-modal-footer-block">
                <Button
                    onClick={handleBackClick}
                    disabled={currentFunctionIndex === 0}
                >
                    &lt; Back
                </Button>
                {currentFunctionIndex === 2 ? (
                    <Button
                        onClick={fileUploading}
                        disabled={fileFunctions.length === 0}
                    >
                        Upload File
                    </Button>
                ):(
                    <Button
                        onClick={handleNextClick}
                        disabled={selectedFile === null}
                    >
                        Next &gt;
                    </Button>
                )}
            </Modal.Footer>
            <LoadingOverlay isLoading={isLoading} />
        </Modal>
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

const RecommendationFileModel = ({show, handleClose}) => {
    return (
        <Modal
            show={show}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                  Add new file
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Here is an example and recommendation which type of file you can add, what structure, and other details.</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleClose}>Understood</Button>
            </Modal.Footer>
        </Modal>
    )
};

const FileChoosing = ({selectedFile, setSelectedFile}) => {
    const [show, setShow] = useState(false);
    const [fileTypeStatus, setFileTypeStatus] = useState('');

    const handleClose = () => setShow(false);
    const handleOpen = () => setShow(true);

    // Example of RegExp for uploading a correct file type: const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;

    const allowedExtensions = /(\.txt|\.xls|\.xlsx|\.pdf)$/i;
    const UserFilehandle = (event) => {
        const file = event.target.files[0];

        if (!allowedExtensions.exec(file.name)) {
            alert("Invalid file type. Choose correct file!\nYou can an upload only file with .pdf, .xls, .xlsx and .txt types!");
            setFileTypeStatus('invalid-file-type');
        } else if (file.name.length > 200 ) {
            alert("Your file name is too long.\nPlease rename it and make shorter! Max length 245 symbols.\n" +
                "File name including also file type!");
            setFileTypeStatus('invalid-file-type');
        } else {
            setSelectedFile(file);
            setFileTypeStatus('correct-file-type');
        }
    };

    return (
        <Form.Group controlId="formFile" className="add-file-form mb-3">
            <h4>Agreements:</h4>
            <p>
                You have reviewed the sample file and data that are permissible to upload, as well as the restrictions
                on prohibited data. You bear full responsibility for the files and data you upload to the service. By
                accepting this agreement, you acknowledge that the file data may be altered or lost, and you assume all
                associated risks. The service provider is not liable for any damage or loss resulting from your use of
                the service.
            </p>

            <h4>Recommendation to read:</h4>

            <p>Here is an example and a recommendation of what types of files you can add. What is the structure, etc.</p>

            <Button variant="link" onClick={handleOpen} className="recommendation-link-block">Click here.</Button>

            <Form.Label className="add-file-label">Choose your file below: </Form.Label>
            <Form.Control type="file" onChange={UserFilehandle} className= {`add-file-handler-container ${fileTypeStatus}`} />

             {selectedFile && (
                <Form.Group controlId="formFile" className="add-file-form mb-3">
                    <h5>Selected File: {selectedFile.name}</h5>
                </Form.Group>
            )}

            <RecommendationFileModel show={show} handleClose={handleClose} />
        </Form.Group>
    );
};

const FileNameChange = ({ selectedFile, setFileName }) => {
    const [changeName, setChangeName] = useState(false);
    const [newFileName, setNewFileName] = useState("");

    const handleNameChanging = () => {
        setChangeName(!changeName);
        if (changeName) {
            setNewFileName(""); // Очищаємо нове ім'я файлу, якщо користувач передумав змінювати ім'я
            setFileName(""); // Очищаємо значення у батьківському компоненті
        }
    };

    const handleFileNameInput = (event) => {
        const newName = event.target.value;

        if (newName.length > 200) {
            alert('Your new file name is too long!\nMax length of file name must be no more than 195 symbols!');
            return; // Виходимо з функції, якщо назва перевищує максимальну довжину
        }

        setNewFileName(newName);
    };

    useEffect(() => {
        if (changeName) {
            setFileName(newFileName);
        } else {
            setFileName(''); // Clear the fileName in the parent component if the checkbox is unchecked
        }
    }, [newFileName, changeName, setFileName]);


    return (
        <Form.Group controlId="formFile" className="add-file-form mb-3">
            <h4>Warning:</h4>
            <p>
                You are responsible for any modifications made to the file and its name, which may be used by the
                "Open Visualization" service and the company "PolyTex" as needed. All risks associated with the provided
                data and files are borne by you. However, the company guarantees the security and confidentiality of
                your uploaded files and data. Your files and data will not be distributed without your consent.
            </p>
            <div className="change-name-modal-container">
                <h4> Do you want to change filename? </h4>
                {selectedFile && <p>Current File: {selectedFile.name}</p>}
            </div>
            <Form.Check
                type="checkbox"
                id='changeFileNameCheck'
                label='Change file name'
                checked={changeName}
                onChange={handleNameChanging}
            />

            <InputGroup className="change-name-modal-input mb-3">
                <InputGroup.Text id="inputGroup-sizing-default">
                    New file name:
                </InputGroup.Text>
                <Form.Control
                    disabled={!changeName}
                    aria-label="Default"
                    aria-describedby="inputGroup-sizing-default"
                    value={newFileName}
                    onChange={handleFileNameInput}
                    placeholder="Enter new file name"
                />
            </InputGroup>
        </Form.Group>
    );
};

const VisualizationChoosing = ({setFileFunctions}) => {
    const [checkedFunctions, setCheckedFunctions] = useState({
        chart: false,
        map: false,
        statistics: false,
        prediction: false
    });

    const handleCheckboxChange = (event) => {
        const { id, checked } = event.target;
        setCheckedFunctions({
            ...checkedFunctions,
            [id]: checked
        });

        if (checked) {
            // Add function if checkbox is checked
            setFileFunctions(prevFunctions => [...prevFunctions, id]);
        } else {
            // Remove function if checkbox is unchecked
            setFileFunctions(prevFunctions => prevFunctions.filter(func => func !== id));
        }
    };

    return (
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
                You can change function after adding your file. You can add new function from list or cancel function
                from list. Also you can delete file from your account.
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
    );
};

export default AddUserFile;