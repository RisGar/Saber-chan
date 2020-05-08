/* eslint-disable @typescript-eslint/explicit-function-return-type */
// TODO date function
export default class date {
  date() {
    const now = Date.now();
    const dateZenbu = new Date(now);
    const dateNow = dateZenbu.getDate();
    const month = dateZenbu.getMonth() + 1;
    const year = dateZenbu.getFullYear();
    const hours = dateZenbu.getHours();
    const minutes = dateZenbu.getMinutes();
    const seconds = dateZenbu.getSeconds();

    this.fullTime = `${dateNow}.${month}.${year} ${hours}:${minutes}:${seconds}`;
  }
}
