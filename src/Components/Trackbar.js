import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';

const styles = theme => ({
    root: {
      width: '90%',
    },
    statusMsg: {
      marginTop: theme.spacing.unit,
      marginBottom: theme.spacing.unit,
    }
});
  
function getSteps() {
  return ['Document Uploaded', 'Job Accepted', 'Document Printed', 'Ready for Pickup'];
}
  
function getStepContent(step) {
  switch (step) {
    case 1:
      return 'Waiting for printer to accept job';
    case 2:
      return 'Waiting for documents to print';
    case 3:
      return 'Almost there';
    case 4:
      return 'Job finished!'
    default:
      return 'Unknown step';
  }
}

class Trackbar extends Component {
  state = {
    activeStep: 1,
    intervalID: 0
  };

  componentDidMount() {
    let id = setInterval(() => {
      const { activeStep } = this.state;
      this.setState({ activeStep: activeStep + 1, });

      if (activeStep === 3) {
        clearInterval(this.state.intervalID);
      }
    }, 2000);
    this.setState({ intervalID : id});
  }

  render() {
    const { classes } = this.props;
    const steps = getSteps();
    const { activeStep } = this.state;

    return (
      <div className={classes.root}>
        <Typography className={classes.statusMsg}>
          {getStepContent(activeStep)}
        </Typography>
        {
          this.state.activeStep >= 4 ?
          <LinearProgress style={{visibility : 'hidden'}}/>:
          <LinearProgress/>
        }
        <Stepper activeStep={activeStep}>
          {steps.map((label) => {
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

export default withStyles(styles)(Trackbar);
