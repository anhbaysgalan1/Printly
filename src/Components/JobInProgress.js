import React, { Component } from 'react';
import Trackbar from './Trackbar.js';
import FilePreview from './FilePreview.js';
import '../App.css';

const PageEnum = {
	HOME : 1,
	MATCHEDPRINTERS : 2,
	JOBINPROGRESS : 3,
}

const pricesPerPage = {
		transfer: [0.00, 0.50],
		sided: [0.10, 0.07],
		orientation: [0.00, 0.00],
		quality: [0.03, 0.05, 0.10],
		color: [0.05, 0.15]
}

export default class JobInProgress extends Component {
	render() {
		let stars = [];
		for (let i = 0; i < this.props.printer_data["rating"]; i++)
		{
            stars.push(<span className="fa fa-star checked" key={i}></span>)
		}
		
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
		                	Total Cost: ${
									(this.props.transfer === 'delivery') ?
										(this.props.job_cost + pricesPerPage.transfer[1] * parseFloat(this.props.printer_data["distance"])).toFixed(2)
									:
										(this.props.job_cost).toFixed(2)
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
	        	<button onClick={() => this.props.changePage(PageEnum.HOME)}>
					Job Done
				</button>
			</div>
		);
	}
}
