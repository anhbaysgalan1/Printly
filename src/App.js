import React, { Component } from 'react';
import './App.css';
import Home from './Components/Home.js';
import MatchedPrinters from './Components/MatchedPrinters.js';
import JobInProgress from './Components/JobInProgress.js';
import SettingsPopups from './Components/SettingsPopups.js';


const PageEnum = {
	HOME : 1,
	MATCHEDPRINTERS : 2,
	JOBINPROGRESS : 3,
	SETTINGSPOPUPS: 4,
}

class App extends Component {
	constructor() {
		super();

		this.state = {
			page : PageEnum.HOME,
			printer_data: null,
			printer_img: null,
			selected_file: null,
		};
	}

	changePage = (newPage, new_printer_data, new_printer_img) => {
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
		this.setState({ selected_file: event.target.files[0],})
	}
	uploadDoc = () => {
		alert(this.state.selected_file.name)
		//need to upload file into firebase
	}



	render() {
		let current_page = null;

		switch (this.state.page) {
			case PageEnum.HOME:
				current_page = <Home
									changePage={this.changePage}
									chooseFile={this.chooseFile}
									uploadDoc={this.uploadDoc}
								/>
				break;

			case PageEnum.MATCHEDPRINTERS:
				current_page = <MatchedPrinters
									changePage={this.changePage}
								/>
				break;

			case PageEnum.SETTINGSPOPUPS:
				current_page = <SettingsPopups
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
