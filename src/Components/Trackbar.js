import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles'
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import { StepConnector } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import '../App.css';

const styles = theme => ({
  stepBar: {
    width: '70%',
  },
  stepIcon: {
    transform: 'scale(1.5)',
  },
  stepLabel: {
    paddingRight: '4px',
    height: '20px',
    borderRadius: '7px',
  },
  stepLabelPulse: {
    paddingRight: '4px',
    height: '20px',
    borderRadius: '7px',
    animation: 'stepLabelPulse 1s infinite',
  },
  stepConnector: {
    marginRight: '10px',
  },
});

const STEPS = [
  'Document Uploaded', 
  'Job Accepted', 
  'Document Printed', 
  'Ready for Pickup'
];

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
    }, 3000);

    this.setState({ intervalID : id});
  }

  render() {
    const { classes } = this.props;

    return (
      <Grid container justify="center">
        <Stepper className={classes.stepBar} 
                  activeStep={this.state.activeStep} 
                  connector={<StepConnector className={classes.stepConnector}></StepConnector>}>
          {STEPS.map((label, index) => {
            let labelProp =
              index === this.state.activeStep ? classes.stepLabelPulse : classes.stepLabel;

            return (
              <Step key={label}>
                <StepLabel 
                  className={labelProp}
                  classes={{iconContainer: classes.stepIcon}}>
                  {label}
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </Grid>
    );
  }
}

Trackbar.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(Trackbar);
