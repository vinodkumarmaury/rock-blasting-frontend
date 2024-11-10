import React from 'react';
import '../styles/InputGuide.css';

function InputGuide() {
    const parameters = [
        { name: "Rock Type", description: "Type of rock being blasted (e.g., Coal, Iron Ore, Granite)" },
        { name: "UCS (MPa)", description: "Uniaxial Compressive Strength of the rock in MPa" },
        { name: "Penetration Rate (m/min)", description: "Rate at which the drill penetrates the rock" },
        { name: "Hole Diameter (mm)", description: "Diameter of the blast hole" },
        { name: "Burden (m)", description: "Distance between adjacent blast holes" },
        { name: "Spacing (m)", description: "Distance between rows of blast holes" },
        { name: "Stemming Length (m)", description: "Length of the stemming material" },
        { name: "Groundwater Level (m)", description: "Depth of groundwater" },
        { name: "Explosive Weight (kg)", description: "Weight of explosive charge in kg" },
        // Add more parameters as needed
    ];

    return (
        <div className="guide-container">
            <h2>Input Parameter Guide</h2>
            <p>This page provides information about each input parameter required for the model:</p>
            <ul>
                {parameters.map((param) => (
                    <li key={param.name}>
                        <strong>{param.name}:</strong> {param.description}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default InputGuide;
