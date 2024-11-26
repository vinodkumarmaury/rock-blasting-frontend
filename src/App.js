// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import axios from 'axios';
import './styles/App.css';
import './styles/Navbar.css';
import InputGuide from './components/InputGuide';
import Analysis from './components/Analysis';
import Home from './components/Home';
import RockData from './components/RockData.js';

function App() {
    // Initial form data and result state
    const [formData, setFormData] = useState({
        id: "",
        rock_type: "",
        rock_density: "",
        ucs: "",
        elastic_modulus: "",
        fracture_frequency: "",
        hole_diameter: "",
        charge_length: "",
        stemming_length: "",
        blast_pattern_spacing: "",
        delay_timing: "",
        powder_factor: "",
        groundwater_level: "",
        penetration_rate: "",
        bench_height: "",
        burden: "",
        spacing: "",
        explosive_weight: ""
    });
    const [result, setResult] = useState(null);

    // Handle form input change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submit for prediction
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("https://rock-blasting-backend.onrender.com/predict", formData);
            setResult(response.data.predictions);
        } catch (error) {
            console.error("Error fetching prediction:", error);
        }
    };

    return (
        <Router>
            <nav className="navbar">
                <Link to="/">Home</Link>
                <Link to="/input-guide">Input Guide</Link>
                <Link to="/analysis">Analysis</Link>
                <Link to="/prediction">Prediction</Link>
                <Link to="/rock-data">Rock Data</Link>
            </nav>
            <div className="container">
                <Routes>
                    <Route
                        path="/prediction"
                        element={
                            <>
                                <h2>Rock Blasting Prediction</h2>
                                <form onSubmit={handleSubmit} className="form">
                                    {Object.keys(formData).map((key) => (
                                        <div key={key} className="form-group">
                                            <label>{key.replace(/_/g, " ").toUpperCase()}:</label>
                                            <input
                                                type="text"
                                                name={key}
                                                value={formData[key]}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    ))}
                                    <button type="submit" className="btn">Predict</button>
                                </form>
                                {result && (
                                    <div className="result">
                                        <h3>Prediction Results:</h3>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Target</th>
                                                    <th>Value</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Object.keys(result).map((target) => (
                                                    <tr key={target}>
                                                        <td>{target}</td>
                                                        <td>{result[target].toFixed(2)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </>
                        }
                    />
                    <Route path="/input-guide" element={<InputGuide />} />
                    <Route path="/analysis" element={<Analysis />} />
                    <Route path="/rock-data" element={<RockData />} />
                    <Route path="/" element={<Home />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;