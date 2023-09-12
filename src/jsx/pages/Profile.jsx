import React, { useState, useEffect } from 'react';
import { API_BASE, API_PROFILE } from '../EndPoints';
import { Container, Row, Col } from 'react-bootstrap';

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
        
                console.log(API_BASE + API_PROFILE + name);
        
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
                console.log(userData);
                setUser(userData);
            } catch (error) {
                console.error("Error fetching user data:", error);
                setError(error); // Set the error state
            }
        };
    
        fetchUser();
    }, []);
    
  
    // Show error message if any error occurs
    if (error) {
        return <div>Error: {error.message}</div>;
    }

    // Show loading state if the profile hasn't been fetched yet
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
            </Row>
        </Container>
    );
}


export default ProfilePage;
