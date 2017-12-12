// Declare & Instantiate Empty Array
let journeyData = [];
let singleDayRecords = [];
let busIdSelection, dateSelection;

let rowCount; //Global So Validation Method Can See It
let zeroValues = 0; //Counts Number Of Zero Values
let dataBeforeSplice = [];

function filterJourneyData(data) {
    let busId = document.getElementById('bus-id').value;
    let driverId = document.getElementById('driver-id').value;
    let dayFrom = parseInt(document.getElementById('date-from').value); //1-31
    let monthFrom = parseInt(document.getElementById('month-from').value); //1-12
    let yearFrom = parseInt((document.getElementById('year-from').value).substring(2, 4)); //2017
    let dayTo = parseInt(document.getElementById('date-to').value);
    let monthTo = parseInt(document.getElementById('month-to').value);
    let yearTo = parseInt((document.getElementById('year-to').value).substring(2, 4));
    let displayNo = parseInt(document.getElementById('noOfRecords').value);
    let order = document.getElementById('order').value;
    let ignoreZero = document.getElementById('zero').checked;
    let singleDay = document.getElementById('single-day').checked;
    let includeTimeFilter = document.getElementById('includeTimeFilter').checked;

    //Date.parse() returns an Integer of millseconds since epoch (Dates In MM-DD-YY)
    let dateFrom = Date.parse("" + monthFrom + "/" + dayFrom + "/" + yearFrom);
    let dateTo = Date.parse("" + monthTo + "/" + dayTo + "/" + yearTo);

    //Date & BusID Selection Vars - For Data Selection Div
    if (singleDay) {
        dateSelection = dayFrom + "/" + monthFrom + "/" + yearFrom + " - " + dayTo + "/" + monthTo + "/" + yearTo;
    } else {
        dateSelection = dayFrom + "/" + monthFrom + "/" + yearFrom;
    }

    if (selectingById()) {
        busIdSelection = busId;
    } else {
        busIdSelection = null;
    }

    singleDayRecords = []; //Clear array from previous selection

    console.log("Date From: " + dayFrom + "/" + monthFrom + "/" + yearFrom + ".");
    console.log("Date To: " + dayTo + "/" + monthTo + "/" + yearTo + ".");
    console.log("Date From: " + dateFrom);
    console.log("Date To: " + dateTo);

    rowCount = 0; //Instantiate rowCount to 0

    //Filter By ID
    if (busId.length > 0) {
        for (let i = 0; i < data.length; i++) {
            let docId = data[i].bus_id;
            if (docId === busId) {
                journeyData.push(data[i]);
                rowCount++;
            }
        }
    } else if (driverId.length > 0) {
        for (let j = 0; j < data.length; j++) {
            let docDriver = data[j].driver_code;
            if (docDriver === driverId) {
                journeyData.push(data[j]);
                rowCount++;
            }
        }
    } else if (driverId.length > 0 && busId.length > 0) {
        triggerModal("You cannot select a Driver & Bus ID at the same time. \n Please clear one of the fields.", "error");
    }

    //Filter By Date
    if (selectingById()) { //If user is selecting by bus or driver id, splice out records from journeyData
        for (let i = journeyData.length - 1; i >= 0; i--) {
            //Current Iteration Record Information
            let docDay = journeyData[i].startDate.substring(0, 2); //D or DD
            let docMonth = journeyData[i].startDate.substring(3, 5); //M or MM
            let docYear = journeyData[i].startDate.substring(6, 8); //YY
            let docDate = Date.parse(docMonth + "/" + docDay  + "/" + docYear);

            if (docDate !== dateFrom && !singleDay) { //Single Day: If Date Doesn't Match, Splice It Out.
                journeyData.splice(i, 1);
                rowCount--;
            } else if (docDate < dateFrom || docDate > dateTo) { //Date Range: If Date Not In Range, Splice It Out.
                journeyData.splice(i, 1);
                rowCount--;
            }
        }
    } else { //If user is not selecting by an id, push the data that matches only date selection
        for (let i = 0; i < data.length; i++) {
            //Current Iteration Record Information
            let docDay = data[i].startDate.substring(0, 2); //D or DD
            let docMonth = data[i].startDate.substring(3, 5); //M or MM
            let docYear = data[i].startDate.substring(6, 8); //YY
            let docDate = Date.parse(docMonth + "/" + docDay  + "/" + docYear);

            if (docDate === dateFrom && !singleDay) {
                journeyData.push(data[i]);
                rowCount++;
            } else if (docDate >= dateFrom && docDate <= dateTo && singleDay) {
                journeyData.push(data[i]);
                rowCount++;
            }
        }
    }

    function parseDate(string) {
        let dd = string.substring(0, 2);
        let mm = string.substring(3, 5);
        let yyyy = "20" + string.substring(6, 8);
        return yyyy + "-" + mm + "-" + dd;
    }

    //Sort Records
    if (order === "Ascending") {
        journeyData.sort(function(a, b) {return a.totalIn - b.totalIn}); //if a < b, a goes first
    } else if (order === "Descending") {
        journeyData.sort(function(a, b) {return b.totalIn - a.totalIn});
    } else if (order === "Chronological") {
        console.log("Sorting By Chronological Order!");
        journeyData.sort(function(a, b) {
            let aDateString = new Date(parseDate(a.startDate) + "T" + a.startTime); //Correct Date Format "YYYY-MM-DD" + "T" + "HH:MM:SS" (Separated By Letter T)
            let bDateString = new Date(parseDate(b.startDate) + "T" + b.startTime);
            return aDateString - bDateString;
        });
    }// else it'll be in the order from the DB (No Order)

    //Remove Records That Are Zero (If Checkbox Is Checked)
    if (ignoreZero) {
        for(let i = journeyData.length - 1; i >= 0; i--) {
            if (journeyData[i].totalIn === 0) {
                journeyData.splice(i, 1);
                zeroValues++;
                rowCount--;
            }
        }

        //journeyData = journeyData.filter(function(val) {return val != 0;});
    }

    //Reduce Number Of Records
    function reduceRecordsNo(numberToReduceTo) {
        //Alerts
        if (rowCount < numberToReduceTo && rowCount > 0 && zeroValues === 0) {
            triggerModal("There are only " + rowCount + " records in your selection!", "alert");
        } else if (rowCount < numberToReduceTo && rowCount > 0 && zeroValues > 0) {
            let startString = "There are only " + (rowCount + zeroValues) + " records in your selection!\n" + zeroValues + " of them";

            if (zeroValues > 1) {
                let secondString = " are ";
                let fourthString = " have ";
            } else {
                let secondString = " is ";
                let fourthString = " has ";
            }

            let thirdString = "zero and";
            let fifthString =  "been removed from the selection.";

            triggerModal(startString + secondString + thirdString + fourthString + fifthString, "alert");
        } else if (rowCount === 0 && zeroValues > 0) {
            triggerModal("All the records in your selection are zero!", "alert");
        } else if (rowCount > numberToReduceTo) {
            let string1 = "There are " + rowCount + " records in your selection!\n";
            let string2 = "Currently displaying the first " + numberToReduceTo + ".\nPlease see the" +
                  " 'Record Selection' tab for a breakdown of your selection to further refine it."
            if (zeroValues > 0) {
                let message = string1 + "Zero value records have been removed.\n" + string2;
                triggerModal(message, "alert");
            } else {
                let message = string1 + string2;
                triggerModal(message, "alert");
            }


            //The user has selected n records. n is > numberToReduceTo, therefore, show the user the dates of their selected records.
            populateRecordOverflow(journeyData);
        }

        //Iterate Backwards Over Data Array & Splice Necessary Records
        for (let i = rowCount - 1; i >= 0; i--) {
            if (journeyData.length > numberToReduceTo) {
                journeyData.splice(i, 1);
            }
        }
    }

    /* For updateDataSelectionInformation()
       - If user is selecting a single day, we want the total pass in for that day.
       - But if the no of records for that day is > 40, it will only display total in for that 40
       - Therefore, BEFORE we reduceRecordsNo(), if we're selecting a single day, we store all the
         records for that day into the singleDayRecords variable
   */
    if (!singleDay) {
        singleDayRecords = journeyData.slice(0);
    }

    reduceRecordsNo(displayNo); //Invoke Record Number Reduction

    //Alert User If No Records In Selection
    if (rowCount === 0 && singleDay && busId.length > 0) {
        triggerModal("No Records In The Range [" + dayFrom + "/" + monthFrom + "/" + yearFrom
               + "] - [" + dayTo + "/" + monthTo + "/" + yearTo + "] with the ID: " + busId, "error");
    } else if (rowCount === 0 && !singleDay && busId.length > 0) {
        triggerModal("No Records With The Date: " + dayFrom + "/" + monthFrom + "/" + yearFrom + " and " +
             "the ID: " + busId, "error");
    } else if (rowCount === 0 && singleDay && driverId.length > 0) {
        triggerModal("No Records In The Range [" + dayFrom + "/" + monthFrom + "/" + yearFrom
               + "] - [" + dayTo + "/" + monthTo + "/" + yearTo + "] with the ID: " + driverId, "error");
    } else if (rowCount === 0 && !singleDay && driverId.length > 0) {
        triggerModal("No Records With The Date: " + dayFrom + "/" + monthFrom + "/" + yearFrom + " and " +
              "the ID: " + driverId, "error");
    } else if (rowCount === 0 && !singleDay) {
        triggerModal("No Records With The Date: " + dayFrom + "/" + monthFrom + "/" + yearFrom + ".", "error");
    } else if (rowCount === 0 && singleDay) {
        triggerModal("No Records In The Range [" + dayFrom + "/" + monthFrom + "/" + yearFrom
               + "] - [" + dayTo + "/" + monthTo + "/" + yearTo + "]", "error");
    }

    //Filter By Time
    if (includeTimeFilter) {
        filterDataByTime(journeyData);
    }

    //Append JourneyData --> Hidden Field In Form For GET
    document.getElementById('report-data').value = JSON.stringify(journeyData);
    document.getElementById('report-overall-records').value = rowCount;
    document.getElementById('total_in').value = getSelectionPassCount()[0];
    document.getElementById('filter_by_time').value = document.getElementById('includeTimeFilter').checked;
    document.getElementById('ignore_zero').value = document.getElementById('zero').checked;
} //End of filterJourneyData()

function validateDataFilter() {
    return rowCount !== 0;
}

function initData() {
    let totalIn = 0;
    //Initialise Graph To First 25
    for (let i = 0; i < 25; i++) {
        journeyData.push(dBJourneyData[i]);
        totalIn += parseInt(journeyData[i].totalIn);
    }
    updateDataSelectionInformation("Any", "17/07/17 - 10/08/17", "Any", totalIn);
    totalInParseInt();
}

function totalInParseInt() {
    //Parse All TotalIn Values As Integers
    journeyData.forEach(function(d) {
        d.totalIn = +d.totalIn;
    });
}

function toggleToFilter() {
    let singleDay = document.getElementById('single-day').checked;
    if (!singleDay) {
        //Un-Checked - Single Day
        $("#date-to, #month-to, #year-to").animate({"opacity": "0.2"}, 500);
        $("#date-to, #month-to, #year-to").prop("disabled", true);
        $("#selection-type").fadeOut(250, function() {
            $(this).text("- Selecting Single Day -").fadeIn(250);
        });
        $("#date-to, #month-to, #year-to").css("cursor", "no-drop");
    } else if (singleDay) {
        //Checked - Date Range
        $("#date-to, #month-to, #year-to").animate({"opacity": "1"}, 500);
        $("#date-to, #month-to, #year-to").prop("disabled", false);
        $("#selection-type").fadeOut(250, function() {
            $(this).text("- Selecting Date Range -").fadeIn(250);
        });
        $("#date-to, #month-to, #year-to").css("cursor", "default");
    }
}

function populateRecordOverflow(data) {
  dataBeforeSplice = []; //Clear Array From Previous Selection. Prevents Cumulative Counts
    //This function recieves all the selected records BEFORE splicing out the selected quantity
    let container = document.getElementById('record-overflow');
    container.innerHTML = ""; //Remove the "You haven't selected any records."
    document.getElementById('record-overflow-days').innerHTML = "Select a month on the left to breakdown.";

    let overflowCount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; //Array of counters

    let months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

    //Iterate over selection, count record months
    for (let i = 0; i < data.length; i++) {
        //Current Iteration Record Information
        let docMonth = data[i].startDate.substring(3, 5); //M or MM
        dataBeforeSplice.push(data[i]); //Store data in this array for expandOverflow()

        switch(docMonth) {
            case "01" : //January
                overflowCount[0]++;
                break;
            case "02" : //February
                overflowCount[1]++;
                break;
            case "03" : //March
                overflowCount[2]++;
                break;
            case "04" : //April
                overflowCount[3]++;
                break;
            case "05" : //May
                overflowCount[4]++;
                break;
            case "06" : //June
                overflowCount[5]++;
                break;
            case "07" : //July
                overflowCount[6]++;
                break;
            case "08" : //August
                overflowCount[7]++;
                break;
            case "09" : //September
                overflowCount[8]++;
                break;
            case "10" : //October
                overflowCount[9]++;
                break;
            case "11" : //November
                overflowCount[10]++;
                break;
            case "12" : //Decemeber
                overflowCount[11]++;
                break;
            default:
                break;
        }
    }
    console.log(overflowCount);
    container.innerHTML += "You've selected " + overflowCount.reduce(function(a, b) {return a + b;}, 0) + " records. There are...<br>";

    for (let i = 0; i < overflowCount.length; i++) {
        if (overflowCount[i] !== 0) {
            container.innerHTML += "<span class='fa fa-plus-square fa-fw'></span><a class='record-overflow-link' onclick='expandOverflow(" + i + ", " + overflowCount[i] +");'>" +
                                    overflowCount[i] + " records in " + months[i] + "</a>.<br>";
        }
    }

    //Add Overflow Count To Print Report
    //document.getElementById('records-selected').innerHTML = overflowCount.reduce(function(a, b) {return a + b;}, 0);
}

function expandOverflow(monthIndex, recordCount) {
    console.log(monthIndex, recordCount);
    //Stores Data For Month
    let overflowData = [];
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    monthIndex++; //Increment - No Longer An Array Index
    let monthString = monthIndex;
    if (monthIndex < 10) {
        monthString = "0" + monthIndex;
    }

    console.log(dataBeforeSplice);
    console.log(monthString);
    //Splices redundant months from data, pushes relevant data to overflowData[]
    for (let i = 0; i < dataBeforeSplice.length; i++) {
        const docMonth = parseInt(dataBeforeSplice[i].startDate.substring(3, 5));
        if (docMonth === parseInt(monthString)) {
            overflowData.push(dataBeforeSplice[i]); //All Records From Passed Month
        }
    }

    console.log(overflowData);

    let daysInMonth = function() {
        //30 Days - September(8), April(2), June(5), November(10)
        if (monthIndex === 2 || monthIndex === 5 || monthIndex === 8 || monthIndex === 10) {
            return 30;
        } else if (monthIndex === 1) { //If February(1)
            return 28;
        } else { //If any of the remaining, its 31.
            return 31;
        }
    };

    let container = document.getElementById('record-overflow-days');
    container.innerHTML = "The " + recordCount + " records in " + months[monthIndex - 1] + ":<br> ";

    /* Object For Storing Day Counts
       "Property" = "Value"
       "Day" + n = "x" */
    let monthObject = {};

    //Calculate Number of records per day, adds to object
    for (let i = 0; i < overflowData.length; i++) {
        let day = parseInt(overflowData[i].startDate.substring(0, 2));
        if (!monthObject.hasOwnProperty("Day" + day)) {
            monthObject["Day" + day] = 1; //Day doesn't exist, create key, instantiate to 1
        } else {
            monthObject["Day" + day]++; //Day exists, increment by 1
        }
    }

    let tableString = "<table id='month-table'><tr>"; //Open Table
    for (let i = 1; i <= 31; i++) {
        if (i % 7 === 1) {
            tableString += "</tr><tr>"; //Close Previous Row, Open A New One (Every 7 Days)
        }

        tableString += "<td align=center><span class='table-date'>" + i + getDateSuffix(i).sup() + "</span></td>";

        if (monthObject["Day" + i] === undefined) {
            tableString += "<td align=center><span class='table-hyphen'>-</span></td>"; //Replace undefined with hyphen
        } else {
            tableString += "<td align=center><span class='table-data'>" + monthObject["Day" + i] + "</span></td>"; //Add Data
        }
    }
    tableString += "</tr></table>"; //Close Table
    container.innerHTML += tableString; //Add To Div

    //DD-MM-YY : 01-34-67
}

function getDateSuffix(number) {
    if (number > 3 && number < 21) {
        return "th";
    } else if (number === 1) {
        return "st";
    } else if (number === 2) {
        return "nd";
    } else if (number === 3) {
        return "rd";
    } else {
        switch (number % 10) {
        case 1:
            return "st";
        case 2:
            return "nd";
        case 3:
            return "rd";
        default:
            return "th";
        }
    }
}

//Driver & Bus ID Field Logic

$('#driver-id').on("keyup mouseup mousewheel", function() {
    if ($('#driver-id').val().length > 0) {
        toggleBusId(true); //Disable It
    } else {
        toggleBusId(false); //Enable It
    }
});

$('#bus-id').on("keyup mousedown mousewheel", function() {
    if ($('#bus-id').val().length > 0) {
        toggleDriverId(true);
    } else {
        toggleDriverId(false);
    }
});

function toggleDriverId(bool) {
    let field = $('#driver-id');
    if(bool) {
        field.prop("disabled", true);
        field.css("cursor", "no-drop");
        field.animate({"opacity": "0.2"}, 200);
    } else {
        field.prop("disabled", false);
        field.css("cursor", "default");
        field.animate({"opacity": "1"}, 200);
    }
}

function toggleBusId(bool) {
    let field = $('#bus-id');
    if (bool) {
        field.prop("disabled", true);
        field.css("cursor", "no-drop");
        field.animate({"opacity": "0.2"}, 200);
    } else {
        field.prop("disabled", false);
        field.css("cursor", "default");
        field.animate({"opacity": "1"}, 200);
    }
}

//Returns true if user has chosen to select by Driver or Bus ID
//else false
function selectingById() {
    return $('#driver-id').val().length > 0 || $('#bus-id').val().length > 0;
}

toggleToFilter();
