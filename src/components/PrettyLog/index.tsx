import React from 'react';
import { Value, ValueType } from '../../models';

export const prettify = (val: Value): string => {
  switch (val.type) {
    case ValueType.Array:
      return `[${val.value.map(prettify).join(', ')}]`;
    case ValueType.String:
      return `"${val.value.replace(/"|\\/g, '\\$&')}"`;
    default:
      return val.value;
  }
};

export interface Props {
  value: Value;
}
export default class PrettyLog extends React.Component<Props> {
  render() {
    return <span>{prettify(this.props.value)}</span>;
  }
}
