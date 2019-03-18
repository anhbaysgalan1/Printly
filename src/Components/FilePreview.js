import React, { Component } from 'react';
import "../App.css"

export default class FilePreview extends Component {
	render() {
		if(this.props.file_url) {
			if(this.props.file_url.includes('.png') || this.props.file_url.includes('.jpg') || this.props.file_url.includes('.jpeg')) {
				let y_val = window.innerHeight / 1.5;
				return (
					<img src={this.props.file_url} height={y_val} alt="preview"></img>
				)
			}
			else { 
				let encoded_url = encodeURIComponent(this.props.file_url);
				let viewer_url = "https://docs.google.com/viewer?url=" + encoded_url + "&embedded=true";
				return (
					<iframe title="preview" src={viewer_url} className="iframe" width='100%' height='100%' frameBorder='0'></iframe>
				);
			}
		}
		else {
			return (
				<div>
					Oh no, something broke!
				</div>
			);
		}
  }
}
