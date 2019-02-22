import React, { Component } from 'react';
import Trackbar from './Trackbar.js';
import FilePreview from './FilePreview.js';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
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

class JobInProgress extends Component {
	state = {
		jobComplete: false
	}

	updateJobStatus = () => {
		this.setState({ jobComplete: true });
	}

	render() {
		const { classes } = this.props;

		let stars = [];
		for (let i = 0; i < this.props.printer_data["rating"]; i++)
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
					Job Status
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
	        	<Button  variant="outlined" 
						color="inherit" 
						className={classes.button} 
						onClick={() => this.props.changePage(this.props.PageEnum.HOME)}
						disabled={this.state.jobComplete ? false : true}>
					Finish
				</Button>
			</div>
		);
	}
}

JobInProgress.propTypes = {
	classes: PropTypes.object.isRequired
  };

export default withStyles(styles)(JobInProgress);
