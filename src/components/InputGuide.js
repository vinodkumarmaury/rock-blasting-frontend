import React from 'react';
import '../styles/InputGuide.css';

function InputGuide() {
    const parameters = [
        { 
            name: "Rock Type", 
            description: "Type of rock being blasted (e.g., Coal, Iron Ore, Granite, etc.)",
            inputType: "Text or dropdown selection (choose from predefined rock types)" 
        },
        { 
            name: "UCS (MPa)", 
            description: "Uniaxial Compressive Strength of the rock, measured in MPa.",
            inputType: "Numeric value (e.g., 50, 120, 200)" 
        },
        { 
            name: "Penetration Rate (m/min)", 
            description: "Rate at which the drill penetrates the rock, measured in meters per minute.",
            inputType: "Numeric value (e.g., 0.5, 1.2, 1.8)" 
        },
        { 
            name: "Hole Diameter (mm)", 
            description: "Diameter of the blast hole, measured in millimeters.",
            inputType: "Numeric value (e.g., 200, 250, 311)" 
        },
        { 
            name: "Burden (m)", 
            description: "Distance between adjacent blast holes, measured in meters.",
            inputType: "Numeric value (e.g., 3.0, 3.5, 4.0)" 
        },
        { 
            name: "Spacing (m)", 
            description: "Distance between rows of blast holes, measured in meters.",
            inputType: "Numeric value (e.g., 4.0, 4.5, 5.0)" 
        },
        { 
            name: "Stemming Length (m)", 
            description: "Length of the stemming material used to confine the explosive energy.",
            inputType: "Numeric value (e.g., 2.5, 3.0, 3.5)" 
        },
        { 
            name: "Groundwater Level (m)", 
            description: "Depth of the groundwater level below the surface, measured in meters.",
            inputType: "Numeric value (e.g., 1.5, 2.0, 3.0)" 
        },
        { 
            name: "Explosive Weight (kg)", 
            description: "Weight of the explosive charge used, measured in kilograms.",
            inputType: "Numeric value (e.g., 100, 250, 500)" 
        }
        // Add more parameters as needed
    ];

    return (
        <div className="guide-container">
            <h2>Input Parameter Guide</h2>
            <p>This page provides information about each input parameter required for the model. Use this guide to understand the data you need to enter for accurate predictions:</p>
            <ul>
                {parameters.map((param) => (
                    <li key={param.name}>
                        <strong>{param.name}:</strong> {param.description} <br />
                        <em>Input Type:</em> {param.inputType}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default InputGuide;
