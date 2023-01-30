$(document).ready(function () {

  var getUploadedFileName;

  $("#file").change(function () {
    // console.log("The text has been changed.");
    var getInputVal = $("#file").val();
    var splitGetInputVal = getInputVal.split(/[\\\/]/);
    var lenSplitGetInputVal = splitGetInputVal.length;
    getUploadedFileName = splitGetInputVal[lenSplitGetInputVal - 1];
    console.log(getUploadedFileName);
    $(".getFileLabel").val(getUploadedFileName);
    $("#submit-file").removeClass("displayNone");
  });


  $("#select-file").click(function () {
    // console.log('Open file browser');
    // console.log(getUploadedFileName)
  });

  // console.log(getUploadedFileName);

  $('#submit-file').on("click", function (e) {
    e.preventDefault();
    $('#file').parse({
      config: {
        delimiter: "auto",
        complete: displayHTMLTable,
      },
      complete: function () {
        // console.log(results);

      }
    });
  });





  function displayHTMLTable(results) {
    console.log('Data captured');
    var table = "<table class='table'>";
    var data = results.data;
    data.pop();
    console.log(data);
    $('.getTouchName').val('Test');

    var rowOne = data[1];

    var cellData = rowOne.join(",").split(",");
    console.log(cellData)

    for (a = 0; a < cellData.length; a++) {
      console.log(cellData[a]);
      $('.getTouchData_' + a).val(cellData[a]);

      if (cellData[a] == 'true') {
        $('.getTouchData_' +a+'_true').attr('checked', true);

      }

      if (cellData[a] == 'false') {
        $('.getTouchData_' +a+'_false').attr('checked', true);
      }
    }

    for (i = 0; i < data.length; i++) {
      table += "<tr>";
      var row = data[i];
      // console.log(row)

      var cells = row.join(",").split(",");

      for (j = 0; j < cells.length; j++) {

        table += "<td>";
        table += cells[j];
        table += "</th>";
      }
      table += "</tr>";
    }
    table += "</table>";
    // $("#parsed_csv_list").html(table);
  }

  // STEP ========================================================================================================================


  var currentTab = 0; // Current tab is set to be the first tab (0)
  showTab(currentTab); // Display the current tab

  function showTab(n) {
    // This function will display the specified tab of the form...
    var x = document.getElementsByClassName("tab");
    x[n].style.display = "block";
    //... and fix the Previous/Next buttons:
    if (n == 0) {
      document.getElementById("prevBtn").style.display = "none";
    } else {
      document.getElementById("prevBtn").style.display = "inline";
    }
    if (n == (x.length - 1)) {
      document.getElementById("nextBtn").innerHTML = "Submit";
    } else {
      document.getElementById("nextBtn").innerHTML = "Next";
    }
    //... and run a function that will display the correct step indicator:
    fixStepIndicator(n)
  }

  function nextPrev(n) {
    // This function will figure out which tab to display
    var x = document.getElementsByClassName("tab");
    // Exit the function if any field in the current tab is invalid:
    if (n == 1 && !validateForm()) return false;
    // Hide the current tab:
    x[currentTab].style.display = "none";
    // Increase or decrease the current tab by 1:
    currentTab = currentTab + n;
    // if you have reached the end of the form...
    if (currentTab >= x.length) {
      // ... the form gets submitted:
      document.getElementById("regForm").submit();
      return false;
    }
    // Otherwise, display the correct tab:
    showTab(currentTab);
  }

  $("#prevBtn").click(function () {
    nextPrev(-1)
  });


  $("#nextBtn").click(function () {
    nextPrev(1)
  });



  function validateForm() {
    // This function deals with validation of the form fields
    var x, y, i, valid = true;
    x = document.getElementsByClassName("tab");
    y = x[currentTab].getElementsByTagName("input");
    // A loop that checks every input field in the current tab:
    for (i = 0; i < y.length; i++) {
      // If a field is empty...
      if (y[i].value == "") {
        // add an "invalid" class to the field:
        y[i].className += " invalid";
        // and set the current valid status to false
        valid = false;
      }
    }
    // If the valid status is true, mark the step as finished and valid:
    if (valid) {
      document.getElementsByClassName("step")[currentTab].className += " finish";
    }
    return valid; // return the valid status
  }

  function fixStepIndicator(n) {
    // This function removes the "active" class of all steps...
    var i, x = document.getElementsByClassName("step");
    for (i = 0; i < x.length; i++) {
      x[i].className = x[i].className.replace(" active", "");
    }
    //... and adds the "active" class on the current step:
    x[n].className += " active";
  }
});