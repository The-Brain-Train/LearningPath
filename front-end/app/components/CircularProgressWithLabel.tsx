import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

type CircularProgressWithLabelProps = {
    value: number | undefined;
    size: number | undefined;
};

const CircularProgressWithLabel = (prop: CircularProgressWithLabelProps) => {
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress variant="determinate" value={prop.value} size={prop.size} />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="caption" component="div" color="white">
          {prop.value}%
        </Typography>
      </Box>
    </Box>
  );
};

export default CircularProgressWithLabel;
