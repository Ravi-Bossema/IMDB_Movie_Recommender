# IMDB_Movie_Recommender
Webapp that uses IMDB data in an RDF database to recommend movies based on the user's input.

## Installation

Download title.basics.tsv.gz and title.ratings.tsv.gz from https://datasets.imdbws.com/

Unzip and store basics.tsv and ratings.tsv in the same folder as tsv_to_ttl.py and imdbData.ttl

Run tsv_to_ttl.py and import imdbData.ttl into your local RDF database (GraphDB for example). 

Change the endpoints as stated by your local RDF database in KD-javascript.js lines 31 and 62

## Usage

Run your local RDF database and open the KD-html.html file in your browser.

Select your preferred genre and/or type and click on "Search Movie" to get a list of recommended movies.
