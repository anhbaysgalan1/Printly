import React, { Component } from 'react';
import '../App.css';


const PageEnum = {
	HOME : 1,
	MATCHEDPRINTERS : 2,
	JOBINPROGRESS : 3,
}

export default class Home extends Component {

	render() {
		return (
			<div>
				Home (upload and select documents for jobs)
				<br/>
				<button onClick={() => this.props.changePage(PageEnum.MATCHEDPRINTERS)}>
					Matched Printers
				</button>
			</div>
		);
	}
}