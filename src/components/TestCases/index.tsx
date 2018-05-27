import React, { Component, ComponentClass } from 'react';
import Collapse, { Panel } from 'rc-collapse';
import 'rc-collapse/assets/index.css';
import { Container } from './styled';
import { TestCase, Method, MethodId } from '../../models';
import { prettify } from '../PrettyLog';

export interface MethodsById {
  [id: string]: Method;
}
export const toMethodMapById = (methods: Method[]): MethodsById => {
  const map: MethodsById = {};
  for (const method of methods) {
    map[method.id] = method;
  }
  return map;
};

export interface Props {
  /** Test cases to display. */
  cases: TestCase[];
  /** Methods referenced by calls. */
  methods: Method[];
}

export default class TestCases extends React.Component<Props> {
  render() {
    const { cases, methods } = this.props;
    const methodsById = toMethodMapById(methods);
    return (
      <Container>
        <Collapse accordion>
          {cases.map(({ id, name, calls, isHidden, isActive }, i) => {
            return (
              <Panel
                key={id}
                header={
                  <span>
                    <span>{name || `Test Case #${i + 1}`}</span>
                    {isHidden && <span>Hidden</span>}
                  </span>
                }
              >
                {calls.map(({ id, methodId, input, expectedOutput }) => {
                  const method = methodsById[methodId];
                  return (
                    <div key={id}>
                      {method ? method.name : '???'}({input
                        .map(value => prettify(value))
                        .join(', ')}){expectedOutput !== null && ` = ${prettify(expectedOutput)}`}
                    </div>
                  );
                })}
              </Panel>
            );
          })}
        </Collapse>
      </Container>
    );
  }
}
