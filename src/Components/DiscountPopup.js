import React, { Component } from 'react';
import '../App.css';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

const styles = theme => ({
	button:{
		color: '#04619f',
		background: '#FFFFFF',
	},
});

class DiscountPopup extends Component {
	render() {
        const { classes } = styles;

		return (
		<div className="popup">
		  <div className="popup_inner">
			  <div className="popup_title">Welcome</div>
			  <br/>
			  <div className="popup_content">
				<p>We noticed you logged in with an email associated with a university, you get 25% off your order!</p>
				<Button variant="outlined"
						color="blue"
						onClick={() => this.props.show(false)}>
					Great!
				</Button>
			  </div>
		  </div>
	  </div>
		)
	}
}

DiscountPopup.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(DiscountPopup);
