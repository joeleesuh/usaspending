/**
 * moneyFormatter-test.js
 * Created by Kevin Li 1/25/17
 */

import { formatMoney, formatMoneyWithPrecision, calculatePercentage, formatLargeValues } from 'helpers/moneyFormatter';

test.each([
    [123.45, '$123'],
    [123.75, '$124'],
    [123.50, '$124'],
    [12345678.23, '$12,345,678'],
    [-12345678.23, '-$12,345,678'],
    [0, '$0']
])('formatMoney: when input is %s --> %s', (input, output) => {
    expect(formatMoney(input)).toEqual(output);
});

test.each([
    [123.45, '$123.45'],
    [0, '$0.00', '--'],
    ['', '--', '--'],
    [null, '--', '--'],
    [null, 'you can specify the default return value in this case', 'you can specify the default return value in this case'],
    ['', '$0.00']
])('formatMoneyWithPrecision: when input is %s --> %s', (input, output, defaultReturn = null) => {
    expect(formatMoneyWithPrecision(input, 2, defaultReturn)).toEqual(output);
});

test.each([
    [50, 100, '50.0%'],
    [50, 0, 'Happy Troll Dance', 'Happy Troll Dance'],
    [50, 0, '--'],
    [.0000000001, 100000, "< 0.01%", '--', 2, { absoluteMin: '< 0.01%' }],
    [.0000000001, 100000, "0.00%", '--', 2, { absoluteMin: null }],
    [50, null, '--'],
    [50, 'null', '--'],
    [50, '', '--'],
    [null, 100, '--'],
    ['null', 100, '--'],
    ['', 100, '--']
])('calculatePercentage with inputs %s and %s returns %s', (num, denom, rtrn, defaultRtrn = '--', toDecimalPlaces = 1, config = { absoluteMin: '' }) => {
    expect(calculatePercentage(num, denom, defaultRtrn, toDecimalPlaces, config)).toEqual(rtrn);
});

test.each([
    [0, '$0'],
    [1123.45, '$1,123'],
    [1123.75, '$1,124'],
    [11123.50, '$11,124'],
    [12345678, '$12.35 M'],
    [12345678000, '$12.35 B'],
    [123456780000000, '$123.46 T']
])('formatLargeValues: when input is %s --> %s', (input, output) => {
    expect(formatLargeValues(input)).toEqual(output);
});

test.each([
    [0, 5, '$0'],
    [1123.45, 3, '$1,123'],
    [1123.75, 1, '$1,124'],
    [11123.50, 0, '$11,124'],
    [12345678, 2, '$12.35 M'],
    [12345678000, 3, '$12.346 B'],
    [123456780000000, 1, '$123.5 T']
])('formatLargeValues: when input is %s, %s --> %s', (value, decimals, output) => {
    expect(formatLargeValues(value, decimals)).toEqual(output);
});
