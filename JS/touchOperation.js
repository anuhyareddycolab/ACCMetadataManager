loadLibrary("meta:common.js");  

// ******************************************** Create Touch Template function calling definition ***************************************************************************// 


    function createTouchTemplate(requestBodyObject,touchId){
        try{
             //logInfo("Inside createTouchTemplate:");
            var folderPath=getOption("metaTouchTemplateFolder");
            var queryData= xtk.queryDef.create(
                          <queryDef schema="xtk:folder" operation="select">
                            <select>
                              <node expr="@id"/>
                            </select>
                            <where>                          
                              <condition expr={"@fullName like '"+folderPath+"'"}/>
                            </where>
                           </queryDef>);
                           
                           var data= queryData.ExecuteQuery();
                           var folderId= data.folder.@id;
                           
           var campData= xtk.queryDef.create(
                          <queryDef schema="meta:campaign" operation="select">
                            <select>                              
                              <node expr="@campaignName"/>
                              <node expr="@initiativeId"/>
                              <node expr="@lobId"/>
                              <node expr="@brandId"/>
                              <node expr="@campaignStartDate"/>
                              <node expr="@campaignendDate"/>
                            </select>
                            <where>                          
                              <condition expr={"@id = '"+requestBodyObject.data.campaignId+"'"}/>
                            </where>
                           </queryDef>);
           var data= campData.ExecuteQuery();           
           var campaignName= data.campaign.@campaignName;
           var lobId= data.campaign.@lobId;       
           var brandId=data.campaign.@brandId;        
           var initiativeId=data.campaign.@initiativeId;      
           var campaignStartDate= data.campaign.@campaignStartDate;
           var campaignEndDate=data.campaign.@campaignendDate;
           
           // var templateName=getOption("metaCampaignTemplateName"); 
               var templateName=data.campaign.@campaignName;
               //logInfo("templateName:"+templateName);
               var queryData= xtk.queryDef.create(
                            <queryDef schema="nms:operation" operation="select">
                              <select>
                                <node expr="@id"/>
                              </select>
                              <where>
                                <condition boolOperator="AND" expr={"@label = '"+templateName+"'"}/>
                                <condition expr={"@isModel='1'"}/>
                              </where>
                             </queryDef>);
                             
               var templateData= queryData.ExecuteQuery(); 
               var templateId= templateData.operation.@id;
               
               
               //logInfo("templateId:"+templateId);
           var operation = nms.operation.create();
                             operation.DuplicateTo("nms:operation|"+templateId+"","xtk:folder|"+folderId+""); 
                             operation.label=campaignName; 
                             operation.metaInitiativeId=initiativeId;
                             operation.metaLobId=lobId;
                             operation.metaBrandId=brandId;
                             operation.start=campaignStartDate;
                             operation.end=campaignEndDate;                            
                             operation.isModel="0";
                             operation.metaTouchId=touchId;                                   
                           operation.save(); 
                           //logInfo("operation.id :"+operation.id);
                           return operation.id;              
                     
          }
          catch(error){
            return executeResult(300,"Error in creating campaign template- "+ error + " "+ error.message + ' - ' + error.name ,"Fail");
          }           
    }



// ******************************************** Create Touch ***************************************************************************// 


     function createTouch(requestBodyObject){
         if(JSON.stringify(requestBodyObject.data) == '{}'){
                  return executeResult(300,"Error in request payload data" ,"Fail");
           }
           else{
              try{
              
                    
                    var dSegmentId=0;
                    var touch=meta.touch.create();                                                // writing data in touch schema
                               touch.campaignId=requestBodyObject.data.campaignId;                     
                               touch.touchName=requestBodyObject.data.touchName; 
                               touch.touchDescription=requestBodyObject.data.touchDescription;
                               touch.channelId=requestBodyObject.data.channelId;
                               touch.mailFileDueDate=requestBodyObject.data.mailFileDueDate;
                               touch.estimatedDropDate=requestBodyObject.data.estimatedDropDate;
                               touch.touchStartDate=requestBodyObject.data.touchStartDate;
                               touch.touchEndDate=requestBodyObject.data.touchEndDate;                               
                               touch.haveSegments=requestBodyObject.data.haveSegments; 
                               touch.havePhoneAssignments=requestBodyObject.data.havePhoneAssignments;
                               touch.haveUrlAssignments=requestBodyObject.data.haveUrlAssignments;
                               touch.haveOperationAssigned=requestBodyObject.data.haveOperationAssigned;                                          
                               touch.save(); 
                               var touchId= touch.id;
                       
                    if(requestBodyObject.data.haveSegments == "0"){                                 // creating default segment when didn't opt for segment while touch creation
                            var segment=meta.segment.create();
                                        segment.segmentName=requestBodyObject.data.touchName;
                                        segment.touchId=touchId;
                                        segment.save();
                                        dSegmentId=segment.id;
                         } 
                         
                         var tOperationId=0;
                         if(requestBodyObject.data.haveOperationAssigned == "1"){  
                            //logInfo(" inside haveOperationAssigned:");                                               
                            tOperationId=createTouchTemplate(requestBodyObject,touchId);                   //calling createTouchTemplate function
                            logMessage(tOperationId,debugFlag)                        
                         }           
                               var responseObject={};
                               responseObject.methodName=requestBodyObject.methodName;
                               
                               var queryData= xtk.queryDef.create(
                                <queryDef schema="meta:touch" operation="select">
                                  <select>                            
                                    <node expr="@touchCode"/>
                                    <node expr="@touchName"/>
                                    <node expr="@touchDescription"/>
                                    <node expr="@channelId"/>
                                    <node expr="@mailFileDueDate"/>
                                    <node expr="@estimatedDropDate"/>
                                    <node expr="@touchStartDate"/>
                                    <node expr="@touchEndDate"/> 
                                    <node expr="@haveSegments"/>
                                    <node expr="@havePhoneAssignments"/> 
                                    <node expr="@haveUrlAssignments"/> 
                                    <node expr="@haveOperationAssigned"/>                                                  
                                  </select>
                                  <where>
                                    <condition expr={"@id='"+touchId+"'"}/>
                                  </where>
                                 </queryDef>);
                                 
                                  var data=queryData.ExecuteQuery();
                                  var metadata={};
                                  metadata.campaignId=requestBodyObject.data.campaignId;
                                  metadata.segmentId=dSegmentId;
                                  for each(var ada in data){                                         // preparing JSON response
                                    metadata.touchId=touchId.toString();
                                    metadata.touchCode=ada.@touchCode.toString();
                                    metadata.touchName=ada.@touchName.toString();
                                    metadata.touchDescription=ada.@touchDescription.toString();
                                    metadata.channelId=ada.@channelId.toString();
                                    metadata.mailFileDueDate=ada.@mailFileDueDate.toString();
                                    metadata.estimatedDropDate=ada.@estimatedDropDate.toString();
                                    metadata.touchStartDate=ada.@touchStartDate.toString();
                                    metadata.touchEndDate=ada.@touchEndDate.toString();
                                    metadata.haveSegments=ada.@haveSegments.toString();
                                    metadata.havePhoneAssignments=ada.@havePhoneAssignments.toString();
                                    metadata.haveUrlAssignments=ada.@haveUrlAssignments.toString();
                                    metadata.haveOperationAssigned=ada.@haveOperationAssigned.toString();                      
                                  }                         
                                 responseObject.data=metadata;
                          return JSON.stringify(responseObject);
                  }
                  catch(error){
                      return executeResult(300,"Error in creating touch record- "+ error + " "+ error.message + ' - ' + error.name ,"Fail");
                  }
           
              
           }
     }
     
// ******************************************** Update Touch ***************************************************************************// 

      function updateTouch(requestBodyObject){     
       
            if(JSON.stringify(requestBodyObject.data) == '{}'){
                    return executeResult(300,"Error in request payload data" ,"Fail");
             }
             else{
                        try{  
                           var responseObject={};
                           responseObject.methodName=requestBodyObject.methodName;
                           var table="touch";
                           var schemaName="meta:touch";
                           
                           //@@ checking haveSegmentDelete flag for generic segment creation
                           if(requestBodyObject.data.haveSegmentDelete=="1"){
                           
                                 //@@ creating generic segment 
                                 var segment=meta.segment.create();
                                            segment.segmentName=requestBodyObject.data.touchName;
                                            segment.touchId=requestBodyObject.data.touchId;
                                            segment.save();
                                 var SegmentId=segment.id;
                                 
                                 //@@ updating touch details
                                xtk.session.Write(<{table} xtkschema={schemaName} _operation="update"  _key="@id" id={requestBodyObject.data.touchId} touchName={requestBodyObject.data.touchName} touchDescription={requestBodyObject.data.touchDescription} channelId={requestBodyObject.data.channelId} mailFileDueDate={requestBodyObject.data.mailFileDueDate} estimatedDropDate={requestBodyObject.data.estimatedDropDate} touchStartDate={requestBodyObject.data.touchStartDate} touchEndDate={requestBodyObject.data.touchEndDate} haveSegments={requestBodyObject.data.haveSegments} havePhoneAssignments={requestBodyObject.data.havePhoneAssignments} haveUrlAssignments={requestBodyObject.data.haveUrlAssignments} haveOperationAssigned={requestBodyObject.data.haveOperationAssigned} campaignWorkflowTemplate={requestBodyObject.data.campaignWorkflowTemplate}></{table}>);
                                 
                                 
                                 var data=[];
                                 var segResponse={};
                                 segResponse.segmentId=SegmentId; 
                                 responseObject.data=segResponse;
                                 
                                 //@@ return segmentId
                                 return JSON.stringify(responseObject);         
                                        
                           }
                           else{
                            xtk.session.Write(<{table} xtkschema={schemaName} _operation="update"  _key="@id" id={requestBodyObject.data.touchId} touchName={requestBodyObject.data.touchName} touchDescription={requestBodyObject.data.touchDescription} channelId={requestBodyObject.data.channelId} mailFileDueDate={requestBodyObject.data.mailFileDueDate} estimatedDropDate={requestBodyObject.data.estimatedDropDate} touchStartDate={requestBodyObject.data.touchStartDate} touchEndDate={requestBodyObject.data.touchEndDate} haveSegments={requestBodyObject.data.haveSegments} havePhoneAssignments={requestBodyObject.data.havePhoneAssignments} haveUrlAssignments={requestBodyObject.data.haveUrlAssignments} haveOperationAssigned={requestBodyObject.data.haveOperationAssigned} campaignWorkflowTemplate={requestBodyObject.data.campaignWorkflowTemplate}></{table}>);
                            return executeResult(200,"Touch of id "+requestBodyObject.data.touchId+" updated successfully " ,"Success");
                           }
                        }
                        catch(error){
                           return executeResult(300,"Error in updating touch record- "+ error + " "+ error.message + ' - ' + error.name ,"Fail");
                        }
             }  
  
      }
     
// ******************************************** Delete Touch ***************************************************************************// 


    function deleteTouch(requestBodyObject){
            
                if(JSON.stringify(requestBodyObject.data) == '{}'){
                  return executeResult(300,"Error in request payload data" ,"Fail");
                } 
                else { 
                    try{
                          var query = xtk.queryDef.create(
                                      <queryDef schema="meta:touch" operation="get">
                                        <select> 
                                            <node expr="@id"/>    
                                        </select>
                                        <where>
                                           <condition expr={"@id ='"+requestBodyObject.data.touchId+"'"}/>
                                         </where>                                                
                                      </queryDef>);                                
                          var queryData=query.ExecuteQuery();
                          
                          var segmentIdArr= getSegmentInformation(requestBodyObject.data.touchId);
                          
                          for(var i=0; i<segmentIdArr.length;i++){
                          if(getSegmentIdFromPhoneNumberAssignmnet (segmentIdArr[i])>0){
                            //@@ mark delete phoneNumber Assignment record first
                            xtk.session.Write(<phoneNumberAssignment xtkschema="meta:phoneNumberAssignment" _operation="update" _key="@segmentId" segmentId={segmentIdArr[i]} isMarkDeleted="1"> </phoneNumberAssignment>);        
                            var phoneNumberId=getPhoneNumberIdFromSegmentId (segmentIdArr[i]);
                            updateReleaseDate(phoneNumberId);
                             }
                             //@@ check for segmentId in segmentAssignment table
                                    var jobCount= xtk.queryDef.create(
                                            <queryDef schema="meta:segmentAssignment" operation="get">
                                              <select>
                                                <node expr="Count(@id)" alias="@countId"/>
                                              </select>                                    
                                              <where>
                                                 <condition expr={"@segmentId ='"+segmentIdArr[i]+"'"}/>
                                               </where>                                                                                     
                                            </queryDef>);
                                     var sSACount=parseInt(jobCount.ExecuteQuery().@countId);
                             if(sSACount>0){
                             //@@ delete segmnetAssignment record 
                             xtk.session.Write(<segmentAssignment xtkschema="meta:segmentAssignment" _operation="update" _key="@segmentId" segmentId={segmentIdArr[i]} isMarkDeleted="1"> </segmentAssignment>);  
                             }
                             //@@ check for segmentId in segment table
                                    var jobCount= xtk.queryDef.create(
                                            <queryDef schema="meta:segment" operation="get">
                                              <select>
                                                <node expr="Count(@id)" alias="@countId"/>
                                              </select>                                    
                                              <where>
                                                 <condition expr={"@id ='"+segmentIdArr[i]+"'"}/>
                                               </where>                                                                                     
                                            </queryDef>);
                                     var sSCount=parseInt(jobCount.ExecuteQuery().@countId);
                             if(sSCount>0){
                             //@@ delete segmnet record 
                             xtk.session.Write(<segment xtkschema="meta:segment" _operation="update" _key="@id" id={segmentIdArr[i]} isMarkDeleted="1"> </segment>); 
                             }                                                   
                          }
                    
                          xtk.session.Write(<touch xtkschema="meta:touch" _operation="update" _key="@id" id={requestBodyObject.data.touchId} isMarkDeleted="1"> </touch>);                                              // delete touch record
                          return executeResult(200,"Request of Id:"+ requestBodyObject.data.touchId +" deleted successfully.","Success");
                    }
                    catch(error){   
                          return executeResult(300,"Error in deleting touch record- "+ error + " "+ error.message + ' - ' + error.name ,"Fail");
                          }
             }
    }
    

// ******************************************** Update Touch Status ***************************************************************************// 
    
    
    function updateTouchStatus(requestBodyObject){
  
        if(JSON.stringify(requestBodyObject.data) == '{}'){
                  return executeResult(300,"Error in request payload data" ,"Fail");
        }
        else{
              try{
                  xtk.session.Write(<touch xtkschema="meta:touch" _operation="update" _key="@id" id={requestBodyObject.data.touchId} status={requestBodyObject.data.touchStatus}> </touch>);
                  
                   //@@ querying touch data
                           var queryData= xtk.queryDef.create(
                              <queryDef schema="meta:touch" operation="select">
                                <select>
                                  <node expr="@campaignId"/>                                   
                                  <node expr="@touchName"/>
                                  <node expr="[campaign/@campaignName]" alias="@campaignName"/>   
                                  <node expr="[campaign/initiative/@name]" alias="@initiativeName"/>                                                                                       
                                </select>                                                      
                                <where>                                                          
                                  <condition expr={"@id = '"+requestBodyObject.data.touchId+"'"}/>                            
                                </where>                             
                               </queryDef>);
                           
                           var touchData=queryData.ExecuteQuery(); 
                           var initiativeName=touchData.touch.@initiativeName.toString();
                           var campaignName=touchData.touch.@campaignName.toString();
                           var touchName=touchData.touch.@touchName.toString();                           
                           var currentDate=formatDate(new Date(),"%4Y-%2M-%2D %02H:%02N:%02S");
                           var requestSubmitter=getOperator();
                           var campaignId=touchData.touch.@campaignId.toString();
                 
                 if(requestBodyObject.data.touchStatus == "Approved"){
                  createRequestNotification("",campaignId,"Campaign Manager","Notification","0","","Touch approved","Touch - "+touchName+" for Campaign - "+initiativeName+":"+campaignName+" is Approved.",currentDate,requestSubmitter,"Pending",requestBodyObject.data.touchId,"","close","touch");
                  updateRequestNotification("",campaignId,"Campaign Reviewer","Notification","0","","Touch approved","Touch - "+touchName+" for Campaign - "+initiativeName+":"+campaignName+" is Approved.",currentDate,requestSubmitter,"Pending",requestBodyObject.data.touchId,"","close","touch");
                                   
                 }
                 if(requestBodyObject.data.touchStatus == "Needs Review"){
                  createRequestNotification("",campaignId,"Campaign Manager","Notification","0","","Touch under review","Touch - "+touchName+" for Campaign - "+initiativeName+":"+campaignName+" marked for Review. ",currentDate,requestSubmitter,"Pending",requestBodyObject.data.touchId,"","close","touch");
                  updateRequestNotification("",campaignId,"Campaign Reviewer","Warning","1","Review","Touch under review","Touch - "+touchName+" for Campaign - "+initiativeName+":"+campaignName+" marked for Review. Please Approve.",currentDate,requestSubmitter,"Pending",requestBodyObject.data.touchId,"","open","touch");
                }   
                              
                           
                  
                  
                  return executeResult(200,"Touch of Id:"+ requestBodyObject.data.touchId +" updated successfully.","Success"); 
              }
              catch(error){
                  return executeResult(300,"Error in updating touch record- "+ error + " "+ error.message + ' - ' + error.name ,"Fail");
              }
        }

    }   
    
// ******************************************** reinitialize Phone Assignment ***************************************************************************//     
    
