export default function getTime(time) {
    let hours = new Date(time).getHours()
    let minutes = new Date(time).getMinutes()
    if(hours < 10) hours = '0' + hours;
    if(minutes < 10) minutes = '0' + minutes;
    return hours + ':' + minutes;
}