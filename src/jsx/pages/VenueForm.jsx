import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom'
import { API_BASE, API_VENUE } from '../EndPoints';
import * as yup from 'yup';

const venueSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    description: yup.string().required('Description is required'),
    price: yup.number().required('Price is required').min(0, "Price should be a positive value"),
    maxGuests: yup.number().required('Max guests is required').min(1, "Should have at least 1 guest").max(100, "Maximum of 100 guests allowed"),
    media: yup.array().of(yup.string().url('Invalid URL').notRequired()).required(),
    rating: yup.number().min(0, "Minimum rating is 0").max(5, "Maximum rating is 5").nullable().notRequired(),
    location: yup.object({
        address: yup.string(),
        city: yup.string(),
        zip: yup.string(),
        country: yup.string(),
        continent: yup.string(),
        lat: yup.number().min(-90, "Invalid latitude").max(90, "Invalid latitude"),
        lng: yup.number().min(-180, "Invalid longitude").max(180, "Invalid longitude")
    }),
    
    meta: yup.object({
        wifi: yup.boolean(),
        parking: yup.boolean(),
        breakfast: yup.boolean(),
        pets: yup.boolean()
    })
});

function VenueForm({ initialData = {}, mode = 'create', onSubmit }) {
    const navigate = useNavigate();

    const onSubmitHandler = async (values) => {
        const url = mode === 'edit' ? `${API_BASE}${API_VENUE}/${initialData.id}` : `${API_BASE}${API_VENUE}`;
        const method = mode === 'edit' ? 'PUT' : 'POST';
        const token = localStorage.getItem("token");
        
        try {
            const response = await fetch(url, {
                method: method, 
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(values)
            });
    
            const json = await response.json();
            console.log(json)
    
            if (json.id) {
                formik.resetForm();
                navigate(`/venue/${json.id}`);
                if (onSubmit && typeof onSubmit === 'function') {
                    onSubmit();
                }
            } else if (json.errors && json.errors.length > 0) {
                alert(json.errors[0].message);
            } else {
                alert("An error occurred, try again.");
            }
    
        } catch (error) {
            console.error(error);
        }
    };

    const formik = useFormik({
        initialValues: {
            ...initialData,
            media: initialData.media || [""],
            location: initialData.location || {},
            meta: initialData.meta || {}
        },
        validationSchema: venueSchema,
        onSubmit: onSubmitHandler
    });

    const handleRatingChange = (event) => {
        const value = event.target.value;
        formik.setFieldValue("rating", value ? parseInt(value, 10) : "");
    };
    
    return (
        <Container>
            <h1 className='text-center mb-5'> {mode === 'edit' ? 'Edit Venue' : 'Create New Venue'} </h1>
            <Form onSubmit={formik.handleSubmit}>
                
                <Form.Group controlId="venueName">
                    <Form.Label>Name:</Form.Label>
                    <Form.Control 
                        type="text" 
                        name="name" 
                        value={formik.values.name} 
                        onChange={formik.handleChange}
                        isInvalid={formik.touched.name && formik.errors.name}
                    />
                    <Form.Control.Feedback type="invalid">{formik.errors.name}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Description:</Form.Label>
                    <Form.Control 
                        type="text" 
                        name="description" 
                        value={formik.values.description} 
                        onChange={formik.handleChange}
                        isInvalid={formik.touched.description && formik.errors.description}
                        required 
                    />
                    <Form.Control.Feedback type="invalid">{formik.errors.description}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Media URLs</Form.Label>
                        {formik.values.media.map((url, index) => (
                                <div key={index}>
                                    <Form.Control 
                                        type="text"
                                        name={`media[${index}]`}
                                        value={url} 
                                        onChange={formik.handleChange}
                                        isInvalid={formik.touched.media && formik.touched.media[index] && formik.errors.media && formik.errors.media[index]}
                                    />
                                    {formik.values.media.length > 1 && (
                                        <Button 
                                            onClick={() => {
                                                const updatedMedia = [...formik.values.media];
                                                updatedMedia.splice(index, 1);
                                                formik.setFieldValue("media", updatedMedia);
                                            }}
                                        >
                                            Remove URL
                                    </Button>
                                )}
                            </div>
                        ))}
                </Form.Group>
                                
                {formik.values.media.length < 5 && (
                    <Button 
                        onClick={() => {
                            formik.setFieldValue("media", [...formik.values.media, ""]);
                        }}
                    >
                        Add Media URL
                    </Button>
                )}

                <Form.Group as={Row} controlId="price">
                    <Col sm={12}>
                        <Form.Label>Price per night:</Form.Label>
                    </Col>
                    <Col sm={12}>
                        <Form.Control 
                            type="number" 
                            name="price" 
                            min="0" 
                            value={formik.values.price} 
                            onChange={formik.handleChange} 
                            isInvalid={formik.touched.price && formik.errors.price}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.price}</Form.Control.Feedback>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="maxGuests">
                    <Col sm={12}>
                        <Form.Label>Max number of guests:</Form.Label>
                    </Col>
                    <Col sm={12}>
                        <Form.Control 
                            type="number" 
                            name="maxGuests" 
                            min="1" 
                            max="100" 
                            value={formik.values.maxGuests} 
                            onChange={formik.handleChange} 
                            isInvalid={formik.touched.maxGuests && formik.errors.maxGuests}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.maxGuests}</Form.Control.Feedback>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="rating">
                    <Col sm={12}>
                        <Form.Control 
                            as="select" 
                            name="rating" 
                            value={formik.values.rating || ''} 
                            onChange={handleRatingChange}
                            isInvalid={formik.touched.rating && formik.errors.rating}
                        >
                            <option value="">Select Rating</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">{formik.errors.rating}</Form.Control.Feedback>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="address">
                    <Col sm={12}>
                        <Form.Label>Address:</Form.Label>
                    </Col>
                    <Col sm={12}>
                        <Form.Control 
                            type="text" 
                            name="location.address" 
                            value={formik.values.location.address || ''} 
                            onChange={formik.handleChange} 
                            isInvalid={formik.touched.location?.address && formik.errors.location?.address}
                            placeholder="Enter address" 
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.location?.address}</Form.Control.Feedback>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="city">
                    <Col sm={12}>
                        <Form.Label>City:</Form.Label>
                    </Col>
                    <Col sm={12}>
                        <Form.Control 
                            type="text" 
                            name="location.city" 
                            value={formik.values.location.city || ''} 
                            onChange={formik.handleChange} 
                            isInvalid={formik.touched.location?.city && formik.errors.location?.city}
                            placeholder="Enter city" 
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.location?.city}</Form.Control.Feedback>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="country">
                    <Col sm={12}>
                        <Form.Label>Country:</Form.Label>
                    </Col>
                    <Col sm={12}>
                        <Form.Control 
                            type="text" 
                            name="location.country" 
                            value={formik.values.location.country || ''} 
                            onChange={formik.handleChange} 
                            isInvalid={formik.touched.location?.country && formik.errors.location?.country}
                            placeholder="Enter country" 
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.location?.country}</Form.Control.Feedback>
                    </Col>
                </Form.Group>

                <Form.Group as={Row}>
                    <Col xs={6}>
                        <Form.Check 
                            type="checkbox" 
                            label="Wifi" 
                            name="meta.wifi" 
                            checked={formik.values.meta.wifi} 
                            onChange={formik.handleChange} 
                        />
                    </Col>
                    <Col xs={6}>
                        <Form.Check 
                            type="checkbox" 
                            label="Parking" 
                            name="meta.parking" 
                            checked={formik.values.meta.parking} 
                            onChange={formik.handleChange} 
                        />
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Col xs={6}>
                        <Form.Check 
                            type="checkbox" 
                            label="Breakfast" 
                            name="meta.breakfast" 
                            checked={formik.values.meta.breakfast} 
                            onChange={formik.handleChange} 
                        />
                    </Col>
                    <Col xs={6}>
                        <Form.Check 
                            type="checkbox" 
                            label="Pets Allowed" 
                            name="meta.pets" 
                            checked={formik.values.meta.pets} 
                            onChange={formik.handleChange} 
                        />
                    </Col>
                </Form.Group>

                <Button variant="primary" type="submit">
                    {mode === 'edit' ? 'Save Changes' : 'Create'}
                </Button>

            </Form>
        </Container>
    );
}

export default VenueForm;
