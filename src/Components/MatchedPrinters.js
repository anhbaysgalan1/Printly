import React, { Component } from 'react';
import '../App.css';
import firebase from "firebase";

var config = {
    apiKey: "AIzaSyD0ZMlZ0JCrCqsCxDx1MK1HO0taGmXZkXY",
    authDomain: "printly.firebaseapp.com",
    databaseURL: "https://printly.firebaseio.com",
    storageBucket: "printly.appspot.com",
};
firebase.initializeApp(config);

class MatchedPrinters extends Component {
  render() {
    return (
      <div>
          HELLO
      </div>
    );
  }
}

export default MatchedPrinters;
