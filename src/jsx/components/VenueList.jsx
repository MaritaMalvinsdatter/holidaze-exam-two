// Venues.jsx

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../../styles/VenueList.module.css';
import { API_BASE, API_VENUE } from '../EndPoints';

function Venues( {searchTerm }) {
  const [Venues, setVenues] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function getData() {
      try {
        setIsError(false);
        setIsLoading(true);
        const response = await fetch(`${API_BASE}${API_VENUE}?limit=100&_bookings=true&_owner=true`);
        const json = await response.json();
        const sortedVenues = json.sort((a, b) => new Date(b.created) - new Date(a.created));// sorted by date created
        const venuesWithMedia = sortedVenues.filter(venue => venue.media && venue.media.length > 0); // only diplay venues with images
        const limitedVenues = venuesWithMedia.slice(0, 100);
        const filteredVenues = limitedVenues.filter(venue => 
        venue.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
        setVenues(filteredVenues);
        console.log(limitedVenues);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setIsError(true);
      }
    }

    getData();
  }, [searchTerm]);

    if (isLoading) {
      return <div>Loading Venues</div>;
    }

    if (isError) {
      return <div>Error loading data</div>;
    }

    return (
      <Container>
        <h1 className='my-5'>Where to?</h1>
          <Row>
              {Venues.map((Venue) => (
                  <Col xs={12} sm={6} md={4} lg={3} key={Venue.id}>
                      <Card className={`mb-4 ${styles.positionRelative}`}>
                          {Venue.media.length > 0 && (
                              <Card.Img 
                                  variant="top" 
                                  src={Venue.media[0]} 
                                  alt="Venue Image" 
                                  className={styles.venueListImage} 
                              />
                          )}
                          <Card.Body>
                              <Card.Title className={styles.boldText}>
                                  <Link to={`/venue/${Venue.id}`}>{Venue.name}</Link>
                              </Card.Title>
                              
                              <Card.Text>
                                  <i className="mb-4">
                                      {
                                          (Venue.location.address === "Unknown" && Venue.location.city === "Unknown") 
                                          ? "Unknown Location"
                                          : `${Venue.location.city}, ${Venue.location.country}`
                                      }
                                  </i>
                              </Card.Text>
                              
                              <Card.Text className="mb-5">
                                  Maximum {Venue.maxGuests} guests
                                  <br />
                                  {Venue.price}NOK / Night
                                  <br />
                                  Hosted by {Venue.owner.name}
                              </Card.Text>
                          </Card.Body>

                          <div className={styles.iconContainer}>
                              <i className={`fa-solid fa-mug-saucer mx-1 ${Venue.meta.breakfast ? '' : styles.iconUnavailable}`}></i>
                              <i className={`fa-solid fa-square-parking mx-1 ${Venue.meta.parking ? '' : styles.iconUnavailable}`}></i>
                              <i className={`fa-solid fa-paw mx-1 ${Venue.meta.pets ? '' : styles.iconUnavailable}`}></i>
                              <i className={`fa-solid fa-wifi mx-1 ${Venue.meta.wifi ? '' : styles.iconUnavailable}`}></i>
                          </div>
                      </Card>
                  </Col>
              ))}
          </Row>
      </Container>

  );
}

export default Venues;

