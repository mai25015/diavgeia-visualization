import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="text-white bg-[#005689]">
      <div className="container flex items-center justify-between px-6 py-4 mx-auto">
        <Link to="/organizations" className="hover:underline">
        <h1 className="text-lg font-bold md:text-2xl">Διαύγεια Visualization</h1></Link>
        <nav>
          <ul className="flex flex-wrap gap-4 space-x-2 text-sm md:text-base">
            <li>
              <Link to="/organizations" className="hover:underline">
                Λήψη εγγεγραμμένων φορέων
              </Link>
            </li>
            <li>
              <Link to="/acts" className="hover:underline">
                Στοιχεία Πράξεων
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;