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
          <p className="settingsheading">Color Details</p>
          <div>
          <FormControlLabel value="" control={<Radio />} label="Black & White" />
          <FormControlLabel value="" control={<Radio />} label="Color" />
          </div>

          <p className="settingsheading">Delivery Details</p>
          <div>
          <FormControlLabel value="" control={<Radio />} label="Delivery" />
          <FormControlLabel value="" control={<Radio />} label="Pickup" />
          </div>

          <p className="settingsheading">Double or Single Sided</p>
          <div>
          <FormControlLabel value="" control={<Radio />} label="Double Sided" />
          <FormControlLabel value="" control={<Radio />} label="Single Sided" />
          </div>

          <p className="settingsheading">Orientation Details</p>
          <div>
          <FormControlLabel value="" control={<Radio />} label="Portrait" />
          <FormControlLabel value="" control={<Radio />} label="Landscape" />
          </div>

          <p className="settingsheading">Print Quality</p>
          <div>
          <FormControlLabel value="" control={<Radio />} label="Low" />
          <FormControlLabel value="" control={<Radio />} label="Medium" />
          <FormControlLabel value="" control={<Radio />} label="High" />
          </div>

          <div>Number of copies: <input type="text" defaultValue={this.props.inputValue} id="food_name"/></div>

          <div>Cost of Delivery: $4.00</div>
          
        
        </div>
      </div>
    )
  }
}