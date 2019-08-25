import React from 'react';
import { Value, ValueType } from 'common/dist/model';

export const prettify = (value: Value): string => {
  switch (value.type) {
    case ValueType.Integer:
    case ValueType.Float:
      return value.value;
    case ValueType.String:
      return `"${value.value.replace(/"|\\/g, '\\$&')}"`;
    case ValueType.List:
      return `[${value.values.map(prettify).join(', ')}]`;
    case ValueType.Tuple:
      return `(${value.values.map(prettify).join(', ')})`;
    case ValueType.Map:
      return `{${value.pairs
        .map(({ key, value }) => `${prettify(key)}: ${prettify(value)}`)
        .join(', ')}}`;
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
