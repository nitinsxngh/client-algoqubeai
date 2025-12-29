'use client';

import React from 'react';
import { Box, Stepper, Step, StepLabel, Typography } from '@mui/material';

interface StepProgressProps {
  activeStep: number;
  steps: string[];
}

const StepProgress: React.FC<StepProgressProps> = ({ activeStep, steps }) => {
  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel
              sx={{
                '& .MuiStepLabel-label': {
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: index <= activeStep ? 'primary.main' : 'text.secondary',
                },
                '& .MuiStepIcon-root': {
                  color: index < activeStep ? 'primary.main' : 'grey.300',
                  '&.Mui-active': {
                    color: 'primary.main',
                  },
                  '&.Mui-completed': {
                    color: 'primary.main',
                  },
                },
              }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default StepProgress;
