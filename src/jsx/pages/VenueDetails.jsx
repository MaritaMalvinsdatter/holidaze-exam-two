import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE, API_VENUE } from '../EndPoints';
import { Row, Col, Container, Alert, Carousel, Modal, Button } from "react-bootstrap";
import styles from '../../styles/VenueDetails.module.css';
import BookingCalendar from "../components/Calendar";
import VenueForm from "./VenueForm";

async function fetchVenue(id, setVenue, setIsLoading, setIsError) {
    try {
        const response = await fetch(`${API_BASE}${API_VENUE}/${id}?_bookings=true&_owner=true`);
        const json = await response.json();
        setVenue(json);
        console.log(json);
    } catch (error) {
        setIsError(true);
    } finally {
        setIsLoading(false);
    }
}

async function deleteVenue(venueId, navigate) {
    const shouldDelete = window.confirm("Are you sure you want to delete this venue?");
    
    if (!shouldDelete) {
      return;
    }
  
    const url = `${API_BASE}${API_VENUE}/${venueId}`;
    const token = localStorage.getItem("token");
    
    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        const errorData = await response.json();  
        console.error(`Error: ${response.status} - ${errorData.message || 'Unknown error'}`);
        return;
      }
  
      const text = await response.text();
      if (text) {
        const data = JSON.parse(text);
        console.log('Deletion response:', data);
      }
  
      navigate('/profile');  
    } catch (error) {
      console.error('Error deleting venue:', error);
    }
  }

function VenueDetails() {
    const [venueSpecs, setVenue] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchVenue(id, setVenue, setIsLoading, setIsError);
    }, [id]);

    if (isLoading) return <Alert variant="info">Loading...</Alert>;
    if (isError) return <Alert variant="danger">Error loading data.</Alert>;
    if (!venueSpecs || !venueSpecs.location) return null;

    const handleEditSubmit = () => {
        setIsEditing(false);
        fetchVenue(id, setVenue, setIsLoading, setIsError);
    };

    const closeModal = () => {
        setIsEditing(false);
    };

    const renderStars = () => {
        let stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                i <= venueSpecs.rating ?
                    <i key={i} className="fa-solid fa-star"></i> :
                    <i key={i} className="fa-regular fa-star"></i>
            );
        }
        return stars;
    };

    function isUserLoggedIn() {
        return localStorage.getItem('profile') !== null;
    }

    const currentUser = JSON.parse(localStorage.getItem('profile'));
    const isOwner = venueSpecs.owner && currentUser && venueSpecs.owner.email === currentUser.email;

    return (
        <Container>
            <Row className="mt-3 justify-content-center">
                <Col md={6} className="text-center my-5">
                    <h2>{venueSpecs.name}</h2>
                    <div>{renderStars()}</div>
                    
                    <div className={styles.carouselContainer}>
                        <Carousel className={styles.carouselContainer}>
                            {venueSpecs.media.map((mediaUrl, index) => (
                                <Carousel.Item key={index}>
                                    <img
                                         
                                        src={mediaUrl}
                                        alt={`Media ${index}`}
                                    />
                                </Carousel.Item>
                            ))}
                        </Carousel>
                    </div>
                </Col>
            </Row>
            
            <Row>
                <Col className="d-flex justify-content-center">
                    {isOwner ? (
                        <div>
                            <Button variant="primary" className="mx-2 primary-button" onClick={() => setIsEditing(true)}>Edit Venue</Button>
                            <Button variant="danger" className={`mx-2 ml-2 ${styles.deleteButton}`} onClick={() => deleteVenue(venueSpecs.id, navigate)}>Delete Venue</Button>
                        </div>
                    ) : (
                        isUserLoggedIn() ? (
                            <BookingCalendar 
                                maxGuests={venueSpecs.maxGuests} 
                                bookings={venueSpecs.bookings}
                                venueId={id}
                                price={venueSpecs.price}
                            />
                        ) : (
                            <Button 
                                variant="primary"
                                onClick={() => navigate('/login')}
                            >
                                Login to Book
                            </Button>
                        )
                    )}
                </Col>
            </Row>

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
                    <strong>Manager:</strong> <span>{venueSpecs.owner.name}</span>
                </Col>
            </Row>
            <Modal show={isEditing} onHide={closeModal}>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <VenueForm
                        initialData={venueSpecs}
                        mode='edit'
                        onSubmit={handleEditSubmit}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>Close</Button>
                </Modal.Footer>
            </Modal>
            <hr />
            {isOwner && (
                <Row className="mt-3">
                    <Col>
                        <h5>Upcoming Bookings:</h5>
                        {venueSpecs.bookings.length > 0 ? (
                            <div>
                                {venueSpecs.bookings.map((booking, index) => (
                                    <div key={index}>
                                        Dates: {new Date(booking.dateFrom).toLocaleDateString()} -  {new Date(booking.dateTo).toLocaleDateString()} | 
                                        Guests: {booking.guests}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>You have no bookings yet for this venue.</p>
                        )}
                    </Col>
                </Row>
            )}
        </Container>
    );
}

export default VenueDetails;

