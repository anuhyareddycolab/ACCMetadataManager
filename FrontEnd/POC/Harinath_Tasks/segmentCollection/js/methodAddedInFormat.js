$(document).ready(function () {



    function progressBarFunctionality(passIndex) {
        $('#progressbar li').each(function () {
            // console.log(this);
            // console.log(passIndex);
            $(this).removeClass('activeProgressKey');
            $("#progressbar li").eq(passIndex).addClass('activeProgressKey')
        });

    }
    //custom display function
    function displayOverview() {
        $('.multiStepFieldsetContainer').hide();
        $('#Overview').show();
        var getOverviewIndex = $('#Overview').attr('fieldsetIndex');
        progressBarFunctionality(getOverviewIndex);

    };

    function displayAddCampaignData() {
        $('.multiStepFieldsetContainer').hide();
        $('#addCampaign').show();

        var getAddCampaignIndex = $('#addCampaign').attr('fieldsetIndex');
        progressBarFunctionality(getAddCampaignIndex);
    };

    function displaySubmitForApproval() {
        $('.multiStepFieldsetContainer').hide();
        $('#submitForApproval').show();

        var getSubmitForApproval = $('#submitForApproval').attr('fieldsetIndex');
        progressBarFunctionality(getSubmitForApproval);
    };

    function displayCreatTouchStepForm() {

        $('.multiStepFieldsetContainer').hide();
        $('#CreateTouchMultiStepForm').show();
        var getCreateTouchMultiStepForm = $('#CreateTouchMultiStepForm').attr('fieldsetIndex');
        progressBarFunctionality(getCreateTouchMultiStepForm);
    }

    //Next and previous button action to display/hide the 3 layered Divs

    $('#step2_Previous').click(function () {
        displayOverview();
    });

    $('#step2_Next').click(function () {
        displayCreatTouchStepForm();
        $("#CreateTouchMultiStepForm_0").show();
    });



    $("#step2_Submit").click(function () {
        displaySubmitForApproval();
    });


    $('#step3_Previous').click(function () {
        displayAddCampaignData();
    });

    $('#step3_Next').click(function () {
        confirm("Do you want to submit for Approval...")
    });



    var $Campaign_name;
    var $Initiative_name;
    var $LOB_name;
    var $Brand_name;
    var $CampaignStartDate;
    var $CampaignEndDate;

    var $stepFormTouchName;
    var $stepFormChannelName;
    var $stepFormTouchStartDate;
    var $stepFormtouchEndDate;
    var $stepFormCreateSegmentRadio;
    var $stepFormCreatePhoneNumber;

    var addNewSegmentJSON = {};
    var $segmentDataTable = $('#segmentDataTable');
    var $segment = $(".getFileLabel");
    var $addSegment = $("#select-file");
    var createUniqueID = 1;
    var getData = [];
    var finalDataArray = [];


    var PhoneNumberJson = [];
    var LanguageJson = [];
    var TouchDetailJSON = [];
    var tableRowCount = [];

    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    var createCampaignRequest;
    var createTouchRequest;
    var createSegmentRequest;
    var getLanguageValue;
    var getPhoneValue

    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    // First div ---> next button action

    $("#step1_Next").click(function () {

        displayAddCampaignData();
        $Campaign_name = $("#Campaign_name").val();
        // $Initiative_name = $("#selectInitiative option:selected").text();
        // $LOB_name = $("#selectLOB option:selected").text();
        // $Brand_name = $("#selectBrand option:selected").text();

        $Initiative_name = $("#selectInitiative option:selected").attr('id');
        $LOB_name = $("#selectLOB option:selected").attr('id');
        $Brand_name = $("#selectBrand option:selected").attr('id');

        var date = new Date($("#campaignStartDate").val());
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        var date1 = new Date($("#campaignEndDate").val());
        var day1 = date1.getDate();
        var month1 = date1.getMonth() + 1;
        var year1 = date1.getFullYear();

        $CampaignStartDate = [year, month, day].join('/');
        $CampaignEndDate = [year1, month1, day1].join('/');

        createCampaignRequest = {

            "data": {
                "campaignName": $Campaign_name,
                "initiativeId": $Initiative_name,
                "lobId": $LOB_name,
                "brandId": $Brand_name,
                "campaignStartDate": $CampaignStartDate,
                "campaignEndDate": $CampaignEndDate,
                "campaignTemplate": "1",
                "campaignId": "12345"
            }
        }

        console.log(createCampaignRequest.data)

    });

    // create touch step  form &&&&&&&&&&&&&&&&&&  next button action

    $("#tab1_Next").click(function () {
        $('.CreateTouchMultiStepForm-fieldset').hide();
        $("#CreateTouchMultiStepForm_1").show();


        // console.log(createCampaignRequest.data);

        var date = new Date($("#touchStartDate").val());
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        var date1 = new Date($("#touchEndDate").val());
        var day1 = date1.getDate();
        var month1 = date1.getMonth() + 1;
        var year1 = date1.getFullYear();


        $stepFormTouchName = $('#touch_name').val();
        $stepFormChannelName = $("#selectInitiative option:selected").attr('id');
        $stepFormTouchStartDate = [year, month, day].join('/');
        $stepFormtouchEndDate = [year1, month1, day1].join('/');
        if ($('input[name="segment_radio_group"]:checked').val() == "yes") {
            $stepFormCreateSegmentRadio = '1'
        } else {
            $stepFormCreateSegmentRadio = '0'
        }

        if ($('input[name="phone_radio_group"]:checked').val() == "yes") {
            $stepFormCreatePhoneNumber = '1'
        } else {
            $stepFormCreatePhoneNumber = '0'
        }



        createTouchRequest = {

            "data": {
                "campaignId": createCampaignRequest.data.campaignId,
                "touchName": $stepFormTouchName,
                "touchDescription": "abcd",
                "channelId": $stepFormChannelName,
                "mailFileDueDate": "2021-03-22",
                "estimatedDropDate": "2021-03-22",
                "touchStartDate": $stepFormTouchStartDate,
                "touchEndDate": $stepFormtouchEndDate,
                "haveSegments": $stepFormCreateSegmentRadio,
                "havePhoneAssignements": $stepFormCreatePhoneNumber,
                "haveUrlAssignments": "1",
                "haveOperationAssigned": "1",
                "campaignWorkflowTemplate": "1",
                "touchId": "1111"
            }
        }

        console.log(createTouchRequest.data)


        if ($stepFormCreateSegmentRadio.toLowerCase() == 'no' && $stepFormCreatePhoneNumber.toLowerCase() == 'no') {
            $('.CreateTouchMultiStepForm-fieldset').hide();
            $('.multiStepFieldsetContainer').hide();
            $('#addCampaign').show();
            $("#step2_Submit").removeClass("displayNone");
        }
    });




    // ADD segment to list
    $("#select-file").click(function () {
 

        createSegmentRequest = {

            segment_collection: [{
                segment: {
                    "segmentId": "",
                    "touchId": "",
                    "segmentName": "",
                    "segmentCode": ""
                   
                },
                segmentAssignment_collection: {
                    "segmentId": "",
                    "segmentLanguageId":"" ,
                    "segmentPhoneNumberId":"",
                    "urlLink": "www.google.com"

                }

            }]


        }



        // createSegmentRequest = {

        //     segment_collection: [{
        //         "methodName": "createSegment",
        //         "data": {        
        //       "touchId":"",
        //       "segmentName":""
        //      },
        //         segmentAssignment_collection: {
        //             "methodName":"createSegmentAssignment",
        //             "data":{      
        //                "createSegment":"",
        //                "createPhoneNumber":"",
                       
        //                "segmentsAssignment":[
        //                   {
        //                      "segmentId":"",
        //                      "segmentLanguageId":"",
        //                      "segmentPhoneNumberId":"",
        //                "urlLink":"www.google.com"
        //                   }
                          
        //                ]
        //             }
        //          }

        //     }]


        // }

        console.log(createSegmentRequest)

        // console.log(createSegmentRequest.segment_collection)

        if ($segment.val().length >= 1) {
            console.log('Add Segment button clicked');

            var segmentJSON = {
                "segmentId": createUniqueID,
                "touchId": createTouchRequest.data.touchId,
                "segmentName": $segment.val(),
                "segmentCode": "SEG_000" + createUniqueID

            };
            Object.assign(createSegmentRequest.segment_collection[0].segment, segmentJSON);

            console.log(createSegmentRequest.segment_collection);

            createUniqueID++
            $segment.val('');
            $segment.focus();
            $segmentDataTable.append("<li><div class='li-text-div'>" + segmentJSON.segmentName + "</div><div class='icon-delete'><span class='glyphicon glyphicon-trash'></span></div></li>");
            getData.push(segmentJSON);


            // DELETE segment from list
            $('.glyphicon').on('click', function () {
                var currentList = $(this).parent().prev().html();
                $(this).parent().parent().remove();
                $.each(getData, function (index, dataList) {
                    console.log(dataList);
                    if (currentList == dataList.segmentName) {
                        var getID = dataList.id;
                        // console.log('getID : ' + getID);
                        // console.log('Delete : ' + dataList.segmentName);
                        findAndRemove(getData, 'id', getID);
                        return false;
                    };
                });
            });

            finalDataArray = getData;

            // console.log(finalDataArray);
            // console.log('Segment count ' + finalDataArray.length);

        } else {
            alert('Segment name cannot be blank...')
        };
    });


    $("#tab2_Next").click(function () {
        $('.CreateTouchMultiStepForm-fieldset').hide();
        $("#CreateTouchMultiStepForm_2").show();
        var getSegmentListLength = finalDataArray.length
        // console.log(getSegmentListLength);

        for (i = 0; i < getSegmentListLength; i++) {
            // $('#languageDataTable').append('<input type="text" name="" id="seg_language_' + i + '" placeholder="Language ' + (i + 1) + '" />')
            $('#languageDataTable').append(' <select id="seg_language_' + i + '"><option id="0">Select Language*</option><option id="1">Language 1</option><option id="2">Language 2</option><option id="3">Language 3</option><option id="4">Language 4</option><option id="5">Language 5</option><option id="6">Language 6</option></select>')

        };

    });


    $("#tab3_Next").click(function () {
        $('.CreateTouchMultiStepForm-fieldset').hide();
        $("#CreateTouchMultiStepForm_3").show();
        var getSegmentListLength = finalDataArray.length
        // console.log(getSegmentListLength);

        for (i = 0; i < getSegmentListLength; i++) {
                       $('#PhoneDataTable').append(' <select id="seg_phone_' + i + '"><option id="0">Select Phone*</option><option id="1">Phone 1</option><option id="2">Phone 2</option><option id="3">Phone 3</option><option id="4">Phone 4</option><option id="5">Phone 5</option><option id="6">Phone 6</option></select>')
        };





        // });
         getLanguageValue = $("#seg_language_0 option:selected").attr('id');


    });

    ///Submit the create touch step form

    $("#tab4_Next").click(function () {
        $('.CreateTouchMultiStepForm-fieldset').hide();
        $('.multiStepFieldsetContainer').hide();
        $("#addCampaign").show();
        $("#step2_Submit").removeClass("displayNone");

        $('#PhoneDataTable input').each(function (index) {
           

        });
        TouchDetailJSON.push(PhoneNumberJson);
     

        tableRowCount.push(TouchDetailJSON)
        // console.log(tableRowCount)


        $.each(TouchDetailJSON, function (index, val) {
            // console.log(val)
        });


         getPhoneValue = $("#seg_phone_0 option:selected").attr('id');

        var segmentAssignPhoneJSON = {
            "segmentId": createSegmentRequest.segment_collection[0].segment.segmentId,
            "segmentLanguageId":getLanguageValue ,
            "segmentPhoneNumberId":getPhoneValue,
            "urlLink": "www.google.com"

        };

        // console.log(segmentAssignJSON);

        Object.assign(createSegmentRequest.segment_collection[0].segmentAssignment_collection, segmentAssignPhoneJSON);
        console.log(createSegmentRequest.segment_collection[0].segmentAssignment_collection);
        console.log(createSegmentRequest);


    });


    // create touch step form previous button action

    $("#tab2_previous").click(function () {
        $('.CreateTouchMultiStepForm-fieldset').hide();
        $("#CreateTouchMultiStepForm_0").show();
    });

    $("#tab3_previous").click(function () {
        $('.CreateTouchMultiStepForm-fieldset').hide();
        $("#CreateTouchMultiStepForm_1").show();


        $('#languageDataTable').empty();
    });


    $("#tab4_previous").click(function () {
        $('.CreateTouchMultiStepForm-fieldset').hide();
        $("#CreateTouchMultiStepForm_2").show();
        $('#PhoneDataTable').empty();
    });



    //FUNCTION >>> Remove object from array
    function findAndRemove(array, property, value) {
        array.forEach(function (result, index) {
            if (result[property] === value) {

                array.splice(index, 1);
            }
        });
        // console.log(array);
    };





});