import React from 'react';
import { AppBar, Toolbar, styled } from '@mui/material';
import { NavLink } from 'react-router-dom';

const Header = styled(AppBar)`
    background: #111111;
`;

const Tabs = styled(NavLink)`
    color: #FFFFFF;
    margin-right: 20px;
    text-decoration: none;
    font-size: 20px;
`;

const NavBar = () => {
  return (
    <Header position="static">
      <Toolbar>
        <Tabs to="./" exact="true"><b>MCL</b></Tabs>
        <Tabs to="all" exact="true">All Players</Tabs>
        <Tabs to="eligible" exact="true">Bidding Page</Tabs>

        <ul className="navbar-nav ml-auto nav-flex-icons">
          <li className="nav-item dropdown">
            <div className="nav-link dropdown-toggle" id="navbarDropdownMenuLink-333" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
              style={{
                cursor: 'pointer',
              }}>
              <i className="fas fa-user" />
            </div>
            <div className="dropdown-menu dropdown-menu-right dropdown-default" aria-labelledby="navbarDropdownMenuLink-333">
              <a className="dropdown-item" href="https://docs.google.com/spreadsheets/d/1GqJfbPYwLsAPW3XKSOgCLZy5QXeci-0IG331Ak34rNc/edit#gid=0" target={'_blank'} rel="noreferrer" >Database</a>
              <a className="dropdown-item" href="https://www.instagram.com/white_pegasus_/?hl=en" target={'_blank'} rel="noreferrer" >Creator</a>
              <a className="dropdown-item" href="https://www.instagram.com/mcl_msit/" target={'_blank'} rel="noreferrer" >Contact Us</a>
            </div>
          </li>
        </ul>
      </Toolbar>
    </Header>
  )
}

export default NavBar;