// Venues.jsx

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const url = 'https://api.noroff.dev/api/v1/holidaze/venues?limit=100';

function Venues() {
  const [Venues, setVenues] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function getData() {
      try {
        setIsError(false);
        setIsLoading(true);
        const response = await fetch(url);
        const json = await response.json();
        const sortedVenues = json.sort((a, b) => new Date(b.created) - new Date(a.created));// sorted by date created
        const venuesWithMedia = sortedVenues.filter(venue => venue.media && venue.media.length > 0); // only diplay venues with images
        const limitedVenues = venuesWithMedia.slice(0, 100);
        setVenues(limitedVenues);
        // console.log(limitedVenues);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setIsError(true);
      }
    }

    getData();
  }, []);

  if (isLoading) {
    return <div>Loading Venues</div>;
  }

  if (isError) {
    return <div>Error loading data</div>;
  }

  return (
    <div>
      {Venues.map((Venue) => (
        <div key={Venue.id}>
          <Link to={`/venue/${Venue.id}`}>
            <h2>{Venue.name}</h2>
          </Link>
          <p>{Venue.description}</p>
          <div>
            <Carousel>
              {Venue.media.map((mediaUrl, index) => (
                <div key={index}>
                  <img
                    src={mediaUrl}
                    alt={`Media ${index}`}
                    style={{ maxWidth: '50%', height: 'auto' }}
                  />
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Venues;
