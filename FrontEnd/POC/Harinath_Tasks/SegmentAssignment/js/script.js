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


    function resetTouchFormOnSubmit() {
        $("#segmentDataTable").empty();
        $("#createSegmentLanguage").empty();
        $("#createSegmentPhoneNo").empty();
        $("#createSegmentUrlLink").empty();
        arrayMultipleSegmentNames = [];


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

    var arrayMultipleSegmentNames = []
    var PostsegmentJSON;


    var arrayPushSegmentLanguageID = []
    var arrayPushSegmentPhoneID = []
    var arrayPushSegmentURL = [];


    var arraySegAssignJSON = [];
    var segAssignJson;
    var segmentCollectionJson;


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
                "methodName": "createSegment",
                "data": {
                    "touchId": "",
                    "segmentName": ""
                },
                segmentAssignment_collection: {
                    "methodName": "createSegmentAssignment",
                    "data": {
                        "createSegment": "",
                        "createPhoneNumber": "",

                        "segmentsAssignment": [{
                                "segmentId": "",
                                "segmentLanguageId": "",
                                "segmentPhoneNumberId": "",
                                "urlLink": "www.google.com"
                            }

                        ]
                    }
                }

            }]


        }

        // console.log(createSegmentRequest);

        // console.log(createSegmentRequest.segment_collection)

        if ($segment.val().length >= 1) {
            console.log('Add Segment button clicked');

            var segmentJSON = {
                "methodName": "createSegment",
                "data": {
                    "segmentId": createUniqueID,
                    "touchId": createTouchRequest.data.touchId,
                    "segmentName": $segment.val(),
                    // "segmentCode": "SEG_000" + createUniqueID
                },

            }

            console.log(segmentJSON.data)

            arrayMultipleSegmentNames.push(segmentJSON.data);
            console.log(arrayMultipleSegmentNames);
            Object.assign(createSegmentRequest.segment_collection[0].data, segmentJSON);
            // console.log(createSegmentRequest.segment_collection);
            PostsegmentJSON = {
                "methodName": "createSegment",
                "data": arrayMultipleSegmentNames,
            }

            // console.log(PostsegmentJSON)

            createUniqueID++
            $segment.val('');
            $segment.focus();
            // $segmentDataTable.append("<li><div class='li-text-div'>" + segmentJSON.data.segmentName + "</div><div class='icon-delete'><span class='glyphicon glyphicon-trash'></span></div></li>");

            $segmentDataTable.append('<li id="' + segmentJSON.data.segmentName + '" class="li">' + segmentJSON.data.segmentName + '<img class="segmentTrashImg" src=http://zeus2embhapp90.embhdb.com/res/EMBH_Dev/icon-trash-purple-20.png"><hr class="hr"></li>');

            getData.push(segmentJSON);


            // DELETE segment from list
            $('.segmentTrashImg').on('click', function () {
                console.log($(this));
                var currentList = $(this).parent().text();
                $(this).parent().remove();

                var deleteSegmentJSON;

                // $.each(getData, function (index, dataList) {
                $.each(arrayMultipleSegmentNames, function (index, dataList) {
                    console.log("START DELETE ");
                    console.log(index);
                    console.log(dataList);
                    if (currentList == dataList.segmentName) {
                        var getID = dataList.segmentId;
                        console.log('getID : ' + getID);
                        deleteSegmentJSON = {
                            "methodName": "deleteSegment",
                            "data": {
                                "segmentId": createUniqueID,

                            },

                        };
                        console.log(deleteSegmentJSON);
                        console.log('Delete : ' + dataList.segmentName);
                        findAndRemove(arrayMultipleSegmentNames, 'segmentId', getID);
                        return false;
                    };
                });



                console.log('After Delete');
                console.log(arrayMultipleSegmentNames);

            });

            finalDataArray = getData;
            console.log(arrayMultipleSegmentNames);

            // console.log(finalDataArray);
            // console.log('Segment count ' + finalDataArray.length);

        } else {
            alert('Segment name cannot be blank...')
        };
    });

    ///Adding Language
    $("#tab2_Next").click(function () {
        var langaugeAjax;
        $('.CreateTouchMultiStepForm-fieldset').hide();
        $("#CreateTouchMultiStepForm_2").show();
        var getSegmentListLength = arrayMultipleSegmentNames.length
        // console.log('getSegmentListLength');
        // console.log(getSegmentListLength);
        arrayPushSegmentLanguageID = [getSegmentListLength]

        $.ajax({
            type: "GET",
            url: "../data/meta.json",
            dataType: "json",
            success: function (response) {

                langaugeAjax = response
                // console.log(langaugeAjax.metaData[2]);
                for (i = 0; i < getSegmentListLength; i++) {

        
                    $('#createSegmentLanguage').append('<select id="seglanguage_' + i + '"><option id="0">Select Language*</option></select>');
                    for(j=0;j<langaugeAjax.metaData[2].data.length;j++)
                    {
                        $('#seglanguage_'+i).append('<option id="'+langaugeAjax.metaData[2].data[j].ID+'">'+langaugeAjax.metaData[2].data[j].Name+'</option>');
                    };
        
                    $("#seglanguage_" + i).change(function () {
                        // console.log(this.value);
                        var getSelectedIndex = $(this).attr('id').split('_')
                        var getSelectedOptionData = $(this).find('option:selected').attr('id');
                        // console.log('getSelectedIndex : ' + getSelectedIndex[1]);
                        // console.log('getSelectedOptionData : ' + getSelectedOptionData);
                        arrayPushSegmentLanguageID[getSelectedIndex[1]] = getSelectedOptionData
                       
                    });
        
                };
            }
        });
        
    });

    ///Adding Phone number
    $("#tab3_Next").click(function () {
        $('.CreateTouchMultiStepForm-fieldset').hide();
        $("#CreateTouchMultiStepForm_3").show();
        var getSegmentListLength = arrayMultipleSegmentNames.length
        // console.log(getSegmentListLength);
        arrayPushSegmentPhoneID = [getSegmentListLength]

        for (i = 0; i < getSegmentListLength; i++) {
            $('#createSegmentPhoneNo').append(' <select id="segphone_' + i + '"><option id="0">Select Phone*</option><option id="1">Phone 1</option><option id="2">Phone 2</option><option id="3">Phone 3</option><option id="4">Phone 4</option><option id="5">Phone 5</option><option id="6">Phone 6</option></select>');



            $("#segphone_" + i).change(function (e) {
                // console.log(this.value);
                var getSelectedIndex = $(this).attr('id').split('_')
                var getSelectedOptionData = $(this).find('option:selected').attr('id');
                // console.log('getSelectedIndex : ' + getSelectedIndex[1]);
                // console.log('getSelectedOptionData : ' + getSelectedOptionData);
                arrayPushSegmentPhoneID[getSelectedIndex[1]] = getSelectedOptionData
                


            });

        };


    });
    ///Adding URL link
    $('#tab4_Next').click(function () {
        $('.CreateTouchMultiStepForm-fieldset').hide();
        // $('.multiStepFieldsetContainer').hide();
        $("#CreateTouchMultiStepForm_4").show()
        var getSegmentListLength = arrayMultipleSegmentNames.length
        // console.log(getSegmentListLength);
        arrayPushSegmentURL = [getSegmentListLength]

        for (i = 0; i < getSegmentListLength; i++) {
            $("#createSegmentUrlLink").append("<input type='text' class='segURL_textbox' id='segurl_" + i + "' placeholder='Segment URL " + i + "'>")
        };

        $(".segURL_textbox").keyup(function () {
            var getSelectedIndex = $(this).attr('id').split('_')
            var getUrlInputData = $(this).val();
            // console.log('getSelectedIndex : ' + getSelectedIndex[1]);
            // console.log('getUrlInputData : ' + getUrlInputData);
            arrayPushSegmentURL[getSelectedIndex[1]] = getUrlInputData
            
        });




    });

    ///Submit the create touch step form

    $("#tab5_Next").click(function () {
        $('.CreateTouchMultiStepForm-fieldset').hide();
        $('.multiStepFieldsetContainer').hide();
        $("#addCampaign").show();
        $("#step2_Submit").removeClass("displayNone");



        // console.log(arrayPushSegmentLanguageID)
        // console.log(arrayPushSegmentPhoneID);
        // console.log(arrayMultipleSegmentNames);
        // console.log(arrayPushSegmentURL);



        for (i = 0; i < arrayMultipleSegmentNames.length; i++) {
            segAssignJson = {
                "segmentId": arrayMultipleSegmentNames[i].segmentId,
                "segmentLanguageId": arrayPushSegmentLanguageID[i],
                "segmentPhoneNumberId": arrayPushSegmentPhoneID[i],
                "urlLink": arrayPushSegmentURL[i]
            };
            arraySegAssignJSON.push(segAssignJson)
        }


        segmentCollectionJson = {
            "methodName": "createSegmentAssignment",
            "data": {
                "createSegment": createTouchRequest.data.haveSegments,
                "createPhoneNumber": createTouchRequest.data.havePhoneAssignements,

                "segmentsAssignment": arraySegAssignJSON
            }
        }
        console.log(segmentCollectionJson);


    });


    // create touch step form previous button action

    $("#tab2_previous").click(function () {
        $('.CreateTouchMultiStepForm-fieldset').hide();
        $("#CreateTouchMultiStepForm_0").show();
    });

    $("#tab3_previous").click(function () {
        $('.CreateTouchMultiStepForm-fieldset').hide();
        $("#CreateTouchMultiStepForm_1").show();
        $('#createSegmentLanguage').empty();
    });


    $("#tab4_previous").click(function () {
        $('.CreateTouchMultiStepForm-fieldset').hide();
        $("#CreateTouchMultiStepForm_2").show();
        $('#createSegmentPhoneNo').empty();
    });

    $("#tab5_previous").click(function () {
        $('.CreateTouchMultiStepForm-fieldset').hide();
        $("#CreateTouchMultiStepForm_3").show();
        $('#createSegmentUrlLink').empty();
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