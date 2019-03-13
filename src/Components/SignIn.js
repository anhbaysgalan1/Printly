import React from 'react';
import firebase from "firebase";
import StyleFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

export default class SignIn extends React.Component {
	uiConfig = {
		signInFlow: "popup",
		signInOptions: [
			firebase.auth.GoogleAuthProvider.PROVIDER_ID
		],
		callbacks: {
			signInSuccessWithAuthResults: () => false
		}
	};

	render() {
		return (
			<div>
				<div className="title"></div>
				<div className="homeInfo">
					<div className="home_top_container">
						<img src='https://firebasestorage.googleapis.com/v0/b/printly.appspot.com/o/Printly%20Home%20-%20top.png?alt=media&token=1981989b-0e64-45e1-94fb-9a5d5e21a3d5' alt="home_info" className="home_top_image"/>
					</div>
					<div className="home_upload_container">
						<StyleFirebaseAuth
							uiConfig={this.uiConfig}
							firebaseAuth={firebase.auth()}
						/>
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
           </div>
	);}
} 
