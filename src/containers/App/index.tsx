import * as React from 'react';
import { connect } from 'react-redux';
// import { TransitionGroup, Transition } from 'transition-group';

// import Workspace from '../workspace';

import NavBar from '../NavBar/index';

import routeMap, { HOME, HOW, routeComponents } from '../../routes/index';
import { State } from '../../state/index';

import './index.css';
import '@atlaskit/css-reset';

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

interface SwitcherProps {
  pageComponent: React.ComponentClass;
  direction: string;
  isLoading: boolean;
  pageType: string;
}

class SwitcherComponent extends React.Component<SwitcherProps> {
  render() {
    const PageComponent = this.props.pageComponent;
    return <PageComponent />;
    // const { pageComponent, direction, isLoading } = this.props;
    // return (
    //   <TransitionGroup
    //     // className={`${styles.switcher} ${direction}`}
    //     duration={500}
    //     prefix="fade"
    //   >
    //     <Transition key={page}>
    //       <div>{loadedComponent(pageComponent)}</div>
    //     </Transition>
    //   </TransitionGroup>
    // );
  }
}
const Switcher = connect(
  (state: State): SwitcherProps => ({
    pageComponent: routeComponents[state.location.type],
    direction: 'back',
    isLoading: false,
    pageType: state.location.type,
  }),
)(SwitcherComponent);

export default class App extends React.Component {
  render() {
    return (
      <main>
        <header>
          <h1>EdgeCase</h1>
        </header>

        <NavBar />

        <Switcher />
      </main>
    );
  }
}
