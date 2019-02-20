import React, { Component } from 'react';
import './App.css';
import Home from './Components/Home.js';
import MatchedPrinters from './Components/MatchedPrinters.js';
import JobInProgress from './Components/JobInProgress.js';
import firebase from 'firebase';

const PageEnum = {
	HOME : 1,
	MATCHEDPRINTERS : 2,
	JOBINPROGRESS : 3,
}

var config = {
    apiKey: "AIzaSyD0ZMlZ0JCrCqsCxDx1MK1HO0taGmXZkXY",
    authDomain: "printly.firebaseapp.com",
    databaseURL: "https://printly.firebaseio.com",
    storageBucket: "printly.appspot.com",
};
firebase.initializeApp(config);

class App extends Component {
	constructor() {
		super();

		this.state = {
			page : PageEnum.HOME,
			printer_data: null,
			printer_img: null,
			selected_file: null,
			selected_file_data: null,
		};
	}

	changePage = (newPage, new_printer_data, new_printer_img) => {
		if (newPage === PageEnum.MATCHEDPRINTERS && this.state.selected_file != null) {
			this.uploadFile();
		}

		this.setState({
			page: newPage,
		});

		if (newPage === PageEnum.JOBINPROGRESS)
		{
			this.setState({
				printer_data: new_printer_data,
				printer_img: new_printer_img
			})
		}
	}

	//for uploading files to print
	chooseFile = (event) => {
		// event.preventDefault();
		let reader = new FileReader();
		let file = event.target.files[0]
		if(file) {
			reader.onloadend =() => {
				this.setState({ 
					selected_file: file,
					selected_file_data: reader.result
				})
			}
			reader.readAsDataURL(file)
			console.log("new file selected")
		}
		else {
			this.setState({
				selected_file: null,
				selected_file_data: null
			})
			console.log("no file selected")
		}
	}

	uploadFile() {
		let storageRef = firebase.storage().ref();
		let fileRef = storageRef.child('printQueue/' + this.state.selected_file.name);
		fileRef.put(this.state.selected_file).then(function(snapshot) {
			console.log('successful upload');
		});
	}

	render() {
		let current_page = null;

		switch (this.state.page) {
			case PageEnum.HOME:
				current_page = <Home
									changePage={this.changePage}
									chooseFile={this.chooseFile}
									uploadDoc={this.uploadDoc}
									selected_file={this.state.selected_file}
									selected_file_data={this.state.selected_file_data}
								/>
				break;

			case PageEnum.MATCHEDPRINTERS:
				current_page = <MatchedPrinters
									changePage={this.changePage}
								/>
				break;

			case PageEnum.JOBINPROGRESS:
				current_page = <JobInProgress
									changePage={this.changePage}
									printer_data={this.state.printer_data}
									printer_img={this.state.printer_img}
								/>
				break;
			
			default:
				current_page = <Home/>
				break;
		}

		return (
			<div className="App">
				{current_page}
				
				
			</div>
		);
	}
}

export default App;
