import React, { Component } from 'react';
import firebase from "firebase";
import Button from '@material-ui/core/Button';
import '../App.css';

class ConfirmPopup extends Component {
	render() {
		let stars = [];
			for (let i = 0; i < Math.round(this.props.selected_printer_data["Rating"]); i++){
					stars.push(<span className="fa fa-star checked" key={i}></span>)
			}

		let job_description = null;
		let delivery_cost = 0.0;
		if (this.props.print_options.Transfer === 'Delivery')
		{
			delivery_cost = this.props.pricesPerPage.Transfer[1] * parseFloat(this.props.selected_printer_data["Distance"])
			job_description = 
				<div>
					<div style={{ fontWeight: "bold", fontSize: "20px" }}>ETA</div>
					<div style={{ fontWeight: "bold", fontSize: "20px", fontStyle: "italic" }}>{this.props.calcETA(this.props.selected_printer_data["Distance"])}</div>
					<br/>
					<br/>
					<div style={{ color: "grey", "width": "55%", marginLeft: "auto", marginRight: "auto" }}>
						<span style={{float: "left"}}>Subtotal:</span><span style={{float: "right"}}>${this.props.subtotal.toFixed(2)}</span>
						<br/>
						<span style={{float: "left"}}>Delivery:</span><span style={{float: "right"}}>${delivery_cost.toFixed(2)}</span>
						<br/>
						<span style={{float: "left"}}>Student Discount:</span><span style={{float: "right"}}>-${(this.props.subtotal * this.props.discount_rate).toFixed(2)}</span>
						<br/>
					</div>
				</div>
		}
		else
		{
			job_description = 
				<div>
					<br/>
					<div style={{ fontWeight: "bold", fontSize: "20px" }}>Pick-up:</div>
					<div>{this.props.selected_printer_data["address"]} ({this.props.selected_printer_data["Distance"]} mile{(this.props.selected_printer_data["Distance"] === 1) ? "" : "s"})</div>
					<br/>
					<br/>
					<div style={{ color: "grey", "width": "55%", marginLeft: "auto", marginRight: "auto" }}>
						<span style={{float: "left"}}>Subtotal:</span><span style={{float: "right"}}>${this.props.subtotal.toFixed(2)}</span>
						<br/>
						<span style={{float: "left"}}>Student Discount:</span><span style={{float: "right"}}>-${(this.props.subtotal * this.props.discount_rate).toFixed(2)}</span>
						<br/>
					</div>
				</div>
		}


		let imageRef = firebase.storage().ref().child('id_pictures/' + this.props.selected_printer_data["name"] + ".png");
		imageRef.getDownloadURL().then((url) => {
			document.getElementById("confirm" + this.props.selected_printer_data["id"]).src = url;
		}).catch(function (error) {
			console.log(error);
		});

		let image = <img id={"confirm" + this.props.selected_printer_data["id"]} src='https://firebasestorage.googleapis.com/v0/b/printly.appspot.com/o/id_pictures%2Fprofile-icon-blue.png?alt=media&token=281ccc96-a3b3-4669-bb8b-7c1d17f07713' className="id_image" alt="logo" />

		return (
			<div className="popup">
				<div className="popup_inner">
					<div className="popup_title">Review Order</div>
					<br/>
					<div className="popup_content">
						<div>
							<div className="printer_preview">
								<div style={{ fontWeight: "bold" }}>{this.props.selected_printer_data["name"]}</div>
								<div>{image}</div>
								<div style={{ fontWeight: "bold" }}>Rating: {stars}</div>
								<br/>
							</div>
							<br/>
							{job_description}
						</div>
						<div style={{padding: "10px", background: "#ededed", fontWeight: "bold", fontSize: "20px"}}>Total Price &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; ${(this.props.subtotal + delivery_cost - this.props.discount_rate*(this.props.subtotal + delivery_cost)).toFixed(2)}</div>
						<br/>
						<br/>
						<Button variant="outlined"
								onClick={() => this.props.closePopup(false)}>
							Cancel
						</Button>

						&nbsp;
						&nbsp;
						&nbsp;

						<Button variant="outlined"
								onClick={() => this.props.closePopup(true)}>
							Confirm & Submit!
						</Button>
					</div>
				</div>
			</div>
		);
	}
}

export default ConfirmPopup;