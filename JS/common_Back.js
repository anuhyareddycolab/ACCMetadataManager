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
      logInfo("operator login: " + operator.login)
       return  operator.login;  
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
logInfo("hasAdminRight: " + hasAdminRight)
return  hasAdminRight;  
    }
    catch(eror){      
        return executeResult(500,"Error in Admin user evaluation- "+ error + " "+ error.message + ' - ' + error.name ,"Fail");
     }
}
  /* --------------------------------------------------------------------------------------*/ 
 
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
                            
var operatorLabelqueryData=operatorLabelquery.ExecuteQuery();
var operatorLabel;
    for each(var labelData in operatorLabelqueryData)
     operatorLabel=labelData.@label;                        
    return operatorLabel;
    }
    catch(eror){
        return executeResult(500,"Error in Get Operator label- "+ error + " "+ error.message + ' - ' + error.name ,"Fail");
     }     
}

/* --------------------------------------------------------------------------------------*/ 

