
$(document).ready(function () {

  var segmentJSONObject = {};

  // var abc= {};
  // var a1 = {name:"harinath"};
  // //console.log(a1);

  // Object.assign(abc,a1);
  // //console.log(abc);
  // var a2 = {lname:"Chipdapareddy"};
  // Object.assign(abc,a2);
  // //console.log(abc);

  var q1_getRadioValue;
  var q2_getRadioValue;
  var questionArray = new Array(2);
  $('input[type=radio][name="TouchLanguage"]').change(function () {
    q1_getRadioValue = $(this).val();
    // //console.log("Q1 : " + q1_getRadioValue);
    if (q1_getRadioValue == "yes") {
      // $('.tab').eq(1).removeClass('hidden');
      questionArray[0] = 1;
    } else {
      questionArray[0] = 0;
    }
  });


  $('input[type=radio][name="TouchPhone"]').change(function () {

    q2_getRadioValue = $(this).val();
    //console.log("Q2 : " + q2_getRadioValue);
    if (q2_getRadioValue == "yes") {
      // $('.tab').eq(2).removeClass('hidden');
      questionArray[1] = 1;

    } else {
      questionArray[1] = 0;
    }
  });


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
      // document.getElementById("nextBtn").classList.add("mystyle");
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
      //console.log('Submit');
      // alert('Submitting');
      // document.getElementById("regForm").submit();
      return false;

    }
    // Otherwise, display the correct tab:
    showTab(currentTab);
  }

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

  $("#prevBtn").click(function () {

    nextPrev(-1);
  });

  $("#nextBtn").click(function () {
    console.log(segmentJSONObject);
    //console.log(questionArray);
    // $(questionArray).each(function (index, val) {
      // //console.log(val);
      if(questionArray[0] == 0 && questionArray[1] == 0){
        $('.tab').eq(1).remove();
        $('.step').eq(1).remove();
        $('.tab').eq(2).remove();
        $('.step').eq(2).remove();
        $("#nextBtn").html("Submit");
      }
      
      if (questionArray[0] == 0) {
        $('.tab').eq(1).remove();
        $('.step').eq(1).remove();
        $("#nextBtn").html("Submit");

      } else if (questionArray[1] == 0) {
        $('.tab').eq(2).remove();
        $('.step').eq(2).remove();
        $("#nextBtn").html("Submit");
      }else{
        $('.tab').eq(3).remove();
        $('.step').eq(3).remove();
      }
    // });
    nextPrev(1)
  });



  var dataArray = new Array();



  $('#touchLanguage').bind('change', function () {

    $('.TouchlanguageLabel').removeClass('hidden');
    //console.log(this);
    $(this).parents('.form-group').addClass('focused');
    var selectedText = $(this).find('option:selected').text();
    //console.log(selectedText);
    var defaultText = '[Touch] Language';
    if (selectedText == defaultText) {
      //console.log('Default Text Selected...');
      $('.TouchlanguageLabel').addClass('hidden');
      $(this).parents('.form-group').removeClass('focused');
      selectedText = false;

    };
    var touchLag = {
      TouchLanguage: selectedText
    };
Object.assign(segmentJSONObject,touchLag);
  });



  $('#segLang').bind('change', function () {
    $('.segLangLabel').removeClass('hidden');
    //console.log(this);
    $(this).parents('.form-group').addClass('focused');
    var selectedText = $(this).find('option:selected').text();
    //console.log(selectedText);
    var defaultText = '[Segment 1] Language';
    if (selectedText == defaultText) {
      //console.log('Default Text Selected...');
      $('.segLangLabel').addClass('hidden');
      $(this).parents('.form-group').removeClass('focused');
      selectedText = false;
    };


    var segment1 = {
      segment1Language: selectedText
    };
    Object.assign(segmentJSONObject,segment1);
  });


  $('#segLang2').bind('change', function () {
    $('.segLangLabel2').removeClass('hidden');
    //console.log(this);
    $(this).parents('.form-group').addClass('focused');
    var selectedText = $(this).find('option:selected').text();
    //console.log(selectedText);
    var defaultText = '[Segment 2] Language';
    if (selectedText == defaultText) {
      //console.log('Default Text Selected...');
      $('.segLangLabel2').addClass('hidden');
      $(this).parents('.form-group').removeClass('focused');
      selectedText = false;
    };

    var segment2 = {
      segment2Language: selectedText
    };
    Object.assign(segmentJSONObject,segment2);

  });


  $('#segLang3').bind('change', function () {
    $('.segLangLabel3').removeClass('hidden');
    //console.log(this);
    $(this).parents('.form-group').addClass('focused');
    var selectedText = $(this).find('option:selected').text();
    //console.log(selectedText);
    var defaultText = '[Segment 3] Language';
    if (selectedText == defaultText) {
      //console.log('Default Text Selected...');
      $('.segLangLabel3').addClass('hidden');
      $(this).parents('.form-group').removeClass('focused');
      selectedText = false;
    };

    var segment3 = {
      segment3Language: selectedText
    };
    Object.assign(segmentJSONObject,segment3);
  });

  // $('#nextBtn').click(function (e) {
  //   //console.log(dataArray);
  // });

  $('#x2_touchLanguage').bind('change', function () {

    $('.x2_TouchlanguageLabel').removeClass('hidden');
    //console.log(this);
    $(this).parents('.form-group').addClass('focused');
    var selectedText = $(this).find('option:selected').text();
    //console.log(selectedText);
    var defaultText = '[Touch] Language';
    if (selectedText == defaultText) {
      //console.log('Default Text Selected...');
      $('.x2_TouchlanguageLabel').addClass('hidden');
      $(this).parents('.form-group').removeClass('focused');
      selectedText = false;

    };
    var touchPhone = {
      
      TouchPhone: selectedText
    };
    Object.assign(segmentJSONObject,touchPhone);
  });



  $('#x2_segLang').bind('change', function () {
    $('.x2_segLangLabel').removeClass('hidden');
    //console.log(this);
    $(this).parents('.form-group').addClass('focused');
    var selectedText = $(this).find('option:selected').text();
    //console.log(selectedText);
    var defaultText = '[Segment 1] Language';
    if (selectedText == defaultText) {
      //console.log('Default Text Selected...');
      $('.x2_segLangLabel').addClass('hidden');
      $(this).parents('.form-group').removeClass('focused');
      selectedText = false;
    };


    var segment1Phone = {
      
      segment1Phone: selectedText
    };
    Object.assign(segmentJSONObject,segment1Phone);
  });


  $('#x2_segLang2').bind('change', function () {
    $('.x2_segLangLabel2').removeClass('hidden');
    //console.log(this);
    $(this).parents('.form-group').addClass('focused');
    var selectedText = $(this).find('option:selected').text();
    //console.log(selectedText);
    var defaultText = '[Segment 2] Language';
    if (selectedText == defaultText) {
      //console.log('Default Text Selected...');
      $('.x2_segLangLabel2').addClass('hidden');
      $(this).parents('.form-group').removeClass('focused');
      selectedText = false;
    };

    var segment2Phone = {
    
      segment2Phone: selectedText
    };
    Object.assign(segmentJSONObject,segment2Phone);

  });


  $('#x2_segLang3').bind('change', function () {
    $('.x2_segLangLabel3').removeClass('hidden');
    //console.log(this);
    $(this).parents('.form-group').addClass('focused');
    var selectedText = $(this).find('option:selected').text();
    //console.log(selectedText);
    var defaultText = '[Segment 3] Language';
    if (selectedText == defaultText) {
      //console.log('Default Text Selected...');
      $('.x2_segLangLabel3').addClass('hidden');
      $(this).parents('.form-group').removeClass('focused');
      selectedText = false;
    };

    var segment3Phone = {
     
      segment3Phone: selectedText
    };
    Object.assign(segmentJSONObject,segment3Phone);
  });
});
