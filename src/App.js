import React from 'react';
import NavBar from './components/NavBar';
import NotFound from './components/NotFound'; 
import HomePage from './components/HomePage';
import BiddingPage from './components/BiddingPage'

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AllPlayers from './components/AllPlayers';

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage /> } />
        <Route path='/all' element={<AllPlayers/>}/>
        <Route path='/eligible' element={<BiddingPage />} />
        <Route path='/*' element={<NotFound />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
