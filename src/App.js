import React, { Component } from 'react';
import Home from './Components/Home.js';
import MatchedPrinters from './Components/MatchedPrinters.js';
import JobInProgress from './Components/JobInProgress.js';
import SignIn from './Components/SignIn.js';
import firebase from 'firebase';
import './App.css';

var config = {
    apiKey: "AIzaSyD0ZMlZ0JCrCqsCxDx1MK1HO0taGmXZkXY",
    authDomain: "printly.firebaseapp.com",
    databaseURL: "https://printly.firebaseio.com",
    storageBucket: "printly.appspot.com",
};
firebase.initializeApp(config);
firebase.auth().signOut();

const PageEnum = {
	SIGNIN : 0,
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
			page: PageEnum.SIGNIN,
			displayName: null,
			printer_data: {name: "Molly", Distance:0.5, Rating:5, rating_count:2, Color:"both", Quality:"medium", Transfer:"Delivery",
			 address:'2145 Sheridan Rd, Evanston, IL, 60208', id:200, rating_total:6},
			printer_img: null,
			selected_file_url: null,
			selected_file_name: null,
			selected_file_size: null,
			price: 0.0,
			delivery_address: '2145 Sheridan Rd, Evanston, IL, 60208',
			print_options: {
				Transfer: "Delivery",
				Sided: "Single",
				Orientation: "Portrait",
				Quality: "Medium",
				Color: "Black & White",
				copies: 1,
			},
		};

		window.onbeforeunload = () => {this.deleteSelectedFile();};
	}

	componentDidMount = () => {
		firebase.auth().onAuthStateChanged(user => {
			if (user) {
				this.setState({
					page: PageEnum.HOME,
					displayName: user.displayName,
				});
			}
			else {
				this.setState({ 
					page: PageEnum.SIGNIN,
					displayName: null,
				});
			}
		});
    }

	changePage = (newPage, new_printer_data, new_printer_img) => {
		// purge file data from previous job, if any
		if (this.page !== PageEnum.SIGNIN && newPage === PageEnum.HOME) {
			this.deleteSelectedFile();
			this.setState({
				selected_file_url: null,
				selected_file_name: null,
				selected_file_size: null
			})
		}

		if (newPage === PageEnum.MATCHEDPRINTERS) {
			let self = this;
			let fileRef = firebase.storage().ref().child('printQueue/' + this.state.selected_file_name);
			fileRef.getMetadata().then(function(metadata) {
				self.setState({ selected_file_size: (metadata.size/1000) });
			});
		}
		
		if (newPage === PageEnum.JOBINPROGRESS)
		{
			this.setState({
				printer_data: new_printer_data,
				printer_img: new_printer_img
			})
		}

		this.setState({
			page: newPage,
		});
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
		let file = event.target.files[0]
		
		if(file) {
			if (this.state.selected_file_name !== file.name) {
				this.deleteSelectedFile();

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
		}
	};

	deleteSelectedFile() {
		if (this.state.selected_file_name != null) {
			let oldRef = firebase.storage().ref().child('printQueue/' + this.state.selected_file_name);
			oldRef.delete();
		}
	};

	changeAddress(new_addr) {
		this.setState({
			delivery_address: new_addr,
		})
	}

	render() {
		let current_page = null;

		switch (this.state.page) {
			case PageEnum.SIGNIN:
				current_page = <SignIn/>
				break;

			case PageEnum.HOME:
				current_page = <Home
									PageEnum={PageEnum}
									displayName={this.state.displayName}
									changePage={this.changePage}
									chooseFile={this.chooseFile}
									uploadDoc={this.uploadDoc}
									selected_file_url={this.state.selected_file_url}
								/>
				break;

			case PageEnum.MATCHEDPRINTERS:
				current_page = <MatchedPrinters
									PageEnum={PageEnum}
									displayName={this.state.displayName}
									changePage={this.changePage}
									updateCost={this.updateCost}
									updatePrintOptions={this.updatePrintOptions}
									printOptions={printOptions}
									pricesPerPage={pricesPerPage}
									optionInfo={optionInfo}
									file_size={this.state.selected_file_size}
									changeAddress={this.changeAddress}
								/>
				break;

			case PageEnum.JOBINPROGRESS:
				current_page = <JobInProgress
									PageEnum={PageEnum}
									displayName={this.state.displayName}
									changePage={this.changePage}
									printer_data={this.state.printer_data}
									printer_img={this.state.printer_img}
									selected_file_url={this.state.selected_file_url}
									price={this.state.price}
									pricesPerPage={pricesPerPage}
									print_options={this.state.print_options}
									address={this.state.delivery_address}
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
