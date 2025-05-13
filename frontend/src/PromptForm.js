import React, { useState } from 'react';
import axios from 'axios';

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


const PromptForm = () => {
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('');
  const [response, setResponse] = useState('');

  const handleModelSelect = (e) => {
    setModel(e.target.value)
  }
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:8000/api/prompter/', {
        prompt: prompt,
        model: model,
      });

      setResponse(JSON.stringify(res.data, null, 1));
    } catch (err) {
      console.error('Error:', err);
      setResponse('Error sending prompt');
    }
  };

  return (
    <div>
      <Box sx={{ maxWidth: 200 }}>
        <FormControl fullWidth>
        <InputLabel id="model-select-label">Model</InputLabel>
        <Select
          labelId="model-select-label"
          id="model-select"
          value={model}
          label="Model"
          onChange={handleModelSelect}
        >
          <MenuItem value={0}>Model 1</MenuItem>
          <MenuItem value={1}>Model 2</MenuItem>
        </Select>
      </FormControl>
    </Box>

      <form onSubmit={handleSubmit}>
        <textarea
          rows="1"
          cols="50"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a prompt"
          required
        ></textarea>
        <button type="submit">send</button>
      </form>
      {response && <p>Response: {response}</p>}
    </div>
  );
};

export default PromptForm;
