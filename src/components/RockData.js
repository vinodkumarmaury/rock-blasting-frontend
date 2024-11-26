// RockData.js
import React, { useState } from 'react';
import axios from 'axios';
import '../styles/RockData.css';
function RockData() {
    const [rockId, setRockId] = useState('');
    const [data, setData] = useState(null);

    const fetchData = async () => {
        try {
            const response = await axios.get(`https://rock-blasting-backend.onrender.com/data/${rockId}`);
            setData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            if (error.response && error.response.status === 404) {
                alert('Data not found for the provided ID.');
            } else {
                alert('An error occurred while fetching data.');
            }
        }
    };

    return (
        <div>
            <h2>Get Rock Data by ID</h2>
            <input
                type="text"
                value={rockId}
                onChange={(e) => setRockId(e.target.value)}
                placeholder="Enter Rock ID"
            />
            <button onClick={fetchData}>Fetch Data</button>
            {data && (
                <div>
                    <h3>Data for ID: {rockId}</h3>
                    <ul>
                        {Object.entries(data).map(([key, value]) => (
                            <li key={key}>
                                <strong>{key}:</strong> {value}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default RockData;