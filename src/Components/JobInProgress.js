import React, { Component } from 'react';
import Trackbar from './Trackbar.js';
import FilePreview from './FilePreview.js';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import '../App.css';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Rating from 'material-ui-rating'
import firebase from "firebase";

const styles = theme => ({
	button:{
		color: '#04619f',
		background: '#FFFFFF',
	},
});

class JobInProgress extends Component {
	state = {
		jobComplete: false,
		showDonePopup: false,
		showCancelPopup: false,
	}

	updateJobStatus = () => {
		this.setState({ jobComplete: true });
	}

	closePopup = (rating, comment) => {
		let printer_path = "active_printers/" + String(this.props.printer_data["id"]);
		let printer_ref = firebase.database().ref(printer_path);

		let rating_total_ref = printer_ref.child('rating_total');
		rating_total_ref.once('value', function(snapshot) {
			let prev_rating_total = snapshot.val();
			rating_total_ref.set(prev_rating_total + rating);
		});

		let rating_count_ref = printer_ref.child('rating_count');
		rating_count_ref.once('value', function(snapshot) {
			let prev_rating_count = snapshot.val();
			rating_count_ref.set(prev_rating_count + 1);
		});

		printer_ref.once('value', function(snapshot) {
			let rating_total = snapshot.child("rating_total").val();
			let rating_count = snapshot.child("rating_count").val();
			let rating_ref = printer_ref.child('rating');
			rating_ref.set(rating_total/rating_count);

			let comment_ref = firebase.database().ref(printer_path + "/comments");
			comment_ref.push(comment);
		});



		this.setState({ showDonePopup: false });
		this.props.changePage(this.props.PageEnum.HOME)
	}

	closeCancelPopup = () => {
		this.setState({ showCancelPopup: false });
	}

	render() {
		const { classes } = this.props;

		let stars = [];
		for (let i = 0; i < Math.round(this.props.printer_data["rating"]); i++)
		{
            stars.push(<span className="fa fa-star checked" key={i}></span>)
		}

		const selected_options = Object.keys(this.props.print_options).map(option => (
				<div>
					<ListItem key={option}>
						<ListItemText primary={option + ': ' + this.props.print_options[option]}/>
					</ListItem>
				</div>
			)
		);
		
		return (
			<div>
				<div className="title">
					<div className="pagetitle">Job Status</div>
					<img src='https://firebasestorage.googleapis.com/v0/b/printly.appspot.com/o/logo.png?alt=media&token=d339ba8b-b16f-4c4b-8fce-e56e2ddfdf29' className="logo" alt="logo"/>
				</div>
				{this.props.print_options['transfer'] === 'delivery' ? 
				<Trackbar activeStep={2} deliver updateJobStatus={this.updateJobStatus}/> :
				<Trackbar activeStep={2} updateJobStatus={this.updateJobStatus}/>}
				<div className="job_info">
	            	<div>
	                	{this.props.printer_img}
	            	</div>
	            	<div>
	                	{this.props.printer_data["name"]} 
	                	<br/>
	                	Address: {this.props.printer_data["address"]}
	                	<br/>
	                	Rating: {stars}
	                	<br/>
	                	<br/>
	                	<div className="job_data">
	                		Print Options:
	                		<br/>
	                		{selected_options}
	                		<br/>
		                	Total Cost: ${
									(this.props.print_options.transfer === 'delivery') ?
										(this.props.price + this.props.pricesPerPage.transfer[1] * parseFloat(this.props.printer_data["distance"])).toFixed(2)
									:
										(this.props.price).toFixed(2)
							}
		                </div>
	            	</div>
	        	</div>
	        	<div id="file_preview">
					Preview
					<FilePreview file_data={this.props.selected_file_data}
								 file_name={this.props.selected_file}/>
				</div>
	        	<br/>
	        	<div className="posn">
				<Button  variant="outlined" 
						color="inherit" 
						className={classes.button} 
						onClick={() => this.setState({ showCancelPopup: true})}>
					Cancel Job
				</Button>
				&nbsp;
				&nbsp;
				&nbsp;
	        	<Button  variant="outlined" 
						color="inherit" 
						className={classes.button} 
						onClick={() => this.setState({ showDonePopup: true })}
						disabled={this.state.jobComplete ? false : true}>
					Finish
				</Button>
				</div>

				{this.state.showDonePopup ? 
					<JobDonePopup
						closePopup={this.closePopup}
						print_options={this.props.print_options}
						printer_data={this.props.printer_data}
						price={this.props.price}
						pricesPerPage={this.props.pricesPerPage}/>
					: null
				}

				{this.state.showCancelPopup ? 
					<CancelPopup
					closePopup={this.closePopup}
					closeCancelPopup={this.closeCancelPopup}/>
					: null
				}

				
			</div>
		);
	}
}

JobInProgress.propTypes = {
	classes: PropTypes.object.isRequired
  };

export default withStyles(styles)(JobInProgress);

class CancelPopup extends Component {
  render() {
  	return (
  	<div className="popup">
				<div className="popup_inner">
					<div className="popup_title">Cancel Print Job</div>
					<br/>
					<p> You will still be charged for this print job. Are you sure you want to cancel?</p>
					<Button variant="outlined"
							color="blue"
							onClick={() => this.props.closePopup()}>
						Yes
					</Button>

					&nbsp;
					&nbsp;
					&nbsp;

					<Button variant="outlined"
							color="blue"
							onClick={() => this.props.closeCancelPopup()}>
						No
					</Button>
					
					</div>
					</div>
  	)
  }

}


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
					Total Cost: ${
						(this.props.print_options.transfer === 'delivery') ?
							(this.props.price + this.props.pricesPerPage.transfer[1] * parseFloat(this.props.printer_data["distance"])).toFixed(2)
						:
							(this.props.price).toFixed(2)
					}
					<br/>
					<br/>
					<br/>
					Rate {this.props.printer_data["name"]}
					{<Rating
								value={this.state.rating}
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
		)
	}
}