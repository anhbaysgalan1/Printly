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
  constructor(){
      super();

      this.state = {
        active_printers : []
      };
  }

  componentWillMount = () => {
    firebase.database().ref('active_printers').on('value', (snapshot) => {
        let printer_buff = [];
        snapshot.forEach((child) => {
            printer_buff.push(child.val());
        })

        this.setState({
            active_printers: printer_buff
        });
        console.log(printer_buff);
    });
  };
  
    render() {
        let printer_data = Object.entries(this.state.active_printers).map(([id, data]) => {
            return (<PrinterInfo data={data} key={id}></PrinterInfo>);
        });

        return (
        <div>
            {printer_data}
        </div>
        );
  }
}

class PrinterInfo extends Component {
    render(){
        let stars = [];
        
        for (let i = 0; i < this.props.data["rating"]; i++){
            stars.push(<span className="fa fa-star checked" key={i}></span>)
        }
        return (
        <div className="printer_info">
            <div className="printer_image">
                <img src='../logo.svg' className="App_logo" alt="logo" />
            </div>
            <div className="printer_data">
                Name: {this.props.data["name"]} 
                <br/>
                Address: {this.props.data["address"]}
                <br/>
                Rating: {stars}
            </div>
        </div>
        );
    }
}

export default MatchedPrinters;
