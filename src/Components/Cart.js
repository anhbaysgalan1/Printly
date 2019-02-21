import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';
import '../App.css'

const styles = theme => ({
	root: {
		display: 'flex',
		backgroundColor: 'white',
		//minHeight: '100px',
	},
});


class Cart extends React.Component {
	prettyText = (input) => {
		return "$" + parseFloat(input).toFixed(2)
	}


	render() {
		const { classes, theme } = this.props;
		console.log('MY DATA : ', this.props.data)
		const listItems = Object.keys(this.props.data).map(option => (
					<div>
						<ListItem  key={option}>
							<ListItemText primary={option} 
										  secondary={this.prettyText(parseFloat(this.props.data[option] * this.props.copies))}/>
						</ListItem>
						<Divider />
					</div>
					)
		);
		return (
			<div className={classes.root}>

							<List>
								Your Current Price Breakdown<br/><br/><br/>
								<Divider />
								{listItems}
								<ListItem  key="total">
									<ListItemText primary="Subtotal" 
												  secondary={this.prettyText(this.props.price * this.props.copies)}/>
								</ListItem>
							</List>
			</div>
		);
	}
}

export default withStyles(styles, { withTheme: true })(Cart);