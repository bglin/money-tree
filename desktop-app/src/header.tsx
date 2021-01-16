import React from 'react';
import {Link} from "react-router-dom";
import {Navbar,Button, Nav} from 'react-bootstrap';


function Navigation() {

  return(
  <Navbar bg="dark" variant="dark">
    <Navbar.Brand>Reward Tracker</Navbar.Brand>
    <Nav className="mr-auto">
    <Nav.Link> <Link to="/" replace>Home</Link></Nav.Link>
    {/*<Nav.Link><Link to="/roster" replace>Roster</Link></Nav.Link>*/}
    </Nav>
  </Navbar>
)

};

export default Navigation;
