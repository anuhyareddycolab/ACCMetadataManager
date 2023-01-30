loadLibrary("meta:common.js");  

<<<<<<< HEAD
=======
// ******************************************** Create Touch Template function calling definition ***************************************************************************// 


>>>>>>> Krishna-Gupta
    function createTouchTemplate(requestBodyObject){
        try{
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
                              <node expr="@operationtemplateId"/>
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
           var templateId= data.campaign.@operationtemplateId;
           var campaignName= data.campaign.@campaignName;
           var lobId= data.campaign.@lobId;       
           var brandId=data.campaign.@brandId;        
           var initiativeId=data.campaign.@initiativeId;      
           var campaignStartDate= data.campaign.@campaignStartDate;
           var campaignEndDate=data.campaign.@campaignendDate;
        
           var operation = nms.operation.create();
                             operation.DuplicateTo("nms:operation|"+templateId+"","xtk:folder|"+folderId+""); 
                             operation.label=campaignName; 
                             operation.initiativeId=initiativeId;
                             operation.lobId=lobId;
                             operation.brandId=brandId;
                             operation.start=campaignStartDate;
                             operation.end=campaignEndDate;                                     
                           operation.save(); 
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
              
                    var tOperationId=0; 
                         if(requestBodyObject.data.campaignWorkflowTemplate == "1"){                     
                            tOperationId=createTouchTemplate(requestBodyObject);                   //calling createTouchTemplate function
                            logMessage(tOperationId,debugFlag)                        
                         }              
                  
                    var touch=meta.touch.create();                                                // writing data in touch schema
                               touch.campaignId=requestBodyObject.data.campaignId;                     
                               touch.touchName=requestBodyObject.data.touchName; 
                               touch.touchDescription=requestBodyObject.data.touchDescription;
                               touch.channelId=requestBodyObject.data.channelId;
                               touch.mailFileDueDate=requestBodyObject.data.mailFileDueDate;
                               touch.estimatedDropDate=requestBodyObject.data.estimatedDropDate;
                               touch.touchStartDate=requestBodyObject.data.touchStartDate;
                               touch.touchEndDate=requestBodyObject.data.touchEndDate; 
                               touch.operationId=tOperationId; 
                               touch.haveSegments=requestBodyObject.data.haveSegments; 
                               touch.havePhoneAssignments=requestBodyObject.data.havePhoneAssignments;
                               touch.haveUrlAssignments=requestBodyObject.data.haveUrlAssignments;
                               touch.haveOperationAssigned=requestBodyObject.data.haveOperationAssigned;                                          
                               touch.save(); 
                               var touchId= touch.id;
                               
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
     
<<<<<<< HEAD
=======
// ******************************************** Update Touch ***************************************************************************// 

      function updateTouch(requestBodyObject){     
       
            if(JSON.stringify(requestBodyObject.data) == '{}'){
                    return executeResult(300,"Error in request payload data" ,"Fail");
             }
             else{
                        try{  
                         
                           var table="touch";
                           var schemaName="meta:touch";
                           xtk.session.Write(<{table} xtkschema={schemaName} _operation="update"  _key="@id" id={requestBodyObject.data.touchId} touchName={requestBodyObject.data.touchName} touchDescription={requestBodyObject.data.touchDescription} channelId={requestBodyObject.data.channelId} mailFileDueDate={requestBodyObject.data.mailFileDueDate} estimatedDropDate={requestBodyObject.data.estimatedDropDate} touchStartDate={requestBodyObject.data.touchStartDate} touchEndDate={requestBodyObject.data.touchEndDate} haveSegments={requestBodyObject.data.haveSegments} havePhoneAssignments={requestBodyObject.data.havePhoneAssignments} haveUrlAssignments={requestBodyObject.data.haveUrlAssignments} haveOperationAssigned={requestBodyObject.data.haveOperationAssigned} campaignWorkflowTemplate={requestBodyObject.data.campaignWorkflowTemplate}></{table}>);
                           return executeResult(200,"Touch of id "+requestBodyObject.data.touchId+" updated successfully " ,"Success");
                        }
                        catch(error){
                           return executeResult(300,"Error in updating touch record- "+ error + " "+ error.message + ' - ' + error.name ,"Fail");
                        }
             }  
  
      } 
     
>>>>>>> Krishna-Gupta
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
                    
                          xtk.session.Write(<touch xtkschema="meta:touch" _operation="update" _key="@id" id={requestBodyObject.data.touchId} isMarkDeleted="1"> </touch>);
                          return executeResult(200,"Request of Id:"+ requestBodyObject.data.touchId +" deleted successfully.","Success");
                    }
                    catch(error){   
                          return executeResult(300,"Error in deleting touch record- "+ error + " "+ error.message + ' - ' + error.name ,"Fail");
                          }
             }
<<<<<<< HEAD
}
=======
    }
>>>>>>> Krishna-Gupta
