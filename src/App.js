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
	transfer: ['pickup', 'delivery'],
	sided: ['single', 'double'],
	orientation: ['portrait', 'landscape'],
	quality: ['low', 'medium', 'high'],
	color: ['black & white', 'color']
}

const pricesPerPage = {
	transfer: [0.00, 1.50],
	sided: [0.10, 0.05],
	orientation: [0.00, 0.00],
	quality: [0.05, 0.10, 0.15],
	color: [0.05, 0.25]
}

class App extends Component {
	constructor() {
		super();

		this.state = {
			page : PageEnum.HOME,
			printer_data: null,
			printer_img: null,
			selected_file: null,
			selected_file_data: null,
			price: 0.0,
			print_options: {
				transfer: null,
				sided: null,
				orientation: null,
				quality: null,
				color: null,
				copies: null,
			},
		};
	}

	changePage = (newPage, new_printer_data, new_printer_img) => {
		// purge file data from previous job, if any
		if (newPage === PageEnum.HOME) {
			this.setState({
				// TODO delete from firebase
				selected_file: null,
				selected_file_data: null
			})
		}

		// upload to firebase for printing
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

	updateCost = (new_cost, new_transfer) => {
		this.setState({
			price: new_cost,
			transfer: new_transfer
		});
	}

	updatePrintOptions = (new_print_options) => {
		let temp_print_options = {
			transfer: null,
			sided: null,
			orientation: null,
			quality: null,
			color: null,
			copies: null,
		};

		temp_print_options.transfer = new_print_options.transfer;
		temp_print_options.sided = new_print_options.sided;
		temp_print_options.orientation = new_print_options.orientation;
		temp_print_options.quality = new_print_options.quality;
		temp_print_options.color = new_print_options.color;
		temp_print_options.copies = new_print_options.copies

		this.setState({
			print_options: temp_print_options,
		});
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
		}
		else {
			this.setState({
				selected_file: null,
				selected_file_data: null
			})
		}
	}

	uploadFile() {
		let storageRef = firebase.storage().ref();
		let fileRef = storageRef.child('printQueue/' + this.state.selected_file.name);
		fileRef.put(this.state.selected_file).then(function(snapshot) {
			// lolidk
		});
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
									selected_file={this.state.selected_file}
									selected_file_data={this.state.selected_file_data}
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
								/>
				break;

			case PageEnum.JOBINPROGRESS:
				current_page = <JobInProgress
									PageEnum={PageEnum}
									changePage={this.changePage}
									printer_data={this.state.printer_data}
									printer_img={this.state.printer_img}
									selected_file={this.state.selected_file}
									selected_file_data={this.state.selected_file_data}
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
