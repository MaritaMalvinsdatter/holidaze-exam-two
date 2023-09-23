import React, { useState } from 'react';
import VenueList from '../components/VenueList';
import Search from '../components/Search';

function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  return (
    <div>
      <Search onSearch={setSearchTerm} />
      <div>
        <VenueList searchTerm={searchTerm} />
      </div>
    </div>
  );
}

export default Home;
