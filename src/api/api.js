import axios from 'axios';
import axiosRetry from 'axios-retry';

const baseURL = 'https://script.google.com/macros/s/AKfycbwPRSI1ciQYvptbmTbLDRC2t4DeUaBvReBFHbez9vHAssiLZ9WgOydiiNGZ5rWGsuio/exec';

// Configure axios-retry
axiosRetry(axios, {
    retries: 3, // Number of retry attempts
    retryDelay: (retryCount) => {
        console.warn(`Retry attempt: ${retryCount}`);
        return retryCount * 3000; // Time between retries in ms
    },
    retryCondition: (error) => {
        // Retry only if the request failed due to a network error or 5xx status codes
        return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.response?.status >= 500;
    },
});

// Helper to handle API errors
const handleApiError = (error) => {
    if (error.response) {
        console.error(`API Error: ${error.response.status} - ${error.response.data}`);
    } else if (error.request) {
        console.error('No response received:', error.request);
    } else {
        console.error('Error:', error.message);
    }
    throw error; // Rethrow the error to propagate it
};

// API functions
export const getPlayers = async (type) => {
    try {
        return await axios.get(baseURL, { params: { requestType: type } });
    } catch (error) {
        handleApiError(error);
    }
};

export const editPlayer = async (val) => {
    try {
        return await axios.post(baseURL, JSON.stringify(val), { params: { requestType: 'updatePlayer' } });
    } catch (error) {
        handleApiError(error);
    }
};

export const getTeams = async () => {
    try {
        return await axios.get(baseURL, { params: { requestType: 'teams' } });
    } catch (error) {
        handleApiError(error);
    }
};

export const editTeamPoints = async (val) => {
    try {
        return await axios.post(baseURL, JSON.stringify(val), { params: { requestType: 'updateTeam' } });
    } catch (error) {
        handleApiError(error);
    }
};

export const editTeamPlayerList = async (teamName, val) => {
    try {
        return await axios.post(baseURL, JSON.stringify(val), { params: { requestType: 'editTeamPlayerList', teamname: teamName } });
    } catch (error) {
        handleApiError(error);
    }
};

export const addLogs = async (val) => {
    try {
        return await axios.post(baseURL, JSON.stringify(val), { params: { requestType: 'addLogs' } });
    } catch (error) {
        handleApiError(error);
    }
};
