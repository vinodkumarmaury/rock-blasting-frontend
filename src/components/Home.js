// Home.js
import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";
import img from "../components/assets/images/rock-blasting.jpg";

function Home() {
  return (
    <div className="home-container">
      <h1>Welcome to Rock Mass Blasting Prediction Tool</h1>
      <p>
        This tool provides predictive insights into rock mass blasting
        parameters like fragmentation size, vibration levels, powder factor, and
        noise level.
      </p>
      <img
        src={img}
        alt="Blasting"
      />
      <Link to="/prediction">
      <button >Prediction</button>
      </Link>
      <Link to="/rock-data">
        <button>View Rock Data</button>
      </Link>
      <a
        href="https://en.wikipedia.org/wiki/Drilling_and_blasting"
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none" }}
      >
        <button>Learn More</button>
      </a>
      
    </div>
  );
}

export default Home;
