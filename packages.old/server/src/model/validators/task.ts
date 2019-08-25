import { ValueType, Value, ValueShape } from '../../model';

/** Returns `true` if `value` is a valid `Value` object. */
export const isValidValue = (value: Value): value is Value => {
  if (!value) return false;
  switch (value.type) {
    case ValueType.Integer:
    case ValueType.Float:
    case ValueType.String:
      return typeof value.value === 'string';
    case ValueType.List:
    case ValueType.Tuple: {
      const { values } = value;
      return Array.isArray(values) && values.every(isValidValue);
    }
    case ValueType.Map: {
      const { pairs } = value;
      return (
        Array.isArray(pairs) &&
        pairs.every(({ key, value }) => isValidValue(key) && isValidValue(value))
      );
    }
    default:
      return false;
  }
};

/** Returns `true` if `shape` is a valid `ValueShape` object. */
export const isValidValueShape = (shape: ValueShape): shape is ValueShape => {
  if (!shape) return false;
  switch (shape.type) {
    case ValueType.Integer:
    case ValueType.Float:
    case ValueType.String:
      return true;
    case ValueType.List: {
      const { valueTypes } = shape;
      return Array.isArray(valueTypes) && valueTypes.every(isValidValueShape);
    }
    case ValueType.Tuple: {
      const { values } = shape;
      return (
        Array.isArray(values) &&
        values.every(({ name, type }) => typeof name === 'string' && isValidValueShape(type))
      );
    }
    case ValueType.Map: {
      const { keyType, valueType } = shape;
      return isValidValueShape(keyType) && isValidValueShape(valueType);
    }
    default:
      return false;
  }
};
