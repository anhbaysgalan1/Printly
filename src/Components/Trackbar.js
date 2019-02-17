import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles'
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
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
});

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
    const { classes } = this.props;

    return (
      <Grid container justify="center" spacing={24}>
        <Grid item sm={12}>
          <Typography>
            {getStatusMsg(this.state.activeStep)}
          </Typography>
        </Grid>
        <Grid item sm={8}>
          {
            this.state.activeStep >= STEPS.length ?
            <LinearProgress style={{visibility : 'hidden'}}/>:
            <LinearProgress/>
          }
        </Grid>
        <Stepper className={classes.stepBar} activeStep={this.state.activeStep}>
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
