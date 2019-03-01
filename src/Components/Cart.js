import React from 'react';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles, createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import '../App.css'

const theme = createMuiTheme({
	overrides: {
		MuiList: {
			padding: {
				paddingBottom: '0px',
			},
		},
		MuiListItem: {
			root: {
				fontSize: '10px',
				paddingTop: '2.5px',
				paddingBottom: '2.5px',
			},
		},
	},
});

const styles = ({
	root: {
		display: 'flex',
		backgroundColor: 'white',
		border: '1px solid black',
		borderRadius: '10px',
	},
});

class Cart extends React.Component {
	prettyText = (input) => {
		return "$" + parseFloat(input).toFixed(2)
	}


	render() {
		const { classes } = this.props;
		const listItems = Object.keys(this.props.data)
								.filter(option => (option != "Orientation"))
								.map(option => (
			<div>
				<ListItem  key={option}>
					<ListItemText primary={option} 
									secondary={this.prettyText(parseFloat(this.props.data[option] * this.props.copies))}/>
				</ListItem>
				<Divider />
			</div>
			)
		);

		listItems.push(
		<div>
			<ListItem  key={"handling_fee"}>
				<ListItemText primary={"Handling"} 
							  secondary={this.prettyText(parseFloat(this.props.handling_fee))}/>
			</ListItem>
			<Divider />
		</div>
		);
		return (
			<div className={classes.root}>
				<MuiThemeProvider theme={theme}>
					<List>
						<div className="cartTitle">Price Breakdown</div>
						<Divider />
						{listItems}
						<ListItem  key="total">
							<ListItemText primary="Subtotal" 
											secondary={this.prettyText(this.props.price)}/>
						</ListItem>
						<Divider/>
						<ListItem>
							<ListItemText primary="Delivery" 
											secondary={this.prettyText(this.props.deliv_fee)}/>
						</ListItem>
						<Divider/>
						<ListItem>
							<ListItemText primary="Grand Total" className = "flashit"
											secondary={this.prettyText(parseFloat(this.props.price) + parseFloat(this.props.deliv_fee))}/>
						</ListItem>
					</List>
				</MuiThemeProvider>
			</div>
		);
	}
}

export default withStyles(styles, { withTheme: true })(Cart);