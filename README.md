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
        

4. Upload printer profiles into the Firebase Database using the proper data structure.
    Create a category "printly", then a category "active printers". 

    For each printer, it should include information about color, distance, quality, rating, transfer, address, comments, id, name, rating count, and total rating. For example:


      - printly
        - active_printers
          - 0
              Color: 'both'

              Distance: 1

              Quality: 'Medium'

              Rating: 3.3

              Transfer: 'Delivery'

              address: '101 Elm St'
              + comments

                L_ta7R: 'Great job Bob!'

              id: 0

              name: 'Bob'

              rating_count: 13

              rating_total: 43
          - 1

              ...


5. The logo and other gifs and images for the application should be stored in Firebase Storage.
    The names should be 'logo.png', 'Printly Home - bottom.png', 'Printly Home - top.png', 'Printly-connecting-v2.gif', 'Printly-delivery-v2.gif', 'Printly-pickup-v2.gif', and 'Printly-printing_v2.gif'.


6. Deploy the project with `firebase deploy` in the command line.


7. Alternately, start the app on your local machine with `npm start`.



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
