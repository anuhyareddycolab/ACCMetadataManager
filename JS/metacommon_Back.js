  /*****************************************************************
   *****************************************************************
   ******** common_Back.js library for MetaData Manager Tool********
   ***********************Krishna Gupta*****************************
   *****************************************************************
   *****************************************************************/
   
/* ---------------------------   required libraries  --------------------------*/
loadLibrary("xtk:shared/nl.js")
 NL.require('/xtk/shared/xtk.js')
  .require('/nl/core/shared/nl.js');
   loadLibrary("meta:jsspcontext.js");
   
/* --------------------------------------------------------------------------------------*/ 
 
 var buttonId = "";  /*Home button Id if user click in create campaign button will get create id or if user click on exiting campaign btn will get exiting button id */
 var addColloff=1;
 function setVariable(buttonId)
 {
    setOption("metaButtonId",buttonId);
 }
/* ---------------------------   validate seesion   --------------------------*/
function validateSession(response,request){
if ( NL.JSSPContext == undefined ) {
  // ## compatibility with build 7825
  NL.JSSPContext = JSSPContext;
}

// headers to disable cache
response.addHeader("Pragma", "no-cache")
response.addHeader("Cache-Control", "no-cache");
response.addHeader("Expires", new Date().toGMTString());
response.setContentType("text/html;charset=utf-8")
var jsspContext = new NL.JSSPContext(request)
  
if( !jsspContext.checkAuthentication(response) )

  return;
} 

/* --------------------------------------------------------------------------------------*/  


/* --------------------------------Global Variable---------------------------------------*/ 

var serverUrl=getOption("metaServerURL");
var metaEnvName=getOption("metaEnvName");





/* --------------------------------------------------------------------------------------*/

function todaysDate(){
    var today = new Date();
    var dd = String(today.getDate());
    var mm = String(today.getMonth() + 1); //January is 0!
    var yyyy = today.getFullYear();    
    today = mm + '/' + dd + '/' + yyyy;    
    return today;
}

/* ---------------------------   logout seesion   --------------------------*/
function getLogouturl(request){
   // ## logout url 
   var targetURL         = request.requestURI;
  var logouturl="/meta/logout.jssp?disconnect=true&target="+targetURL;
  return logouturl;
}

/* --------------------------------------------------------------------------------------*/ 

/* ---------------------------   header section   --------------------------*/

function header(request){
  var logo = getOption('metaLogoURL');
  var logoText = getOption('metaLogoURLText');
  var metaResourceDirectoryDefault = getOption('metaResourceDirectoryDefault');
  var operatorEmail=getOperator();
  var logout =getLogouturl(request);
  if(isCampaignMetaManagers() == true || isApplicationAdministrator() == true)
  {
  var text = '<div class="col-12"><div class="row headerDiv"><div class="col-lg-3 col-md-3 col-sm-4"><div id="logoDiv"><a href="/meta/home.jssp"><img src="'+logo+'emblem-logo-dark.png" class="img-fluid center-home" alt="Logo" /> </a><div class="logoText-home">'+logoText+'</div></div></div><div class="col-lg-5 col-md-5 col-sm-4"></div><div class="col-lg-4 col-md-4 col-sm-4"><input class="menu-btn" type="checkbox" id="menu-btn" /><label class="menu-icon" for="menu-btn"><span class="navicon"></span></label><a href="#" id="mobileNotification" class="notification"><img src="'+metaResourceDirectoryDefault+'zeroNotifications.png" width="28" style="width: 28px;" /><span class="badge">3</span></a><ul class="menu"><a id="notification-icon" href="#" class="notification-icon-container notification"><img id="notification-button" onclick="notificationIconBoxToggler(event)" class="notification-icon" src="'+metaResourceDirectoryDefault+'zeroNotifications.png" width="28" style="width: 28px;" /><span class="badge"></span></a><li><span class="bar"></span><a href="#about"><img class="userIcon" src="'+metaResourceDirectoryDefault+'icon-account-grey-20.png"/>&nbsp;&nbsp;'+operatorEmail+'</a><span class="bar"></span></li><li><a href="'+logout+'">Logout</a></li></ul></div></div></div>';
  }
   else
  {
  var text = '<div class="col-12"><div class="row headerDiv"><div class="col-lg-3 col-md-3 col-sm-4"><div id="logoDiv"><a href="/meta/home.jssp"><img src="'+logo+'emblem-logo-dark.png" class="img-fluid center-home" alt="Logo" /> </a><div class="logoText-home">'+logoText+'</div></div></div><div class="col-lg-5 col-md-5 col-sm-4"></div><div class="col-lg-4 col-md-4 col-sm-4"><input class="menu-btn" type="checkbox" id="menu-btn" /><label class="menu-icon" for="menu-btn"><span class="navicon"></span></label><a href="#" id="mobileNotification" class="notification"><img src="'+metaResourceDirectoryDefault+'icon-notifications-alert-grey-20.png" width="28" style="width: 28px;" /><span class="badge">3</span></a><ul class="menu"><a id="notification-icon" href="#" class="notification-icon-container notification"><img id="notification-button" onclick="notificationIconBoxToggler(event)" class="notification-icon" src="'+metaResourceDirectoryDefault+'icon-notifications-alert-grey-20.png" width="28" style="width: 28px;" /><span class="badge"></span></a><li><span class="bar"></span><a href="#about"><img class="userIcon" src="'+metaResourceDirectoryDefault+'icon-account-grey-20.png"/>&nbsp;&nbsp;'+operatorEmail+'</a><span class="bar"></span></li><li><a href="'+logout+'">Logout</a></li></ul></div></div></div>';
  
  }
  return text;
  
}

/* --------------------------------------------------------------------------------------*/ 
/* ---------------------------   Debugger on/off flag option   --------------------------*/

var debugFlag = getOption("debugFlag");

/* --------------------------------------------------------------------------------------*/ 

/* ----------------------------   Response return method   ------------------------------*/

      function executeResult(MessageID,Message,status){
                        var result={};  
                        result.MessageID=MessageID;
                        result.Message=Message;
                        result.Status=status;
                       
                        return JSON.stringify(result);
      }    
                  
/* --------------------------------------------------------------------------------------*/ 



/* -----------------------------   Trigger Email Method   -------------------------------*/ 


      function triggerEmail(subject,body,deliverytemplateID,email)
      {
          var deliveryId = nms.delivery.SubmitDelivery(deliverytemplateID,<delivery>
                         <mailParameters mirrorPagePolicy="default" needMirrorPage="0" useDefaultErrorAddress="true">                  
                            <subject>{subject}</subject>                                   
                         </mailParameters>
                         <targets >
                            <deliveryTarget>
                               <targetPart exclusion='false'  ignoreDeleteStatus='false'>
                                   <where  filteringSchema="xtk:operator">
                                       <condition expr={"@email='"+email+"'"}/>          
                                    </where>        
                               </targetPart>
                           </deliveryTarget>
                        </targets>
                        <content>
                            <html>
                            <source>{body}</source>
                          </html>
                        </content>                               
           </delivery>);
         return deliveryId;
      
      }
      
/* --------------------------------------------------------------------------------------*/  




/* ----------------------------   Debugger  ---------------------------------------------*/ 
    
    
      function logMessage(message,debug){ 
                               if ( debug == '1' ){                               
                                 logInfo("Debug Log: "+message);
                                 } 
                        }     
     
     
/* --------------------------------------------------------------------------------------*/  


/* ---------------------------   JSON checker   -----------------------------------------*/

      function isJSON(JSONRequest) {
              try {
                JSON.parse(JSONRequest);          
                return true;
              } catch (err) {
                return false;
              }
            } 

/* --------------------------------------------------------------------------------------*/  

/* ----------------------------   Encrypt method   --------------------------------------*/

      function encryptMethod(name){
        try{
          var encryptData=cryptString(name);
          return encryptData;
        }
        catch(error){
          return executeResult(300,"Error in reset password- "+ error + " "+ error.message + ' - ' + error.name ,"Fail");
        }
      
      }
      
 /* --------------------------------------------------------------------------------------*/ 

/* ----------------------------   Decrypt method   --------------------------------------*/

      function decryptMethod(login){
        try{
          var decryptData=decryptString(login);
          return decryptData;
        }
        catch(error){
          return executeResult(300,"Error in reset password- "+ error + " "+ error.message + ' - ' + error.name ,"Fail");
        }
      
      }
      
 /* --------------------------------------------------------------------------------------*/      

/* ----------------------------   Get Operator method   --------------------------------------*/ 
 function getOperator()
{
   
 try{

      var operator = application.operator;
  
      logMessage(operator.login,debugFlag);
       return  operator.login;  
    }
    catch(eror){
        return executeResult(500,"Error in Get Operator- "+ error + " "+ error.message + ' - ' + error.name ,"Fail");
     }
     
}

 /* --------------------------------------------------------------------------------------*/ 
 
 /* ----------------------------   Get Operator Description method   --------------------------------------*/ 
 function getOperatorDescription()
{
   
 try{

      var operator = application.operator;
    logMessage(operator.computeString,debugFlag);
       return  operator.computeString;  
    }
    catch(eror){
        return executeResult(500,"Error in Get Operator- "+ error + " "+ error.message + ' - ' + error.name ,"Fail");
     }
     
}

 /* --------------------------------------------------------------------------------------*/ 
 
/* ----------------------------   Check is operartor admin or not method   --------------------------------------*/ 
 function isAdmin(){
 try{
var hasAdminRight = application.operator.hasRight("admin")
    logMessage(hasAdminRight,debugFlag);
return  hasAdminRight;  
    }
    catch(eror){      
        return executeResult(500,"Error in Admin user evaluation- "+ error + " "+ error.message + ' - ' + error.name ,"Fail");
     }
}
  /* --------------------------------------------------------------------------------------*/ 
 
 
 /* ----------------------------   Check is operartor in Application Administrator group or not method   --------------------------------------*/ 
 function isApplicationAdministrator(){
   try{
   var hasApplicationAdministrator= false;
        for each(var right in application.operator.rights){
        if(right == "metaapplicationadministratorright")
        hasApplicationAdministrator = true;
        }
     logMessage(hasApplicationAdministrator,debugFlag);
        return  hasApplicationAdministrator;  
      }
      catch(eror){      
          return executeResult(500,"Error in metaapplicationadministrator right   evaluation- "+ error + " "+ error.message + ' - ' + error.name ,"Fail");
       }
}
  /* --------------------------------------------------------------------------------------*/ 
 
 
 /* ----------------------------   Check is operartor in Campaign Meta Managers group or not method   --------------------------------------*/ 
 function isCampaignMetaManagers(){
 try{
 var hasCampaignMetaManagers= false;
      for each(var right in application.operator.rights){
        if(right == "metacampaignmetamanagersright")
        hasCampaignMetaManagers = true;
        }
     logMessage(hasCampaignMetaManagers,debugFlag);
return  hasCampaignMetaManagers;  
    }
    catch(eror){      
        return executeResult(500,"Error in metaapplicationadministrator right   evaluation- "+ error + " "+ error.message + ' - ' + error.name ,"Fail");
     }
}
  /* --------------------------------------------------------------------------------------*/ 
  
  
   /* ----------------------------   Check is operartor in Campaign Meta Reviewer group or not method   --------------------------------------*/ 
 function isCampaignMetaReviewer(){
 try{
 var hasCampaignMetaReviewer= false;
      for each(var right in application.operator.rights){
        if(right == "metacampaignmetareviewerright")
        hasCampaignMetaReviewer = true;
        }
     logMessage(hasCampaignMetaReviewer,debugFlag);
return  hasCampaignMetaReviewer;  
    }
    catch(eror){      
        return executeResult(500,"Error in metaapplicationadministrator right   evaluation- "+ error + " "+ error.message + ' - ' + error.name ,"Fail");
     }
}
  /* --------------------------------------------------------------------------------------*/ 
  
  
     /* ----------------------------   Check is operartor in Phone Number Managers group or not method   --------------------------------------*/ 
 function isPhoneNumberManagers(){
 try{
   var hasPhoneNumberManagers= false;
      for each(var right in application.operator.rights){
        if(right == "metaphonenumbermanagersright")
        hasPhoneNumberManagers = true;
        }
     logMessage(hasPhoneNumberManagers,debugFlag);

return  hasPhoneNumberManagers;  
    }
    catch(eror){      
        return executeResult(500,"Error in metaapplicationadministrator right   evaluation- "+ error + " "+ error.message + ' - ' + error.name ,"Fail");
     }
}
  /* --------------------------------------------------------------------------------------*/ 
  
 function checkOperator(){

  
  var admin= isApplicationAdministrator();
  var campaignReviewer= isCampaignMetaReviewer();
  var campaignMangers= isCampaignMetaManagers();
  var phoneManagers= isPhoneNumberManagers();
   
  
    if(admin == true){       
        return "applicationAdministrator";  
      }
      else if(campaignMangers == true){
         return "campaignMangers";
      }
      else if(phoneManagers == true){      
        return "phoneManagers";
      }
      else if(campaignReviewer == true){       
        return "campaignReviewer";
      }    
 
 } 
 
 /* ----------------------------   get Operator Label method   --------------------------------------*/ 
 
function getOperatorLabel()
{
   
 try{ 
      var operatorLabelquery = xtk.queryDef.create(
     <queryDef schema="xtk:operator" operation="select">
         <select> 
            <node expr="@label" /> 
         </select>
      <where>
         <condition expr={"@id='"+application.operator.id+"'"} />
      </where>                                                
    </queryDef>);
    var login=getOption('metaadmin');;
logonEscalation(login);   
                
var operatorLabelqueryData=operatorLabelquery.ExecuteQuery();
    logMessage(operatorLabelqueryData,debugFlag);
var operatorLabel;
logonEscalation(getOperator());   
    for each(var labelData in operatorLabelqueryData)
     operatorLabel=labelData.@label;  
       logMessage(operatorLabel,debugFlag);
    return operatorLabel;
    }
    catch(eror){
        return executeResult(500,"Error in Get Operator label- "+ error + " "+ error.message + ' - ' + error.name ,"Fail");
     }     
}

/* --------------------------------------------------------------------------------------*/ 



 /* ----------------------------   update phone release date  --------------------------------------*/ 
 function updateReleaseDate(phoneNumberId){
 try{
var phoneNumberId=phoneNumberId;

var newReleaedate;
//logInfo("phoneNumberId:"+phoneNumberId);
var touchEndDate=getLatestTouchEndDate(phoneNumberId);
var coolOffPeriod=getCoolOffPeriod(phoneNumberId);
var newReleaedate=calculateNewReleaedate(touchEndDate,phoneNumberId,coolOffPeriod);
xtk.session.Write(<phoneNumberLibrary _operation = "update" _key = "@id"  id ={phoneNumberId}  releaseDate ={newReleaedate} xtkschema = "meta:phoneNumberLibrary"/>);  
//logInfo("newReleaedate update successfully" +newReleaedate)
 }
 catch(error){
   return executeResult(300,"Error in updateReleaseDate- "+ error + " "+ error.message + ' - ' + error.name ,"Fail");
        }
 }
 /* --------------------------------------------------------------------------------------*/ 
 
 
  /* ----------------------------   getLatestTouchEndDate   --------------------------------------*/ 
  function getLatestTouchEndDate(phoneNumberId){
  try{
    var touchEndDate = sqlGetDate("SELECT tsAssignedEnd from MetaPhoneNumberAssignment where iPhoneNumberId="+phoneNumberId+" AND iIsMarkDeleted='0'  ORDER BY  tsAssignedEnd DESC ");
     if(touchEndDate == null){
    var d = new Date();
   touchEndDate= d;
   addColloff=0;
    }
   //logInfo("touchEndDate :"+touchEndDate)
   return touchEndDate;
    }
 catch(error){
   return executeResult(300,"Error in getLatestTouchEndDate- "+ error + " "+ error.message + ' - ' + error.name ,"Fail");
        }
  }
 /* --------------------------------------------------------------------------------------*/  
 
  
   /* ----------------------------   getCoolOffPeriod  --------------------------------------*/ 
 function getCoolOffPeriod(phoneNumberId){
 try{
   var coolOffPeriod = 0;
   coolOffPeriod = sqlGetInt("SELECT iPeriodCoolOffDays from MetaPhoneNumberLibrary where iPhoneNumberLibraryId="+phoneNumberId+" ");
   //logInfo("coolOffPeriod :"+coolOffPeriod)
   return coolOffPeriod;
    }
 catch(error){
   return executeResult(300,"Error in getCoolOffPeriod- "+ error + " "+ error.message + ' - ' + error.name ,"Fail");
        }
 }
  /* --------------------------------------------------------------------------------------*/ 

           
  
   /* ----------------------------    calculateNewReleaedate  --------------------------------------*/ 
function calculateNewReleaedate(touchEndDate,phoneNumberId,coolOffPeriod){
try{
  var phoneAssignmentsforPhoneid =   sqlGetInt("SELECT iPhoneNumberAssignmentId from MetaPhoneNumberAssignment where iPhoneNumberId="+phoneNumberId+" AND iIsMarkDeleted='0'  ");
var newReleaedate = new Date(touchEndDate);
if(addColloff !=0){
newReleaedate.setDate(newReleaedate.getDate() + coolOffPeriod);
}
else{
newReleaedate.setDate(newReleaedate.getDate());  
}

newReleaedate=new Date(newReleaedate).toISOString().slice(0, 10);
//logInfo("newReleaedate :"+newReleaedate)
return newReleaedate;
 }
 catch(error){
   return executeResult(300,"Error in calculateNewReleaedate- "+ error + " "+ error.message + ' - ' + error.name ,"Fail");
        }

  }
 
 /* --------------------------------------------------------------------------------------*/ 
 
   /* ----------------------------    isPseudoNumber  --------------------------------------*/ 
   function isPseudoNumber(phoneNumberId){
    try{
 var pseudoNumber = sqlGetInt("SELECT iIsPseudoNumber from MetaPhoneNumberLibrary where iPhoneNumberLibraryId="+phoneNumberId+" ");
logMessage(pseudoNumber,debugFlag); 
return pseudoNumber;
    }
       catch(error){
   return executeResult(300,"Error in isPseudoNumber- "+ error + " "+ error.message + ' - ' + error.name ,"Fail");
        }
  }

 /* --------------------------------------------------------------------------------------*/ 
 
  
   /* ----------------------------    isReservedNumber  --------------------------------------*/ 
   function isReservedNumber(phoneNumberId){
    try{
 var reservedNumber = sqlGetInt("SELECT iIsReserved from MetaPhoneNumberLibrary where iPhoneNumberLibraryId="+phoneNumberId+" ");
logMessage(reservedNumber,debugFlag); 
return reservedNumber;
    }
       catch(error){
   return executeResult(300,"Error in isReserved- "+ error + " "+ error.message + ' - ' + error.name ,"Fail");
        }
  }

 /* --------------------------------------------------------------------------------------*/ 
 
    /* ----------------------------    getBrandId  --------------------------------------*/ 
   function getBrandId(phoneNumberId){
    try{
 var brandId = sqlGetInt("SELECT iBrandId from MetaPhoneNumberLibrary where iPhoneNumberLibraryId="+phoneNumberId+" ");
logMessage(brandId,debugFlag); 
return brandId;
    }
       catch(error){
   return executeResult(300,"Error in getBrandId- "+ error + " "+ error.message + ' - ' + error.name ,"Fail");
        }
  }

 /* --------------------------------------------------------------------------------------*/ 
 
    /* ----------------------------    getChannelId  --------------------------------------*/ 
   function getChannelId(phoneNumberId){
    try{
 var channelId = sqlGetInt("SELECT iChannelId from MetaPhoneNumberLibrary where iPhoneNumberLibraryId="+phoneNumberId+" ");
logMessage(channelId,debugFlag); 
return channelId;
    }
       catch(error){
   return executeResult(300,"Error in getChannelId- "+ error + " "+ error.message + ' - ' + error.name ,"Fail");
        }
  }

 /* --------------------------------------------------------------------------------------*/ 
    /* ----------------------------    getInitiativeId  --------------------------------------*/ 
   function getInitiativeId(phoneNumberId){
    try{
 var initiativeId = sqlGetInt("SELECT iInitiativeId from MetaPhoneNumberLibrary where iPhoneNumberLibraryId="+phoneNumberId+" ");
logMessage(initiativeId,debugFlag); 
return initiativeId;
    }
       catch(error){
   return executeResult(300,"Error in getInitiativeId- "+ error + " "+ error.message + ' - ' + error.name ,"Fail");
        }
  }

 /* --------------------------------------------------------------------------------------*/ 
 
    /* ----------------------------    getLanguageId  --------------------------------------*/ 
   function getLanguageId(phoneNumberId){
    try{
 var languageId = sqlGetInt("SELECT iLanguageId from MetaPhoneNumberLibrary where iPhoneNumberLibraryId="+phoneNumberId+" ");
logMessage(languageId,debugFlag); 
return languageId;
    }
       catch(error){
   return executeResult(300,"Error in getLanguageId- "+ error + " "+ error.message + ' - ' + error.name ,"Fail");
        }
  }

 /* --------------------------------------------------------------------------------------*/ 
 
    /* ----------------------------    getLobId  --------------------------------------*/ 
   function getLobId(phoneNumberId){
    try{
 var lobId = sqlGetInt("SELECT iLobId from MetaPhoneNumberLibrary where iPhoneNumberLibraryId="+phoneNumberId+" ");
logMessage(lobId,debugFlag); 
return lobId;
    }
       catch(error){
   return executeResult(300,"Error in getLobId- "+ error + " "+ error.message + ' - ' + error.name ,"Fail");
        }
  }

 /* --------------------------------------------------------------------------------------*/ 
 
 // ******************************************** get SegmnetId From PhoneNumber Assignmnet***************************************************************************//  
 function getSegmentIdFromPhoneNumberAssignmnet (segmentId){
 try{
    var phoneNumberAssignmentSegmentId = sqlGetInt("SELECT iSegmentId from MetaPhoneNumberAssignment where  iSegmentId="+segmentId+" AND iIsMarkDeleted='0' ");
 return phoneNumberAssignmentSegmentId;
 }
 catch(error){
   return executeResult(300,"Error in getSegmentIdFromPhoneNumberAssignmnet- "+ error + " "+ error.message + ' - ' + error.name ,"Fail");
        }
 }
  
 // ******************************************** get PhoneNumber Id From SegmentId***************************************************************************//   
   function getPhoneNumberIdFromSegmentId (segmentId){
 try{
    var phoneNumberIdFromSegmentId = sqlGetInt("SELECT iPhoneNumberId from MetaPhoneNumberAssignment where  iSegmentId="+segmentId+" AND iIsMarkDeleted='0' ");
 return phoneNumberIdFromSegmentId;
 }
 catch(error){
   return executeResult(300,"Error in getPhoneNumberIdFromSegmentId- "+ error + " "+ error.message + ' - ' + error.name ,"Fail");
        }
 }
  
 
 /* ******************************************************* Touch Details JSSP ************************************************ */
 
    function getTouchInformation(touchId){   
       
       var touchResponseObject={};
      
       var touchQuery= xtk.queryDef.create(
                            <queryDef schema="meta:touch"  operation="select">
                                <select>
                                  <node expr="@id"/> 
                                  <node expr="[campaign/@campaignCode]" alias="@campaignCode"/>
                                  <node expr="@touchName"/>
                                  <node expr="@touchCode"/> 
                                  <node expr="@touchDescription"/>  
                                  <node expr="@touchStartDate"/>
                                  <node expr="@touchEndDate"/>                            
                                  <node expr="[channel/@code]" alias="@channelCode"/>
                                  <node expr="[channel/@name]" alias="@channelName"/>
                                  <node expr="@status"/> 
                                  <node expr="@haveSegments"/>
                                  <node expr="@havePhoneAssignments"/>
                                  <node expr="@haveUrlAssignments"/>                                                                            
                                </select> 
                                <where>                          
                                    <condition boolOperator="AND" expr={"@id = '"+touchId+"'"}/>
                                    <condition expr={"@id != '0'"}/>
                                </where> 
                           </queryDef>);
       var touchdata= touchQuery.ExecuteQuery();
      
      var data=[];
      
      for each(var i in touchdata){
          var touchData={};          
          touchData.TouchId=i.@id.toString();
          touchData.CampaignCode=i.@campaignCode.toString();
          touchData.TouchName=i.@touchName.toString();
          touchData.UniqueId=i.@touchCode.toString();
          touchData.TouchDescription=i.@touchDescription.toString();
          touchData.TouchStartDate=i.@touchStartDate.toString();
          touchData.TouchEndDate=i.@touchEndDate.toString();          
          touchData.ChannelName=i.@channelName.toString();
          touchData.ChannelCode=i.@channelCode.toString();
          touchData.Status=i.@status.toString();
          touchData.HaveSegments=i.@haveSegments.toString()=="1"?"Yes":"No";
          touchData.HavePhoneAssignments=i.@havePhoneAssignments.toString()=="1"?"Yes":"No";
          touchData.HaveUrlAssignments=i.@haveUrlAssignments.toString()=="1"?"Yes":"No";         
         
          data.push(touchData);
      }
      touchResponseObject.data=data;
      return touchResponseObject;
        
  }
  
   function getSegmentInformation(touchId){   
       
       var segmentIdArray=[];
      
       var segmentQuery= xtk.queryDef.create(
                            <queryDef schema="meta:segment"  operation="select"  >
                                <select>
                                  <node expr="@id"/>                                                                           
                                </select> 
                                <where>                          
                                    <condition boolOperator="AND" expr={"@touchId = '"+touchId+"'"}/>
                                    <condition expr={"@touchId != '0'"}/>
                                </where> 
                           </queryDef>);
       var segmentData= segmentQuery.ExecuteQuery();
      
     
      
      for each(var i in segmentData){
         
          segmentIdArray.push(i.@id.toString()); 
      }
      return  segmentIdArray;
  }
  
  function getSegmentAssignmentInformation(segmentId){   
       
       var segmentAssignmentJSONData={};
      
       var segmentAssignmentQuery= xtk.queryDef.create(
                            <queryDef schema="meta:segmentAssignment"  operation="select"  >
                                <select>
                                  <node expr="[segment/@id]" alias="@segmentId"/> 
                                  <node expr="[segment/@segmentName]" alias="@segmentName"/>
                                  <node expr="[segment/@segmentCode]" alias="@segmentCode"/>                                   
                                  <node expr="@id"/>
                                  <node expr="@segmentAssignmentCode"/> 
                                  <node expr="[language/@code]" alias="@languageCode"/> 
                                  <node expr="[language/@name]" alias="@languageName"/>                                   
                                  <node expr="@urlLink"/> 
                                  <node expr="@urlLinkWithUTM"/>  
                                  <node expr="@urlLinkVanity"/>  
                                  <node expr="@phoneAssigmentStatus"/> 
                                  <node expr="@ctaUrlAssignmentStatus"/>                                  
                                  <node expr="[phoneNumberAssignment/@phoneAssignmentCode]" alias="@phoneAssignmentCode"/>   
                                </select> 
                                <where>                          
                                    <condition expr={"@segmentId = '"+segmentId+"'"}/>
                                </where> 
                           </queryDef>);
       var segmentAssignmentData= segmentAssignmentQuery.ExecuteQuery();
      
     
      
      for each(var ada in segmentAssignmentData){
       
      // var segmentAssignmentJSONData={};
       
          segmentAssignmentJSONData.SegmentId=ada.@segmentId.toString();
          segmentAssignmentJSONData.SegmentName=ada.@segmentName.toString();
          segmentAssignmentJSONData.SegmentCode=ada.@segmentCode.toString();
          segmentAssignmentJSONData.SegmentAssignmentCode=ada.@segmentAssignmentCode.toString();
          segmentAssignmentJSONData.PhoneNumberAssignmentCode=ada.@phoneAssignmentCode.toString(); 
          //segmentAssignmentJSONData.SegmentAssignmentCode=ada.@segmentAssignmentCode.toString(); .         
          segmentAssignmentJSONData.LanguageName=ada.@languageName.toString();
          segmentAssignmentJSONData.LanguageCode=ada.@languageCode.toString();
          segmentAssignmentJSONData.UrlLink=ada.@urlLink.toString();
          segmentAssignmentJSONData.UrlLinkWithUTM=ada.@urlLinkWithUTM.toString();
          segmentAssignmentJSONData.UrlLinkVanity=ada.@urlLinkVanity.toString();
          segmentAssignmentJSONData.PhoneAssigmentStatus=ada.@phoneAssigmentStatus.toString();
          segmentAssignmentJSONData.CtaUrlAssignmentStatus=ada.@ctaUrlAssignmentStatus.toString();
         // segmentAssignmentJSONData.PhoneNumberAssignmentCode=ada.@phoneAssignmentCode.toString();
          
      }
    
      return segmentAssignmentJSONData;
        
  }
  

//****************************************************  @@ calling method createRequestNotification refernce[meta:requestNotification.js,meta:touchOperation.js]  ******************************************************** 

    function createRequestNotification(segmentId,campaignId,userType,notificationType,action,actionName,title,description,notificationDate,requestedBy,requestedStatus,touchId,phoneNumberAssignmentId,Status,notificationType2){
 
                           logInfo("CphoneNumberAssignmentId "+phoneNumberAssignmentId);
        logInfo("CnotificationType2 "+notificationType2);
        logInfo("CsegmentId "+segmentId);
        logInfo("CuserType "+userType); 
                            
                            
                            
                            
                                var requestNotification=meta.requestNotification.create();
                                            requestNotification.segmentId=segmentId;
                                            requestNotification.campaignId=campaignId;
                                            requestNotification.userType=userType;
                                            requestNotification.notificationType=notificationType;
                                            requestNotification.action=action;
                                            requestNotification.actionName=actionName;
                                            requestNotification.title=title;
                                            requestNotification.description=description;
                                            requestNotification.notificationDate=notificationDate;
                                            requestNotification.requestedBy=requestedBy
                                            requestNotification.requestedStatus=requestedStatus
                                            requestNotification.touchId=touchId;
                                            requestNotification.phoneNumberAssignmentId=phoneNumberAssignmentId
                                            requestNotification.Status=Status
                                            requestNotification.notificationType2=notificationType2
                                            requestNotification.save();
                                            
                                 return requestNotification.id;
 
 
    }
    
    
//****************************************************  @@ calling method updateRequestNotification refernce[meta:touchOperation.js]  ******************************************************** 

    function updateRequestNotification(segmentId,campaignId,userType,notificationType,action,actionName,title,description,notificationDate,requestedBy,requestedStatus,touchId,phoneNumberAssignmentId,Status,notificationType2){
     
     logInfo("touchId "+touchId);
        logInfo("phoneNumberAssignmentId "+phoneNumberAssignmentId);
        logInfo("notificationType2 "+notificationType2);
        logInfo("segmentId "+segmentId);
        logInfo("userType "+userType);
        xtk.session.Write(<requestNotification xtkschema="meta:requestNotification" _operation="update"  _key="@touchId,@phoneNumberAssignmentId,@notificationType2,@segmentId" segmentId={segmentId} campaignId={campaignId} userType={userType} notificationType={notificationType} action={action} actionName={actionName} title={title} description={description} notificationDate={notificationDate} requestedBy={requestedBy} requestedStatus={requestedStatus} touchId={touchId} phoneNumberAssignmentId={phoneNumberAssignmentId} Status={Status} notificationType2={notificationType2}></requestNotification>);
                                 
     
     }   
  
  
  //****************************************************  @@ getMetaName ******************************************************** 
function   getMetaName(phoneNumberId,columnName,schemaName){
  
var metaId = sqlGetString("SELECT "+columnName+" FROM  MetaPhoneNumberLibrary WHERE iPhoneNumberLibraryId =  '"+phoneNumberId+"' ");
//logInfo("metaId"+metaId);
if(schemaName == 'MetaLineOfBusiness')
  columnName='iLineOfBusinessId';
  var metaName = sqlGetString("SELECT sName FROM  "+schemaName+" WHERE "+columnName+" = " + parseInt(metaId));
   //logInfo("metaName"+metaName);         
     return metaName;
}   
     
 //****************************************************  @@ calling method getSegmentAssignmentData  ********************************************************    
    
    function getSegmentAssignmentData(segmentId,flag,havePhone){
 
                            var queryData= xtk.queryDef.create(
                                           <queryDef schema="meta:segmentAssignment" operation="select">
                                              <select>
                                                <node expr="@urlLink"/>
                                                <node expr="@phoneAssignmentId"/>
                                                <node expr="[/phoneNumberAssignment/phoneNumberLibrary/@phoneNumber]" alias="@phoneNumber"/>
                                              </select>
                                              <where> 
                                               <condition expr={"@segmentId = '"+segmentId+"'"}/>   
                                              </where>                           
                                           </queryDef>);                           
                            var queryDataXML=queryData.ExecuteQuery();
                            var urlLinkData=queryDataXML.segmentAssignment.@urlLink.toString();
                            var phoneNumberAssignmentId=queryDataXML.segmentAssignment.@phoneAssignmentId.toString();
                            var phoneNumber=queryDataXML.segmentAssignment.@phoneNumber.toString();
                            
                            if(flag == "0" && havePhone == "0"){
                            return urlLinkData;
                            }
                            if(flag == "1" && havePhone == "0"){
                            return phoneNumberAssignmentId;
                            }
                            if(flag == "0" && havePhone == "1"){
                            return phoneNumber;
                            }
                            
                             
    }    
 
 //****************************************************  @@ calling method getOwnerId  ********************************************************   
 
 /*function getOwnerId(requestSubmitter){
        var queryData= xtk.queryDef.create(
                          <queryDef schema="xtk:opsecurity" operation="select">
                            <select>
                              <node expr="@id"/>                                                                                        
                            </select>                                                      
                              <where> 
                               <condition expr={"@name = '"+requestSubmitter+"'"}/>                               
                              </where>                            
                           </queryDef>);
                           
         var requestXMLData=queryData.ExecuteQuery();
         var ownerId=requestXMLData.opsecurity.@id.toString();
    return ownerId;    
         
 }      */
