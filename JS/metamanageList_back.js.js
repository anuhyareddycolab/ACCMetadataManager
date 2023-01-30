loadLibrary("meta:common_Back.js");  


 function getMetaLists(category){
                  try{
                        var schemaname="meta:"+category;
                        
                        logInfo("schemaname :"+schemaname);              
                        var metalistJson={};
                        var query = xtk.queryDef.create(
                          <queryDef schema={schemaname} operation="select">
                            <select>        
                                <node expr="@id"/> 
                                <node expr="@name"/> 
                                <node expr="@positionNumber"/> 
                                <node expr="@isArchived"/>                                     
                            </select>                            
                            <orderBy>                              
                              <node expr="@id" />                                       
                            </orderBy>                                                
                          </queryDef>);
                    
                        var queryData=query.ExecuteQuery();
                        var data=[];
                   
                        for each(var ada in queryData){
                        var metaJson={};
                            metaJson.Name=ada.@name.toString(); 
                            metaJson.PositionNumber=ada.@positionNumber.toString();                       
                            metaJson.isArchived=ada.@isArchived.toString();  
                            data.push(metaJson);                             
                        }
                     metalistJson.name=category;
                     metalistJson.data=data;
                     return metalistJson;
                     }
                     catch(error){
                       return executeResult(300,"Error in reading manage list- "+ error + " "+ error.message + ' - ' + error.name ,"Fail");
                     }
                     
 }
 
     function createManageMetaList(requestBodyObject)
    {
    
          if(JSON.stringify(requestBodyObject.data) == '{}'){
          return executeResult(300,"Error in request payload data" ,"Fail");
          }
          else{
          
              try{
                  var methodName=requestBodyObject.methodName;
                  logMessage(methodName,debugFlag);
                  var schemaName="";
                  var table="";
                  if(methodName=="createInitiative"){
                  schemaName="meta:initiative";
                  table="initiative";
                  }
                  else if(methodName=="createChannel")
                  {
                   schemaName="meta:channel";
                   table="channel";
                  }
                  else if(methodName=="createBrand")
                  {
                   schemaName="meta:brand";
                   table="brand";
                  }
                  else if(methodName=="createLOB")
                  {
                   schemaName="meta:lineOfBusiness";
                   table="lineOfBusiness";
                  }
                  else if(methodName=="createLanguage")
                  {
                   schemaName="meta:language";
                   table="language";
                  }
                  logMessage(schemaName,debugFlag);
                  logMessage(table,debugFlag);
                  
                  xtk.session.Write(<{table} xtkschema={schemaName} _operation="insert"  name={requestBodyObject.data.name} ></{table}>);
                  return executeResult(200,"Record of "+schemaName+" created successfully " ,"Success");
              }
              catch(error){
                  return executeResult(300,"Error in creating manage meta list category "+ error + " "+ error.message + ' - ' + error.name ,"Fail");
              }
          
          }
    }
    
    
    function updateManageMetaList(requestBodyObject)
{

if(JSON.stringify(requestBodyObject.data) == '{}'){
return executeResult(300,"Error in request payload data" ,"Fail");
}
else{

  try{
  var methodName=requestBodyObject.methodName;
  logMessage(methodName,debugFlag);
  var schemaName="";
  var table="";
  if(methodName=="updateInitiative"){
  schemaName="meta:initiative";
  table="initiative";
  }
  else if(methodName=="updateChannel")
  {
   schemaName="meta:channel";
   table="channel";
  }
  else if(methodName=="updateBrand")
  {
   schemaName="meta:brand";
   table="brand";
  }
  else if(methodName=="updateLOB")
  {
   schemaName="meta:lineOfBusiness";
   table="lineOfBusiness";
  }
  else if(methodName=="updateLanguage")
  {
   schemaName="meta:language";
   table="language";
  }
  logMessage(schemaName,debugFlag);
  logMessage(table,debugFlag);
  
  xtk.session.Write(<{table} xtkschema={schemaName} _operation="update"  _key="@name" name={requestBodyObject.data.name} positionNumber={requestBodyObject.data.positionNumber} isArchived={requestBodyObject.data.isArchived}></{table}>);
  return executeResult(200,""+schemaName+" of is  updated successfully " ,"Success");
  }
  catch(error){
  return executeResult(300,""+schemaName+" Error in update manage meta list category "+ error + " "+ error.message + ' - ' + error.name ,"Fail");
  }

}
}
