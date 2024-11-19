import React, { useState, useEffect } from 'react';
import { getPlayers } from '../api/api';

const AllPlayers = () => {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    getAllPlayers();
  }, []);

  // Getting all players' details from the sheet
  const getAllPlayers = async () => {
    await getPlayers("players").then((response) => {
      setPlayers(response.data.data);
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border-separate border-spacing-0">
        <thead className="bg-black text-white">
          <tr>
            <th className="px-4 py-2 text-lg">Id</th>
            <th className="px-4 py-2 text-lg">Name</th>
            <th className="px-4 py-2 text-lg">Department</th>
            <th className="px-4 py-2 text-lg">Year</th>
            <th className="px-4 py-2 text-lg">Speciality</th>
            <th className="px-4 py-2 text-lg">WK</th>
            <th className="px-4 py-2 text-lg">Sold To</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr key={player.id} className="hover:bg-gray-100">
              <td className="px-4 py-2 text-lg">{player.id}</td>
              <td className="px-4 py-2 text-lg">{player.name}</td>
              <td className="px-4 py-2 text-lg">{player.dept}</td>
              <td className="px-4 py-2 text-lg">{player.year}</td>
              <td className="px-4 py-2 text-lg">{player.speciality}</td>
              <td className="px-4 py-2 text-lg">{player.wk}</td>
              <td className="px-4 py-2 text-lg">{player.soldto}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllPlayers;
