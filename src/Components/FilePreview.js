import React, { Component } from 'react';
import FileViewer from 'react-file-viewer';

//const file = 'https://cdn4.iconfinder.com/data/icons/free-scuba-diving-icon-set/256/fish.png'

export default class FilePreview extends Component {

	render() {
		if(this.props.file_data && this.props.file_name) {
			let url = "https://firebasestorage.googleapis.com/v0/b/printly.appspot.com/o/" + this.props.file_name.name.replace(/ /g, "_") + "?alt=media" 
			console.log("filename: " , this.props.file_name.name)
			console.log("filename_formatted: " , this.props.file_name.name.replace(/ /g, "%2520"))
			console.log("encoded: ", encodeURIComponent(this.props.file_name.name))
			console.log("URL: " , url);
			return (
				<embed src={url} width='100%' height='500'></embed>

			);
		}
		else {
			return (
				<div>
					Please select a file.
				</div>)
		}
  }
}