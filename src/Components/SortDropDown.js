import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import PropTypes from 'prop-types';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import TextField from '@material-ui/core/TextField';
import { withStyles, createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';

const styles = theme => ({
  root: {
    //backgroundColor: 'white',
    //border: '1px solid black',
    //borderRadius: '10px',
    //display: 'inline-flex',
    //flexDirection: 'rows',
    //paddingTop: '1em',
    //margin: '0.5em',
    //width: 500
  },
  formControl: {
    //borderRight: '1px solid gray',
    //paddingLeft: '15px',
    //marginBottom: '5px',
  },
  
  textField: {
      backgroundColor: 'white',
      width: 500
    //marginLeft: theme.spacing.unit,
    //marginRight: theme.spacing.unit,
    //width: 500
  },
  
  menu: {
    //width: 500
  },
  group: {
    //margin: `${theme.spacing.unit}px 0`,
    //margin: '0.1em',
    //marginBottom: '1em'
  },
});

class SortDropDown extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            selected : props.value
        };
    }

  render() {
      //console.log(this.props.options);
      //console.log(this.props.value);
      //console.log(this.state.selected);
      return (
        <div>
        <FormControl component="fieldset" className={styles.formControl}>
        <TextField id="SortBy"
                    label="Sort By:"
                    select
                    className={styles.textField}
                    value={this.state.selected}
                    onChange={event => {
                        //console.log(event);
                        //console.log(event.target.value);
                        let value = event.target.value;
                        this.setState({
                            selected: value
                        });
                        this.props.onChange(value);
                    }}
                    SelectProps={{
                        MenuProps: {
                        className: styles.menu
                        }
                    }}
                    //helperText="Sort By:"
                    margin="normal"
                    variant="outlined">
            {this.props.options.map(option => (<MenuItem key={option} value={option}>
                                  {option}
                                  </MenuItem>))}
            </TextField>
        </FormControl>
        </div>
    );
  }
}

export default withStyles(styles)(SortDropDown);