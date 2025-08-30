import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Header.css';

const navItems = [
  { label: 'Home', path: '/home' },
  { label: 'Product', path: '/product' },
  { label: 'About Us', path: '/about' },
  { label: 'Contact', path: '/contact' },
  { label: 'My Page', path: '/admin/dashboard' },
];

const Header = () => {
  return (
    <>
      {/* Desktop Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark px-3 navbar-custom d-none d-md-flex">
        <div className="container">
          <Link className="navbar-brand fs-5 d-flex align-items-center" to="/home">
            <img
              src="/images/logo/logo.png"
              alt="MyApp Logo"
              style={{ height: '70px', width: 'auto' }}
            />
            {/* <span className="ms-2 d-none d-lg-inline">MyApp</span> */}
          </Link>

          <div className="collapse navbar-collapse justify-content-end" id="navbarNavDesktop">
            <ul className="navbar-nav align-items-center gap-5 fs-5">
              {navItems.map(item => (
                <li className="nav-item" key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `nav-link fw-semibold ${isActive
                        ? 'text-white border-bottom border-3 border-white pb-1'
                        : 'text-light'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}

              <li className="nav-item">
                <button className="btn btn-outline-light d-flex align-items-center gap-1">
                  <span>🔍</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav className="navbar navbar-dark px-3 d-flex d-md-none navbar-custom">
        <div className="container-fluid">


          <Link className="navbar-brand ms-2" to="/home">
            <img src="/images/logo/logo.png" alt="MyApp Logo" style={{ height: '70px' }} />
          </Link>
          <button
            className="navbar-toggler custome-hambuger"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#mobileMenu"
            aria-controls="mobileMenu"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>
      </nav>

      {/* Offcanvas Menu for Mobile */}
      <div className="offcanvas offcanvas-end" tabIndex="-1" id="mobileMenu">
        <div className="offcanvas-header d-flex align-items-center justify-content-between">
          {/* Logo + Tên App */}
          <Link className="navbar-brand d-flex align-items-center" to="/home" onClick={() => {
            const offcanvasEl = document.getElementById('mobileMenu');
            const bsOffcanvas = window.bootstrap.Offcanvas.getInstance(offcanvasEl);
            bsOffcanvas?.hide();
          }}>
            <img src="/images/logo/logo.png" alt="Logo" style={{ height: '40px' }} />
            <span className="ms-2 fw-bold">Tap hoa Thua Van</span>
          </Link>

          {/* Nút đóng offcanvas */}
          <button type="button" className="btn-close text-reset fs-3" data-bs-dismiss="offcanvas"></button>
        </div>

        <div className="offcanvas-body pt-0">
          <div className='p-2 custom-top-left'>
            <ul className="navbar-nav custom-menu-text">
              {/* Search button */}
              <li className="nav-item">
                <button className="btn btn-outline-light d-flex align-items-center gap-2">
                  <span>🔍</span> Search
                </button>
              </li>
              {navItems.map(item => (
                <li className="nav-item my-2" key={item.path}>
                  <NavLink
                    to={item.path}
                    className="nav-link fs-3"
                    onClick={() => {
                      const offcanvasEl = document.getElementById('mobileMenu');
                      const bsOffcanvas = window.bootstrap.Offcanvas.getInstance(offcanvasEl);
                      bsOffcanvas?.hide();
                    }}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

    </>
  );
};

export default Header;
