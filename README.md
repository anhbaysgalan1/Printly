# Printly

A web appication for crowdsourcing your printing needs. Think Postmates, but for documents.

## System Requirements

- Node.js (10.15.0+)

## Getting Started

1. Download and install the code.

        $ git clone https://github.com/cs394-w19/Printly.git
        $ cd Printly
        $ npm install
             
2. Create a new [Firebase](https://firebase.google.com/) project. Required components are:

    - `firebase-auth` for user login
    - `firebase-storage` for uploaded documents
    - `firebase-database` for maintaining active printers
    
3. Add your project's config info to the beginning of App.js file.

        var config = {
          apiKey: "YOUR",
          authDomain: "PROJECT",
          databaseURL: "INFO",
          storageBucket: "HERE",
        };
        firebase.initializeApp(config);
        
4. json file structure + where to put
5. logos/gifs where to put
6. notes on hosting
7. run with npm start

## Known Issues

- firebase 404 in  matched printers
- (possibly related) state update for unmounted component in matched printers
- mui typography deprecated next update

## Limitations and Future Work

- printee side
    - detect student by email
    - separate print queue for users
    - dynamic printer search by address
    - dynamic eta, maps
    
- printer side
    - all of it
