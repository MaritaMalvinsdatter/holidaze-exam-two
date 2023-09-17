import React, { useState, useEffect } from 'react';
import { API_BASE, API_PROFILE } from '../EndPoints';
import { Container, Row, Col } from 'react-bootstrap';
import logout from '../ApiHelper';

function ProfilePage() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");
                const storedProfile = JSON.parse(localStorage.getItem("profile"));
                const name = storedProfile ? storedProfile.name : null;
        
                if (!name) {
                    setError(new Error("User name is not found in localStorage."));
                    return;
                }
        
                const response = await fetch(API_BASE + API_PROFILE + name, {
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
                        <p className="font-weight-bold">Venue Manager</p> :
                        <button onClick={handleBecomeManager}>Become a Venue Manager</button>
                    }
                </Col> 
                <Col xs={12}>
                    <button onClick={logout}>Logout</button>
                </Col>
            </Row>
        </Container>
    );
}

export default ProfilePage;
