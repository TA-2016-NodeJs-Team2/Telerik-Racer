/*globals $*/
'use strict';

$(document).ready(function () {
    $("#grid").kendoGrid({
        columns: [{
            field: "FirstName",
            title: "First Name"
        },
            {
                field: "LastName",
                title: "Last Name"
            }],
        dataSource: {
            data: JSON.stringify(cars)
        }
    });
});