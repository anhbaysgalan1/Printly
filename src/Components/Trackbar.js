import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Grid from '@material-ui/core/Grid';
import '../App.css';

const styles = ({
  stepLabel: {
    height: '30px',
    width: '150px',
    paddingTop: '7px',
    borderRadius: '7px',
  },
  stepLabelPulse: {
    height: '30px',
    width: '150px',
    paddingTop: '7px',
    borderRadius: '7px',
    animation: 'stepLabelPulse 1s infinite',
  },
});

const theme = createMuiTheme({
  overrides: {
    MuiStepper: {
      root: {
        width: '100%',
        padding: '10px 10px 10px 10px',
        margin: '10px',
        border: '1px solid black',
        borderRadius: '10px',
      },
    },
    MuiStepIcon: {
      root: {
        '&$active': {
          color: '#04619f',
        },
        '&$completed': {
          color: '#04619f',
        },
      },
    },
    MuiSvgIcon: {
      root: {
        height: '40px',
        width: '40px',
      },
    },
    MuiTypography: {
      body1: {
        fontSize: '14px',
      }
    }
  },
});

const STEPS_PICKUP = [
  'Upload Document',
  'Choose Settings',
  'Connecting to Printer',
  'Printing Document',
  'Preparing for Pickup'
];

const STEPS_PICKUP_DONE = [
  'Document Uploaded', 
  'Settings Applied',
  'Connected with Printer', 
  'Document Printed', 
  'Ready for Pickup'
];

const STEPS_DELIV= [
  'Uploading Document',
  'Choose Settings',
  'Connecting to Printer',
  'Printing Document',
  'Document On the Way'
];

const STEPS_DELIV_DONE = [
  'Document Uploaded', 
  'Settings Applied',
  'Connected with Printer',
  'Document Printed', 
  'Document Delivered'
];

class Trackbar extends Component {
  state = {
    activeStep: this.props.activeStep,
    numSteps: (this.props.deliver ? STEPS_DELIV.length : STEPS_PICKUP.length),
    intervalID: 0
  };

  componentDidMount() {
    // hacky updater for demo
    if (this.state.activeStep >= 2) {
      let id = setInterval(() => {
        let newStep = this.state.activeStep + 1;
        this.setState({ activeStep: newStep });
  
        if (newStep === this.state.numSteps) {
          clearInterval(this.state.intervalID);
          this.props.updateJobStatus();
        }
      }, 3000);
  
      this.setState({ intervalID : id});
    }
  }

  render() {
    const { classes } = this.props;

    let steps = this.props.deliver ? STEPS_DELIV : STEPS_PICKUP;
    let stepsDone = this.props.deliver ? STEPS_DELIV_DONE : STEPS_PICKUP_DONE;

    return (
      <Grid container justify="center">
      <MuiThemeProvider theme={theme}>
          <Stepper activeStep={this.state.activeStep}>
            {steps.map((label, index) => {
              if (index < this.state.activeStep) {
                label = stepsDone[index];
              }

              let labelStyle =
                index === this.state.activeStep ? classes.stepLabelPulse : classes.stepLabel;

              return (
                <Step key={label}>
                  <StepLabel classes={{labelContainer: labelStyle}}>
                    {label}
                  </StepLabel>
                </Step>
              );
            })}
          </Stepper>
        </MuiThemeProvider>
      </Grid>
    );
  }
}

Trackbar.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(Trackbar);
