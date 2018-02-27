import * as React from 'react';
import Link from 'redux-first-router-link';

export default class NavBar extends React.PureComponent {
  render() {
    return (
      <nav>
        <ul>
          <li><Link to="/wiki">Wiki</Link></li>
          <li><Link to="/challenges">Challenges</Link></li>
          <li><Link to="/tutorials">Tutorials</Link></li>
          <li><button onClick={() => {}}>Login</button></li>
          <li><button>Create Account</button></li>
        </ul>
      </nav>
    );
  }
}
