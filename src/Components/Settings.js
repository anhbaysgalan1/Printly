import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import TextField from '@material-ui/core/TextField';
import HelpOutline from '@material-ui/icons/HelpOutline';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Tooltip from '@material-ui/core/Tooltip'
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
	MuiOutlinedInput: {
	  root: {
		margin: '2px',
	  },
	},
	MuiRadio: {
	  colorSecondary: {
		'&$checked': {
		  color: '#04619f',
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
		if(name === "Transfer") {
			return (
				<div>
				  <MuiThemeProvider theme={theme}>
				  <Tooltip title={this.props.optionInfo[name]} placement="top">
						<HelpOutline style={{color: 'grey'}}/>
					  </Tooltip>
					<FormControl component="fieldset" className={classes.formControl}>
					  
					  <FormLabel component="legend">{name}</FormLabel>
					  <RadioGroup row
						name={name}
						className={classes.group}
						value={this.props.print_options_state[name]}
						onChange={(e) => this.props.handleChange(name, e)}
					  >
						{opts}
					  </RadioGroup>
					  <p style={{color: 'grey'}}>+${this.props.deliv_fee}</p>
					</FormControl>
				  </MuiThemeProvider>
				</div>
		)}
		else {
		  return (
			<div>
			  <MuiThemeProvider theme={theme}>
			  <Tooltip title={this.props.optionInfo[name]} placement="top">
					<HelpOutline style={{color: 'grey'}}/>
				  </Tooltip>
				<FormControl component="fieldset" className={classes.formControl}>
				  
				  <FormLabel component="legend">{name}</FormLabel>
				  <RadioGroup row
					name={name}
					className={classes.group}
					value={this.props.print_options_state[name]}
					onChange={(e) => this.props.handleChange(name, e)}
				  >
					{opts}
				  </RadioGroup>
				  <p style={{color: 'grey'}}>+${this.props.data[name]}/copy</p>
				</FormControl>
			  </MuiThemeProvider>
			</div>
		  )}
		}
	);

	return (
	  <div className="specific_setting">
			<div className={classes.root}>
			  {optionButtons}
			  <MuiThemeProvider theme={theme}>
				<TextField
				id="outlined-number"
				label="Number of Copies"
				value={this.props.print_options_state.copies}
				onChange={(e) => this.props.handleChange('copies', e)}
				type="number"
				InputLabelProps={{
				  minvalue: 1,
				}}
				margin="normal"
				variant="outlined"
			  />
			</MuiThemeProvider>
			</div>
		  </div>
	);
  }
}


class ToolTip extends React.Component {
  state = {
	open: false,
  }

  handleClose = () => {
	this.setState({ open: false});
  }

  handleOpen = () => {
	this.setState({ open: true });
  }

  handleSwitch = () => {
	this.setState({ open: !this.state.open })
  }

  render() {
	return (
	  //<ClickAwayListener onClickAway={this.handleTooltipClose}>
		  <div>
			<Tooltip
			  PopperProps={{
				disablePortal: true,
			  }}
			  onClose={this.handleClose}
			  open={this.state.open}
			  disableFocusListener
			  disableHoverListener
			  disableTouchListener
			  title="Add"
			>
			  <HelpOutline onClick={this.handleSwitch}>Click</HelpOutline>
			</Tooltip>
		  </div>
	  //</ClickAwayListener>
	);
  }
}


export default withStyles(styles)(Settings);