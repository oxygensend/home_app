import moment from 'moment';

export const getTodayIsoDate = () => {
    return moment(new Date(), 'DD-MM-YYYY').format().split('T')[0];
};
