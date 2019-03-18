import React, { Component } from 'react';
import firebase from "firebase";
import '../App.css';

class PrinterInfo extends Component {
    constructor(){
            super(); 

            this.state = {
                    images : []
            };
    }

    render(){
            let stars = [];
            for (let i = 0; i < Math.round(this.props.data["Rating"]); i++){
                    stars.push(<span className="fa fa-star checked" key={i}></span>)
            }
            let imageRef = firebase.storage().ref().child('id_pictures/' + this.props.data["name"] + ".png");
            imageRef.getDownloadURL().then((url) => {
                document.getElementById(this.props.data["id"]).src = url;    
            }).catch(function (error) {
                console.log(error);
            });
            
            let image = <img id={this.props.data["id"]} src='https://firebasestorage.googleapis.com/v0/b/printly.appspot.com/o/id_pictures%2Fprofile-icon-blue.png?alt=media&token=281ccc96-a3b3-4669-bb8b-7c1d17f07713' className="id_image" alt="logo" />
            
            let classname = this.props.isSelected === true ? "selected_printer_info" : "printer_info";

            return (
            <div className={classname} onClick={() => this.props.choose(image, this.props.data)}>
                    <div className="printer_data printer_title">
                    {this.props.data["name"]} 
                    </div>
                    <div className="printer_image">
                            {image}
                    </div>
                    <div className="printer_data">
                            <br/>
                            Rating: {stars}
                            <br/>
                            {(this.props.Transfer === 'Delivery') ?
                                <>
                                    ETA: {this.props.calcETA(this.props.data["Distance"])}
                                    <br/>
                                    Delivery Cost: ${(this.props.pricesPerPage.Transfer[1] * parseFloat(this.props.data["Distance"])).toFixed(2)}
                                </>
                                :
                                <>
                                    Distance: {this.props.data["Distance"]} mile{(this.props.data["Distance"] === 1) ? 
                                    "" : "s"}
                                    <br/>
                                </>
                            }
                    </div>
            </div>
            );
    }
}

export default PrinterInfo;