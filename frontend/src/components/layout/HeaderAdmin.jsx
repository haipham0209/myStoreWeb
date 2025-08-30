import React from 'react';
import { Link } from 'react-router-dom';
import './header-admin.css';
import { NavLink } from 'react-router-dom';

const Header = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark px-3 d-none d-sm-block mx-auto w-85">
      <div className="container">
        {/* Menu + search: gập được khi mobile */}
        <div className="collapse navbar-collapse justify-content-center" id="navbarNavAlt">
          {/* Menu */}
          <h1><a href="#">Admin</a></h1>
        </div>
        <div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
