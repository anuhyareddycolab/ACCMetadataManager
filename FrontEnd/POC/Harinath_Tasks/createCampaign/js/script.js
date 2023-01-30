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
            console.log(this);
            console.log(passIndex);

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

    // First div ---> next button action

    $("#step1_Next").click(function () {
        console.log("step1_Next click");
        displayAddCampaignData();
        $Campaign_name = $("#Campaign_name").val();
        $Initiative_name = $("#selectInitiative option:selected").text();
        $LOB_name = $("#selectLOB option:selected").text();
        $Brand_name = $("#selectBrand option:selected").text();

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

        var date = new Date($("#touchStartDate").val());
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        var date1 = new Date($("#touchEndDate").val());
        var day1 = date1.getDate();
        var month1 = date1.getMonth() + 1;
        var year1 = date1.getFullYear();


        $stepFormTouchName = $('#touch_name').val();
        $stepFormChannelName = $('#channelName').val();
        $stepFormTouchStartDate = [year, month, day].join('/');
        $stepFormtouchEndDate = [year1, month1, day1].join('/');
        $stepFormCreateSegmentRadio = $('input[name="gender"]:checked').val();
        $stepFormCreatePhoneNumber = $('input[name="gender1"]:checked').val();

        // console.log(pushDataInJson.campaign_collection[0].touch_collection[0].touch);

        pushDataInJson.campaign_collection[0].touch_collection[0].touch.touchName = $stepFormTouchName;
        pushDataInJson.campaign_collection[0].touch_collection[0].touch.channelName = $stepFormChannelName;
        pushDataInJson.campaign_collection[0].touch_collection[0].touch.touchStartDate = $stepFormTouchStartDate;
        pushDataInJson.campaign_collection[0].touch_collection[0].touch.touchEndDate = $stepFormtouchEndDate;
        pushDataInJson.campaign_collection[0].touch_collection[0].touch.haveSegments = $stepFormCreateSegmentRadio;
        pushDataInJson.campaign_collection[0].touch_collection[0].touch.havePhoneAssignments = $stepFormCreatePhoneNumber;

        console.log(pushDataInJson.campaign_collection[0].touch_collection[0].touch);
        console.log($stepFormCreateSegmentRadio.toLowerCase());

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
        console.log(getSegmentListLength);

    });


    $("#tab3_Next").click(function () {
        $('.CreateTouchMultiStepForm-fieldset').hide();
        $("#CreateTouchMultiStepForm_3").show();
    });

    ///Submit the create touch step form

    $("#tab4_Next").click(function () {
        $('.CreateTouchMultiStepForm-fieldset').hide();
        $('.multiStepFieldsetContainer').hide();
        $("#addCampaign").show();
        $("#step2_Submit").removeClass("displayNone");

    });


    // create touch step form previous button action

    $("#tab2_previous").click(function () {
        $('.CreateTouchMultiStepForm-fieldset').hide();
        $("#CreateTouchMultiStepForm_0").show();
    });

    $("#tab3_previous").click(function () {
        $('.CreateTouchMultiStepForm-fieldset').hide();
        $("#CreateTouchMultiStepForm_1").show();
    });


    $("#tab4_previous").click(function () {
        $('.CreateTouchMultiStepForm-fieldset').hide();
        $("#CreateTouchMultiStepForm_2").show();
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
        if ($segment.val().length >= 1) {
            console.log('add button clicked');

            var segmentJSON = {
                id: createUniqueID,
                segmentName: $segment.val()

            };


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
        } else {
            alert('Segment name cannot be blank...')
        };
    });


});