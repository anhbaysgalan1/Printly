import React, { Component } from 'react';
import '../App.css';


const PageEnum = {
	HOME : 1,
	MATCHEDPRINTERS : 2,
	JOBINPROGRESS : 3,
}

export default class JobInProgress extends Component {
	constructor(props) {
		super(props);
	}

	changePage = (newPage) => {
		this.props.changePage(newPage);
	}

	render() {
		console.log(this.props.printer_data);
		return (
			<div>
				JobInProgress
				<br/>
				{this.props.printer_img}
				<br/>
				<button onClick={() => this.changePage(PageEnum.HOME)}>
					Job Done
				</button>
			</div>
		);
	}
}