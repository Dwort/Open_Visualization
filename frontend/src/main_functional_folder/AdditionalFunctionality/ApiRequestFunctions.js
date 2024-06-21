import React from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "../burger_menu_files/burger_menu_styles/UserProjects_CSS.css";


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

    const EditFileName = ({fileName, setIsLoading, show, onHide}) => {

        console.log('In func');
        console.log(`Name: ${fileName}`)
        const changeNameRequest = async () => {
            // Ваша логіка для зміни імені файлу
        };

        return (
            <Modal
                show={show}
                onHide={onHide}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                className="add-file-modal-container"
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
                    <p>{fileName}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={changeNameRequest}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    };

    return { DeleteUserFile, EditFileName };
}

// export default { apiRequestFunctions, EditFileMenu };