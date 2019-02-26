import React, { Component } from 'react';
import firebase from "firebase";
import Settings from './Settings.js';
import Cart from './Cart.js'
import Trackbar from './Trackbar';
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
				selected_printer_image: null,
				selected_printer_data: null,
				subtotal: 0.0,
				sort_by: SortEnum.RATING
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
	}

	handlePageChange = (new_page, new_printer_data, new_printer_img, new_cost, new_transfer) => {
		this.props.updateCost(new_cost, new_transfer);
		this.props.changePage(new_page, new_printer_data, new_printer_img);
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
			new_matched = this.sortDecreasing(printers, "rating");
			this.setState({
				sort_by: new_val,
				matching_printers : new_matched
			});
		} else if (new_val == "Distance"){
			new_matched = this.sortIncreasing(printers, "distance");
			this.setState({
				sort_by: new_val,
				matching_printers : new_matched
			});
		} else if (new_val == "Price"){
			if (this.state.print_options["transfer"] == 'delivery'){
				new_matched = this.sortIncreasing(printers, "distance");
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
		
		/// ---- Sort Printers will set the state
		this.sortPrinters(new_matches, this.state.sort_by);	
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
							transfer={this.state.print_options.transfer}
							choose={this.handlePrinterChange}
							isSelected={selected}
						/>
				);
		});

		// for cart to display
		let deliv_cost = 0.0;
		if (this.state.print_options.transfer === "delivery" && this.state.selected_printer_data != null) {
			deliv_cost =
				(this.props.pricesPerPage.transfer[1] * this.state.selected_printer_data["distance"]).toFixed(2);
		}

		return (
		<div>
			<div className="title">
				<div className="pagetitle">The Following Printers Have Matched Your Criteria</div>
				<img src='https://firebasestorage.googleapis.com/v0/b/printly.appspot.com/o/logo.png?alt=media&token=d339ba8b-b16f-4c4b-8fce-e56e2ddfdf29' className="logo" alt="logo"/>
			</div>
			<div>
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
					<SortDropDown options={SortOptions} onChange={this.handleSortChange} value={this.state.sort_by}></SortDropDown>
					<div className="printer_container">
						{printer_data}
					</div>
				</div>
			</div>
			<div className="MatchedPrintersSidebar">
				<div id="cart">
					<Cart
						data={this.state.selected_pricing}
						price={this.state.subtotal}
						copies={this.state.print_options.copies}
						handling_fee={this.state.handling_fee}
						deliv_fee={deliv_cost}
					/>
				</div>
				<MuiThemeProvider theme={theme}>
					<Button className={classes.button} variant="outlined"
							color="inherit"
							onClick={() => this.handlePageChange(
								this.props.PageEnum.HOME)}>
						Back to Home Page
					</Button>
					<Button className={classes.button} variant="outlined"
							color="inherit"
							onClick={() => this.handlePageChange(
								this.props.PageEnum.JOBINPROGRESS,
								this.state.selected_printer_data,
								this.state.selected_printer_image,
								this.state.subtotal,
								this.state.print_options.transfer)}
							disabled={this.state.selected_printer_data === null ? true : false}>
						Send Job to Printer
					</Button>
				</MuiThemeProvider>
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
								Distance: {this.props.data["distance"]} mile{(this.props.data["distance"] === 1) ? 
								"" : "s"}
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

MatchedPrinters.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(MatchedPrinters);
