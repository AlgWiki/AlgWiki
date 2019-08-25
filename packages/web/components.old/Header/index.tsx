import React, { Component } from 'react';
import Button from '@atlaskit/button';
import Link from 'next/link';
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
import Login, { LoginForm } from '../Login';
import { Mode } from '../Login/types';

export interface Props {}
export interface State {
  loginDialogMode: Mode | null;
}
export default class Header extends Component<Props, State> {
  state: State = { loginDialogMode: null };

  componentDidMount() {
    LoginForm.preload();
  }

  render() {
    const { loginDialogMode } = this.state;
    return (
      <header>
        <Nav>
          <Link href="/" passHref>
            <HeadingLink>
              <Heading>Alg.Wiki</Heading>
            </HeadingLink>
          </Link>

          <NavList>
            <NavItem>
              <Link href="/wiki" passHref>
                <NavLink>Wiki</NavLink>
              </Link>
            </NavItem>
            <NavItem>
              <Link href="/challenges" passHref>
                <NavLink>Challenges</NavLink>
              </Link>
            </NavItem>
            <NavItem>
              <Link href="/tutorials" passHref>
                <NavLink>Tutorials</NavLink>
              </Link>
            </NavItem>
          </NavList>

          <AccountSection>
            <AccountButtons>
              <NavItem>
                <Button onClick={() => this.setState({ loginDialogMode: Mode.Login })}>
                  Log In
                </Button>
              </NavItem>
              <NavItem>
                <Button
                  appearance="primary"
                  onClick={() =>
                    this.setState({
                      loginDialogMode: Mode.Signup,
                    })
                  }
                >
                  Sign Up
                </Button>
              </NavItem>
            </AccountButtons>
            {loginDialogMode !== null && (
              <Login
                mode={loginDialogMode}
                onClose={() => this.setState({ loginDialogMode: null })}
              />
            )}
          </AccountSection>
        </Nav>
      </header>
    );
  }
}
