import { ErrorType, Violation } from '../types';

export const findPropertyViolation = <T>(violations: Array<Violation<T>>, property: string): ErrorType | undefined => {
    return violations.find((violation: any) => violation.property === property)?.constraints;
};
