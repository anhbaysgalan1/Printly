import React, { Component } from 'react';
import '../App.css';
import firebase from "firebase";


const PageEnum = {
    HOME : 1,
    MATCHEDPRINTERS : 2,
    JOBINPROGRESS : 3,
}

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
            return (<PrinterInfo data={data} key={id} changePage={this.props.changePage}></PrinterInfo>);
        });

        return (
        <div>
            <div className="printer_header">
                The Following Printers Have Matched Your Criteria
            </div>
            {printer_data}
        </div>
        );
  }
}

class PrinterInfo extends Component {
    constructor(){
        super(); 

        this.state = {
            images : []
        };
    }

    changePage = (newPage, new_printer_data, new_printer_img) => {
        this.props.changePage(newPage, new_printer_data, new_printer_img);
    }

    render(){
        let stars = [];
        
        for (let i = 0; i < this.props.data["rating"]; i++){
            stars.push(<span className="fa fa-star checked" key={i}></span>)
        }
        let image = <img src='https://firebasestorage.googleapis.com/v0/b/printly.appspot.com/o/id_pictures%2Fdefault-profile-picture.png?alt=media&token=324bbe06-2b57-46cc-a9e8-8f5778ec34f6' className="id_image" alt="logo" />
        return (
        <div className="printer_info" onClick={() => this.props.changePage(PageEnum.JOBINPROGRESS, this.props.data, image)}>
            <div className="printer_image">
                {image}
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
