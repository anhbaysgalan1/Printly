import React, { Component } from 'react';
import FileViewer from 'react-file-viewer';

//const file = 'https://cdn4.iconfinder.com/data/icons/free-scuba-diving-icon-set/256/fish.png'

export default class FilePreview extends Component {

	render() {
		if(this.props.file_data && this.props.file_name) {
			console.log("success! " , this.props.file_name)
			return (
				<FileViewer
					key={this.props.file_name.name}
					filePath={this.props.file_data}
					fileType={this.props.file_name.name.substring(this.props.file_name.name.lastIndexOf('.')+1)}
				/>
			);
		}
		else {
			console.log("PICK A FILE")
			return (
				<p>please select a file</p>)
		}
  }
}