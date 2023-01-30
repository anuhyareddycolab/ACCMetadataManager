$(document).ready(function () {


    // JSON TO STORE DATA

    var pushDataInJson = {
        "campaign_collection": [{
            "campaign": {
                "campaign_name": "",
                "initiativeName": "",
                "lobName": "",
                "brandName": "",
                "campaignStartDate": "",
                "campaignendDate": "",
            },
            "touch_collection": [{
                    "touch": {
                        "touchName": "",
                        "channelName": "",
                        "touchStartDate": "2021-03-22",
                        "touchEndDate": "2021-03-29",
                        "haveSegments": "0",
                        "havePhoneAssignments": "0"

                    },
                    "segment_collection": [{
                        "segment": {

                        },
                        "segmentAssignment_collection": [{
                            "segmentAssignment": {

                            }
                        }]

                    }]
                }

            ]
        }]
    };



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

        //Push data in json

        pushDataInJson.campaign_collection[0].campaign.campaign_name = $Campaign_name;
        pushDataInJson.campaign_collection[0].campaign.initiativeName = $Initiative_name;
        pushDataInJson.campaign_collection[0].campaign.lobName = $LOB_name;
        pushDataInJson.campaign_collection[0].campaign.brandName = $Brand_name;
        pushDataInJson.campaign_collection[0].campaign.campaignStartDate = $CampaignStartDate;
        pushDataInJson.campaign_collection[0].campaign.campaignendDate = $CampaignEndDate;
        console.log(pushDataInJson);


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


        //Get data from json and show on table 
        $(".step2getInitiative").html(pushDataInJson.campaign_collection[0].campaign.initiativeName);
        $(".step2getCampaignName").html(pushDataInJson.campaign_collection[0].campaign.campaign_name);
        $(".getBrandNameValue").html(pushDataInJson.campaign_collection[0].campaign.brandName);
        $(".getLOBValue").html(pushDataInJson.campaign_collection[0].campaign.lobName);
        $(".getStartDateValue").html(pushDataInJson.campaign_collection[0].campaign.campaignStartDate);
        $(".getEndDateValue").html(pushDataInJson.campaign_collection[0].campaign.campaignendDate);

    });


    // create touch step  form &&&&&&&&&&&&&&&&&&  next button action


    $("#tab1_Next").click(function () {
        $('.CreateTouchMultiStepForm-fieldset').hide();
        $("#CreateTouchMultiStepForm_1").show();


        console.log(createCampaignRequest.data);

        var date = new Date($("#touchStartDate").val());
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        var date1 = new Date($("#touchEndDate").val());
        var day1 = date1.getDate();
        var month1 = date1.getMonth() + 1;
        var year1 = date1.getFullYear();


        $stepFormTouchName = $('#touch_name').val();
        // $stepFormChannelName = $('#channelName').val();

        $stepFormChannelName = $("#selectInitiative option:selected").attr('id');
        $stepFormTouchStartDate = [year, month, day].join('/');
        $stepFormtouchEndDate = [year1, month1, day1].join('/');
        // $stepFormCreateSegmentRadio = $('input[name="segment_radio_group"]:checked').val();
        // $stepFormCreatePhoneNumber = $('input[name="phone_radio_group"]:checked').val();
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


        TouchDetailJSON.push($stepFormTouchName);
        TouchDetailJSON.push($stepFormChannelName);
        TouchDetailJSON.push($stepFormTouchStartDate);
        TouchDetailJSON.push($stepFormtouchEndDate);
        TouchDetailJSON.push($stepFormCreateSegmentRadio);
        TouchDetailJSON.push($stepFormCreatePhoneNumber)

        // console.log(pushDataInJson.campaign_collection[0].touch_collection[0].touch);

        pushDataInJson.campaign_collection[0].touch_collection[0].touch.touchName = $stepFormTouchName;
        pushDataInJson.campaign_collection[0].touch_collection[0].touch.channelName = $stepFormChannelName;
        pushDataInJson.campaign_collection[0].touch_collection[0].touch.touchStartDate = $stepFormTouchStartDate;
        pushDataInJson.campaign_collection[0].touch_collection[0].touch.touchEndDate = $stepFormtouchEndDate;
        pushDataInJson.campaign_collection[0].touch_collection[0].touch.haveSegments = $stepFormCreateSegmentRadio;
        pushDataInJson.campaign_collection[0].touch_collection[0].touch.havePhoneAssignments = $stepFormCreatePhoneNumber;

        // console.log(pushDataInJson.campaign_collection[0].touch_collection[0].touch);

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
                "touchId":"1111"
            }
        }

        console.log(createTouchRequest.data)
        // console.log($stepFormCreateSegmentRadio.toLowerCase());
        // console.log(TouchDetailJSON);

        if ($stepFormCreateSegmentRadio.toLowerCase() == 'no' && $stepFormCreatePhoneNumber.toLowerCase() == 'no') {
            $('.CreateTouchMultiStepForm-fieldset').hide();
            $('.multiStepFieldsetContainer').hide();
            $('#addCampaign').show();
            $("#step2_Submit").removeClass("displayNone");
        }
    });


    $("#tab2_Next").click(function () {
        $('.CreateTouchMultiStepForm-fieldset').hide();
        $("#CreateTouchMultiStepForm_2").show();
        var getSegmentListLength = finalDataArray.length
        // console.log(getSegmentListLength);

        for (i = 0; i < getSegmentListLength; i++) {
            $('#languageDataTable').append('<input type="text" name="" id="seg_language_' + i + '" placeholder="Language ' + (i + 1) + '" />')
        };

        console.log("TouchDetailJSON")
        TouchDetailJSON.push(finalDataArray)
        console.log(TouchDetailJSON)




    });


    $("#tab3_Next").click(function () {
        $('.CreateTouchMultiStepForm-fieldset').hide();
        $("#CreateTouchMultiStepForm_3").show();
        var getSegmentListLength = finalDataArray.length
        // console.log(getSegmentListLength);

        for (i = 0; i < getSegmentListLength; i++) {
            $('#PhoneDataTable').append('<input type="text" name="" id="seg_phone_' + i + '" placeholder="Phone Number ' + (i + 1) + '" />')
        };

        $('#languageDataTable input').each(function (index) {
            console.log('index : ' + index);

            var getLanguageValue = $("#seg_language_" + index).val();
            LanguageJson.push(getLanguageValue);

        });

        TouchDetailJSON.push(LanguageJson);
        // console.log(finalDataArray);
        // console.log(LanguageJson);
    });

    ///Submit the create touch step form

    $("#tab4_Next").click(function () {
        $('.CreateTouchMultiStepForm-fieldset').hide();
        $('.multiStepFieldsetContainer').hide();
        $("#addCampaign").show();
        $("#step2_Submit").removeClass("displayNone");

        $('#PhoneDataTable input').each(function (index) {
            // console.log('index : ' + index);

            var getPhoneNumberValue = $("#seg_phone_" + index).val();
            PhoneNumberJson.push(getPhoneNumberValue);

            // console.log(finalDataArray);
            // console.log(LanguageJson);
            // console.log(PhoneNumberJson);

        });
        TouchDetailJSON.push(PhoneNumberJson);
        console.log("Final Touch Details");
        console.log(TouchDetailJSON);

        tableRowCount.push(TouchDetailJSON)
        console.log(tableRowCount)


        $.each(TouchDetailJSON, function (index, val) {
            // console.log(val)
        });

        var tableHeaders = "Touch Name,Channel,Touch Date,Unique ID,Segment,Phone #,URL,Language,Status";

        var tableHeadersArray = tableHeaders.split(",");
        console.log(tableHeadersArray)

        var tableHeaderLength = $("#touch_dataTable thead tr th").length;
        // console.log(tableHeaderLength);

        for (i = 0; i < tableRowCount.length; i++) {

            var addTR = "<tr class='tableRow' id='tableRow_" + i + "'></tr>"
            $("#touch_dataTable_tbody").append(addTR)

            for (j = 0; j < TouchDetailJSON.length; j++) {

                // var addTD = "<td class='tableDataColumn' id='tableDataColumn_" + j + "'>" + TouchDetailJSON[j] + "</td>"
                $("#tableRow_" + i).append(addTD)
            }

            // TouchDetailJSON
            //finalDataArray ------ Segments
            //LanguageJson
            //PhoneNumberJson

            // RESET STEP FORMS
            $('#touch_name').val('');
            $('#channelName').val('');
            $("#touchStartDate").val('')
            $("#touchEndDate").val('')

            document.getElementById('segment_yes').checked = false;
            document.getElementById('phone_yes').checked = false;
            document.getElementById('segment_no').checked = false;
            document.getElementById('phone_no').checked = false;

            getData = [];
            finalDataArray = [];
            $('#segmentDataTable').empty();


            $("#languageDataTable").empty();
            $('#PhoneDataTable').empty();
            LanguageJson = [];
            PhoneNumberJson = [];
            TouchDetailJSON = [];



        }


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

    // ADD segment to list
    $("#select-file").click(function () {
        createSegmentRequest = {

            "data": 
                {
                    "touchId": "1271",
                    "segmentName": "xyz1"
                }
            
        }

        console.log(createTouchRequest.data)

        if ($segment.val().length >= 1) {
            console.log('add button clicked');

            var segmentJSON = {
                "segmentId": createUniqueID,
                "touchId": createTouchRequest.data.touchId,
                "segmentName": $segment.val(),
                "segmentCode":"SEG"+createUniqueID

            };

            console.log(createSegmentRequest.data)

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

            console.log(finalDataArray);
            console.log('Segment count ' + finalDataArray.length);

        } else {
            alert('Segment name cannot be blank...')
        };
    });



});