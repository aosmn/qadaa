import axios from 'axios';
import day from 'dayjs';

export const fetchPrayerTimes = ({ latitude, longitude, method = 0 }) => {
    return axios
        .get(
            `http://api.aladhan.com/v1/timings/${day().unix()}?latitude=${latitude}&longitude=${longitude}&method=${method}`
        )
        .then(res => {
            // console.log(res.data.data.timings);
            return res.data.data.timings;
        });
};
