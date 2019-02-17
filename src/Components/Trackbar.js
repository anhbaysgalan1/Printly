import React, { Component } from 'react';
import '../App.css';

class Trackbar extends Component {
  move

  render() {
    return (
      <div className="container">
        <ul class="progressbar">
            <li class="active after">Document Uploaded</li>
            <li>Job Accepted</li>
            <li>Document Printed</li>
            <li>Ready for Pickup</li>
        </ul>
      </div>
    );
  }
}

export default Trackbar;
