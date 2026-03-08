import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://job-tracker-omega-ten.vercel.app/api',
});

export default instance;
