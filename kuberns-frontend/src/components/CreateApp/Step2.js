import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableRow, 
  Checkbox, 
  IconButton,
  Divider,
  CircularProgress,
  Alert,
  Collapse,
  Card,
  CardContent
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { getDeploymentLogs } from '../../api';

const Step2 = ({ onSubmit, onBack, loading, appId }) => {
  const [port, setPort] = useState('3000');
  const [envVars, setEnvVars] = useState([
    { key: 'API_URL', value: 'https://api.example.com', enabled: true },
    { key: 'ENV', value: 'production', enabled: true },
  ]);
  const [deploymentStatus, setDeploymentStatus] = useState(null);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(null);

  const handleAddVar = () => {
    setEnvVars([...envVars, { key: '', value: '', enabled: true }]);
  };

  const handleDeleteVar = (index) => {
    const newVars = [...envVars];
    newVars.splice(index, 1);
    setEnvVars(newVars);
  };

  const handleVarChange = (index, field, value) => {
    const newVars = [...envVars];
    newVars[index][field] = value;
    setEnvVars(newVars);
  };

  const toggleVar = (index) => {
    const newVars = [...envVars];
    newVars[index].enabled = !newVars[index].enabled;
    setEnvVars(newVars);
  };

  const handleSubmit = async () => {
    setError(null);
    try {
      setDeploymentStatus('deploying');
      
      // Create properly structured payload
      const payload = {
        port: parseInt(port),
        env_vars: envVars
          .filter(v => v.enabled && v.key)
          .map(({key, value}) => ({key, value}))
      };
      
      await onSubmit(payload);
    } catch (err) {
      // Ensure error is a string
      setError(typeof err === 'object' ? err.message : String(err));
      setDeploymentStatus('failed');
    }
  };

  useEffect(() => {
    if (appId && deploymentStatus === 'deploying') {
      const interval = setInterval(async () => {
        try {
          const response = await getDeploymentLogs(appId);
          // Ensure logs are properly formatted
          const formattedLogs = Array.isArray(response.data) 
            ? response.data 
            : [response.data];
          setLogs(formattedLogs);
          
          if (formattedLogs.some(log => 
            log.message?.includes('success') || 
            log.message?.includes('active')
          )) {
            setDeploymentStatus('deployed');
            clearInterval(interval);
          }
        } catch (err) {
          console.error('Error fetching logs:', err);
        }
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [appId, deploymentStatus]);

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', mt: 2 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        Create New App
      </Typography>
      <Typography variant="body1" gutterBottom sx={{ color: 'text.secondary', mb: 3 }}>
        Connect your repository and it is in the requirements to see the app displayed in seconds.
      </Typography>

      <Collapse in={!!error}>
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      </Collapse>

      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        Port Configuration
      </Typography>
      <Typography variant="body2" gutterBottom sx={{ color: 'text.secondary', mb: 2 }}>
        You can choose a specific port for your application.
      </Typography>
      
      <TextField
        label="Port"
        value={port}
        onChange={(e) => setPort(e.target.value)}
        type="number"
        sx={{ mb: 3, width: 120 }}
        size="small"
        disabled={loading || deploymentStatus === 'deploying'}
      />

      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 4 }}>
        Configure Environment Variables
      </Typography>
      <Typography variant="body2" gutterBottom sx={{ color: 'text.secondary', mb: 2 }}>
        Message and customize environment variables for your application.
      </Typography>

      <Table sx={{ mb: 2, border: '1px solid #e1e4e8', borderRadius: '8px' }}>
        <TableBody>
          {envVars.map((env, index) => (
            <TableRow key={index}>
              <TableCell sx={{ width: 60 }}>
                <Checkbox
                  checked={env.enabled}
                  onChange={() => toggleVar(index)}
                  color="primary"
                  disabled={loading || deploymentStatus === 'deploying'}
                />
              </TableCell>
              <TableCell>
                <TextField
                  value={env.key}
                  onChange={(e) => handleVarChange(index, 'key', e.target.value)}
                  fullWidth
                  disabled={!env.enabled || loading || deploymentStatus === 'deploying'}
                  size="small"
                  placeholder="Key"
                />
              </TableCell>
              <TableCell>
                <TextField
                  value={env.value}
                  onChange={(e) => handleVarChange(index, 'value', e.target.value)}
                  fullWidth
                  disabled={!env.enabled || loading || deploymentStatus === 'deploying'}
                  size="small"
                  placeholder="Value"
                />
              </TableCell>
              <TableCell sx={{ width: 60 }}>
                <IconButton 
                  onClick={() => handleDeleteVar(index)}
                  size="small"
                  disabled={loading || deploymentStatus === 'deploying'}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Button 
        startIcon={<AddIcon />} 
        onClick={handleAddVar}
        sx={{ mb: 3, color: '#1976d2' }}
        disabled={loading || deploymentStatus === 'deploying'}
      >
        Add Now
      </Button>

      {deploymentStatus === 'deploying' && (
        <Card sx={{ mb: 3, borderLeft: '4px solid #1976d2' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Deployment in Progress
              <CircularProgress size={20} sx={{ ml: 2 }} />
            </Typography>
            <Box sx={{ 
              maxHeight: 200, 
              overflow: 'auto', 
              bgcolor: '#f8f9fa', 
              p: 2, 
              borderRadius: 1 
            }}>
              {logs.length > 0 ? (
                logs.map((log, index) => (
                  <Typography 
                    key={index} 
                    variant="body2" 
                    component="div"
                    sx={{ 
                      fontFamily: 'monospace',
                      mb: index < logs.length - 1 ? 1 : 0
                    }}
                  >
                    <span style={{ color: '#6c757d' }}>
                      {new Date(log.created_at).toLocaleTimeString()}:
                    </span> {log.message}
                  </Typography>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Waiting for deployment logs...
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>
      )}

      {deploymentStatus === 'deployed' && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Deployment completed successfully! Your application is now live.
        </Alert>
      )}

      <Divider sx={{ my: 3 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button 
          variant="outlined" 
          onClick={onBack}
          sx={{ borderColor: '#ced4da' }}
          disabled={loading || deploymentStatus === 'deploying'}
        >
          Back
        </Button>
        <Button 
          variant="contained" 
          onClick={handleSubmit}
          sx={{ 
            backgroundColor: '#1976d2',
            '&:hover': { backgroundColor: '#1565c0' },
            minWidth: 150
          }}
          disabled={loading || deploymentStatus === 'deploying'}
          endIcon={
            (loading || deploymentStatus === 'deploying') ? (
              <CircularProgress size={24} color="inherit" />
            ) : null
          }
        >
          {deploymentStatus === 'deploying' ? 'Deploying...' : 'Finish my Setup'}
        </Button>
      </Box>
    </Box>
  );
};

export default Step2;