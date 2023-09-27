import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { API_BASE, API_BOOKINGS } from '../EndPoints';
import { getTotalPrice } from '../ApiHelper';
import styles from '../../styles/Calendar.module.css';
import { Container, Row, Col } from 'react-bootstrap';



function BookingCalendar({ maxGuests, bookings, venueId, price }) {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(null);
    const [guests, setGuests] = useState(1);
    const [bookedDates, setBookedDates] = useState([]);
  
    useEffect(() => {
      // Fetching all booked dates from the bookings data
      setBookedDates(getBookedDates(bookings));
    }, [bookings]);
  
    const handleGuestChange = (event) => {
      setGuests(event.target.value);
    };
  
    function getBookedDates(bookings) {
      let dates = [];
      bookings.forEach(booking => {
        const start = new Date(booking.dateFrom);
        const end = new Date(booking.dateTo);
        for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
          dates.push(new Date(d));
        }
      });
      return dates;
    }
  
    const handleBookClick = async () => {
      const bookingData = {
        dateFrom: startDate.toISOString().split('T')[0],
        dateTo: endDate.toISOString().split('T')[0],
        guests: parseInt(guests),
        venueId: venueId 
      };
      await saveBooking(bookingData);
    };
  
    async function saveBooking(bookingData) {
      try {
          const token = localStorage.getItem("token");
          console.log('Sending booking data:', bookingData);
          
          const response = await fetch(API_BASE + API_BOOKINGS, {
              method: "POST",
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                  dateFrom: bookingData.dateFrom,
                  dateTo: bookingData.dateTo,
                  guests: bookingData.guests,
                  venueId: bookingData.venueId
              })
          });
  
          if (!response.ok) {
              const errorData = await response.json();
              console.error("Error response from server:", errorData);
          } else {
              const responseBody = await response.json();
              console.log("Booking saved:", responseBody);
          }
      } catch (error) {
          console.error("Error saving booking:", error);
      }
    }

    return (
        <div className="d-flex flex-column align-items-center">
            <Container className={styles.bookingBox}>

                <div className={styles.infoTopLeft}>
                    <div>Price per night: ${price}</div>
                    <div>Max Guests: {maxGuests}</div>
                </div>

                <div className={styles.datePickers}>
                    <Row>
                        <Col xs={12} md={6}>
                            <div className="d-flex flex-column align-items-center">
                                <label>Check-in:</label>
                                <DatePicker 
                                    className={styles.inputField}
                                    selected={startDate}
                                    onChange={date => setStartDate(date)}
                                    selectsStart
                                    startDate={startDate}
                                    endDate={endDate}
                                    excludeDates={bookedDates}
                                />
                            </div>
                        </Col>
                        <Col xs={12} md={6}>
                            <div className="d-flex flex-column align-items-center">
                                <label>Check-out:</label>
                                <DatePicker 
                                    className={styles.inputField}
                                    selected={endDate}
                                    onChange={date => setEndDate(date)}
                                    selectsEnd
                                    startDate={startDate}
                                    endDate={endDate}
                                    minDate={startDate}
                                    excludeDates={bookedDates}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row className="mt-2">
                        <Col>
                            <div className="d-flex flex-column align-items-center">
                                <label>Guests:</label>
                                <select value={guests} onChange={handleGuestChange} className={styles.inputField}>
                                    {Array.from({ length: maxGuests }).map((_, i) => (
                                        <option key={i} value={i + 1}>{i + 1}</option>
                                    ))}
                                </select>
                            </div>
                        </Col>
                    </Row>
                </div>

                <Row className="mt-2">
                    <Col>
                        <div>Total: ${getTotalPrice(startDate, endDate, price)}</div>
                    </Col>
                </Row>

            </Container>
            
            <button onClick={handleBookClick} className={`btn mt-2 ${styles.bookEditButton}`}>Book</button>
        </div>
    );
    
    
    
}

export default BookingCalendar;
