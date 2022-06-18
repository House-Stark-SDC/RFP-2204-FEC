import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 }, // below normal load
    { duration: '5m', target: 100 },
    { duration: '2m', target: 200 }, // normal load
    { duration: '5m', target: 200 },
    { duration: '2m', target: 300 }, // around the breaking point
    { duration: '5m', target: 300 },
    { duration: '2m', target: 400 }, // beyond the breaking point
    { duration: '5m', target: 400 },
    { duration: '10m', target: 0 }, // scale down. Recovery stage.
  ],
};

export default function () {
  const BASE_URL = 'http://localhost:8080'; // make sure this is not production

  const responses = http.batch([
    ['GET', `${BASE_URL}/reviews/?product_id=1`, null, { tags: { reported: false } }],
    ['GET', `${BASE_URL}/reviews/?product_id=1000000`, null, { tags: { reported: false } }],
    ['GET', `${BASE_URL}/reviews/?product_id=3000000`, null, { tags: { reported: false } }],
    ['GET', `${BASE_URL}/reviews/?product_id=5774952`, null, { tags: { reported: false } }],
  ]);

  sleep(1);
}