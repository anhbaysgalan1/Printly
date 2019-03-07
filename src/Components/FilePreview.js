import React, { Component } from 'react';
import "../App.css"
//const file = 'https://cdn4.iconfinder.com/data/icons/free-scuba-diving-icon-set/256/fish.png'

export default class FilePreview extends Component {
	render() {
		console.log('FILE URL: ' , this.props.file_url);
		if(this.props.file_url) {
			if(this.props.file_url.includes('.png') || this.props.file_url.includes('.jpg') || this.props.file_url.includes('.jpeg')) {
				let y_val = window.innerHeight / 1.5;
				//let x_val = window.innerWidth;
				return (
					<img src={this.props.file_url} height={y_val} alt="preview"></img>
				)
			}
			else { 
				return (
					<iframe title="preview" src={this.props.file_url} className="iframe" width='100%' height='100%' frameBorder='0'></iframe>
				);
			}
		}
		else {
			return (
				<div>
					Please select a file.
				</div>
			);
		}
  }
}
