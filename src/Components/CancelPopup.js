import React, { Component } from 'react';
import '../App.css';
import Button from '@material-ui/core/Button';


class CancelPopup extends Component {
  render() {
  	return (
  	<div className="popup">
		<div className="popup_inner">
			<div className="popup_title">Cancel Print Job</div>
			<br/>
			<div className="popup_content">
				<p> You will still be charged for this print job. Are you sure you want to cancel?</p>
				<Button variant="outlined"
						color="blue"
						onClick={() => this.props.closeCancelPopup(false)}>
					No
				</Button>
				&nbsp;
				&nbsp;
				&nbsp;
				<Button variant="outlined"
						color="blue"
						onClick={() => this.props.closeCancelPopup(true)}>
					Yes
				</Button>
			</div>
		</div>
	</div>
  	)
  }

}

export default CancelPopup;