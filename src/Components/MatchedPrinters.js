import React, { Component } from 'react';
import firebase from "firebase";
import Settings from './Settings.js';
import Trackbar from './Trackbar';
import Subtotals from './Subtotals';
import AddressPopup from './AddressPopup';
import Button from '@material-ui/core/Button';
import SortDropDown from './SortDropDown.js';
import PropTypes from 'prop-types';
import { withStyles} from '@material-ui/core/styles';//, createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import '../App.css';
import ConfirmPopup from './ConfirmPopup.js';
import PrinterInfo from './PrinterInfo.js';

const styles = theme => ({
	button:{
		color: '#04619f',
		background: '#FFFFFF',
	},
	buttonleft:{
		color: '#04619f',
		background: '#FFFFFF',
		display: 'inline'
	},
	buttonright:{
		color: '#04619f',
		background: '#FFFFFF',
		display: 'inline'
	},
	address:{
		margin: '0',
		paddingRight: '1em',
		display: 'inline'
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
				showAddressPopup: false,
				address: '2145 Sheridan Rd, Evanston, IL, 60208',
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
		if(name === 'copies') {
			let newState = this.state.print_options;
			let numCopies = event.target.value;
			if(numCopies> 100) {
				numCopies = 100;
			}
			newState['copies'] = numCopies;
			this.setState({
				print_options: newState,
			})
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
		let new_prices = {}
		Object.keys(this.state.selected_pricing).map(option => {
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

			return null;
		})

		this.setState({
			selected_pricing: new_prices,
		})
	};

	calcCost = () => {
		let total_cost = 0.0;

		if (this.state.print_options.Sided === 'Single')
			total_cost += this.props.pricesPerPage.Sided[0];
		else if (this.state.print_options.Sided === 'Double')
			total_cost += this.props.pricesPerPage.Sided[1];

		if (this.state.print_options.Orientation === 'Portrait')
			total_cost += this.props.pricesPerPage.Orientation[0];
		else if (this.state.print_options.Orientation === 'Landscape')
			total_cost += this.props.pricesPerPage.Orientation[1];

		if (this.state.print_options.Quality === 'Low')
			total_cost += this.props.pricesPerPage.Quality[0];
		else if (this.state.print_options.Quality === 'Medium')
			total_cost += this.props.pricesPerPage.Quality[1];
		else if (this.state.print_options.Quality === 'High')
			total_cost += this.props.pricesPerPage.Quality[2];

		if (this.state.print_options.Color === 'Black & White')
			total_cost += this.props.pricesPerPage.Color[0];
		else if (this.state.print_options.Color === 'Color')
			total_cost += this.props.pricesPerPage.Color[1];

		total_cost = total_cost * this.props.file_size*0.05 * this.state.print_options.copies;
		total_cost += parseFloat(this.state.handling_fee);

		return total_cost;
	};

	handleSortChange = (new_val) => {
		this.sortPrinters(this.state.matching_printers, new_val);
	};

	sortIncreasing = (printers, key) => {
		let new_order = [];
		let helper_array = [];

		for (var index = 0; index < printers.length; index++){
			helper_array.push([printers[index][key], index]);
		}
		
		helper_array.sort(function(first, second) {
			return first[0] - second[0];
		});
		
		for (var new_index = 0; new_index < helper_array.length; new_index++){
			new_order.push(printers[helper_array[new_index][1]]);
		}
		
		return new_order;
	};

	sortDecreasing = (printers, key) => {
		let new_order = [];
		let helper_array = [];

		for (var index = 0; index < printers.length; index++){
			helper_array.push([printers[index][key], index]);
		}
		
		helper_array.sort(function(first, second) {
			return second[0] - first[0];
		});
		
		for (var new_index = 0; new_index < helper_array.length; new_index++){
			new_order.push(printers[helper_array[new_index][1]]);
		}
		
		return new_order;
	};

	sortPrinters = (printers, new_val) => {
		let new_matched;
		if (new_val === "Rating"){
			new_matched = this.sortDecreasing(printers, "Rating");
			this.setState({
				sort_by: new_val,
				matching_printers : new_matched
			});
		} else if (new_val === "Distance"){
			new_matched = this.sortIncreasing(printers, "Distance");
			this.setState({
				sort_by: new_val,
				matching_printers : new_matched
			});
		} else if (new_val === "Price"){
			if (this.state.print_options["Transfer"] === 'Delivery'){
				new_matched = this.sortIncreasing(printers, "Distance");
				this.setState({
					sort_by: new_val,
					matching_printers : new_matched
				});
			} else {
				this.setState({
					sort_by: new_val
				});
			}
		} else {
			new_matched = printers;
			this.setState({
				sort_by: new_val
			});
		}
		return new_matched;
	};

	filterPrinters = () => {
		var filterOptions = ['Transfer', 'Quality', 'Color']; 
		let new_matches = Array.from(this.state.active_printers); //deep copy so i don't affect the actual active_printers state
		
		//for each option that we're filtering by, do this:
		filterOptions.map(option => {
			let option_selection = this.state.print_options[option]; //this is what we picked for each option. ex: i picked delivery for the Transfer option

			for(var i = 0; i < new_matches.length; i++) { //for each printer, if the option offered doesn't match my option selection, remove it from the list
				let cur_printer = new_matches[i]
	
				if(option_selection !== null && cur_printer[option] !== "both" && cur_printer[option] !==  option_selection) { 
					//ex: this printer only has black & white, but i picked color
					//null means i didn't make a selection for the option yet, so i should only check if i made a selection
					new_matches.splice(i, 1);
					i--;
				}
			}

			return null;
		});
		
		/// ---- Sort Printers will set the state
		this.sortPrinters(new_matches, this.state.sort_by);	
	};

	calcETA = (dist) => {
		let num = Math.ceil((dist * 10)/5)*5;
		return (num)  + "-" + (num + 5) + " min";
	};

	showHideAddrPopup = (value) => {
		this.setState({
			showAddrPopup: value,
		});
	}

	updateAddress= (new_addr) => {
		this.props.changeAddress(new_addr);
		this.setState({
			address: new_addr,
		});
		
		this.showHideAddrPopup(false);
	}

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
		
		let temp_left = classes.button + " buttonleft";
		let temp_right = classes.button + " buttonright";

		return (
		<div>
			<div className="title">
				<div className="username">Hello {this.props.displayName}!</div>
				<img src='https://firebasestorage.googleapis.com/v0/b/printly.appspot.com/o/logo_new.png?alt=media&token=5b6207ee-4d0e-4a20-9e13-48933fe60432' className="logo" alt="logo"/>
			</div>
			<div>
				{this.state.print_options.Transfer === 'Delivery' ? 
				<div className="trackbar_container">
					<Trackbar activeStep={1} deliver/>
				</div> :
				<div className="trackbar_container">
					<Trackbar activeStep={1}/>
				</div>}
				<div className="navigation" style={{display: 'flex', marginBottom: '5px'}}>
				<Button style={{maxWidth: '160px', maxHeight: '50px', minWidth: '160px', minHeight: '50px', marginRight: 'auto'}} className={temp_left}//{classes.button} 
							variant="outlined"
							color="inherit"
							onClick={() => this.handlePageChange(
								this.props.PageEnum.HOME)}>
						Back
				</Button>
				{this.state.print_options.Transfer === 'Delivery' ?
					<div style={{height: '42px', marginTop: '8px'}}> 
						<p className={classes.address}>Deliver to: {this.props.deliveryAddress}</p>
						<Button	className={classes.button} 
								onClick={this.showHideAddrPopup}
								variant="outlined"
								color="inherit">
						Change
						</Button>
					</div>
					:
					null
				}
				<Button style={{maxWidth: '160px', maxHeight: '50px', minWidth: '160px', minHeight: '50px', marginLeft: 'auto'}} className={temp_right}//{classes.button} 
						variant="outlined"
						color="inherit"
						onClick={() => this.setState({ showConfirmPopup: true })}
						disabled={this.state.selected_printer_data === null ? true : false}>
					Review Order
				</Button>
				</div>
				<div id="matches_div">
					<div className="matches_bar">
						<div className="settings_div">
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
						<div className="subtotals_div">
							<Subtotals
								price={this.state.subtotal}
								deliv_fee={deliv_cost}
								discount_rate={this.props.discount_rate}
							/>
						</div>
					</div>
					
					<SortDropDown options={SortOptions} onChange={this.handleSortChange} value={this.state.sort_by}></SortDropDown>
					<div className="printer_container">
						{printer_data}
					</div>
				</div>
				<br/>
				<br/>
				<br/>
				<br/>
				<br/>
				<br/>
				<br/>
				<br/>
			</div>
			{this.state.showConfirmPopup ?
				<ConfirmPopup
					closePopup={this.closePopup}
					print_options={this.state.print_options}
					selected_printer_image={this.state.selected_printer_image}
					selected_printer_data={this.state.selected_printer_data}
					pricesPerPage={this.props.pricesPerPage}
					calcETA={this.calcETA}
					subtotal={this.state.subtotal}
					discount_rate={this.props.discount_rate}/>
				:
				null
			}
			{this.state.showAddrPopup ?
				<AddressPopup confirm={this.updateAddress} cancel={this.showHideAddrPopup} oldAddr={this.state.address}/>
				:
				null
			}

		</div>
		);
	}
}

MatchedPrinters.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(MatchedPrinters);
