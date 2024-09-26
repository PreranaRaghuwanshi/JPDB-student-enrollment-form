
var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var stuDBName = "SCHOOL-DB";
var stuRelationName = "STUDENT-TABLE";
var connToken = "90932061|-31949224985347537|90962533";

// Disable all buttons except Employee ID input
$("#save").prop("disabled", true);
$("#change").prop("disabled", true);
$("#reset").prop("disabled", true);
$("#stuname, #stuclass, #studob, #stuadd, #stuenrol").prop("disabled", true);

$("#stuid").focus();

// Function to reset the form
function resetForm() {
    $("#stuid, #stuname, #stuclass, #studob, #stuadd, #stuenrol").val("");
    $("#stuid").prop("disabled", false);
    $("#stuname, #stuclass, #studob, #stuadd, #stuenrol").prop("disabled", true);
    $("#save").prop("disabled", true);
    $("#change").prop("disabled", true);
    $("#reset").prop("disabled", true);
    $("#stuid").focus();
}

// Function to check if Student ID exists in the database
function getStu() {
    var stuid = $("#stuid").val();
    if (!stuid) {
        alert("Please enter a valid Roll Number");
        return;
    }
    var jsonStr = getStuIdAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, stuDBName, stuRelationName, jsonStr);

    jQuery.ajaxSetup({ async: false });
    var res = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({ async: true });

    if (res.status === 200) {
        fillData(res);
        $("#stuid").prop("disabled", true);
        $("#stuname, #stuclass, #studob, #stuadd, #stuenrol").prop("disabled", false);
        $("#change").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#stuname").focus();
    } else {
        $("#stuname, #stuclass, #studob, #stuadd, #stuenrol").prop("disabled", false);
        $("#save").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#stuname").focus();
    }
}

// Function to save the new student data
function saveData() {
    var jsonStr = validateAndGetFormData();
    if (!jsonStr) {
        return;
    }

    var putRequest = createPUTRequest(connToken, jsonStr, stuDBName, stuRelationName);

    jQuery.ajaxSetup({ async: false });
    var res = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({ async: true });

    if (res.status === 200) {
        alert("Data saved successfully!");
        resetForm();
    } else {
        alert("Error: " + res.status + " " + res.responseText);
    }
}

// Function to update the student data
function changeData() {
    var jsonStr = validateAndGetFormData();
    if (!jsonStr) {
        return;
    }

    var updateRequest = createUPDATERecordRequest(connToken, jsonStr, stuDBName, stuRelationName, localStorage.getItem("recno"));

    jQuery.ajaxSetup({ async: false });
    var res = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({ async: true });

    if (res.status === 200) {
        alert("Data updated successfully!");
        resetForm();
    } else {
        alert("Error: " + res.status + " " + res.responseText);
    }
}

// Function to validate the form data and return it as a JSON string
function validateAndGetFormData() {
    var stuid = $("#stuid").val();
    var stuname = $("#stuname").val();
    var stuclass = $("#stuclass").val();
    var studob = $("#studob").val();
    var stuadd = $("#stuadd").val();
    var stuenrol = $("#stuenrol").val();

    if (!stuid || !stuname || !stuclass || !studob || !stuadd || !stuenrol) {
        alert("All fields are mandatory.");
        return "";
    }

    var jsonStrObj = {
        id: stuid,
        name: stuname,
        class: stuclass,
        dob: studob,
        address: stuadd,
        enrollment: stuenrol
    };

    return JSON.stringify(jsonStrObj);
}

// Helper function to create a JSON object for Student ID
function getStuIdAsJsonObj() {
    var stuid = $("#stuid").val();
    var jsonStr = {
        id: stuid
    };
    return JSON.stringify(jsonStr);
}

// Function to fill form with fetched data
function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $("#stuname").val(record.name);
    $("#stuclass").val(record.class);
    $("#studob").val(record.dob);
    $("#stuadd").val(record.address);
    $("#stuenrol").val(record.enrollment);
}

function saveRecNo2LS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
}
