import React from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  MenuItem, 
  Button, 
  Card, 
  CardContent,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  CircularProgress,
  Alert,
  Collapse
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';

const regions = [
  { label: "US West (Oregon)", value: "us-west-2" },
  { label: "US East (Virginia)", value: "us-east-1" },
  { label: "Europe (Ireland)", value: "eu-west-1" },
  { label: "Asia Pacific (Singapore)", value: "ap-southeast-1" }
];



const frameworks = ['React', 'Vue', 'Angular', 'Next.js', 'Nuxt.js'];

const plans = [
  {
    name: 'Starter',
    storage: '10 GB',
    bandwidth: '10 GB',
    ram: '2 GB',
    cpu: '1 vCPU',
    monthly: '$20',
    hourly: '$0.03'
  },
  {
    name: 'Pro',
    storage: '50 GB',
    bandwidth: '50 GB',
    ram: '8 GB',
    cpu: '4 vCPU',
    monthly: '$80',
    hourly: '$0.12'
  }
];

const Step1 = ({ onSubmit, loading, error, onClearError }) => {
  const [org, setOrg] = React.useState('');
  const [repo, setRepo] = React.useState('');
  const [branch, setBranch] = React.useState('');
  const [appName, setAppName] = React.useState('');
  const [region, setRegion] = React.useState('');
  const [framework, setFramework] = React.useState('');
  const [plan, setPlan] = React.useState('starter');
  const [showDatabaseDialog, setShowDatabaseDialog] = React.useState(false);

const handleSubmit = () => {
  const userId = localStorage.getItem("user_id"); // 👈 Ensure user_id is stored at login or mock for now

  const appData = {
    user_id: 1, // 👈 use real ID
    name: appName,
    region,
    framework,
    plan_type: plan,
    repo_org: org,
    repo_name: repo,
    repo_branch: branch,
    owner: parseInt(userId), // ✅ Include owner ID for backend
    env_vars: [] // initialize with empty env vars for now
  };

  onSubmit(JSON.stringify(appData));
};


  const handleConnectDatabase = () => {
    setShowDatabaseDialog(true);
  };

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', mt: 2 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        Create New App
      </Typography>
      <Typography variant="body1" gutterBottom sx={{ color: 'text.secondary', mb: 3 }}>
        Connect your repository and fill in the requirements to see the app deployed in seconds.
      </Typography>

      <Collapse in={!!error}>
        <Alert 
          severity="error" 
          sx={{ mb: 3 }} 
          onClose={onClearError}
        >
          {error}
        </Alert>
      </Collapse>

      <Card sx={{ mb: 3, border: '1px solid #e1e4e8' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <GitHubIcon sx={{ mr: 1, color: 'text.primary' }} />
            <Typography variant="h6">GitHub Repository</Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          
          <TextField
            select
            label="Select Organization"
            value={org}
            onChange={(e) => setOrg(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
            size="small"
            disabled={loading}
          >
            {['Adlib Naden T', 'Auburnin Pagis', 'Orlhub'].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Select Repository"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
            size="small"
            disabled={loading}
          >
            {['Repo 1', 'Repo 2', 'Repo 3'].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Select Branch"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            fullWidth
            size="small"
            disabled={loading}
          >
            {['main', 'develop', 'feature'].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </CardContent>
      </Card>

      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        Fill in the details of your App
      </Typography>
      <Typography variant="body2" gutterBottom sx={{ color: 'text.secondary', mb: 3 }}>
        Clear two basic details of your application such as the name, request of deployment and the framework or link template for your application.
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2, mb: 3 }}>
        <TextField
          label="App Name"
          value={appName}
          onChange={(e) => setAppName(e.target.value)}
          size="small"
          disabled={loading}
        />
<TextField
  select
  label="Select Region"
  value={region}
  onChange={(e) => setRegion(e.target.value)}
  size="small"
  disabled={loading}
>
  {regions.map((option) => (
    <MenuItem key={option.value} value={option.value}>
      {option.label}
    </MenuItem>
  ))}
</TextField>


        <TextField
          select
          label="Select Template"
          value={framework}
          onChange={(e) => setFramework(e.target.value)}
          size="small"
          disabled={loading}
        >
          {frameworks.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 4 }}>
        Plan Type
      </Typography>
      <Typography variant="body2" gutterBottom sx={{ color: 'text.secondary', mb: 2 }}>
        Select the plan type that best suits your application model.
      </Typography>

      <RadioGroup 
        value={plan} 
        onChange={(e) => setPlan(e.target.value)} 
        sx={{ mb: 3 }}
      >
        <Box sx={{ display: 'flex', gap: 2 }}>
          {plans.map((p) => (
            <Card 
              key={p.name}
              sx={{ 
                flex: 1,
                border: plan === p.name.toLowerCase() ? '2px solid #1976d2' : '1px solid #e1e4e8',
                cursor: loading ? 'default' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
              onClick={loading ? undefined : () => setPlan(p.name.toLowerCase())}
            >
              <CardContent>
                <FormControlLabel
                  value={p.name.toLowerCase()}
                  control={<Radio disabled={loading} />}
                  label={
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {p.name}
                    </Typography>
                  }
                  sx={{ width: '100%' }}
                />
                <Box sx={{ pl: 4 }}>
                  <Typography variant="body2">Storage: {p.storage}</Typography>
                  <Typography variant="body2">Bandwidth: {p.bandwidth}</Typography>
                  <Typography variant="body2">Memory: {p.ram}</Typography>
                  <Typography variant="body2">CPU: {p.cpu}</Typography>
                  <Typography variant="body2" sx={{ mt: 1, fontWeight: 500 }}>
                    {p.monthly}/month
                  </Typography>
                  {p.name === 'Starter' && (
                    <Typography variant="caption" color="text.secondary">
                      Used for personal blogs and small websites
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </RadioGroup>

      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        Database Selection
      </Typography>
      <Typography variant="body2" gutterBottom sx={{ color: 'text.secondary', mb: 2 }}>
        Please be informed that the proper functioning of our application requires database connections.
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button 
          variant="contained" 
          onClick={handleConnectDatabase}
          disabled={loading}
          sx={{ 
            backgroundColor: '#1976d2',
            '&:hover': { backgroundColor: '#1565c0' }
          }}
        >
          Connect Database
        </Button>
        <Button 
          variant="outlined"
          disabled={loading}
        >
          Maybe Later
        </Button>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          variant="contained" 
          onClick={handleSubmit}
          disabled={!appName || !region || !framework || loading}
          sx={{ 
            backgroundColor: '#1976d2',
            '&:hover': { backgroundColor: '#1565c0' },
            '&:disabled': { backgroundColor: '#e9ecef' },
            minWidth: 200
          }}
          endIcon={loading ? <CircularProgress size={24} color="inherit" /> : null}
        >
          {loading ? 'Creating App...' : 'Set Up Env Variables'}
        </Button>
      </Box>

      {/* Database Connection Dialog - Would be implemented as a separate component */}
      {/* {showDatabaseDialog && (
        <DatabaseDialog 
          open={showDatabaseDialog}
          onClose={() => setShowDatabaseDialog(false)}
        />
      )} */}
    </Box>
  );
};

export default Step1;