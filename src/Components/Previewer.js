import React, { Component } from 'react';
// Import React FilePond
import { FilePond, registerPlugin } from 'react-filepond';

// Import FilePond styles
import 'filepond/dist/filepond.min.css';

// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

// Our app
export default class Previewer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // Set initial files, type 'local' means this is a file
            // that has already been uploaded to the server (see docs)
            files: [{
                source: 'https://firebasestorage.googleapis.com/v0/b/printly.appspot.com/o/preview?alt=media&token=b973789f-1f81-4d74-89b8-d75a2f25441d',
            }]
        };
    }
    
    handleInit() {
        console.log('FilePond instance has initialised', this.pond);
    }

    render() {
        return (
            <div className="App">
            
                {/* Pass FilePond properties as attributes */}
                <FilePond ref={ref => this.pond = ref}
                          files={this.state.files}
                          allowMultiple={false}
                          allowImagePreview={true}
                          oninit={() => this.handleInit() }
                          onupdatefiles={(fileItems) => {
                              // Set current file objects to this.state
                              // this.setState({
                              //     files: fileItems.map(fileItem => fileItem.file)
                              // });
                          }}>
                </FilePond>

            </div>
        );
    }
}