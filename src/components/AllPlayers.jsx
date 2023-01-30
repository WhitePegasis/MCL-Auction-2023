import React from 'react';
import { useState, useEffect } from 'react';
import { Table, TableHead, TableCell,  TableRow, TableBody, styled } from '@mui/material'
import { getPlayers } from '../api/api';

const StyledTable = styled(Table)`
    width: 90%;
    margin: 50px 0 0 50px;
`;

const THead = styled(TableRow)`
    & > th {
        font-size: 20px;
        background: #000000;
        color: #FFFFFF;
    }
`;

const TRow = styled(TableRow)`
    & > td{
        font-size: 18px
    }
`;

const AllPlayers = () => {
    const [players, setPlayers] = useState([]);
    
    useEffect(() => {
        getAllPlayers();
    }, []);

    //getting all players detail from the sheet
    const getAllPlayers = async () => {

        await getPlayers("players").then((response)=>{
            setPlayers(response.data.data);
        });

    }

    return (
        <StyledTable>
            <TableHead>
                <THead>
                    <TableCell>Id</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Year</TableCell>
                    <TableCell>Speciality</TableCell>
                    <TableCell>WK</TableCell>              
                    <TableCell>Sold To</TableCell>
                </THead>
            </TableHead>
            <TableBody>
                {players.map((player) => (
                    <TRow key={player.id}>
                        <TableCell>{player.id}</TableCell> {/* change it to user.id to use JSON Server */}
                        <TableCell>{player.name}</TableCell>
                        <TableCell>{player.dept}</TableCell>
                        <TableCell>{player.year}</TableCell>
                        <TableCell>{player.speciality}</TableCell>
                        <TableCell>{player.wk}</TableCell>
                        {/* <TableCell>{player.registered}</TableCell> */}
                        <TableCell>{player.soldto}</TableCell>
                        {/* <TableCell><a href={player.paymentProof} target="_blank">
                                        <button>View</button>
                                    </a>
                        </TableCell> */}
                    </TRow>
                ))}
            </TableBody>
        </StyledTable>
    )
}

export default AllPlayers;