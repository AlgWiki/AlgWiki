import React, { Component } from 'react';
import Button from '@atlaskit/button';
import {
  Nav,
  Heading,
  NavList,
  NavItem,
  NavLink,
  AccountSection,
  HeadingLink,
  AccountButtons,
} from './styled';
import Login from '../../../Login/async';

export interface Props {}
export interface State {
  showLoginDialog: boolean;
}
export default class Header extends Component<Props, State> {
  state: State = {
    showLoginDialog: false,
  };

  componentDidMount() {
    Login.preload();
  }

  render() {
    const { showLoginDialog } = this.state;
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

          <AccountSection>
            <AccountButtons>
              <NavItem>
                <Button onClick={() => this.setState({ showLoginDialog: true })}>Log In</Button>
              </NavItem>
              <NavItem>
                <Button
                  appearance="primary"
                  onClick={() => this.setState({ showLoginDialog: true })}
                >
                  Sign Up
                </Button>
              </NavItem>
            </AccountButtons>
            {showLoginDialog && <Login onClose={() => this.setState({ showLoginDialog: false })} />}
          </AccountSection>
        </Nav>
      </header>
    );
  }
}
