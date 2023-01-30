loadLibrary("meta:common.js");

function validateCampaignName(requestBodyObject){
 if(JSON.stringify(requestBodyObject.data) == '{}'){
          return executeResult(300,"Error in request payload data" ,"Fail");
          }
  else{
          
 try{
    var message;

    var campaignName = sqlGetString("SELECT scampaignName FROM metacampaign where iinitiativeId='"+requestBodyObject.data.initiativeId+"' and scampaignName='"+requestBodyObject.data.campaignName+"'");
    logInfo("campaignName****"+campaignName);

    if(campaignName.length >0){

    message="Campaign Name already Exists with Selected Initiative !";
    return executeResult(200,message ,"Failed");
    }
    else{
    message="Campaign Name doesn't Exists";
    return executeResult(200,message ,"Success");
    }
    }
  catch(error){
                  return executeResult(300,"Error in validating campaign name  "+ error + " "+ error.message + ' - ' + error.name ,"Fail");
              }
          
          }
}


function validateTouchName(requestBodyObject){
 if(JSON.stringify(requestBodyObject.data) == '{}'){
          return executeResult(300,"Error in request payload data" ,"Fail");
          }
  else{
          
 try{
    var message;

    var touchName = sqlGetString("SELECT stouchName FROM metatouch where   icampaignId='"+requestBodyObject.data.campaignId+"'");
    logInfo("touchName****"+touchName);

    if(touchName.length >0){

    message="Touch Name already Exists with Selected Campaign !";
    return executeResult(200,message ,"Failure");
    }
    else{
    message="Touch Name doesn't Exists";
    return executeResult(200,message ,"Success");
    }
    }
  catch(error){
                  return executeResult(300,"Error in validating Touch name  "+ error + " "+ error.message + ' - ' + error.name ,"Fail");
              }
          
          }
}
  



