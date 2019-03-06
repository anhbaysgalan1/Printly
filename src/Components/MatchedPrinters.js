import React, { Component } from 'react';
import firebase from "firebase";
import Settings from './Settings.js';
import Cart from './Cart.js'
import Trackbar from './Trackbar';
import Subtotals from './Subtotals'
import Button from '@material-ui/core/Button';
import SortDropDown from './SortDropDown.js';
import PropTypes from 'prop-types';
import { withStyles, createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import '../App.css';

const theme = createMuiTheme({
	overrides: {
		MuiButton: {
			root: {
				marginTop: '10px',
			},
		},
	},
})

const styles = theme => ({
	button:{
		color: '#04619f',
		background: '#FFFFFF',
	},
	buttonleft:{
		color: '#04619f',
		background: '#FFFFFF',
	},
	buttonright:{
		color: '#04619f',
		background: '#FFFFFF',
	}

});

const SortEnum = {
	RATING : "Rating",
	DISTANCE : "Distance",
	PRICE : "Price",
}

const SortOptions = [
	"Rating",
	"Distance",
	"Price"
]

class MatchedPrinters extends Component {
	constructor(){
			super();

			this.state = {
				matching_printers : [], //printers that match the preferences i have listed 
				active_printers : [],
				print_options: {
						Transfer: "Pickup",
						Sided: "Single",
						Orientation: "Portrait",
						Quality: "Medium",
						Color: "Black & White",
						copies: 1,
						max_distance: 5,
						min_rating: 1
				},
				selected_pricing: {
					Transfer: '0.00',
					Sided: '0.00',
					Orientation: '0.00',
					Quality: '0.00',
					Color: '0.00',
				},
				handling_fee: '4.00',
				selected_printer_image: null,
				selected_printer_data: null,
				subtotal: 0.0,
				sort_by: SortEnum.RATING,
				showConfirmPopup: false,
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
						subtotal: init_cost
				});

				this.filterPrinters();
				
				this.props.updatePrintOptions(this.state.print_options);
		});
		this.calcIndivPrices();
	};

	componentDidUpdate = () => {
		if (this.state.selected_printer_image != null) {
			// deselect chosen printer if unavailable under new settings
			let shouldDeselect = true;

			for (var i = 0; i < this.state.matching_printers.length; i++) {
				if (this.state.selected_printer_data["id"] === (this.state.matching_printers[i])["id"]) {
					shouldDeselect = false;
					break;
				}
			}

			if (shouldDeselect) {
				this.setState({
					selected_printer_image: null,
					selected_printer_data: null
				});
			}
		}
	}

	handleSettingsChange = (name, event) => {
		if (!event.target.value || event.target.value < 1) {
			this.setState({ [name]: null });
		}
		else {
			let newState = this.state.print_options;
			newState[name] = event.target.value;

			this.setState({
				print_options: newState,
			})
		}

		this.filterPrinters();

		let new_cost = this.calcCost();
		this.setState({subtotal: new_cost});
		this.calcIndivPrices();

		this.props.updatePrintOptions(this.state.print_options);
	}

	handlePrinterChange = (printer_image, printer_data) => {
		this.setState({
			selected_printer_image: printer_image,
			selected_printer_data: printer_data
		});
		this.calcIndivPrices();
	}

	handlePageChange = (new_page, new_printer_data, new_printer_img, new_cost, new_Transfer) => {
		this.props.updateCost(new_cost, new_Transfer);
		this.props.changePage(new_page, new_printer_data, new_printer_img);
	}

	calcIndivPrices = () => {
		//console.log('data : ' ,this.state.selected_pricing)
		let new_prices = {}
		Object.keys(this.state.selected_pricing).map(option => {
			//console.log("OPTION SELECTION " , this.state.print_options[option])
			let option_selection = this.state.print_options[option]; //this is what we picked for each option. ex: i picked delivery for the Transfer option
			if(option_selection === null) {
				new_prices[option] = '0.00'
			}
			if(option === "Transfer") { 
				let deliv_cost = 0.0;
				if (this.state.print_options.Transfer === "Delivery" && this.state.selected_printer_data != null) {
					deliv_cost =
						(this.props.pricesPerPage.Transfer[1] * this.state.selected_printer_data["Distance"]).toFixed(2);
				}
				new_prices[option] = deliv_cost;
		
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

		if (this.state.print_options.Sided === 'Single')
			total_cost += this.props.pricesPerPage.Sided[0] * copies;
		else if (this.state.print_options.Sided === 'Double')
			total_cost += this.props.pricesPerPage.Sided[1] * copies;

		if (this.state.print_options.Orientation === 'Portrait')
			total_cost += this.props.pricesPerPage.Orientation[0] * copies;
		else if (this.state.print_options.Orientation === 'Landscape')
			total_cost += this.props.pricesPerPage.Orientation[1] * copies;

		if (this.state.print_options.Quality === 'Low')
			total_cost += this.props.pricesPerPage.Quality[0] * copies;
		else if (this.state.print_options.Quality === 'Medium')
			total_cost += this.props.pricesPerPage.Quality[1] * copies;
		else if (this.state.print_options.Quality === 'High')
			total_cost += this.props.pricesPerPage.Quality[2] * copies;

		if (this.state.print_options.Color === 'Black & White')
			total_cost += this.props.pricesPerPage.Color[0] * copies;
		else if (this.state.print_options.Color === 'Color')
			total_cost += this.props.pricesPerPage.Color[1] * copies;

		total_cost += parseFloat(this.state.handling_fee);
		// console.log("total cost:", total_cost);

		return total_cost;
	};

	handleSortChange = (new_val) => {
		this.sortPrinters(this.state.matching_printers, new_val);
	};

	sortIncreasing = (printers, key) => {
		let new_order = [];
		//console.log("key in increasing", key);
		let helper_array = [];

		for (var index = 0; index < printers.length; index++){
			//console.log("index", index);
			//console.log("printers[index]", printers[index]);
			//console.log("printers[index][key]", printers[index][key], key);
			helper_array.push([printers[index][key], index]);
		}
		
		helper_array.sort(function(first, second) {
			return first[0] - second[0];
		});
		
		//console.log.log(helper_array);
		
		for (var new_index = 0; new_index < helper_array.length; new_index++){
			new_order.push(printers[helper_array[new_index][1]]);
			////console.log.log(helper_array[new_index], new_index);
		}
		//console.log.log("after sorting", new_order);
		//console.log.log("returning", new_order);
		
		return new_order;
	};

	sortDecreasing = (printers, key) => {
		let new_order = [];
		//console.log.log("key in decreasing", key);
		let helper_array = [];

		for (var index = 0; index < printers.length; index++){
			//console.log("index", index);
			//console.log("printers[index]", printers[index]);
			//console.log("printers[index][key]", printers[index][key], key);
			helper_array.push([printers[index][key], index]);
		}
		
		helper_array.sort(function(first, second) {
			return second[0] - first[0];
		});
		
		//console.log.log(helper_array);
		
		for (var new_index = 0; new_index < helper_array.length; new_index++){
			new_order.push(printers[helper_array[new_index][1]]);
			////console.log.log(helper_array[new_index], new_index);
		}
		//console.log.log("after sorting", new_order);
		//console.log.log("returning", new_order);
		
		return new_order;
	};

	sortPrinters = (printers, new_val) => {
		//console.log.log("inside sort printers", new_val);
		//console.log.log("printers before:", printers);
		
		let new_matched;
		if (new_val == "Rating"){
			new_matched = this.sortDecreasing(printers, "Rating");
			this.setState({
				sort_by: new_val,
				matching_printers : new_matched
			});
		} else if (new_val == "Distance"){
			new_matched = this.sortIncreasing(printers, "Distance");
			this.setState({
				sort_by: new_val,
				matching_printers : new_matched
			});
		} else if (new_val == "Price"){
			if (this.state.print_options["Transfer"] == 'Delivery'){
				new_matched = this.sortIncreasing(printers, "Distance");
				this.setState({
					sort_by: new_val,
					matching_printers : new_matched
				});
			} else {
				this.setState({
					sort_by: new_val
				});
				//console.log("Will not sort on price when pickup selected");
			}
		} else {
			//console.log("Unkown sort key given to sortPrinters, returning original");
			new_matched = printers;
			this.setState({
				sort_by: new_val
			});
		}
		//console.log("returning sorted: ", new_matched);
		
		
		return new_matched;
	};

	filterPrinters = () => {
		var filterOptions = ['Transfer', 'Quality', 'Color']; //THESE ARE THE OPTIONS I AM USING TO FILTER
		let new_matches = Array.from(this.state.active_printers); //deep copy so i don't affect the actual active_printers state
		
		//for each option that we're filtering by, do this:
		filterOptions.map(option => {
			let option_selection = this.state.print_options[option]; //this is what we picked for each option. ex: i picked delivery for the Transfer option

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
		
		/// ---- Sort Printers will set the state
		this.sortPrinters(new_matches, this.state.sort_by);	
	};

	calcETA = (dist) => {
		let num = Math.ceil((dist * 10)/5)*5;
		return (num)  + "-" + (num + 5) + " min";
	};

	closePopup = (confirmed) => {
		this.setState({ showConfirmPopup: false });
		if (confirmed)
		{
			this.handlePageChange(
				this.props.PageEnum.JOBINPROGRESS,
				this.state.selected_printer_data,
				this.state.selected_printer_image,
				this.state.subtotal,
				this.state.print_options.Transfer);
		}
	};

	render() {
		const { classes } = this.props;

		let printer_data = Object.entries(this.state.matching_printers).map(([id, data]) => {
				let selected = false;
				if (this.state.selected_printer_data != null && 
					this.state.selected_printer_data["id"] === data["id"]) {
						selected = true;
				}

				return (<PrinterInfo
							data={data} 
							key={id}
							price={this.state.subtotal}
							pricesPerPage={this.props.pricesPerPage}
							Transfer={this.state.print_options.Transfer}
							choose={this.handlePrinterChange}
							isSelected={selected}
							calcETA={this.calcETA}
						/>
				);
		});

		// for cart to display
		let deliv_cost = 0.0;
		if (this.state.print_options.Transfer === "Delivery" && this.state.selected_printer_data != null) {
			deliv_cost =
				(this.props.pricesPerPage.Transfer[1] * this.state.selected_printer_data["Distance"]).toFixed(2);
		}
		

		//<MuiThemeProvider theme={theme}>
		// THIS WAS WRAPPING NAVIGATION BUTTONS			
		//		</MuiThemeProvider>

		let temp_left = classes.button + " buttonleft";
		let temp_right = classes.button + " buttonright";

		console.log("passing to cart", this.state.selected_pricing, this.state.print_options);
		return (
		<div>
			<div className="title">
				<div className="pagetitle">The Following Printers Have Matched Your Criteria</div>
				<img src='https://firebasestorage.googleapis.com/v0/b/printly.appspot.com/o/logo.png?alt=media&token=d339ba8b-b16f-4c4b-8fce-e56e2ddfdf29' className="logo" alt="logo"/>
			</div>
			<div>
				{this.state.print_options.Transfer === 'Delivery' ? 
				<Trackbar activeStep={1} deliver/> :
				<Trackbar activeStep={1}/>}
				<div className="navigation">
				<Button className={temp_left}//{classes.button} 
							variant="outlined"
							color="inherit"
							onClick={() => this.handlePageChange(
								this.props.PageEnum.HOME)}>
						Back to Home Page
					</Button>
					<Button className={temp_right}//{classes.button} 
							variant="outlined"
							color="inherit"
							onClick={() => this.setState({ showConfirmPopup: true })}
							disabled={this.state.selected_printer_data === null ? true : false}>
						Send Job to Printer
					</Button>
				</div>
				<div id="matches_div">
					<div className="settings">
							<Settings
								pricesPerPage={this.props.pricesPerPage}
								printOptions={this.props.printOptions}
								handleChange={this.handleSettingsChange}
								print_options_state={this.state.print_options}	
								optionInfo={this.props.optionInfo}
								data={this.state.selected_pricing}
								deliv_fee={deliv_cost}
								copies={this.state.print_options.copies}
							/>
					</div>
					<SortDropDown options={SortOptions} onChange={this.handleSortChange} value={this.state.sort_by}></SortDropDown>
					<div className="printer_container">
						{printer_data}
					</div>
				</div>
			</div>
			<div>
				<Subtotals price={this.state.subtotal}
							deliv_fee={deliv_cost}
							handling_fee={this.state.handling_fee}>
							</Subtotals>
			</div>

			{this.state.showConfirmPopup ?
				<ConfirmPopup
					closePopup={this.closePopup}
					print_options={this.state.print_options}
					selected_printer_image={this.state.selected_printer_image}
					selected_printer_data={this.state.selected_printer_data}
					pricesPerPage={this.props.pricesPerPage}
					calcETA={this.calcETA}
					subtotal={this.state.subtotal}/>
				:
				null
			}

		</div>
		);
	}
}


// <div className="MatchedPrintersSidebar">
// 				<div id="cart">
// 					<Cart
// 						data={this.state.selected_pricing}
// 						price={this.state.subtotal}
// 						copies={this.state.print_options.copies}
// 						handling_fee={this.state.handling_fee}
// 						deliv_fee={deliv_cost}
// 					/>
// 				</div>
				
// 			</div>

class PrinterInfo extends Component {
		constructor(){
				super(); 

				this.state = {
						images : []
				};
		}

		render(){
				let stars = [];
				for (let i = 0; i < Math.round(this.props.data["Rating"]); i++){
						stars.push(<span className="fa fa-star checked" key={i}></span>)
				}
				
				let image = <img src='https://firebasestorage.googleapis.com/v0/b/printly.appspot.com/o/id_pictures%2Fprofile-icon-blue.png?alt=media&token=281ccc96-a3b3-4669-bb8b-7c1d17f07713' className="id_image" alt="logo" />
				
				let classname = this.props.isSelected === true ? "selected_printer_info" : "printer_info";

				return (
				<div className={classname} onClick={() => this.props.choose(image, this.props.data)}>
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
								{(this.props.Transfer === 'Delivery') ?
									<>
										ETA: {this.props.calcETA(this.props.data["Distance"])}
										<br/>
										Delivery Cost: ${(this.props.pricesPerPage.Transfer[1] * parseFloat(this.props.data["Distance"])).toFixed(2)}
									</>
									:
									<>
										Distance: {this.props.data["Distance"]} mile{(this.props.data["Distance"] === 1) ? 
										"" : "s"}
										<br/>
									</>
								}
						</div>
				</div>
				);
		}
}


class ConfirmPopup extends Component {
	render() {
		let stars = [];
			for (let i = 0; i < Math.round(this.props.selected_printer_data["Rating"]); i++){
					stars.push(<span className="fa fa-star checked" key={i}></span>)
			}

		let job_description = null;
		if (this.props.print_options.Transfer === 'Delivery')
		{
			let delivery_cost = this.props.pricesPerPage.Transfer[1] * parseFloat(this.props.selected_printer_data["Distance"])
			job_description = 
				<div>
					<div className="underline bold">ETA</div>
					{this.props.calcETA(this.props.selected_printer_data["Distance"])}
					<br/>
					<br/>
					<br/>
					Subtotal: ${this.props.subtotal.toFixed(2)}
					<br/>
					Delivery: ${delivery_cost.toFixed(2)}
					<br/>
					<br/>
					<br/>
					<div className="bold">Total Cost: ${(this.props.subtotal + delivery_cost).toFixed(2)}</div>
				</div>
		}
		else
		{
			job_description = 
				<div>
					<div className="underline bold">Printer Address</div>
					{this.props.selected_printer_data["address"]}
					<br/>
					<br/>
					<br/>
					<div className="underline bold">Distance</div>
					{this.props.selected_printer_data["Distance"]} mile{(this.props.selected_printer_data["Distance"] === 1) ? "" : "s"}
					<br/>
					<br/>
					<br/>
					<div className="bold">Total Cost: ${this.props.subtotal.toFixed(2)}</div>
				</div>
		}

		return (
			<div className="popup">
				<div className="popup_inner">
					<div className="popup_title">Print Confirmation</div>
					<br/>
					<div>
						<div className="printer_preview">
							{this.props.selected_printer_image}
							<br/>
							{this.props.selected_printer_data["name"]}
							<br/>
							{stars}
						</div>
						<br/>
						{job_description}
					</div>
					<br/>
					<br/>
					<br/>
					<Button variant="outlined"
							color="blue"
							onClick={() => this.props.closePopup(false)}>
						Cancel
					</Button>

					&nbsp;
					&nbsp;
					&nbsp;

					<Button variant="outlined"
							color="blue"
							onClick={() => this.props.closePopup(true)}>
						Confirm & Submit!
					</Button>
				</div>
			</div>
		);
	}
}


MatchedPrinters.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(MatchedPrinters);
