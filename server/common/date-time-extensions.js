module.exports = {
    getUTCDate: function (date) {
        var year = date.getFullYear();
        var month = date.getMonth();
        var currDate = date.getDate();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();

        return new Date(Date.UTC(year, month, currDate, hours, minutes, seconds));
    }
};