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
    
3. Add your project's config info to the beginning of [App.js](../master/src/App.js).

        var config = {
          apiKey: "YOUR",
          authDomain: "PROJECT",
          databaseURL: "INFO",
          storageBucket: "HERE",
        };
        firebase.initializeApp(config);
        

4. Add printer profiles to Firebase Realtime Database, following the format in [printly-export.json](../master/printly-export.json).

5. Add corresponding profile pictures to Firebase Storage, following the format in [id_pictures](../master/id_pictures).

6. Add content of [Assets](../master/Assets) folder to Firebase Storage.

7. Deploy the project with `firebase deploy` in the command line.

8. Alternatively, start the app on your local machine with `npm start`.



## Known Issues

- Firebase undefined object 404s in the Matched Printers page.
- (possibly related) state update for unmounted component in Matched Printers page.
- MaterialUI typography will be deprecated in the next update.

## Limitations and Future Work

- Printee side
    - Ability to detect student users by email.
    - Have a separate print queue for each unqiue user.
    - Dynamically search for printers based on address.
    - Use real printer addresses, implement dynamic ETA and Google Maps integration.
    
- Printer side
    - all of it
