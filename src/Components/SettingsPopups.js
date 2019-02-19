import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import TextField from '@material-ui/core/TextField';
import classNames from 'classnames';

export default class SettingsPopups extends React.Component{


  render() {

    return (
      <div className="popup">
        <div className="popup_inner">
          <div className="title">Print Job Details</div>
          <FormControlLabel value="" control={<Radio />} label="Black & White" />
          <FormControlLabel value="" control={<Radio />} label="Color" />
          <FormControlLabel value="" control={<Radio />} label="Delivery" />
          <FormControlLabel value="" control={<Radio />} label="Pickup" />
          <FormControlLabel value="" control={<Radio />} label="Double Sided" />
          <FormControlLabel value="" control={<Radio />} label="Single Sided" />
          <div>Number of copies: <input type="text" defaultValue={this.props.inputValue} id="food_name"/></div>
          
          <div>Cost of Delivery: $1.00</div>
          
        
        </div>
      </div>
    )
  }
}