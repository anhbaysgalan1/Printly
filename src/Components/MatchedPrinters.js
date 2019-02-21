import React, { Component } from 'react';
import '../App.css';
import firebase from "firebase";
import Settings from './Settings.js';
import Cart from './Cart.js'


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
		transfer: [0.00, 0.50],
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
						sided: "single",
						orientation: "portrait",
						quality: "medium",
						color: "greyscale",
						copies: 1,
						max_distance: 5,
						min_rating: 1
				},
				selected_pricing: {
					transfer: '0.00',
					sided: '0.00',
					orientation: '0.00',
					quality: '0.00',
					color: '0.00',
				},
				price: 0.20,
			};
	};

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
		this.calcIndivPrices();
	};


	handleSettingsChange = (name, event) => {
		let newState = this.state.print_options;
		newState[name] = event.target.value
		this.setState({ print_options: newState });
		
		if(!event.target.value || event.target.value < 1) {
			this.setState({ [name]: null });
		}
		this.filterPrinters();

		let new_cost = this.calcCost();
		this.props.updateCost(new_cost, this.state.print_options.transfer);
		this.calcIndivPrices();
	};

	calcIndivPrices = () => {
		console.log('data : ' ,this.state.selected_pricing)
		let new_prices = {}
		Object.keys(this.state.selected_pricing).map(option => {
			console.log("OPTION SELECTION " , this.state.print_options[option])
			let option_selection = this.state.print_options[option]; //this is what we picked for each option. ex: i picked delivery for the transfer option
			if(option_selection === null) {
				new_prices[option] = '0.00'
			}

			else {
				let selection_index = printOptions[option].indexOf(option_selection)
				let option_price = pricesPerPage[option][selection_index];
				option_price = option_price.toFixed(2);
				new_prices[option] = option_price
			}
		})
		console.log('NEW PRICES : ' , new_prices)
		this.setState({
			selected_pricing: new_prices,
		})
	};

	calcCost = () => {
		let total_cost = 0.0;
		let copies = this.state.print_options.copies;

		if (this.state.print_options.transfer === 'pickup')
			total_cost += pricesPerPage.transfer[0] * copies;
		else if (this.state.print_options.transfer === 'delivery')
			total_cost += pricesPerPage.transfer[1] * copies;

		if (this.state.print_options.sided === 'single')
			total_cost += pricesPerPage.sided[0] * copies;
		else if (this.state.print_options.sided === 'double')
			total_cost += pricesPerPage.sided[1] * copies;

		if (this.state.print_options.orientation === 'portrait')
			total_cost += pricesPerPage.orientation[0] * copies;
		else if (this.state.print_options.orientation === 'landscape')
			total_cost += pricesPerPage.orientation[1] * copies;

		if (this.state.print_options.quality === 'low')
			total_cost += pricesPerPage.quality[0] * copies;
		else if (this.state.print_options.quality === 'medium')
			total_cost += pricesPerPage.quality[1] * copies;
		else if (this.state.print_options.quality === 'high')
			total_cost += pricesPerPage.quality[2] * copies;

		if (this.state.print_options.color === 'greyscale')
			total_cost += pricesPerPage.color[0] * copies;
		else if (this.state.print_options.color === 'color')
			total_cost += pricesPerPage.color[1] * copies;

		return total_cost;
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
					return (<PrinterInfo 
								data={data} 
								key={id} 
								changePage={this.props.changePage}
								job_cost={this.props.job_cost}
								transfer={this.state.print_options.transfer}
							/>
					);
			});
			

			return (
			<div>
					<div className="title">
							The Following Printers Have Matched Your Criteria
					</div>
					
					<div id="matches_div">
						<div className="settings">
								<Settings
									printOptions={printOptions}
									handleChange={this.handleSettingsChange}
									print_options_state={this.state.print_options}>
										
								</Settings>
						</div>
						<div className="printer_container">
							{printer_data}
						</div>
					</div>
				<Cart id="cart" data={this.state.selected_pricing} price={this.state.price}></Cart>
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
						<div className="printer_data printer_title">
						{this.props.data["name"]} 
						</div>
						<div className="printer_image">
								{image}
						</div>
						<div className="printer_data">
								<br/>
								Rating: {stars}
								<br/>
								Cost: ${
									(this.props.transfer === 'delivery') ?
										(this.props.job_cost + pricesPerPage.transfer[1] * parseFloat(this.props.data["distance"])).toFixed(2)
									:
										this.props.job_cost.toFixed(2)
								}
								<br/>
								Distance: {this.props.data["distance"]}
						</div>
				</div>
				);
		}
}

export default MatchedPrinters;
