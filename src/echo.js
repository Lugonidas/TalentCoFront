import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.REACT_APP_PUSHER_KEY,
    cluster: import.meta.env.REACT_APP_PUSHER_CLUSTER,
    forceTLS: true,
});

export default echo;
