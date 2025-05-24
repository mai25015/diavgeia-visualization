import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Organizations from '../src/features/organizations/Organizations';
import ActsSummary from './features/acts/components/ActsSummary';




function App() {
  return (
    <Router>
      <div className="bg-[#fef9f5] min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Organizations />} />
            <Route path="/organizations" element={<Organizations />} />
            <Route path="/acts" element={<ActsSummary />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;