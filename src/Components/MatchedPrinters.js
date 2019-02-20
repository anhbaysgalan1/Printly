import React, { Component } from 'react';
import '../App.css';
import firebase from "firebase";
import Settings from './Settings.js';


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
			color: ['greyscale', 'color']
}

const pricesPerPage = {
		transfer: [0.00, 1.50],
		sided: [0.10, 0.07],
		orientation: [0.00, 0.00],
		quality: [0.03, 0.05, 0.10],
		color: [0.05, 0.15]
}


class MatchedPrinters extends Component {
	constructor(){
			super();

			this.state = {
				matching_printers : [], //printers that match the preferences i have listed 
				active_printers : [],
				print_options: {
						transfer: null,
						sided: null,
						orientation: null,
						quality: null,
						color: null,
						copies: 1,
						max_distance: 5,
						min_rating: 1
				},
				price: 0,
			};
	}

	componentWillMount = () => {
		firebase.database().ref('active_printers').on('value', (snapshot) => {
				let printer_buff = [];
				snapshot.forEach((child) => {
						printer_buff.push(child.val());
				})

				this.setState({
						active_printers: printer_buff,
						matching_printers: printer_buff,
				});
				console.log(printer_buff);
				
		});
	};


	handleChange = (name, event) => {
		let newState = this.state.print_options;
		newState[name] = event.target.value
		this.setState({ print_options: newState });
		
		if(!event.target.value || event.target.value < 1) {
			this.setState({ [name]: null });
		}
		this.filterPrinters();
		// console.log('changing ' , name , 'to ', event.target.value);
		// console.log(this.state.print_options)
	};





	filterPrinters = () => {
		var filterOptions = ['transfer', 'quality', 'color']; //THESE ARE THE OPTIONS I AM USING TO FILTER
		let new_matches = Array.from(this.state.active_printers); //deep copy so i don't affect the actual active_printers state 


		//for each option that we're filtering by, do this:
		filterOptions.map(option => {
			let option_selection = this.state.print_options[option]; //this is what we picked for each option. ex: i picked delivery for the transfer option

			for(var i = 0; i < new_matches.length; i++) { //for each printer, if the option offered doesn't match my option selection, remove it from the list
				let cur_printer = new_matches[i]
				console.log("printer : ", cur_printer, " has: " , cur_printer[option] , "i want: ",  option_selection)
				if(option_selection !== null && cur_printer[option] !== option_selection) { 
					//ex: this printer only has greyscale, but i picked color
					//null means i didn't make a selection for the option yet, so i should only check if i made a selection
					console.log("this one failed")
					new_matches.splice(i, 1);
					i--;
				}
			}

		});

		console.log("new_matches: ", new_matches);

		//set matching_printers state to new matches, so that only the new matches are rendered
		this.setState({
			matching_printers: new_matches,
		})
		// console.log("matching_printers: " , this.state.matching_printers);
	};





	
		render() {
				let printer_data = Object.entries(this.state.matching_printers).map(([id, data]) => {
						return (<PrinterInfo data={data} key={id} changePage={this.props.changePage}></PrinterInfo>);
				});

				return (
				<div>
						<div className="title">
								The Following Printers Have Matched Your Criteria
						</div>
						<div className="settings">
								<Settings
												printOptions={printOptions}
												handleChange={this.handleChange}
												print_options_state={this.state.print_options}>
										
								</Settings>
						</div>
						<div className="printer_container">
						{printer_data}
						</div>
				</div>
				);
	}
}


class PrinterInfo extends Component {
		constructor(){
				super(); 

				this.state = {
						images : []
				};
		}

		render(){
				let stars = [];
				
				for (let i = 0; i < this.props.data["rating"]; i++){
						stars.push(<span className="fa fa-star checked" key={i}></span>)
				}
				let image = <img src='https://firebasestorage.googleapis.com/v0/b/printly.appspot.com/o/id_pictures%2Fdefault-profile-picture.png?alt=media&token=324bbe06-2b57-46cc-a9e8-8f5778ec34f6' className="id_image" alt="logo" />
				return (
				<div className="printer_info" onClick={() => this.props.changePage(PageEnum.JOBINPROGRESS, this.props.data, image)}>
						<div className="printer_image">
								{image}
						</div>
						<div className="printer_data">
								{this.props.data["name"]} 
								<br/>
								Address: {this.props.data["address"]}
								<br/>
								Distance: {this.props.data["distance"]}
								<br/>
								Rating: {stars}
								<br/>
								Quality: {this.props.data["quality"]}
								<br/>
								
								Cost: $4.00
						</div>
				</div>
				);
		}
}

export default MatchedPrinters;
