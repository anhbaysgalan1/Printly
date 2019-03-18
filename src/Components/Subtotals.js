import React from 'react';
import '../App.css'

class Subtotals extends React.Component {
	render() {
		return (
			<div style={{ height: '5.5em', backgroundColor:  '#04619f', float: 'right', width: "15vw", paddingTop: '1em', paddingBottom: '1.5em' }}>
				<div style={{ fontWeight: "bold", fontSize: "1.7em", color: "white" }}>Grand Total</div>
				<div style={{ fontSize: "1.2em", color: "white", textDecoration: "line-through" }}>
					${(this.props.price + parseFloat(this.props.deliv_fee)).toFixed(2)}
				</div>
				<div style={{ fontSize: "1.6em", color: "white" }}>
					${((this.props.price + parseFloat(this.props.deliv_fee)) - this.props.discount_rate*(this.props.price + parseFloat(this.props.deliv_fee))).toFixed(2)}
				</div>
			</div>
		);
	}
}

export default Subtotals;