import React, { Component } from 'react';
import FileViewer from 'react-file-viewer';

//const file = 'https://cdn4.iconfinder.com/data/icons/free-scuba-diving-icon-set/256/fish.png'

export default class FilePreview extends Component {

	render() {
		if(this.props.file_data && this.props.file_name) {
			return (
				<iframe src="https://firebasestorage.googleapis.com/v0/b/printly.appspot.com/o/preview?alt=media&token=b973789f-1f81-4d74-89b8-d75a2f25441d" width='100%' height='500'></iframe>

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