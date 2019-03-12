import React from 'react';
//import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Tooltip from '@material-ui/core/Tooltip'
import HelpOutline from '@material-ui/icons/HelpOutline';
import { withStyles, createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import '../App.css'

const theme = createMuiTheme({
	overrides: {
		MuiList: {
			padding: {
				paddingBottom: '0px',
			},
		},
		MuiTypography: {
			subheading: {
				fontWeight: 'bold',
				fontSize: '1.4em',
				color: 'white',
			},
		},
		MuiListItem: {
			root: {
				textAlign: 'center',
			},
			gutters: {
				paddingLeft: '10px',
				paddingRight: '10px',
				paddingBottom: '10px',
			},
		},
		MuiListItemText: {
			root: {
				paddingRight: '0',
				color: 'white',
			},
			secondary: {
				color: 'white',
			}
		},
	},
});

const tooltipTheme = createMuiTheme({
	overrides: {
		MuiSvgIcon: {
			root: {
				fontSize: '18px',
				marginLeft: '10px',
			},
		},
	},
});

const styles = ({
	root: {
		height: '6em',
		// minHeight: '100%',
		backgroundColor: '#04619f',
		float: 'right',
		width: '10vw',
		paddingTop: '0.5em',
		paddingBottom: '1.5em',
		// border: '1px solid black',
		// borderRadius: '10px',
	},
});

const calculation_explanation = "Grand Total = 4 + 0.05 * (Transfer + Sided + Quality + Color) * file_kB * Copies";

class Subtotals extends React.Component {
	prettyText = (input) => {
		return "$" + parseFloat(input).toFixed(2)
	}


	render() {
		const { classes } = this.props;
		return (
			<div className={classes.root} >
				<MuiThemeProvider theme={theme}>
					<List>
						<ListItem>
							<ListItemText primary="Grand Total" className = "flashit"
											secondary={this.prettyText(parseFloat(this.props.price) + parseFloat(this.props.deliv_fee))}/>
								<MuiThemeProvider theme={tooltipTheme}>
									<Tooltip title={calculation_explanation} placement="top">
										<HelpOutline style={{color: 'white'}}/>
									</Tooltip>
								</MuiThemeProvider>
						</ListItem>
					</List>
				</MuiThemeProvider>
			</div>
		);
	}
}

export default withStyles(styles, { withTheme: true })(Subtotals);