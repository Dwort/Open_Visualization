import axios from "axios";
import Cookies from "js-cookie";


const LimitProcessing = () => {
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

         // Change path and path name to correct in axios.get request.

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

export default LimitProcessing;