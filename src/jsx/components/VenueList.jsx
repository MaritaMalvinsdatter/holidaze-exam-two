// Venues.jsx

import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const url = 'https://api.noroff.dev/api/v1/holidaze/venues';

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
        setVenues(json);
        console.log(json);
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
          <h2>{Venue.name}</h2>
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
