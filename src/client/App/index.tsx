import React, { Component, ComponentType } from 'react';
import { Switch, Route } from 'react-router';
// import { connect } from 'react-redux';
// import { TransitionGroup, Transition } from 'transition-group';
// import styled from 'styled-components';
import '@atlaskit/css-reset';

// import Workspace from '../workspace';

import Header from './view/Header';

// import routeMap, { HOME, HOW, routeComponents } from '../../routes/index';
// import { State } from '../../state/index';

// import './index.css';

// interface UniversalComponentProps {
//   page: string;
//   isLoading: boolean;
// }
// const UniversalComponent: React.SFC<UniversalComponentProps> =
//   universal((props: UniversalComponentProps) => pageComponentMap[props.page], {
//     minDelay: 500,
//     loading: <p>Loading...</p>,
//     error: <p>Error!</p>,
//   });

// class FourOhFour extends Component<{}> {
//   render() {
//     return <div>404</div>;
//   }
// }

// interface SwitcherProps {
//   pageComponent: ComponentType;
//   direction: string;
//   isLoading: boolean;
//   pageType: string;
// }

// class SwitcherComponent extends React.Component<SwitcherProps> {
//   render() {
//     const PageComponent = this.props.pageComponent;
//     return <PageComponent />;
//     // const { pageComponent, direction, isLoading } = this.props;
//     // return (
//     //   <TransitionGroup
//     //     // className={`${styles.switcher} ${direction}`}
//     //     duration={500}
//     //     prefix="fade"
//     //   >
//     //     <Transition key={page}>
//     //       <div>{loadedComponent(pageComponent)}</div>
//     //     </Transition>
//     //   </TransitionGroup>
//     // );
//   }
// }
// const Switcher = connect((state: State): SwitcherProps => ({
//   pageComponent: routeComponents[state.location.type] || FourOhFour,
//   direction: 'back',
//   isLoading: false,
//   pageType: state.location.type,
// }))(SwitcherComponent);

import Home from '../Home/async';
import { Link } from 'react-router-dom';

export default class App extends Component {
  render() {
    return (
      <main>
        <Header />

        <Switch>
          <Route exact path="/" component={Home} />
        </Switch>
      </main>
    );
  }
}
