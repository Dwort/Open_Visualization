import axios from "axios";
import Cookies from "js-cookie";


const getUserToken = async () => {
    let access_token = Cookies.get('access_token');

    if (!access_token) {
        const refresh_token = Cookies.get('refresh_token');
        if (!refresh_token) {
            throw new Error('No refresh token found. Please log in.');
        }

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {
                refresh: refresh_token
            });
            access_token = response.data.access;
            Cookies.set('access_token', access_token, { expires: 5 / (24 * 60) });
        } catch (error) {
            Cookies.remove('refresh_token');
            throw new Error('Failed to refresh token. Please log in again.');
        }
    }

    return access_token;
}

export default getUserToken;