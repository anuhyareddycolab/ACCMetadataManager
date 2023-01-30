loadLibrary("meta:common.js"); 

   function viewPhoneNumber(phoneNumberId){
             try{
              var schemaname="meta:phoneNumberLibrary";   
                        var phoneNumberJson={};
            //var phoneNumberId='1001'
                        var query = xtk.queryDef.create(
                          <queryDef schema={schemaname} operation="select">
                            <select> 
              <node expr="@id"/>
                                <node expr="@did"/> 
                                <node expr="@phoneNumber"/> 
                                <node expr="@vdnName"/>
                 <node expr="@ivrNumber"/> 
                 <node expr="@status"/> 
                                <node expr="@groupNumber"/> 
                                <node expr="@initiativeId"/>
                 <node expr="@brandId"/> 
                                <node expr="@channelId"/> 
                                <node expr="@languageId"/>
                <node expr="@lobId"/>
                
                            </select>                            
                                   <where>
          <condition expr ={"@id='"+phoneNumberId+ "'"}/>
         </where>                                               
                          </queryDef>);
    
                        var queryData=query.ExecuteQuery();
                       
                   
                        for each(var item in queryData){
                        var phoneJson={};
                            phoneJson.phoneNumberId=item.@id.toString();
                phoneJson.did=item.@did.toString();
                            phoneJson.phoneNumber=item.@phoneNumber.toString();
                            phoneJson.vdnName=item.@vdnName.toString();  
              phoneJson.ivrNumber=item.@ivrNumber.toString();                         
                            phoneJson.status=item.@status.toString();
              phoneJson.groupNumber=item.@groupNumber.toString();
               phoneJson.initiativeId=item.@initiativeId.toString();
               phoneJson.brandId=item.@brandId.toString();
                            phoneJson.channelId=item.@channelId.toString();
                            phoneJson.languageId=item.@languageId.toString();
               phoneJson.lobId=item.@lobId.toString();
                                                       
                        }
                    
                    
                     return phoneJson;
           
           }
                     catch(error){
                       return executeResult(500,"Error in reading phone number - "+ error + " "+ error.message + ' - ' + error.name ,"Fail");
                     }
                     
 }
 
 
 function readPhoneNumbers(){
   try{
var schemaname="meta:phoneNumberLibrary";   
                        var phoneNumberJson={};
            //var phoneNumberId='1001'
                        var query = xtk.queryDef.create(
                          <queryDef schema={schemaname} operation="select">
                            <select> 
              <node expr="@id"/>
                                <node expr="@did"/> 
                                <node expr="@phoneNumber"/> 
                                <node expr="@vdnName"/>
                 <node expr="@ivrNumber"/> 
                 <node expr="@status"/> 
                                <node expr="@groupNumber"/> 
                                <node expr="@initiativeId"/>
                 <node expr="@brandId"/> 
                                <node expr="@channelId"/> 
                                <node expr="@languageId"/>
                <node expr="@lobId"/>
                
                            </select>                            
                                                                
                          </queryDef>);
    
                        var queryData=query.ExecuteQuery();
                         var data=[];
                   
                        for each(var item in queryData){
                       var phoneJson={};
                            phoneJson.phoneNumberId=item.@id.toString();
                phoneJson.did=item.@did.toString();
                            phoneJson.phoneNumber=item.@phoneNumber.toString();
                            phoneJson.vdnName=item.@vdnName.toString();  
              phoneJson.ivrNumber=item.@ivrNumber.toString();                         
                            phoneJson.status=item.@status.toString();
              phoneJson.groupNumber=item.@groupNumber.toString();
               phoneJson.initiativeId=item.@initiativeId.toString();
               phoneJson.brandId=item.@brandId.toString();
                            phoneJson.channelId=item.@channelId.toString();
                            phoneJson.languageId=item.@languageId.toString();
               phoneJson.lobId=item.@lobId.toString();
                            data.push(phoneJson);                             
                        }
                    phoneNumberJson.methodName='readPhoneNumbers';
                     phoneNumberJson.data=data;
                     
   return phoneNumberJson;
           
           }
                     catch(error){
                       return executeResult(500,"Error in reading phone numbers - "+ error + " "+ error.message + ' - ' + error.name ,"Fail");
                     }
                     
 }

function createPhoneNumber(requestBodyObject){
   if(JSON.stringify(requestBodyObject.data) == '{}'){
          return executeResult(500,"Error in request payload data" ,"Fail");
   }
   else{
              try{  
               
                 var table="phoneNumberLibrary";
                 var schemaName="meta:phoneNumberLibrary";
                  xtk.session.Write(<{table} xtkschema={schemaName} _operation="insert"  phoneNumber={requestBodyObject.data.phoneNumber} initiativeId={requestBodyObject.data.initiativeId} lobId={requestBodyObject.data.lobId} brandId={requestBodyObject.data.brandId} channelId={requestBodyObject.data.channelId} languageId={requestBodyObject.data.languageId} did={requestBodyObject.data.did} vdnName={requestBodyObject.data.vdnName} ivrNumber={requestBodyObject.data.ivrNumber} isPseudoNumber={requestBodyObject.data.isPseudoNumber} status={requestBodyObject.data.status}  groupNumber={requestBodyObject.data.groupNumber} isArchived={requestBodyObject.data.isArchived} isMarkDeleted={requestBodyObject.data.isMarkDeleted} isDeleted={requestBodyObject.data.isDeleted}></{table}>);
                   return executeResult(200,"Record of "+table+" created successfully " ,"Success");
              }
              catch(error){
                 return executeResult(500,"Error in createing PhoneNumber record- "+ error + " "+ error.message + ' - ' + error.name ,"Fail");
              }
   }
 }
 
 
 function updatePhoneNumber(requestBodyObject){
  if(JSON.stringify(requestBodyObject.data) == '{}'){
          return executeResult(500,"Error in request payload data" ,"Fail");
   }
   else{
              try{  
               
                var table="phoneNumberLibrary";
                 var schemaName="meta:phoneNumberLibrary";
                 xtk.session.Write(<{table} xtkschema={schemaName} _operation="update"  _key="@id" id={requestBodyObject.data.phoneNumberId} phoneNumber={requestBodyObject.data.phoneNumber} initiativeId={requestBodyObject.data.initiativeId} lobId={requestBodyObject.data.lobId} brandId={requestBodyObject.data.brandId} channelId={requestBodyObject.data.channelId} languageId={requestBodyObject.data.languageId} did={requestBodyObject.data.did} vdnName={requestBodyObject.data.vdnName} ivrNumber={requestBodyObject.data.ivrNumber} isPseudoNumber={requestBodyObject.data.isPseudoNumber} status={requestBodyObject.data.status}  groupNumber={requestBodyObject.data.groupNumber} isArchived={requestBodyObject.data.isArchived} isMarkDeleted={requestBodyObject.data.isMarkDeleted} isDeleted={requestBodyObject.data.isDeleted}></{table}>);
                   return executeResult(200,"Phone Number of id "+requestBodyObject.data.phoneNumberId+" updated successfully " ,"Success");
              }
              catch(error){
                 return executeResult(500,"Error in updating Phone Number record- "+ error + " "+ error.message + ' - ' + error.name ,"Fail");
              }
   }