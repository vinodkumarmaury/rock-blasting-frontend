import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import axios from 'axios';
import './styles/App.css';
import './styles/Navbar.css';
import InputGuide from './components/InputGuide';
import Analysis from './components/Analysis';
import Home from './components/Home';
import RockData from './components/RockData.js';
import AuthPage from './components/Auth.js';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import Settings from './components/Settings';
import Profile from './components/Profile';
import Navbar from './components/Navbar';

function App() {
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
        explosive_weight: "",
        depth_of_hole: "", // New field
        stemming_material: "" // New field
    });
    const [result, setResult] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/predict`, formData);
            setResult(response.data.predictions);
        } catch (error) {
            console.error("Error fetching prediction:", error);
        }
    };

    return (
        <Router>
            <AppContent handleChange={handleChange} handleSubmit={handleSubmit} formData={formData} result={result} />
        </Router>
    );
}

function AppContent({ handleChange, handleSubmit, formData, result }) {
    const location = useLocation();

    return (
        <div>
            <Navbar />
            <div className="mainDiv">
                <div className="container">
                    <Routes>
                        <Route path="/prediction" element={
                            <>
                            <div className="predict">
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
                            </div>
                            </>
                        } />
                        <Route path="/input-guide" element={<InputGuide />} />
                        <Route path="/analysis" element={<Analysis />} />
                        <Route path="/rock-data" element={<RockData />} />
                        <Route path="/auth" element={<AuthPage />} />
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/" element={<Home />} />
                    </Routes>
                </div>
                {location.pathname === "/prediction" && (
                    <div className='blastImage'>
                        <img src="./blasting-software.png" width={500} height={500} alt="RockTech" />
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;