import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import { withStyles} from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';

const styles = theme => ({
  textField: {
      backgroundColor: 'white',
      width: 500
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
      return (
        <div>
        <FormControl component="fieldset" className={styles.formControl}>
        <TextField id="SortBy"
                    label="Sort By:"
                    select
                    className={styles.textField}
                    value={this.state.selected}
                    onChange={event => {
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