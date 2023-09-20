import React, { useState, useEffect } from 'react';
import { API_BASE, API_PROFILE } from '../EndPoints';
import { Container, Row, Col, Card, Button  } from 'react-bootstrap';
import { logout, getTotalPrice } from '../ApiHelper';
import { Link, useNavigate } from 'react-router-dom'; 

function ProfilePage() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const navigateToVenueDetails = (venueId) => {
        navigate(`/venue/${venueId}`);
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");
                const storedProfile = JSON.parse(localStorage.getItem("profile"));
                const requestUrl = `${API_BASE}${API_PROFILE}${storedProfile.name}?_bookings=true&_venues=true`;
    
                const response = await fetch(requestUrl, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
        
                if (!response.ok) {
                    if(response.status === 500) {
                        throw new Error("We're having trouble processing your request. Please try again later.");
                    } else {
                        throw new Error(`Server responded with a status: ${response.status}`);
                    }
                }
        
                const userData = await response.json();
                console.log(userData);
                setUser(userData);
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    setError(error); 
            }
        };
    
        fetchUser();
    }, []);
    

    const handleBecomeManager = async () => {
       
        try {
            const updateURL = `${API_BASE}${API_PROFILE}${user.name}`; 
            const updatedData = {
                venueManager: true
            };
            const token = localStorage.getItem("token");
            const response = await fetch(updateURL, {
                method: 'PUT', 
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedData),
            });
            
    
            if (!response.ok) {
                throw new Error(`Server responded with a status: ${response.status}`);
            }
            
            setUser({
                ...user,
                venueManager: true
            });
        } catch (err) {
            console.error('Error updating user to venue manager:', err);
            setError(err);
        }
    };

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!user) {
        return <div>Loading profile...</div>;
    }

    const avatarStyle = {
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        objectFit: 'cover',
        marginBottom: '15px'
    };
    
    // Calculating price for bookings:
    // const getTotalPrice = (startDate, endDate, nightlyPrice) => {
    //     const start = new Date(startDate);
    //     const end = new Date(endDate);
    //     const differenceInTime = end.getTime() - start.getTime();
    //     const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    //     return differenceInDays * nightlyPrice;
    // };
    
    return (
        <Container>
            <Row className="justify-content-center text-center">
                <Col xs={12}>
                    <img 
                        id="profile-avatar" 
                        src={user.avatar || '/src/img/blank-profile-picture-gca82a1260_640.png'} 
                        alt="Avatar" 
                        style={avatarStyle}
                    />
                </Col>
                <Col xs={12}>
                    <h1 id="profile-name">{user.name}</h1>
                </Col>
                <Col xs={12}>
                    <p id="profile-email">{user.email}</p>
                </Col>
                <Col xs={12}>
                    {user.venueManager ? 
                        <>
                            <p className="font-weight-bold">Venue Manager</p>
                            <Link to="/create-venue">
                                <button>Create New Venue</button>
                            </Link>
                        </> :
                        <button onClick={handleBecomeManager}>Become a Venue Manager</button>
                    }
                </Col> 
                <Col xs={12}>
                    <button onClick={logout}>Logout</button>
                </Col>
            </Row>

            <Col xs={12}>
                <hr />
            </Col>

            <Row>
                <Col xs={12} md={6}>
                    <h3 className="text-center">Your Bookings:</h3>
                    {user.bookings.map((booking) => {
                        const totalPrice = getTotalPrice(booking.dateFrom, booking.dateTo, booking.venue.price);
                        return (
                            <Card key={booking.id} className="mb-3">
                                <Card.Img variant="top" src={booking.venue.media[0] || '/path-to-default-image.jpg'} />
                                <Card.Body>
                                    <Card.Title>{booking.venue.name}</Card.Title>
                                    <Card.Text>
                                        <strong>Your Booking Dates:</strong> {new Date(booking.dateFrom).toLocaleDateString()} to {new Date(booking.dateTo).toLocaleDateString()}
                                        <br />
                                        <strong>Total Price:</strong> ${totalPrice}
                                        <br />
                                        <strong>Guests:</strong> {booking.guests}   
                                    </Card.Text>
                                    <Button variant="primary" onClick={() => navigateToVenueDetails(booking.venue.id)}>Details</Button>
                                </Card.Body>
                            </Card>
                        );
                    })}

                </Col>

                <Col xs={12} md={6} style={{ borderLeft: '1px solid #dee2e6' }}>
                    <h3 className="text-center">Your Venues:</h3>
                    {user.venues && user.venues.length ? (
                        user.venues.map(venue => (
                            <Card className="mb-3" key={venue.id}>
                                <Card.Img variant="top" src={venue.media[0] || '/path-to-default-image.jpg'} />
                                <Card.Body>
                                    <Card.Title>{venue.name}</Card.Title>
                                    <Card.Text>
                                        {venue.description}
                                        <strong>Max Guests:</strong> {venue.maxGuests}
                                        <br />
                                        <strong>Price pr Night:</strong> {venue.price}
                                    </Card.Text>
                                    <Button variant="primary" onClick={() => navigateToVenueDetails(venue.id)}>Details</Button>
                                </Card.Body>
                            </Card>
                        ))
                    ) : (
                        <p>You manage no venues.</p>
                    )}
                </Col>

            </Row>
            
        </Container>
        
    );
}

export default ProfilePage;
