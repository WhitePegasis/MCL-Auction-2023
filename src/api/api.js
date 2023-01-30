import axios from 'axios';

const baseURL = 'https://script.google.com/macros/s/AKfycbwPRSI1ciQYvptbmTbLDRC2t4DeUaBvReBFHbez9vHAssiLZ9WgOydiiNGZ5rWGsuio/exec';

export const getPlayers = async (type) => {

    return await axios.get(baseURL,{params: { requestType: type } });
}

export const editPlayer = async(val)=>{
    return await axios.post(baseURL,JSON.stringify(val),{params:{requestType: 'updatePlayer'}});
}

export const getTeams = async ()=>{
    return await axios.get(baseURL,{params: { requestType: 'teams'} });
}

export const editTeamPoints = async (val)=>{
    return await axios.post(baseURL,JSON.stringify(val),{params: { requestType: 'updateTeam'} });
}

export const editTeamPlayerList = async (teamName, val)=>{
    return await axios.post(baseURL,JSON.stringify(val),{params: { requestType: 'editTeamPlayerList', teamname: teamName} });
}

export const addLogs = async (val)=>{
    return await axios.post(baseURL,JSON.stringify(val),{params: { requestType: 'addLogs'} });
}