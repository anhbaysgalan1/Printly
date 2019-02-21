import React from 'react';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';
import '../App.css'

const styles = ({
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
		const { classes } = this.props;
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