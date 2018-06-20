import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Button from '@atlaskit/button';
import { Nav, Heading, NavList, NavItem, NavLink, AccountButtons, HeadingLink } from './styled';

export default class Header extends Component {
  render() {
    return (
      <header>
        <Nav>
          <HeadingLink to="/">
            <Heading>Alg.Wiki</Heading>
          </HeadingLink>

          <NavList>
            <NavItem>
              <NavLink to="/wiki">Wiki</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/challenges">Challenges</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/tutorials">Tutorials</NavLink>
            </NavItem>
          </NavList>

          <AccountButtons>
            <NavItem>
              <Button>Create Account</Button>
            </NavItem>
            <NavItem>
              <Button appearance="primary" onClick={() => {}}>
                Login
              </Button>
            </NavItem>
          </AccountButtons>
        </Nav>
      </header>
    );
  }
}
