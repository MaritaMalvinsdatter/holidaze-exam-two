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
            <div className={styles.sectionBooking}>
            <Row className="mt-3 justify-content-center">
                    <h2 className="text-center w-100">{venueSpecs.name}</h2> 
                    <div className="text-center w-100">{renderStars()}</div> 
                    <Col xs={12} md={isOwner ? 12 : 6} className={`text-center my-5 ${isOwner ? styles.managerView : ''}`}>
                        <div className={styles.carouselContainer}>
                            <Carousel className={styles.carouselContainer}>
                                {venueSpecs.media.map((mediaUrl, index) => (
                                    <Carousel.Item key={index}>
                                        <img src={mediaUrl} alt={`Media ${index}`} />
                                    </Carousel.Item>
                                ))}
                            </Carousel>
                        </div>
                        {isOwner && (
                            <div className="mt-3">
                                <Button variant="primary" className="mx-2 primary-button" onClick={() => setIsEditing(true)}>Edit Venue</Button>
                                <Button variant="danger" className={`mx-2 ml-2`} onClick={() => deleteVenue(venueSpecs.id, navigate)}>Delete Venue</Button>
                            </div>
                        )}
                    </Col>
                    {!isOwner && (
                        <Col xs={12} md={6} className="my-5">
                            {isUserLoggedIn() ? (
                                <BookingCalendar 
                                    maxGuests={venueSpecs.maxGuests} 
                                    bookings={venueSpecs.bookings}
                                    venueId={id}
                                    price={venueSpecs.price}
                                />
                            ) : (
                                <Button 
                                    variant="primary"
                                    className="w-100"
                                    onClick={() => navigate('/login')}
                                >
                                    Login to Book
                                </Button>
                            )}
                        </Col>
                    )}
                </Row>
            </div>

            <hr />

            <div className={styles.sectionDetails}>
                <Row className="mt-3 mt-md-3 px-2 px-md-5 mx-2 mx-md-5">
                    <h3 className="text-center mb-5 mt-3">About This Venue:</h3>
                    <Col xs={12} md={6} className="px-lg-5">
                        <h5 className="mb-3">Description:</h5>
                        <p>{venueSpecs.description}</p>
                        {isOwner && (
                            <Col>
                                <strong>Price per night:</strong> ${venueSpecs.price}
                                <br />
                                <strong>Max guests:</strong> {venueSpecs.maxGuests}
                            </Col>
                        )}
                    </Col>
                    <Col xs={12} md={6} className={`${styles.mtSmall} pl-md-4 px-lg-5`} style={{ borderLeft: '1px solid #dee2e6' }}>
                        <Row className="mb-3">
                            <h5 className="mb-3">More:</h5>
                            <Col>
                                <strong>Address:</strong> {venueSpecs.location.address}, {venueSpecs.location.city}, {venueSpecs.location.country}
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col>
                                <strong>Venue Created:</strong> {new Date(venueSpecs.created).toLocaleDateString()}
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col>
                                <strong>Manager:</strong> <span>{venueSpecs.owner.name}</span>
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col>
                                <strong>Contact:</strong> <span>{venueSpecs.owner.email}</span>
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col>
                                <strong>Venue ID:</strong> <span>{venueSpecs.id}</span>
                            </Col>
                        </Row>
                        <div className={styles.iconContainer}>
                        <Row className="mb-3">
                            <Col>
                                <span className={`${venueSpecs.meta.breakfast ? '' : styles.iconUnavailable}`}>
                                    <i className={`fa-solid fa-mug-saucer mx-1`}></i> Breakfast
                                </span>
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col>
                                <span className={`${venueSpecs.meta.parking ? '' : styles.iconUnavailable}`}>
                                    <i className={`fa-solid fa-square-parking mx-1`}></i> Parking
                                </span>
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col>
                                <span className={`${venueSpecs.meta.pets ? '' : styles.iconUnavailable}`}>
                                    <i className={`fa-solid fa-paw mx-1`}></i> Pets
                                </span>
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col>
                                <span className={`${venueSpecs.meta.wifi ? '' : styles.iconUnavailable}`}>
                                    <i className={`fa-solid fa-wifi mx-1`}></i> Wifi
                                </span>
                            </Col>
                        </Row>
                    </div>
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

            </div>
            
            <hr />

            {isOwner && (
                <Row className="mt-3 mt-md-3 px-2 px-md-5 mx-2 mx-md-5">
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

