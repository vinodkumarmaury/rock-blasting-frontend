import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [formData, setFormData] = useState({
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

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://127.0.0.1:8000/predict", formData);
            setResult(response.data.predictions);
        } catch (error) {
            console.error("Error fetching prediction:", error);
        }
    };

    return (
        <div className="container">
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
                            required
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
    );
}

export default App;
