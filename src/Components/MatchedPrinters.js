import React, { Component } from 'react';
import '../App.css';
import firebase from "firebase";
import Settings from './Settings.js';


const PageEnum = {
    HOME : 1,
    MATCHEDPRINTERS : 2,
    JOBINPROGRESS : 3,
}

const printOptions = {
      transfer: ['pickup', 'delivery'],
      sided: ['single', 'double'],
      orientation: ['portrait', 'landscape'],
      quality: ['poor', 'medium', 'high'],
      color: ['greyscale', 'color']
}


class MatchedPrinters extends Component {
  constructor(){
      super();

      this.state = {
        active_printers : [],
        settings: {
            color: true,
            double_sided: false,
            max_distance: 5,
            min_rating: 1
        },
        printOptions: {
            transfer: null,
            sided: null,
            orientation: null,
            quality: null,
            color: null,
            copies: 1
        }
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
        // console.log(printer_buff);
    });
  };

  handleChange = (name, event) => {
    this.setState({ [name]: event.target.value });
    console.log('name : ' , name , ' value: ' , event.target.value)
    if(!event.target.value || event.target.value < 1) {
      this.setState({ [name]: null });
      console.log("setting ", name , 'to null')
    }
    console.log(this.state)

  };
  
    render() {
        let printer_data = Object.entries(this.state.active_printers).map(([id, data]) => {
            return (<PrinterInfo data={data} key={id} changePage={this.props.changePage}></PrinterInfo>);
        });

        return (
        <div>
            <div className="title">
                The Following Printers Have Matched Your Criteria
            </div>
            <div className="settings">
                <Settings
                        printOptions={printOptions}
                        handleChange={this.handleChange}
                        print_options={this.state.printOptions}>
                    
                </Settings>
            </div>
            <div className="printer_container">
            {printer_data}
            </div>
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
                {this.props.data["name"]} 
                <br/>
                Address: {this.props.data["address"]}
                <br/>
                Distance: {this.props.data["distance"]}
                <br/>
                Rating: {stars}
                <br/>
                Quality: {this.props.data["quality"]}
                <br/>
                Cost: $4.00
            </div>
        </div>
        );
    }
}

export default MatchedPrinters;
