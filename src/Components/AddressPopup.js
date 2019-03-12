import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import '../App.css'
import { withStyles} from '@material-ui/core/styles';


const addresses = ["AK", "AL", "AR", "AZ", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "ME", "MI", "MN", "MO", "MS", "MT", "NC", "ND", "NE", "NH", "NJ", "NM", "NV", "NY", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VA", "VT", "WA", "WI", "WV", "WY"]

const styles = theme => ({
	button:{
		color: '#04619f',
		background: '#FFFFFF',
		margin: '0'
	},
});

class AddressPopup extends React.Component{
	constructor() {
		super();
		this.state = {
			street: '2145 Sheridan Rd',
			apt: '',
			city: 'Evanston',
			state: 'IL',
			zip: '60201',
			full_address: '2145 Sheridan Rd, Evanston, IL, 60201'
		}
	};

	componentWillMount = () => {
		let addr_arr = this.props.oldAddr.split(", ")
		console.log("addr_arr: ", addr_arr)
		if(addr_arr.length === 5) {
			this.setState({
				street: addr_arr[0],
				apt: addr_arr[1],
				city: addr_arr[2],
				state: addr_arr[3],
				zip: addr_arr[4],
				full_address: this.props.oldAddr
			});
		}
		else {
			this.setState({
				street: addr_arr[0],
				apt: "",
				city: addr_arr[1],
				state: addr_arr[2],
				zip: addr_arr[3],
				full_address: this.props.oldAddr
			});
		}
	};

	handleChange = name => event => {
		console.log("changing " + name + " to " + event.target.value);
		this.setState({ [name]: event.target.value });
	};

	updateFullAddress = () => {
		let new_addr = [this.state.street, this.state.city, this.state.state, this.state.zip].join(", ");
		if(this.state.apt !== "") {
			new_addr = [this.state.street, this.state.apt, this.state.city, this.state.state, this.state.zip].join(", ");
		}
		console.log("new address: " + new_addr)
		this.setState({
			full_address: new_addr
		});
		this.props.confirm(new_addr);
	}



  	render() {
		const { classes } = this.props;
		return (
			<div className="popup">
				<div className="popup_inner">
					<div className="popup_title">Update Delivery Address</div>
					<br/>
					<div>
						<TextField
							id="standard-name"
							label="Street Address"
							value={this.state.street}
							onChange={this.handleChange("street")}
							error={this.state.street === ""}
							margin="normal"
							variant="outlined"
						/>
						&nbsp;
						<TextField
							id="standard-name"
							label="Apt (optional)"
							value={this.state.apt}
							onChange={this.handleChange("apt")}
							margin="normal"
							variant="outlined"
						/>
						<br />
						<TextField
							id="standard-name"
							label="City"
							value={this.state.city}
							onChange={this.handleChange("city")}
							error={this.state.city === ""}
							margin="normal"
							variant="outlined"
						/>
						&nbsp;
						<TextField
							id="standard-name"
							select
							label="State"
							value={this.state.state}
							onChange={this.handleChange("state")}
							error={this.state.state === ""}
							margin="normal"
							variant="outlined"
						>
							{addresses.map(option => (
								<MenuItem key={option} value={option}>
									{option}
								</MenuItem>
							))}
						</TextField>
						<br />
						<TextField
							id="standard-name"
							label="Zip Code"
							className={classes.textField}
							value={this.state.zip}
							onChange={this.handleChange("zip")}
							error={this.state.zip === ""}
							margin="normal"
							variant="outlined"
						/>
					</div>
					<br />
					<br />
					<br />
					<br />

					<Button variant="outlined"
							color="blue"
							onClick={() => this.props.cancel(false)}>
						Cancel
					</Button>

					&nbsp;
					&nbsp;
					&nbsp;

					<Button variant="outlined"
							color="blue"
							disabled={this.state.street === "" || this.state.city === "" || this.state.state === "" || this.state.zip === ""}
							onClick={() => this.updateFullAddress()}>
						Save Changes
					</Button>
				</div>
			</div>

		)
	}
}

export default withStyles(styles)(AddressPopup);
