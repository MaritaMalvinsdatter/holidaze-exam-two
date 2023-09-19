// Venues.jsx

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../../styles/VenueList.module.css';


const url = 'https://api.noroff.dev/api/v1/holidaze/venues?limit=100_bookings=true&_owner=true';

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
        console.log(limitedVenues);
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
      <Container>
          <Row>
              {Venues.map((Venue) => (
                  <Col xs={12} sm={6} md={4} lg={3} key={Venue.id}>
                      <Card className="mb-4">
                          {Venue.media.length > 0 && (
                              <Card.Img 
                                  variant="top" 
                                  src={Venue.media[0]} 
                                  alt="Venue Image" 
                                  className={styles.venueListImage} 
                              />
                          )}
                          <Card.Body>
                            <Card.Title>
                                <Link to={`/venue/${Venue.id}`}>{Venue.name}</Link>
                            </Card.Title>
                            
                            <Card.Text>
                                <i className="mb-4">
                                    {
                                        (Venue.location.address === "Unknown" && Venue.location.city === "Unknown") 
                                        ? "Location is unknown"
                                        : `${Venue.location.city}, ${Venue.location.country}`
                                    }
                                </i>
                            </Card.Text>
                            
                            <Card.Text>
                                Maximum {Venue.maxGuests} guests
                                {Venue.price}NOK / Night
                                Hosted by {Venue.owner.name}
                            </Card.Text>
                            
                            <Card.Text>
                            <i className={`fas fa-mug-saucer ${Venue.meta.breakfast ? '' : 'text-light'}`}></i>

                                <i className={`fa-solid fa-square-parking ${Venue.meta.parking ? '' : 'text-light'}`}></i>
                                <i className={`fa-solid fa-paw ${Venue.meta.pets ? '' : 'text-light'}`}></i>
                                <i className={`fa-solid fa-wifi ${Venue.meta.wifi ? '' : 'text-light'}`}></i>
                            </Card.Text>
                        </Card.Body>

                      </Card>
                  </Col>
              ))}
          </Row>
      </Container>
  );
}

export default Venues;

