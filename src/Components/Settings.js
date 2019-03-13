import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import TextField from '@material-ui/core/TextField';
import HelpOutline from '@material-ui/icons/HelpOutline';
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
		MuiSvgIcon: {
			root: {
				fontSize: '1em',
				marginRight: '-8px',
			},
		},
		MuiIconButton: {
			root: {
				padding: '5px 15px 5px 10px'
			},
		},
  },
});

const tooltipTheme = createMuiTheme({
	overrides: {
		MuiSvgIcon: {
			root: {
				fontSize: '15px',
				marginLeft: '5px',
			},
		},
	},
});

const styles = ({
	root: {
		backgroundColor: 'white',
		height: '7em',
		width: '90vw',
		display: 'inline-flex',
		paddingTop: '1em',
		justifyContent: 'center',

  },
  formControl: {
		height: '7em',
		borderRight: '1px solid gray',
		paddingLeft: '15px',
		marginBottom: '5px',
	},
	formControlCopies: {
		padding: '0 1em 0 1em',
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
							<FormControl component="fieldset" className={classes.formControl}>	
								<FormLabel component="legend">
									{name}
									{
										this.props.optionInfo[name] != null ?
										<MuiThemeProvider theme={tooltipTheme}>
											<Tooltip title={this.props.optionInfo[name]} placement="top">
												<HelpOutline style={{color: 'grey'}}/>
											</Tooltip>
										</MuiThemeProvider> :
										null
									}
								</FormLabel>
								<RadioGroup row
														name={name}
														className={classes.group}
														value={this.props.print_options_state[name]}
														onChange={(e) => this.props.handleChange(name, e)}>
									{opts}
								</RadioGroup>
								<div style={{textAlign: 'center', color: 'grey', marginLeft: '-12%', marginTop:'-8%'}}>
									{(this.props.print_options_state[name] === "Delivery") && (this.props.deliv_fee === 0.0) ?
										<p>Please select a printer</p>
										:
										<p>+${this.props.deliv_fee}</p>}
								</div>
							</FormControl>
						</MuiThemeProvider>
					</div>
				)
			}
			else {
				return (
					<div>
						<MuiThemeProvider theme={theme}>
							<FormControl component="fieldset" className={classes.formControl}>	
								<FormLabel component="legend">
									{name}
									{
										this.props.optionInfo[name] != null ?
										<MuiThemeProvider theme={tooltipTheme}>
											<Tooltip title={this.props.optionInfo[name]} placement="top">
												<HelpOutline style={{color: 'grey'}}/>
											</Tooltip>
										</MuiThemeProvider> :
										null
									}
								</FormLabel>
								<RadioGroup row
														name={name}
														className={classes.group}
														value={this.props.print_options_state[name]}
														onChange={(e) => this.props.handleChange(name, e)}>
									{opts}
								</RadioGroup>
								<div style={{textAlign: 'center', color: 'grey', marginLeft: '-12%', marginTop: '-8%'}}>
									<p>+${(parseFloat(this.props.data[name])*this.props.copies).toFixed(2)}</p>
								</div>
							</FormControl>
						</MuiThemeProvider>
					</div>
				)
			}
		});

	return (
	  <div className="specific_setting">
			<div className={classes.root}>
			  {optionButtons}
			  <MuiThemeProvider theme={theme}>
					<FormControl component="fieldset" className={classes.formControlCopies}>
						<FormLabel component="legend">
							Copies Needed
						</FormLabel>
						<TextField
							id="outlined-number"
							value={this.props.print_options_state.copies}
							onChange={(e) => this.props.handleChange('copies', e)}
							type="number"
							InputLabelProps={{
								minvalue: 1,
								maxvalue: 100
							}}
							margin="normal"
							variant="outlined"
						/>
					</FormControl>
			</MuiThemeProvider>
			</div>
		  </div>
	);
  }
}

export default withStyles(styles)(Settings);
