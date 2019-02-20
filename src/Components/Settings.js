import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import TextField from '@material-ui/core/TextField';
import { withStyles, createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
  overrides: {
    MuiFormLabel: {
      root: {
        '&$focused': {
          color: 'grey',
        },
      },
    },
    MuiRadio: {
      colorSecondary: {
        '&$checked': {
          color: 'rebeccapurple',
        }
      },
    },
  },
});

const styles = ({
  root: {
    backgroundColor: 'white',
    border: '1px solid black',
    borderRadius: '10px',
    display: 'inline-flex',
    flexDirection: 'rows',
    paddingTop: '1em',
    margin: '0.5em'
  },
  formControl: {
    borderRight: '1px solid gray',
    paddingLeft: '15px',
    marginBottom: '5px',
  },
  group: {
    //margin: `${theme.spacing.unit}px 0`,
    margin: '0.1em',
    marginBottom: '1em'
  },
});



class Settings extends React.Component{
  



  render() {
    const { classes } = this.props;

    const optionButtons = Object.entries(this.props.printOptions).map((options) => {
      let name = options[0]
      let opts = Object.entries(options[1]).map((val) => {
        return (
            <FormControlLabel value={val[1]} control={<Radio/>} label={val[1]}/>
          );
        });

      let option1 = options[1][0]
      let option2 = options[1][1]
      return (
        <div>
          <MuiThemeProvider theme={theme}>
            <FormControl component="fieldset" className={classes.formControl}>
              <FormLabel component="legend">{options[0]}</FormLabel>
              <RadioGroup row
                name={options[0]}
                className={classes.group}
                value={this.props.print_options_state.name}
                onChange={(e) => this.props.handleChange(name, e)}
              >
                {opts}
              </RadioGroup>
            </FormControl>
          </MuiThemeProvider>
        </div>
      )}
    );

    return (
      <div className="specific_setting">
          <div>Print Job Details</div>
            <div className={classes.root}>
              {optionButtons}
              <TextField
              id="outlined-number"
              label="Number of Copies"
              value={this.props.print_options_state.copies}
              onChange={(e) => this.props.handleChange('copies', e)}
              type="number"
              InputLabelProps={{
                minValue: 1,
              }}
              margin="normal"
              variant="outlined"
            />
            </div>
          </div>
    );
  }
}

export default withStyles(styles)(Settings);