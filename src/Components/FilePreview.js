import React, { Component } from 'react';

//const file = 'https://cdn4.iconfinder.com/data/icons/free-scuba-diving-icon-set/256/fish.png'

export default class FilePreview extends Component {
	render() {
		console.log(this.props.file_url);
		if(this.props.file_url) {
			return (
				<iframe src={this.props.file_url} width='100%' height='490'></iframe>
			);
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
