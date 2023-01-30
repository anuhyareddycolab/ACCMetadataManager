loadLibrary("meta:common.js");  


// ******************************************** Create Segment ***************************************************************************// 


    function createSegment(requestBodyObject){
        if(JSON.stringify(requestBodyObject.data) == '{}'){                                  // validating request payload data
                  return executeResult(300,"Error in request payload data" ,"Fail");
           }
           else{
              try{
                var segment= meta.segment.create();                                          // creating segment schema record
                             segment.touchId=requestBodyObject.data.touchId;
                             segment.segmentName=requestBodyObject.data.segmentName;
                             segment.save();
                    
                    var segmentId= segment.id;
                    
                    var responseObject={};
                    responseObject.methodName=requestBodyObject.methodName;                  // querying segment records after successfull record creation 
                    var queryData= xtk.queryDef.create(
                        <queryDef schema="meta:segment" operation="select">
                          <select>
                            <node expr="@segmentName"/>
                            <node expr="@segmentCode"/>
                          </select>
                          <where>
                            <condition expr={" @id='"+segmentId+"'"}/>
                          </where>
                        </queryDef>);
                    var segmentData= queryData.ExecuteQuery();
                    var responseData={};                                                     // preparing JSON response data for API
                    responseData.segmentId=segmentId; 
                    responseData.touchId=requestBodyObject.data.touchId;
                    
                    for each(var ada in segmentData){
                    responseData.segmentName=ada.@segmentName.toString();
                    responseData.segmentCode=ada.@segmentCode.toString();
                    }
                    
                responseObject.data=responseData;
                return JSON.stringify(responseObject);
              }
              catch(error){              
                return executeResult(300,"Error in creating segment record- "+ error + " "+ error.message + ' - ' + error.name ,"Fail");
              }
           
           } 
    }
    
    
// ******************************************** Delete Segment ***************************************************************************// 


    function deleteSegment(requestBodyObject)
    {
      if(JSON.stringify(requestBodyObject.data) == '{}'){
                  return executeResult(300,"Error in request payload data" ,"Fail");                             // validating request payload data
                } 
                else { 
                    try{
                          var queryData= xtk.queryDef.create(
                                         <queryDef schema="meta:segment" operation="get">
                                          <select>
                                            <node expr="@id"/>                                          
                                          </select>
                                          <where>
                                            <condition expr={" @id='"+requestBodyObject.data.segmentId+"'"}/>
                                          </where>
                                         </queryDef>);
                          var segmentData=queryData.ExecuteQuery();
                          
                          xtk.session.Write(<segment xtkschema="meta:segment" _operation="update" _key="@id" id={requestBodyObject.data.segmentId} isMarkDeleted="1"></segment>);
                          return executeResult(200,"Request of Id:"+ requestBodyObject.data.segmentId +" deleted successfully.","Success");
                    }
                    catch(error){   
                          return executeResult(300,"Error in deleting segment record- "+ error + " "+ error.message + ' - ' + error.name ,"Fail");
                          }
             }
    
    }



// ******************************************** Create Segment Assignment***************************************************************************// 

  
    function createSegmentAssignment(requestBodyObject)
    {
      var xmlToWrite=<segmentAssignment xtkschema="meta:segmentAssignment"/>;                                        // Xml collection
      if(JSON.stringify(requestBodyObject.data) == '{}'){
                      return executeResult(300,"Error in request payload data" ,"Fail");                             // validating request payload data
                    } 
                    else { 
                        try{
                              
                              for(var i=0;i<requestBodyObject.data.segmentsAssignment.length;i++){                          
                               var segmentId = requestBodyObject.data.segmentsAssignment[i].segmentId;                           
                               var languageId=requestBodyObject.data.segmentsAssignment[i].segmentLanguageId;                         
                               var phoneNumberId=requestBodyObject.data.segmentsAssignment[i].segmentPhoneNumberId;
                               var urlLink=requestBodyObject.data.segmentsAssignment[i].urlLink;                         
                                 
                               xmlToWrite.appendChild(<segmentAssignment xtkschema="meta:segmentAssignment" _operation="insert"  segmentId={segmentId}   phoneNumberId={phoneNumberId} urlLink={urlLink} languageId={languageId}></segmentAssignment>);
                             }                          
                              xtk.session.WriteCollection(xmlToWrite);
                              return executeResult(200,"Segment Assignment requests are created successfully.","Success");
                        }
                        catch(error){   
                              return executeResult(300,"Error in creating segment assignment record- "+ error + " "+ error.message + ' - ' + error.name ,"Fail");
                              }
                 }
    
    }


// ******************************************** Update Segment Assignment***************************************************************************// 


      function updateSegmentAssignment(requestBodyObject)
      {
        var xmlToWrite=<segmentAssignment xtkschema="meta:segmentAssignment"/>;                                        // Xml collection
        if(JSON.stringify(requestBodyObject.data) == '{}'){
                        return executeResult(300,"Error in request payload data" ,"Fail");                             // validating request payload data
         } 
         else { 
              try{
                                
                  for(var i=0;i<requestBodyObject.data.segmentsAssignment.length;i++){                          
                    var segmentId = requestBodyObject.data.segmentsAssignment[i].segmentId;                           
                    var languageId=requestBodyObject.data.segmentsAssignment[i].segmentLanguageId;                         
                    var phoneNumberId=requestBodyObject.data.segmentsAssignment[i].segmentPhoneNumberId;
                    var urlLink=requestBodyObject.data.segmentsAssignment[i].urlLink;
                    var segmentAssignmentId=requestBodyObject.data.segmentsAssignment[i].segmentAssignmentId;                         
                                   
                    xmlToWrite.appendChild(<segmentAssignment xtkschema="meta:segmentAssignment" _operation="update" _key="@id" id={segmentAssignmentId}  segmentId={segmentId}   phoneNumberId={phoneNumberId} urlLink={urlLink} languageId={languageId}></segmentAssignment>);
                   }                          
                    xtk.session.WriteCollection(xmlToWrite);
                    return executeResult(200,"Segment Assignment requests are updated successfully.","Success");
               }
               catch(error){   
                    return executeResult(300,"Error in updating segment assignment record- "+ error + " "+ error.message + ' - ' + error.name ,"Fail");
               }
         }
      
       }
