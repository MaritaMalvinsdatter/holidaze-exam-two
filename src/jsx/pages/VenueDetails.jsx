import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE, API_VENUE } from '../EndPoints';
import { Row, Col, Container, Alert, Carousel, Modal, Button } from "react-bootstrap";
import styles from '../../styles/VenueDetails.module.css';
import BookingCalendar from "../components/Calendar";
import VenueForm from "./VenueForm";

async function fetchData(id, setVenue, setIsLoading, setIsError) {
    try {
        const response = await fetch(`${API_BASE}${API_VENUE}/${id}?_bookings=true&_owner=true`);
        const json = await response.json();
        setVenue(json);
        // console.log(json);
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
        const errorData = await response.json();  // attempt to parse error response
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
        fetchData(id, setVenue, setIsLoading, setIsError);
    }, [id]);

    if (isLoading) return <Alert variant="info">Loading...</Alert>;
    if (isError) return <Alert variant="danger">Error loading data.</Alert>;
    if (!venueSpecs || !venueSpecs.location) return null;

    const handleEditSubmit = () => {
        setIsEditing(false);
        fetchData(id, setVenue, setIsLoading, setIsError);
    };

    const closeModal = () => {
        setIsEditing(false);
    };

    const currentUser = JSON.parse(localStorage.getItem('profile'));
    const isOwner = venueSpecs.owner && currentUser && venueSpecs.owner.email === currentUser.email;

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
                <Col>
                <BookingCalendar 
                    maxGuests={venueSpecs.maxGuests} 
                    bookings={venueSpecs.bookings}
                    venueId={id}
                    price={venueSpecs.price}  // passing the price here
                />
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
            {isOwner && (
                <Row className="mt-3">
                    <Col>
                        <button className="btn btn-primary" onClick={() => setIsEditing(true)}>Edit</button>
                        <button className="btn btn-danger ml-2" onClick={() => deleteVenue(venueSpecs.id, navigate)}>Delete</button>
                    </Col>
                </Row>
            )}
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
        </Container>
    );
}

export default VenueDetails;

