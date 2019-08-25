import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { colors } from '@atlaskit/theme';

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  padding: 16px;
`;

export const HeadingLink = styled(Link)`
  &:focus {
    outline: none;
  }
  &:focus h1 {
    text-decoration: underline;
  }
`;

export const Heading = styled.h1`
  display: inline-block;
  color: ${colors.N600};
`;

export const NavList = styled.ul`
  display: inline-block;
  flex: auto;
  margin: 0 32px;
  padding: 0;
`;

export const NavItem = styled.li`
  list-style: none;
  display: inline-block;
  margin: 0 4px;
  padding: 0;
`;

export const NavLink = styled(Link)`
  padding: 8px 16px;
  border-radius: 4px;

  &:hover {
    background: ${colors.N30};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${colors.B100};
    background: ${colors.N30};
  }
`;

export const AccountSection = styled.div`
  display: inline-block;
  margin: 0;
  padding: 0;
`;

export const AccountButtons = styled.ul`
  display: inline-block;
  margin: 0;
  padding: 0;
`;
