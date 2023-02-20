import {DateTime} from "luxon";

export const isoDateReviver = (key: string, value: any) => {
    if (key === 'transactionDate' || key === 'createdAt' || key === 'updatedAt') {
        return DateTime.fromISO(value);
    }
    return value;
};