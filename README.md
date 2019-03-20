# Printly

A web appication for crowdsourcing your printing needs. Think Postmates, but for documents.

<img src="../master/examples/home.png">

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
        

4. Add printer profiles to Firebase Realtime Database, following the format in [printly-export.json](../master/setup/printly-export.json).

<p align="center"><img src="../master/examples/database.png" height=700></p>

5. Add corresponding profile pictures to Firebase Storage, following the format in [id_pictures](../master/setup/id_pictures).

<p align="center"><img src="../master/examples/id_pics.png" height=700></p>

6. Add content of [Assets](../master/setup/Assets) folder to Firebase Storage.

<p align="center"><img src="../master/examples/storage.png" height=700></p>

7. Deploy the project with `firebase deploy` in the command line.

8. Alternatively, start the app on your local machine with `npm start`.

## Known Issues

- Firebase undefined object 404s on printer selection page.
- Unmounted component state update on printer selection page (possibly related to first issue).
- Material-UI typography will be deprecated in the next update.

## Limitations and Future Work

- Printee side
    - Detect student users by email.
    - Have a separate print queue for each unqiue user.
    - Dynamically search for printers based on address.
    - Dynamically calculate ETA and track delivery on map.
    
- Printer side
    - All of it
