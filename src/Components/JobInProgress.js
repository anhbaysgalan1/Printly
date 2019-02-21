import React, { Component } from 'react';
import Trackbar from './Trackbar.js';
import FilePreview from './FilePreview.js';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import '../App.css';


export default class JobInProgress extends Component {
	render() {
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
				<div className="title">Job Status</div>
				{this.props.transfer === 'delivery' ? 
				<Trackbar activeStep={2} deliver/> :
				<Trackbar activeStep={2}/>}
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
	        	<br/>
	        	<div id="file_preview">
					Preview
					<FilePreview file_data={this.props.selected_file_data}
								 file_name={this.props.selected_file}/>
				</div>
	        	<br/>
	        	<button onClick={() => this.props.changePage(this.props.PageEnum.HOME)}>
					Job Done
				</button>
			</div>
		);
	}
}
