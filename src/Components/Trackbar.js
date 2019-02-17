import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
  
const STEPS = [
  'Document Uploaded', 
  'Job Accepted', 
  'Document Printed', 
  'Ready for Pickup'
];

function getStatusMsg(step) {
  switch (step) {
    case 1:
      return 'Waiting for printer to accept job...';
    case 2:
      return 'Waiting for documents to print...';
    case 3:
      return 'Almost there...';
    case 4:
      return 'Job finished!'
    default:
      return 'Oh no, something broke :(';
  }
}

class Trackbar extends Component {
  state = {
    activeStep: 1,
    intervalID: 0
  };

  componentDidMount() {
    let id = setInterval(() => {
      let newStep = this.state.activeStep + 1;
      this.setState({ activeStep: newStep });

      if (newStep === STEPS.length) {
        clearInterval(this.state.intervalID);
      }
    }, 2000);

    this.setState({ intervalID : id});
  }

  render() {
    return (
      <div>
        <Typography>
          {getStatusMsg(this.state.activeStep)}
        </Typography>
        {
          this.state.activeStep >= STEPS.length ?
          <LinearProgress style={{visibility : 'hidden'}}/>:
          <LinearProgress/>
        }
        <Stepper activeStep={this.state.activeStep}>
          {STEPS.map((label) => {
            const props = {};
            const labelProps = {};
            return (
              <Step key={label} {...props}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </div>
    );
  }
}

Trackbar.propTypes = {
  classes: PropTypes.object,
};

export default Trackbar;
