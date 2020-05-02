// TODO date function
function date() {

    const now = Date.now();
    const date_zenbu = new Date(now);
    const date = date_zenbu.getDate();
    const month = date_zenbu.getMonth() + 1;
    const year = date_zenbu.getFullYear();
    const hours = date_zenbu.getHours();
    const minutes = date_zenbu.getMinutes();
    const seconds = date_zenbu.getSeconds();

    this.full_time = `${date}.${month}.${year} ${hours}:${minutes}:${seconds}`;
}

module.exports = date;