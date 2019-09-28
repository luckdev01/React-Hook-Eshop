import React, { Fragment, useEffect } from 'react';
import { withRouter } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { connect } from 'react-redux';

import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Badge from 'react-bootstrap/Badge';

import { GoogleLogout } from 'react-google-login';

import {
  setSortBy,
  setFilterBy,
  setPageToLoad,
} from '../../store/actions/header';
import { loadProducts } from '../../store/actions/products';
import { getGoogleUser, logOutGoogleUser } from '../../store/actions/auth';
import { config } from '../../services/config';

import './styles.css';

const Header = ({
  location,
  header,
  loadProducts,
  setSortBy,
  setFilterBy,
  setPageToLoad,
  liked,
  cart,
  auth,
  getGoogleUser,
  logOutGoogleUser,
}) => {
  const { pathname } = location;

  useEffect(() => {
    getGoogleUser();
  }, []);

  function setBrandFilterClick(val) {
    setFilterBy({ brand: val, color: header.filterBy.color });
    setPageToLoad(0);
    loadProducts(
      {
        page: { index: 0, size: config.pageSize },
        filter: { brand: val, color: header.filterBy.color },
        sort: { ...header.sortBy },
      },
      false,
    );
    window.scrollTo(0, 0);
  }

  function setColorFilterClick(val) {
    setFilterBy({ color: val, brand: header.filterBy.brand });
    setPageToLoad(0);
    loadProducts(
      {
        page: { index: 0, size: config.pageSize },
        filter: { color: val, brand: header.filterBy.brand },
        sort: { ...header.sortBy },
      },
      false,
    );
    window.scrollTo(0, 0);
  }

  function setSortClick(key, direction) {
    setSortBy({ key, direction });
    setPageToLoad(0);
    loadProducts(
      {
        page: { index: 0, size: config.pageSize },
        filter: { ...header.filterBy },
        sort: { key, direction },
      },
      false,
    );
    window.scrollTo(0, 0);
  }

  function calcCartLength() {
    const sum = cart.cartProducts
      .map(p => p.quantity)
      .reduce((a, b) => a + b, 0);
    return sum;
  }

  function logoutSuccess() {
    logOutGoogleUser();
  }

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      bg="primary"
      variant="dark"
      fixed="top"
    >
      <Container>
        <Navbar.Brand href="/home">Lure shop</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto" activeKey={pathname}>
            <LinkContainer to="/home">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/products">
              <Nav.Link>Products</Nav.Link>
            </LinkContainer>
            <NavDropdown
              disabled={pathname !== '/products'}
              title="Sort"
              id="collasible-nav-dropdown"
            >
              {[
                { label: 'price (asc)', key: 'price', direction: 'asc' },
                { label: 'price (desc)', key: 'price', direction: 'desc' },
                { label: 'weight (asc)', key: 'weight', direction: 'asc' },
                { label: 'weight (desc)', key: 'weight', direction: 'desc' },
                { label: 'size (asc)', key: 'size', direction: 'asc' },
                { label: 'size (desc)', key: 'size', direction: 'desc' },
                { label: 'none', key: 'none', direction: 'asc' },
              ].map((item, i) => (
                <NavDropdown.Item
                  active={
                    header.sortBy.key === item.key &&
                    header.sortBy.direction === item.direction
                  }
                  key={i}
                  onClick={() => setSortClick(item.key, item.direction)}
                >
                  {item.label}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
            <NavDropdown
              disabled={pathname !== '/products'}
              title="Brand"
              id="collasible-nav-dropdown"
            >
              {[
                { label: 'Rapala', filter: 'rapala' },
                { label: 'Heddon', filter: 'heddon' },
                { label: 'Cotton Cordell', filter: 'cottoncordel' },
                { label: 'Rebel', filter: 'rebel' },
                { label: 'Mepps', filter: 'mepps' },
                { label: 'none', filter: 'none' },
              ].map((item, i) => (
                <NavDropdown.Item
                  active={header.filterBy.brand === item.filter}
                  key={i}
                  onClick={() => setBrandFilterClick(item.filter)}
                >
                  {item.label}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
            <NavDropdown
              disabled={pathname !== '/products'}
              title="Color"
              id="collasible-nav-dropdown"
            >
              {[
                { label: 'red', filter: 'red' },
                { label: 'blue', filter: 'blue' },
                { label: 'green', filter: 'green' },
                { label: 'yellow', filter: 'yellow' },
                { label: 'brown', filter: 'brown' },
                { label: 'black', filter: 'black' },
                { label: 'white', filter: 'white' },
                { label: 'any', filter: 'none' },
              ].map((item, i) => (
                <NavDropdown.Item
                  active={header.filterBy.color === item.filter}
                  key={i}
                  onClick={() => setColorFilterClick(item.filter)}
                >
                  {item.label}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
            <LinkContainer to="/liked">
              <Nav.Link>
                Liked{' '}
                {liked.likedProducts.length > 0 && (
                  <Badge pill variant="light">
                    {liked.likedProducts.length}
                  </Badge>
                )}
              </Nav.Link>
            </LinkContainer>
          </Nav>
          <Nav activeKey={pathname}>
            <LinkContainer to="/cart">
              <Nav.Link>
                Cart <i className="fa fa-shopping-cart"></i>{' '}
                {calcCartLength() > 0 && (
                  <Badge pill variant="danger">
                    {calcCartLength()}
                  </Badge>
                )}
              </Nav.Link>
            </LinkContainer>
            {!auth.googleUser ? (
              <LinkContainer to="/login">
                <Nav.Link>Login</Nav.Link>
              </LinkContainer>
            ) : (
              <NavDropdown title="Loged in" id="basic-nav-dropdown">
                <NavDropdown.Item>
                  <div
                    className="row"
                    style={{ minWidth: '15rem', maxHeight: '4rem' }}
                  >
                    <div className="col-lg-3 col-2 img-container">
                      <img
                        src={auth.googleUser.imageUrl}
                        className="user-img"
                      />
                    </div>
                    <div className="col-lg-9 col-10 text-left">
                      <p className="">
                        <strong>{auth.googleUser.name}</strong>
                      </p>
                      <p className="small">{auth.googleUser.email}</p>
                    </div>
                  </div>
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <GoogleLogout
                  clientId={config.clientId}
                  buttonText="Logout"
                  onLogoutSuccess={logoutSuccess}
                  render={renderProps => (
                    <NavDropdown.Item
                      className="text-center"
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                    >
                      Log out
                    </NavDropdown.Item>
                  )}
                />
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
export default connect(
  state => ({
    header: state.headerReducer,
    liked: state.likedReducer,
    cart: state.cartReducer,
    auth: state.authReducer,
  }),
  {
    setSortBy,
    setFilterBy,
    setPageToLoad,
    loadProducts,
    getGoogleUser,
    logOutGoogleUser,
  },
)(withRouter(Header));
