import React, { Component } from 'react';
import Trackbar from './Trackbar';
import FilePreview from './FilePreview.js';
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
				<div className="title">Home</div>
				<Trackbar activeStep={0} />
				<div>
					<input type="file" onChange={this.props.chooseFile}>
					</input>
				</div>
				<br/>
				<button onClick={() => this.props.changePage(PageEnum.MATCHEDPRINTERS)}>
					Matched Printers
				</button>
				<div id="file_preview">
					Preview
					<FilePreview file_data={this.props.selected_file_data}
								file_name={this.props.selected_file}/>
				</div>
			</div>
		);
	}
}