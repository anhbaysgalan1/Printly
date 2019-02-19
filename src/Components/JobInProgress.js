import React, { Component } from 'react';
import Trackbar from './Trackbar';
import '../App.css';

const PageEnum = {
	HOME : 1,
	MATCHEDPRINTERS : 2,
	JOBINPROGRESS : 3,
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
				<Trackbar/>
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
		                	Options:
		                	<br/>
		                	Total Cost:
		                </div>
	            	</div>
	        	</div>
	        	<br/>
	        	<button onClick={() => this.props.changePage(PageEnum.HOME)}>
					Job Done
				</button>
			</div>
		);
	}
}
