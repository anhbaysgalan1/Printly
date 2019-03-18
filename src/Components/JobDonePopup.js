import React, { Component } from 'react';
import '../App.css';
import Button from '@material-ui/core/Button';
import Rating from 'material-ui-rating'

class JobDonePopup extends Component {
	state = {
		rating: 0,
	}

	render() {
		return (
			<div className="popup">
				<div className="popup_inner">
					<div className="popup_title">Summary & Review</div>
					<br/>
					<div className="popup_content">
						<br/>
						<div style={{ fontWeight: "bold", fontSize: "20px" }}> Total Cost: ${
							(this.props.print_options.Transfer === 'Delivery') ?
								((this.props.price + this.props.pricesPerPage.Transfer[1] * parseFloat(this.props.printer_data["Distance"]) - this.props.discount_rate*(this.props.price + this.props.pricesPerPage.Transfer[1] * parseFloat(this.props.printer_data["Distance"])))).toFixed(2)
							:
								(this.props.price - this.props.discount_rate*(this.props.price)).toFixed(2)
						}</div>
						<br/>
						<br/>
						Rate {this.props.printer_data["name"]}
						{<Rating
									value={(this.state.rating === 0) ? this.props.printer_data["Rating"] : this.state.rating}
									max={5}
									onChange={(value) => this.setState({ rating: value })}
								/>}
						<br/>
						Leave a comment!
						<br/>
						<textarea id="comment" rows="4" cols="50"/>
						<br/>
						<br/>
						<Button variant="outlined"
								color="blue"
								onClick={() => this.props.closePopup(this.state.rating, document.getElementById("comment").value)}>
							Confirm & Submit
						</Button>
					</div>
				</div>
			</div>
		)
	}
}

export default JobDonePopup;
