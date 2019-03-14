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
		let temp_left = classes.button + " buttonleft";
		
		return (
			<div>
				<div className="title">
					<div className="username">Hello {this.props.displayName}!</div>
					<img src='https://firebasestorage.googleapis.com/v0/b/printly.appspot.com/o/logo_new.png?alt=media&token=5b6207ee-4d0e-4a20-9e13-48933fe60432' className="logo" alt="logo"/>
				</div>
				<div className="trackbar_container">
					<Trackbar activeStep={0} />
				</div>
				{this.props.selected_file_url === null
				?
				<div className="homeInfo">
					<div className="home_top_container">
						<img src='https://firebasestorage.googleapis.com/v0/b/printly.appspot.com/o/Printly%20Home%20-%20top.png?alt=media&token=1981989b-0e64-45e1-94fb-9a5d5e21a3d5' alt="home_info" className="home_top_image"/>
					</div>
					<div className="home_upload_container">
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
					<div className="home_bottom_container">
						<div className="home_bottom_text">
							<span style={{fontWeight: 'bold'}}>Our Mission:</span>
							<br/>
							<br/>	
							<span>We connect your 24 / 7 printing needs</span>
							<br/>
							<span>with printlys in your neighborhood.</span>
						</div>
					</div>
				</div>
				:
				<>
				<div className="navigation">
					<Button style={{maxWidth: '160px', maxHeight: '50px', minWidth: '160px', minHeight: '50px'}}
						variant="outlined"
						component="label"
						className={temp_left} //{classes.button}
						>
						Upload File
						<input type="file" 
							style={{display: 'none'}}
							onChange={this.props.chooseFile}>
						</input>
					</Button>
					<Button  style={{maxWidth: '160px', maxHeight: '50px', minWidth: '160px', minHeight: '50px'}} variant="outlined" 
						color="inherit" 
						className={temp_right}//{classes.button}
						onClick={() => this.props.changePage(this.props.PageEnum.MATCHEDPRINTERS)}
						disabled={this.props.selected_file_url === null ? true : false}>
					Submit
				</Button>
				</div>
				<div id="file_preview">
					<FilePreview file_url={this.props.selected_file_url}/>
				</div>
				</>
				}
			</div>
		);
	}
}

Home.propTypes = {
	classes: PropTypes.object.isRequired
  };

export default withStyles(styles)(Home);
