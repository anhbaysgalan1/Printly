import React, { Component } from 'react';
import Trackbar from './Trackbar';
import FilePreview from './FilePreview.js';
import '../App.css';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

const styles = theme => ({
	button:{
		color: '#04619f',
		background: '#FFFFFF',
	},
});

class Home extends Component {
	state = {
		submitDisabled: true
	}

	render() {
		const { classes } = this.props;
		let temp_center = classes.button + " buttoncenter";
		let temp_right = classes.button + " buttonright";
		
		return (
			<div>
				<div className="title">
				</div>
				<div className="trackbar_container">
					<Trackbar activeStep={0} />
				</div>
				<div className="navigation">
					<Button  variant="outlined" 
						color="inherit" 
						className={temp_right}//{classes.button}
						onClick={() => this.props.changePage(this.props.PageEnum.MATCHEDPRINTERS)}
						disabled={this.props.selected_file_url === null ? true : false}>
					Submit for Printing!
				</Button>
				</div>
				{this.props.selected_file_url === null ?
				<div className="homeInfo">
					<img src='https://firebasestorage.googleapis.com/v0/b/printly.appspot.com/o/logo_new.png?alt=media&token=5b6207ee-4d0e-4a20-9e13-48933fe60432' className="logo" alt="logo"/>
					<br/>
					<br/>
					Welcome to printly! It's Uber for your papers! 
					<br/>
					Select the button below to upload a file for printing! 
					<br/>
					<br/>
					<br/>
					<Button
						variant="outlined"
						component="label"
						className={temp_center} //{classes.button}
						>
						Upload File
						<input type="file" 
							style={{display: 'none'}}
							onChange={this.props.chooseFile}>
						</input>
					</Button>
				</div>
				:
				<div id="file_preview">
					<FilePreview file_url={this.props.selected_file_url}/>
				</div>
				}
			</div>
		);
	}
}

Home.propTypes = {
	classes: PropTypes.object.isRequired
  };

export default withStyles(styles)(Home);