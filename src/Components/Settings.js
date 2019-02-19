import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import TextField from '@material-ui/core/TextField';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    display: 'inline-block',
    margin: '0.5em'
  },
  formControl: {
    marginBottom: theme.spacing.unit * 0.1,
  },
  group: {
    //margin: `${theme.spacing.unit}px 0`,
    margin: '0.1em',
    marginBottom: '1em'
  },
});

const printOptions = {
      transfer: ['pickup', 'delivery'],
      sided: ['single', 'double'],
      orientation: ['portrait', 'landscape'],
      quality: ['poor', 'medium', 'high'],
      color: ['greyscale', 'color']
    }

class Settings extends React.Component{
  state = {
    transfer: null,
    sided: null,
    orientation: null,
    quality: null,
    color: null,
    copies: 1
  }

  handleChange = (name, event) => {
    this.setState({ [name]: event.target.value });
    console.log('name : ' , name , ' value: ' , event.target.value)
    if(!event.target.value || event.target.value < 1) {
      this.setState({ [name]: null });
      console.log("setting ", name , 'to null')
    }
    console.log(this.state)

  };

  saveAndClose = () => {

  }


  render() {
    const { classes } = this.props;
    

    const optionButtons = Object.entries(printOptions).map((options) => {
      let name = options[0]
      let opts = Object.entries(options[1]).map((val) => {
        return (<FormControlLabel value={val[1]} control={<Radio />} label={val[1]} />);
      });

      let option1 = options[1][0]
      let option2 = options[1][1]
      return (
        <div>
        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">{options[0]}</FormLabel>
          <RadioGroup row
            name={options[0]}
            className={classes.group}
            value={this.state.name}
            onChange={(e) => this.handleChange(name, e)}
          >
            {opts}
          </RadioGroup>
        </FormControl>
        </div>
      )}
    );

    return (
      <div className="specific_setting">
          <div>Print Job Details</div>
          <div className={classes.root}>
            {optionButtons}
          </div>

          <TextField
            id="outlined-number"
            label="Number of Copies"
            value={this.state.copies}
            onChange={(e) => this.handleChange('copies', e)}
            type="number"
            InputLabelProps={{
              minValue: 1,
            }}
            margin="normal"
            variant="outlined"
        />

          <div>Cost of Delivery: $4.00</div>
          <button onClick={this.saveAndClose}>Save and Close</button>
          </div>
    );
  }
}

export default withStyles(styles)(Settings);