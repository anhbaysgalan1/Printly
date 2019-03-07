import React, { Component } from 'react';
import Home from './Components/Home.js';
import MatchedPrinters from './Components/MatchedPrinters.js';
import JobInProgress from './Components/JobInProgress.js';
import firebase from 'firebase';
import './App.css';

var config = {
    apiKey: "AIzaSyD0ZMlZ0JCrCqsCxDx1MK1HO0taGmXZkXY",
    authDomain: "printly.firebaseapp.com",
    databaseURL: "https://printly.firebaseio.com",
    storageBucket: "printly.appspot.com",
};
firebase.initializeApp(config);

const PageEnum = {
	HOME : 1,
	MATCHEDPRINTERS : 2,
	JOBINPROGRESS : 3,
}

const printOptions = {
	Transfer: ['Pickup', 'Delivery'],
	Sided: ['Single', 'Double'],
	Orientation: ['Portrait', 'Landscape'],
	Quality: ['Low', 'Medium', 'High'],
	Color: ['Black & White', 'Color']
}

const optionInfo = {
	Transfer: "Would you like to pick up your document, or have it delivered?",
	Quality: "Select 'low' for everyday documents, 'medium' for important documents, and 'high' for photos.",
}

const pricesPerPage = {
	Transfer: [0.00, 1.50],
	Sided: [0.10, 0.05],
	Orientation: [0.00, 0.00],
	Quality: [0.05, 0.10, 0.15],
	Color: [0.05, 0.25]
}

class App extends Component {
	constructor() {
		super();

		this.state = {
			page : PageEnum.HOME,
			printer_data: null,
			printer_img: null,
			selected_file_url: null,
			selected_file_name: null,
			price: 0.0,
			print_options: {
				Transfer: null,
				Sided: null,
				Orientation: null,
				Quality: null,
				Color: null,
				copies: null,
			},
		};

		window.onbeforeunload = () => {this.deleteSelectedFile();};
	}

	changePage = (newPage, new_printer_data, new_printer_img) => {
		// purge file data from previous job, if any
		if (newPage === PageEnum.HOME) {
			this.deleteSelectedFile();
			this.setState({
				selected_file_url: null,
				selected_file_name: null
			})
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

	updateCost = (new_cost, new_transfer) => {
		this.setState({
			price: new_cost,
			Transfer: new_transfer
		});
	}

	updatePrintOptions = (new_print_options) => {
		let temp_print_options = {
			Transfer: null,
			Sided: null,
			Orientation: null,
			Quality: null,
			Color: null,
			copies: null,
		};

		temp_print_options.Transfer = new_print_options.Transfer;
		temp_print_options.Sided = new_print_options.Sided;
		temp_print_options.Orientation = new_print_options.Orientation;
		temp_print_options.Quality = new_print_options.Quality;
		temp_print_options.Color = new_print_options.Color;
		temp_print_options.copies = new_print_options.copies

		this.setState({
			print_options: temp_print_options,
		});
	};

	chooseFile = (event) => {
		this.deleteSelectedFile();
		let file = event.target.files[0]

		if(file) {
			let self = this;
			let fileRef = firebase.storage().ref().child('printQueue/' + file.name);
			fileRef.put(file).then(function() {
				fileRef.getDownloadURL().then(function(url) {
					self.setState({
						selected_file_url: url,
						selected_file_name: file.name
					});
				});
			});
		}
		else {
			this.setState({
				selected_file_url: null,
				selected_file_name: null
			})
		}
	};

	deleteSelectedFile() {
		if (this.state.selected_file_name != null) {
			let oldRef = firebase.storage().ref().child('printQueue/' + this.state.selected_file_name);
			oldRef.delete();
		}
	}

	render() {
		let current_page = null;

		switch (this.state.page) {
			case PageEnum.HOME:
				current_page = <Home
									PageEnum={PageEnum}
									changePage={this.changePage}
									chooseFile={this.chooseFile}
									uploadDoc={this.uploadDoc}
									selected_file_url={this.state.selected_file_url}
								/>
				break;

			case PageEnum.MATCHEDPRINTERS:
				current_page = <MatchedPrinters
									PageEnum={PageEnum}
									changePage={this.changePage}
									updateCost={this.updateCost}
									updatePrintOptions={this.updatePrintOptions}
									printOptions={printOptions}
									pricesPerPage={pricesPerPage}
									optionInfo={optionInfo}
								/>
				break;

			case PageEnum.JOBINPROGRESS:
				current_page = <JobInProgress
									PageEnum={PageEnum}
									changePage={this.changePage}
									printer_data={this.state.printer_data}
									printer_img={this.state.printer_img}
									selected_file_url={this.state.selected_file_url}
									price={this.state.price}
									pricesPerPage={pricesPerPage}
									print_options={this.state.print_options}
								/>
				break;
			
			default:
				current_page = 'Oh no, something broke!';
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
