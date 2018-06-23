import { prettify } from '.';
import { ValueType } from '../../models';

describe('prettify', () => {
  test('integer', () => {
    expect(prettify({ type: ValueType.Integer, value: '123' })).toBe('123');
    expect(prettify({ type: ValueType.Integer, value: '-123' })).toBe('-123');
    expect(
      prettify({ type: ValueType.Integer, value: '123456789123456789123456789123456789123456789' }),
    ).toBe('123456789123456789123456789123456789123456789');
  });

  test('float', () => {
    expect(prettify({ type: ValueType.Float, value: '123.456' })).toBe('123.456');
    expect(prettify({ type: ValueType.Float, value: '-123.456' })).toBe('-123.456');
    expect(prettify({ type: ValueType.Float, value: '0.056' })).toBe('0.056');
    expect(prettify({ type: ValueType.Float, value: '0.0' })).toBe('0.0');
    expect(
      prettify({
        type: ValueType.Float,
        value: '123456789123456789123456789123456789123456789.000000000000000000000000000000123456',
      }),
    ).toBe('123456789123456789123456789123456789123456789.000000000000000000000000000000123456');
  });

  test('string', () => {
    expect(prettify({ type: ValueType.String, value: 'Hello, world!' })).toBe('"Hello, world!"');
    expect(prettify({ type: ValueType.String, value: 'Quote "mark" and \\backslash\\ here' })).toBe(
      '"Quote \\"mark\\" and \\\\backslash\\\\ here"',
    );
  });
});
