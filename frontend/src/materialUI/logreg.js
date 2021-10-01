import * as React from 'react';
import './drawer.css';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';

const LogReg = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        '& > *': {
          m: 1,
        },
      }}
    >
      <ButtonGroup variant="text" aria-label="text button group">
        <Link to="/login"><Button style={{color: "white"}}>Login</Button></Link>
        <Link to="/authenticate"><Button style={{color: "white"}}>Register</Button></Link>
      </ButtonGroup>
    </Box>
  );
}

export default LogReg;