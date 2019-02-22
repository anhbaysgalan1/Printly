import React, { Component } from 'react';
import firebase from "firebase";
import Settings from './Settings.js';
import Cart from './Cart.js'
import Trackbar from './Trackbar';
import '../App.css';


class MatchedPrinters extends Component {
	constructor(){
			super();

			this.state = {
				matching_printers : [], //printers that match the preferences i have listed 
				active_printers : [],
				print_options: {
						transfer: "pickup",
						sided: "single",
						orientation: "portrait",
						quality: "medium",
						color: "black & white",
						copies: 1,
						max_distance: 5,
						min_rating: 1
				},
				selected_pricing: {
					sided: '0.00',
					orientation: '0.00',
					quality: '0.00',
					color: '0.00',
				},
				handling_fee: '4.00',
				price: 0.0,
			};
	};

	componentWillMount = () => {
		
		firebase.database().ref('active_printers').once('value', (snapshot) => {
				let printer_buff = [];
				snapshot.forEach((child) => {
						printer_buff.push(child.val());
				})

				let init_cost = this.calcCost();

				this.setState({
						active_printers: printer_buff,
						matching_printers: printer_buff,
						price: init_cost
				});
				
				this.filterPrinters();
				this.props.updatePrintOptions(this.state.print_options);
		});
		this.calcIndivPrices();
	};


	handleSettingsChange = (name, event) => {
		let newState = this.state.print_options;
		newState[name] = event.target.value;
		this.setState({ print_options: newState });
		
		if(!event.target.value || event.target.value < 1) {
			this.setState({ [name]: null });
		}
		this.filterPrinters();

		let new_cost = this.calcCost();
		this.setState({price: new_cost});
		this.calcIndivPrices();

		this.props.updatePrintOptions(this.state.print_options);
	}

	calcIndivPrices = () => {
		//console.log('data : ' ,this.state.selected_pricing)
		let new_prices = {}
		Object.keys(this.state.selected_pricing).map(option => {
			//console.log("OPTION SELECTION " , this.state.print_options[option])
			let option_selection = this.state.print_options[option]; //this is what we picked for each option. ex: i picked delivery for the transfer option
			if(option_selection === null) {
				new_prices[option] = '0.00'
			}
			else {
				let selection_index = this.props.printOptions[option].indexOf(option_selection)
				let option_price = this.props.pricesPerPage[option][selection_index];
				option_price = option_price.toFixed(2);
				new_prices[option] = option_price
			}
		})
		//console.log('NEW PRICES : ' , new_prices)
		this.setState({
			selected_pricing: new_prices,
		})
	};

	calcCost = () => {
		let total_cost = 0.0;
		let copies = this.state.print_options.copies;

		if (this.state.print_options.sided === 'single')
			total_cost += this.props.pricesPerPage.sided[0] * copies;
		else if (this.state.print_options.sided === 'double')
			total_cost += this.props.pricesPerPage.sided[1] * copies;

		if (this.state.print_options.orientation === 'portrait')
			total_cost += this.props.pricesPerPage.orientation[0] * copies;
		else if (this.state.print_options.orientation === 'landscape')
			total_cost += this.props.pricesPerPage.orientation[1] * copies;

		if (this.state.print_options.quality === 'low')
			total_cost += this.props.pricesPerPage.quality[0] * copies;
		else if (this.state.print_options.quality === 'medium')
			total_cost += this.props.pricesPerPage.quality[1] * copies;
		else if (this.state.print_options.quality === 'high')
			total_cost += this.props.pricesPerPage.quality[2] * copies;

		if (this.state.print_options.color === 'black & white')
			total_cost += this.props.pricesPerPage.color[0] * copies;
		else if (this.state.print_options.color === 'color')
			total_cost += this.props.pricesPerPage.color[1] * copies;

		total_cost += parseFloat(this.state.handling_fee);

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
				//console.log("printer : ", cur_printer, " has: " , cur_printer[option] , "i want: ",  option_selection)
				if(option_selection !== null && cur_printer[option] !== "both" && cur_printer[option] !==  option_selection) { 
					//ex: this printer only has black & white, but i picked color
					//null means i didn't make a selection for the option yet, so i should only check if i made a selection
					//console.log("this one failed")
					new_matches.splice(i, 1);
					i--;
				}
			}
		});

		//set matching_printers state to new matches, so that only the new matches are rendered
		this.setState({
			matching_printers: new_matches,
		})
	};


		render() {
			let printer_data = Object.entries(this.state.matching_printers).map(([id, data]) => {
					return (<PrinterInfo 
								data={data} 
								key={id}
								PageEnum={this.props.PageEnum}
								changePage={this.props.changePage}
								updateCost={this.props.updateCost}
								price={this.calcCost()}
								pricesPerPage={this.props.pricesPerPage}
								transfer={this.state.print_options.transfer}
							/>
					);
			});

			return (
			<div>
					<div className="title">
							The Following Printers Have Matched Your Criteria
					</div>
					<img src='https://firebasestorage.googleapis.com/v0/b/printly.appspot.com/o/logo.png?alt=media&token=d339ba8b-b16f-4c4b-8fce-e56e2ddfdf29' className="logo" alt="logo"/>
					{this.state.print_options.transfer === 'delivery' ? 
					<Trackbar activeStep={1} deliver/> :
					<Trackbar activeStep={1}/>}
					<div id="matches_div">
						<div className="settings">
								<Settings
									printOptions={this.props.printOptions}
									handleChange={this.handleSettingsChange}
									print_options_state={this.state.print_options}	
								/>
						</div>
						<div className="printer_container">
							{printer_data}
						</div>
					</div>
					<div id="cart">
						<Cart 
							handling_fee={this.state.handling_fee}
							data={this.state.selected_pricing}
							price={this.state.price}
							copies={this.state.print_options.copies}
						/>
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

		handlePageChange = (new_page, new_printer_data, new_printer_img, new_cost, new_transfer) => {
			this.props.updateCost(new_cost, new_transfer);
			this.props.changePage(new_page, new_printer_data, new_printer_img);
		}

		render(){
				let stars = [];
				
				for (let i = 0; i < this.props.data["rating"]; i++){
						stars.push(<span className="fa fa-star checked" key={i}></span>)
				}
				let image = <img src='https://firebasestorage.googleapis.com/v0/b/printly.appspot.com/o/id_pictures%2Fprofile-icon-blue.png?alt=media&token=281ccc96-a3b3-4669-bb8b-7c1d17f07713' className="id_image" alt="logo" />
				return (
				<div className="printer_info" onClick={() => this.handlePageChange(this.props.PageEnum.JOBINPROGRESS, this.props.data, image, this.props.price, this.props.transfer)}>
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
								Distance: {this.props.data["distance"]}
								<br/>
								{(this.props.transfer === 'delivery') ?
									<>
										Delivery Cost: ${(this.props.pricesPerPage.transfer[1] * parseFloat(this.props.data["distance"])).toFixed(2)}
									</>
									:
									null
								}
						</div>
				</div>
				);
		}
}

export default MatchedPrinters;
