import { is, both, complement, equals } from 'ramda';

export const isNumber = both(is(Number), complement(equals(NaN)));
