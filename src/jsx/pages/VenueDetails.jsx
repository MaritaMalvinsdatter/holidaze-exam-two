import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_BASE, API_VENUE } from '../EndPoints';
import { Row, Col, Container, Alert, Carousel } from "react-bootstrap";
import styles from '../../styles/VenueDetails.module.css';

function VenueDetails() {
    const [venueSpecs, setVenue] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const { id } = useParams();

    useEffect(() => {
      async function fetchData() {
        try {
          const response = await fetch(
            API_BASE + API_VENUE + `/${id}?_bookings=true&_owner=true`
          );
          const json = await response.json();
          console.log(json);
          setVenue(json);
          setIsLoading(false);
        } catch (error) {
          setIsError(true);
          setIsLoading(false);
        }
      }

      fetchData();
    }, [id]);

    if (isLoading) {
        return <Alert variant="info">Loading...</Alert>;
    }
    if (isError) {
        return <Alert variant="danger">Error loading data.</Alert>;
    }
    if (!venueSpecs) {
        return null;
    }

    if (!venueSpecs || !venueSpecs.location) {
        return null; 
    }

    return (
        <Container>
            <Row className="mt-3">
                <Col>
                    <h2>{venueSpecs.name}</h2>
                </Col>
            </Row>
            <div className={styles.carouselContainer}>
                <Carousel className={styles.carouselContainer}>
                    {venueSpecs.media.map((mediaUrl, index) => (
                        <Carousel.Item key={index}>
                            <img
                                className="d-block w-100"
                                src={mediaUrl}
                                alt={`Media ${index}`}
                            />
                        </Carousel.Item>
                    ))}
                </Carousel>
            </div>
            <Row className="mt-3">
                <Col md={6}>
                    <strong>Created:</strong> {new Date(venueSpecs.created).toLocaleString()}
                </Col>
                <Row className="mt-3">
                <Col>
                    <strong>Address:</strong> {venueSpecs.location.address}
                </Col>
            </Row>
            <Row className="mt-3">
                <Col md={6}>
                    <strong>City:</strong> {venueSpecs.location.city}
                </Col>
                <Col md={6}>
                    <strong>Country:</strong> {venueSpecs.location.country}
                </Col>
            </Row>
            </Row>
            <Row className="mt-3">
                <Col>
                    <strong>Description:</strong>
                    <p>{venueSpecs.description}</p>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <strong>Maximum number of guests:</strong> {venueSpecs.maxGuests}
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <strong>Price per night:</strong> <span>${venueSpecs.price}</span>
                </Col>
            </Row>
        </Container>
    );
}

export default VenueDetails;

