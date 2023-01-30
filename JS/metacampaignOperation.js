loadLibrary("meta:common.js"); 
 

// ***************************************************** Create Campaign Calling function definition **********************************************************// 


       function createCampaignTemplate(requestBodyObject,campaignId){
          try{
              var folderPath=getOption("metaCampaignTemplateFolder");
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
                             logMessage(folderId,debugFlag)
                             
                             
               var templateName=getOption("metaCampaignTemplateName"); 
               var queryData= xtk.queryDef.create(
                            <queryDef schema="nms:operation" operation="select">
                              <select>
                                <node expr="@id"/>
                              </select>
                              <where>
                                <condition expr={"@label = '"+templateName+"'"}/>
                              </where>
                             </queryDef>);
                             
               var templateData= queryData.ExecuteQuery(); 
               var templateId= templateData.operation.@id;
              
               
               var operation = nms.operation.create();
                             operation.DuplicateTo("nms:operation|"+templateId+"","xtk:folder|"+folderId+"");
                             operation.label=requestBodyObject.data.campaignName; 
                             operation.metaInitiativeId=requestBodyObject.data.initiativeId;
                             operation.metaLobId=requestBodyObject.data.lobId;
                             operation.metaBrandId=requestBodyObject.data.brandId;
                             operation.start=requestBodyObject.data.campaignStartDate;
                             operation.end=requestBodyObject.data.campaignEndDate;                          
                             operation.metaCampaignId=campaignId;                                      
                             operation.save(); 
                             return operation.id; 
                              
                       
            }
            catch(error){
              return executeResult(300,"Error in creating campaign template- "+ error + " "+ error.message + ' - ' + error.name ,"Fail");
            }           
       }
 
 
// *****************************************************Create Campaign **********************************************************// 

   
 
     function createCampaign(requestBodyObject){
     
       if(JSON.stringify(requestBodyObject.data) == '{}'){
              return executeResult(300,"Error in request payload data" ,"Fail");
       }
       else{
                  try{  
                     var campaignId;              
                     var campaign=meta.campaign.create();                      
                           campaign.campaignName=requestBodyObject.data.campaignName; 
                           campaign.campaignDescription=requestBodyObject.data.campaignDescription;
                           campaign.initiativeId=requestBodyObject.data.initiativeId;
                           campaign.lobId=requestBodyObject.data.lobId;
                           campaign.brandId=requestBodyObject.data.brandId;
                           campaign.campaignStartDate=requestBodyObject.data.campaignStartDate;
                           campaign.campaignendDate=requestBodyObject.data.campaignEndDate;  
                           campaign.campaignTemplate=requestBodyObject.data.campaignTemplate;                                      
                           campaign.save();
                           campaignId=campaign.id;
                           
                     
                     if(requestBodyObject.data.campaignTemplate == "1"){
                        
                        if(getOption("metaCampaignTemplateCreationFlag") == "1"){
                          operationId=createCampaignTemplate(requestBodyObject,campaignId);
                          logMessage(operationId,debugFlag)
                        }
                        
                     }       
                                                 
                           var responseObject={};
                           responseObject.methodName=requestBodyObject.methodName;
                           var queryData= xtk.queryDef.create(
                            <queryDef schema="meta:campaign" operation="select">
                              <select>
                                <node expr="@id"/>
                                <node expr="@campaignCode"/>
                                <node expr="@campaignName"/>
                                <node expr="@campaignDescription"/>
                                <node expr="@initiativeId"/>
                                <node expr="@lobId"/>
                                <node expr="@brandId"/>
                                <node expr="@campaignStartDate"/>
                                <node expr="@campaignendDate"/>
                                <node expr="@campaignTemplate"/>
                              </select>
                              <where>
                                <condition expr={"@id='"+campaign.id+"'"}/>
                              </where>
                             </queryDef>);
                              var data=queryData.ExecuteQuery();
                              var metadata={};
                              for each(var ada in data){                           
                                metadata.campaignId=ada.@id.toString();
                                metadata.campaignCode=ada.@campaignCode.toString();
                                metadata.campaignName=ada.@campaignName.toString();
                                metadata.campaignDescription=ada.@campaignDescription.toString();
                                metadata.initiativeId=ada.@initiativeId.toString();
                                metadata.lobId=ada.@lobId.toString();
                                metadata.brandId=ada.@brandId.toString();
                                metadata.campaignStartDate=ada.@campaignStartDate.toString();
                                metadata.campaignendDate=ada.@campaignendDate.toString();
                                metadata.campaignTemplate=ada.@campaignTemplate.toString();
                              }
                             responseObject.data=metadata;                       
                     
                      return JSON.stringify(responseObject);
                  }
                  catch(error){
                     return executeResult(300,"Error in creating campaign record- "+ error + " "+ error.message + ' - ' + error.name ,"Fail");
                  }
       }
       
     }
 

// *******************************************************Edit Campaign ************************************************************//

 
     function updateCampaign(requestBodyObject){
     
          if(JSON.stringify(requestBodyObject.data) == '{}'){
                  return executeResult(300,"Error in request payload data" ,"Fail");
           }
           else{
                      try{  
                       
                         var table="campaign";
                         var schemaName="meta:campaign";
                         xtk.session.Write(<{table} xtkschema={schemaName} _operation="update"  _key="@id" id={requestBodyObject.data.campaignId} campaignName={requestBodyObject.data.campaignName} campaignDescription={requestBodyObject.data.campaignDescription} initiativeId={requestBodyObject.data.initiativeId} lobId={requestBodyObject.data.lobId} brandId={requestBodyObject.data.brandId} campaignStartDate={requestBodyObject.data.campaignStartDate} campaignendDate={requestBodyObject.data.campaignEndDate}></{table}>);
                       //  return executeResult(200,"Campaign of id "+requestBodyObject.data.campaignId+" updated successfully " ,"Success");
                         
                         var responseObject={};
                           responseObject.methodName=requestBodyObject.methodName;
                           var queryData= xtk.queryDef.create(
                            <queryDef schema="meta:campaign" operation="select">
                              <select>
                                <node expr="@id"/>
                                <node expr="@campaignCode"/>
                                <node expr="@campaignName"/>
                                <node expr="@campaignDescription"/>
                                <node expr="@initiativeId"/>
                                <node expr="@lobId"/>
                                <node expr="@brandId"/>
                                <node expr="@campaignStartDate"/>
                                <node expr="@campaignendDate"/>
                              </select>
                              <where>
                                <condition expr={"@id='"+requestBodyObject.data.campaignId+"'"}/>
                              </where>
                             </queryDef>);
                              var data=queryData.ExecuteQuery();
                              var metadata={};
                              for each(var ada in data){                           
                                metadata.campaignId=ada.@id.toString();
                                metadata.campaignCode=ada.@campaignCode.toString();
                                metadata.campaignName=ada.@campaignName.toString();
                                metadata.campaignDescription=ada.@campaignDescription.toString();
                                metadata.initiativeId=ada.@initiativeId.toString();
                                metadata.lobId=ada.@lobId.toString();
                                metadata.brandId=ada.@brandId.toString();
                                metadata.campaignStartDate=ada.@campaignStartDate.toString();
                                metadata.campaignendDate=ada.@campaignendDate.toString();
                              }
                             responseObject.data=metadata;                       
                     
                      return JSON.stringify(responseObject);
                         
                         
                      }
                      catch(error){
                         return executeResult(300,"Error in updating campaign record- "+ error + " "+ error.message + ' - ' + error.name ,"Fail");
                      }
           }
     
     }
     
 
// *******************************************************Delete Campaign ************************************************************//


    function deleteCampaign(requestBodyObject){
            
                if(JSON.stringify(requestBodyObject.data) == '{}'){
                  return executeResult(300,"Error in request payload data" ,"Fail");
                } 
                else { 
                    try{
                          var query = xtk.queryDef.create(
                                      <queryDef schema="meta:campaign" operation="get">
                                        <select> 
                                            <node expr="@id"/>    
                                        </select>
                                        <where>
                                           <condition expr={"@id ='"+requestBodyObject.data.campaignId+"'"}/>
                                         </where>                                                
                                      </queryDef>);                                
                          var queryData=query.ExecuteQuery();
                    
                          xtk.session.Write(<campaign xtkschema="meta:campaign" _operation="update" _key="@id" id={requestBodyObject.data.campaignId} isMarkDeleted="1"> </campaign>);
                          return executeResult(200,"Request of Id:"+ requestBodyObject.data.campaignId +" deleted successfully.","Success");
                    }
                    catch(error){   
                          return executeResult(300,"Error in deleting touch record- "+ error + " "+ error.message + ' - ' + error.name ,"Fail");
                          }
             }
    }
 
 
 
