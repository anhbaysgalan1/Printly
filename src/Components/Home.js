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
	render() {
		const { classes } = this.props;

		return (
			<div>
				<div className="title">Home</div>
				<Trackbar activeStep={0} />
				<div>
					<input type="file" onChange={this.props.chooseFile}>
					</input>
				</div>
				<br/>
				<div id="file_preview">
					Preview
					<FilePreview file_data={this.props.selected_file_data}
								file_name={this.props.selected_file}/>
				</div>
				<br/>
				<Button  variant="outlined" color="inherit" className={classes.button} onClick={() => this.props.changePage(this.props.PageEnum.MATCHEDPRINTERS)}>
					Submit for Printing!
				</Button>
			</div>
		);
	}
}

Home.propTypes = {
	classes: PropTypes.object.isRequired
  };

export default withStyles(styles)(Home);