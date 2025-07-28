import React, { useState } from 'react';
import Step1 from './Step1';
import Step2 from './Step2';
import { createWebApp, deployApp } from '../../api';

const CreateApp = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleStep1Submit = async (data) => {
    setLoading(true);
    try {
      const response = await createWebApp(data);
      setFormData({ ...formData, ...response.data });
      setStep(2);
    } catch (err) {
      setError(err.response?.data || 'Failed to create app');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (envData) => {
    setLoading(true);
    try {
      const deploymentData = {
        webapp_id: formData.id,
        aws_access_key: 'YOUR_AWS_ACCESS_KEY', // In production, get this securely
        aws_secret_key: 'YOUR_AWS_SECRET_KEY'  // In production, get this securely
      };
      const response = await deployApp(deploymentData);
      alert('Deployment started successfully!');
      console.log('Deployment response:', response.data);
    } catch (err) {
      setError(err.response?.data || 'Failed to deploy app');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading-indicator">Loading...</div>}
      {step === 1 && <Step1 onSubmit={handleStep1Submit} loading={loading} />}
      {step === 2 && (
        <Step2 
          onSubmit={handleSubmit} 
          onBack={() => setStep(1)} 
          loading={loading}
          appId={formData.id}
        />
      )}
    </div>
  );
};

export default CreateApp;