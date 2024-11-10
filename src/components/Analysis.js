import React from 'react';
import '../styles/Analysis.css';
// Importing all images
import svrFragmentation from './assets/images/prediction_vs_actual_SVR_Fragmentation_Size (cm).png';
import xgboostFragmentation from './assets/images/prediction_vs_actual_XGBoost_Fragmentation_Size (cm).png';
import rfFragmentation from './assets/images/prediction_vs_actual_RandomForest_Fragmentation_Size (cm).png';

import svrVibration from './assets/images/prediction_vs_actual_SVR_Vibration_Level (dB).png';
import xgboostVibration from './assets/images/prediction_vs_actual_XGBoost_Vibration_Level (dB).png';
import rfVibration from './assets/images/prediction_vs_actual_RandomForest_Vibration_Level (dB).png';

import svrNoise from './assets/images/prediction_vs_actual_SVR_Noise_Level (dB).png';
import xgboostNoise from './assets/images/prediction_vs_actual_XGBoost_Noise_Level (dB).png';
import rfNoise from './assets/images/prediction_vs_actual_RandomForest_Noise_Level (dB).png';

import svrPowder from './assets/images/prediction_vs_actual_SVR_Powder_Factor.png';
import xgboostPowder from './assets/images/prediction_vs_actual_XGBoost_Powder_Factor.png';
import rfPowder from './assets/images/prediction_vs_actual_RandomForest_Powder_Factor.png';

// Create an array of all model and target images
const modelImages = [
  { model: 'SVR', target: 'Fragmentation Size', image: svrFragmentation },
  { model: 'XGBoost', target: 'Fragmentation Size', image: xgboostFragmentation },
  { model: 'RandomForest', target: 'Fragmentation Size', image: rfFragmentation },

  { model: 'SVR', target: 'Vibration Level', image: svrVibration },
  { model: 'XGBoost', target: 'Vibration Level', image: xgboostVibration },
  { model: 'RandomForest', target: 'Vibration Level', image: rfVibration },

  { model: 'SVR', target: 'Noise Level', image: svrNoise },
  { model: 'XGBoost', target: 'Noise Level', image: xgboostNoise },
  { model: 'RandomForest', target: 'Noise Level', image: rfNoise },

  { model: 'SVR', target: 'Powder Factor', image: svrPowder },
  { model: 'XGBoost', target: 'Powder Factor', image: xgboostPowder },
  { model: 'RandomForest', target: 'Powder Factor', image: rfPowder },
];

const Analysis = () => {
  return (
    <div>
      <h1>Model Analysis - Prediction vs Actual</h1>
      {modelImages.map((modelData, index) => (
        <div key={index}>
          <h2>{modelData.model} Model - {modelData.target}</h2>
          <img
            src={modelData.image}
            alt={`${modelData.model} ${modelData.target} Prediction vs Actual`}
            width="500"
            height="300"
          />
        </div>
      ))}
    </div>
  );
}

export default Analysis;
