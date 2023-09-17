import React, { useState } from 'react';
import { API_BASE, API_REGISTER} from '../EndPoints';
import { useApiHelper } from '../ApiHelper';
import { Button, Alert } from 'react-bootstrap';

function ProfileUpdates() {
    const { user, apiRequest, saveUserAndToken } = useApiHelper();
    const [error, setError] = useState(null);

    // lets user become manager after registering 
    const becomeManager = async () => {
        try {
            const updateURL = `${API_BASE}${API_REGISTER}`; 

            const updatedUser = {
                ...user, 
                venueManager: true
            };

            const response = await apiRequest(updateURL, {
                method: 'post',
                body: JSON.stringify(updatedUser),
            });

            if (response) {
                const { userData, authToken } = response;
                saveUserAndToken(userData, authToken);
            } else {
                console.log('ERROR: Could not update user to venue manager');
            }
        } catch (err) {
            console.error('Error updating user to venue manager:', err);
            setError(err);
        }
    };

    return (
        <div>
            { user.venueManager ? 
                <p>You are already a venue manager.</p> :
                <>
                    <Button onClick={becomeManager}>Become a Venue Manager</Button>
                    {error && <Alert variant="danger">Error: {error.message}</Alert>}
                </>
            }
        </div>
    );
}

export default ProfileUpdates;

