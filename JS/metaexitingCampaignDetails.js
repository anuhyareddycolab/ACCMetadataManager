     loadLibrary("/nl/core/shared/nl.js");
loadLibrary('xtk:common.js');

NL.require('/nl/core/shared/xtk.js')
  .require('/nl/core/schema.js')
  .require('/nl/core/shared/json2.js')
  .require('/nl/core/sql.js')
  .require('/nl/core/shared/js.js');
 
 var cmpCol="</campaign-collection>";
  var touchCol="</touch-collection>";
  var segmentCol="</segment-collection>";
  var segAssociateCol="</segmentAssignment_collection>";
 function getcampaignDetails(requestBodyObject){
   var finalresultString='';
   isMultiCampaign = 'no';
  isSingleTouch='no';
  isSingleCampaign='no';
  
 if(JSON.stringify(requestBodyObject.data) == '{}'){
          return executeResult(300,"Error in request payload data" ,"Fail");
          }
  else{
  // logInfo("campaigns inside############ before _____getcampaignDetails "+ "isMultiCampaign"+isMultiCampaign+"isSingleCampaign"+isSingleCampaign);        
 try{
  if(requestBodyObject.data.multiCampaign == "yes" ){
  isMultiCampaign = 'yes';
 }
 else {
 isMultiCampaign = 'no';
 }
 if(requestBodyObject.data.touchId !=null ){
  isSingleTouch = 'yes';
 }
  else {
 isSingleTouch = 'no';
 }
  if(requestBodyObject.data.campaignId !=null ){
  isSingleCampaign = 'yes';
 }
 else{
  isSingleCampaign = 'no';
 }
// logInfo("campaigns inside############ after _____getcampaignDetails "+ "isMultiCampaign"+isMultiCampaign+"isSingleCampaign"+isSingleCampaign);
 if(isMultiCampaign == 'yes' && isSingleCampaign == 'no' ){
  var campaignQuery= xtk.queryDef.create(
                      <queryDef schema="meta:campaign"  operation="select"  >
                        <select>
                          <node expr="@id"/>                                             
                        </select>
             <where>             
                         
              <condition  expr={"@isMarkDeleted = 0" }/>
                        </where>
            <orderBy>
                        <node expr="@lastModified" sortDesc="true"/>
                       </orderBy>
                       </queryDef>);
       var campaigndata= campaignQuery.ExecuteQuery();

        for each(var campaign in campaigndata){ 
                              
   // var segmentName =segment.@segmentName.toString();
      var campaignId =campaign.@id.toString();
          
         finalresultString=finalresultString+getCampaignInfo(campaignId,requestBodyObject);   
    // // logInfo("multi    finalresultString*******"+finalresultString);
      }       
 finalresultString='<multiCampaigns>'+finalresultString+'</multiCampaigns>'; 
 //finalresultString=' '+finalresultString+''; 

 }
 else{
 
 var campaignId=requestBodyObject.data.campaignId;
    finalresultString=getCampaignInfo(campaignId,requestBodyObject);
  //// logInfo(" single finalresultString*******"+finalresultString);
 }
   var finalJson=jsonString(finalresultString);
   //// logInfo("finalJson"+finalJson);
   return finalJson;
  
  
  

    }
  catch(error){
                  return executeResult(300,"Error in validating campaign name  "+ error + " "+ error.message + ' - ' + error.name ,"Fail");
              }
          
          }
}


function getCampaignInfo(campaignId,requestBodyObject){
var campaignInfo;
if(isMultiCampaign == "yes" ){
campaignInfo=generateQuery("meta:campaign","@id = '"+campaignId+"'") + cmpCol;
}
else{
campaignInfo=generateQuery("meta:campaign","@id = '"+campaignId+"'") + getTouchName(campaignId,requestBodyObject)+cmpCol;  
}
return campaignInfo;
}


function getTouchName(campaignId,requestBodyObject){
  var requestTouchId,singleTouchClause
  if(isSingleTouch == "yes" ){
   requestTouchId=requestBodyObject.data.touchId;  
   singleTouchClause="@campaignId = '"+campaignId+"'"+" and "+"@id = '"+requestTouchId+"'" 
            }
            else{
      singleTouchClause=  "@campaignId = '"+campaignId+"'"       
            }
            // logInfo("campaignId @@@@@@@"+campaignId)
            // logInfo("isSingleTouch @@@@@@@"+isSingleTouch)
 var touchQuery= xtk.queryDef.create(
                      <queryDef schema="meta:touch"  operation="select">
                        <select>
                          <node expr="@campaignId"/>
                          <node expr="@touchName"/>
                          <node expr="@id"/>                                               
                        </select>
                        <where>             
                          <condition expr={singleTouchClause }/>
              <condition boolOperator="AND" expr={"@isMarkDeleted = 0" }/>
                        </where>
            <orderBy>
                        <node expr="@lastModified" sortDesc="true"/>
                       </orderBy>            
                       </queryDef>);
             // logInfo("touchQuery @@@@@@@"+touchQuery.BuildQuery () )
       var touchdata= touchQuery.ExecuteQuery();
       var touchcollection='';
        
        for each(var touch in touchdata){                           
    var touchName =touch.@touchName.toString();
     var touchId =touch.@id.toString();
   var touchclause ="@id = '"+touchId+"'" ;
    
  
     touchcollection=touchcollection+generateQuery("meta:touch",touchclause)+getSegmentName(touchId)+touchCol;
    
    }  
                            
    return touchcollection;
                            }
                            
 function getSegmentName(touchId){
 var segmentQuery= xtk.queryDef.create(
                      <queryDef schema="meta:segment"  operation="select">
                        <select>
                          <node expr="@touchId"/>
                          <node expr="@segmentName"/>
                          <node expr="@id"/>                                               
                        </select>
                        <where>                          
                          <condition expr={"@touchId = '"+touchId+"'" }/>
               <condition boolOperator="AND" expr={"@isMarkDeleted = 0" }/>
                        </where>           
                       </queryDef>);
       var segmentdata= segmentQuery.ExecuteQuery();
       var segmentcollection='';
        for each(var segment in segmentdata){                           
      var segmentId =segment.@id.toString();
   var segmentclause ="@id = '"+segmentId+"'" ;
    segmentcollection=segmentcollection+generateQuery("meta:segment",segmentclause)+getSegmentAssignName(segmentId)+segmentCol;                               
                            }                          
    return segmentcollection;
                            }
 
 
  function getSegmentAssignName(segmentId){
 var segmentAssignQuery= xtk.queryDef.create(
                      <queryDef schema="meta:segmentAssignment"  operation="select">
                        <select>                                          
                          <node expr="@id"/>                                             
                        </select>
                        <where>                          
                          <condition expr={"@segmentId = '"+segmentId+"'" }/>
               <condition boolOperator="AND" expr={"@isMarkDeleted = 0" }/>
                        </where>           
                       </queryDef>);
       var segmentAssigndata= segmentAssignQuery.ExecuteQuery();
       var segmentAssigncollection='';
        for each(var segmentAssign in segmentAssigndata){                           
    var segmentAssignId =segmentAssign.@id.toString();
   var segmentAssignclause ="@id = '"+segmentAssignId+"'" ;
    segmentAssigncollection=segmentAssigncollection+generateQuery("meta:segmentAssignment",segmentAssignclause)+segAssociateCol;      
                            }                          
    return segmentAssigncollection;
                            }
                            
                            
function generateQuery(schemaName,clause){
 var eQueryDef =  <queryDef schema={schemaName}  operation="select">
                     <select/>
                     <where>                          
                          <condition expr={clause}/>
                        </where>
                   </queryDef>;
                   
                 var schema = application.getSchema(schemaName);
                   
      for each( var att in schema.root.children )
  {
    if( att.isAttribute && !att.isCalculated && !att.isMappedAsXML && !att.isMemo )
    {
  
      eQueryDef.select.appendChild(<node expr={NL.XTK.expandXPath(att.name)}/>);
    }
  }
//Execute Query           
           var queryDef = xtk.queryDef.create(eQueryDef);
          var result = queryDef.ExecuteQuery();
            
               resultString=result.toString()
  if(schemaName == "meta:campaign"){
     for each(var res in result){
       var brandId =res.@brandId.toString();
     var initiativeId =res.@initiativeId.toString();
     var lobId =res.@lobId.toString();
      // logInfo("brandId***"+brandId)
     //var brandName =" brandName='abcdefg' ";
  var brandName = getMetaKeyVal('meta:brand',brandId,'brandName');
  var initiativeName = getMetaKeyVal('meta:initiative',initiativeId,'initiativeName');
  var lobName = getMetaKeyVal('meta:lineOfBusiness',lobId,'lobName');
       // logInfo("brandName***"+brandName)
       }
    resultString=resultString.substring(0, resultString.length-cmpCol.length);
    resultString=resultString.slice(0,resultString.length-3) + brandName +initiativeName+lobName+ resultString.slice(resultString.length-3,resultString.length);
     // logInfo("resultString() after ***"+resultString)
    }
      if(schemaName == "meta:touch"){
      for each(var res in result){
       var channelId =res.@channelId.toString();
     var channelName = getMetaKeyVal('meta:channel',channelId,'channelName');
     
      }
    resultString=resultString.substring(0, resultString.length-touchCol.length);
   resultString=resultString.slice(0,resultString.length-3) + channelName + resultString.slice(resultString.length-3,resultString.length);
    }
      if(schemaName == "meta:segment"){
    
    resultString=resultString.substring(0, resultString.length-segmentCol.length);
    }
  if(schemaName == "meta:segmentAssignment"){
     for each(var res in result){
       var languageId =res.@languageId.toString();
     var phoneNumberId =res.@phoneNumberId.toString();
     var languageName = getMetaKeyVal('meta:language',languageId,'languageName');
    var phoneNumber = getPhoneNumKeyVal('meta:phoneNumberLibrary',phoneNumberId,'phoneNumber');
       //var phoneNumber =" phoneNumber ='987654321' ";
      }
    resultString=resultString.substring(0, resultString.length-segAssociateCol.length);
  resultString=resultString.slice(0,resultString.length-3) + languageName +phoneNumber+ resultString.slice(resultString.length-3,resultString.length);
    }
    //// logInfo("schemaName***"+schemaName+"resultString****"+resultString)
      return resultString;
}


function jsonString(finalxmlString){

finalxmlString=finalxmlString.split("-collection").join("_collection");
//// logInfo("finalxmlString****"+finalxmlString)
var  xmlToString = DOMDocument.fromXMLString(finalxmlString);

  //var  xmlToString = DOMDocument.fromXMLString(finalxmlString);
 var jsonText = xmlToJson(xmlToString);
       return jsonText;
       
}


      // XML to JSON converter function
 function xmlToJson(xml) {
  // Create the return object
  var obj = {};

  if (xml.nodeType == 1) {
   //// logInfo("xml.nodeType ***"+xml.nodeType);
  //// logInfo("node type is 1")
    // element
    // do attributes
    if (xml.attributes.length > 0) {
  //// logInfo ("xml.attributes.length :"+xml.attributes.length);
      for (var j = 0; j < xml.attributes.length; j++) {
        var attribute = xml.attributes[j];
        obj[attribute.nodeName] = attribute.nodeValue;
      }
    }
  } else if (xml.nodeType == 3) {
   // logInfo("node type is 3")
    // text
    obj = xml.nodeValue;
  }

  // do children
  // If all text nodes inside, get concatenated text from them.
  var textNodes = [].slice.call(xml.childNodes).filter(function(node) {
    return node.nodeType === 3;
  });
  if (xml.hasChildNodes() && xml.childNodes.length === textNodes.length) {
    obj = [].slice.call(xml.childNodes).reduce(function(text, node) {
      return text + node.nodeValue;
    }, "");
  } else if (xml.hasChildNodes()) {
    for (var i = 0; i < xml.childNodes.length; i++) {
     // var item = xml.childNodes.item(i);
     var item = xml.childNodes[i];
      var nodeName = item.nodeName;
     //// logInfo("nodeName ***"+nodeName)
      if (typeof obj[nodeName] == "undefined") {
     //// logInfo("inside undefined ***"+nodeName)
         if(nodeName.indexOf("#text")<0){
     if(nodeName.indexOf("collection")>0){
      //// logInfo("nodename has colletions ***"+nodeName)
      obj[nodeName] = [];
    obj[nodeName].push(xmlToJson(item));
        
     }
     else{
     //// logInfo("nodename DOESN't has colletions ***"+nodeName)
    obj[nodeName] = xmlToJson(item);
     }
      }
      } else {
        if (typeof obj[nodeName].push == "undefined") {
    //// logInfo("inside ELSE undefined ***"+nodeName)
          var old = obj[nodeName];
          obj[nodeName] = [];
          obj[nodeName].push(old);
        }
        obj[nodeName].push(xmlToJson(item));
    //// logInfo("calling  xmlToJson***" +nodeName)
    
      }
    }
  }
  return obj;
}

function getMetaKeyVal(metaSchemaName,id,MetaKey){
 var metakeyVal;
    var metaQuery= xtk.queryDef.create(
                      <queryDef schema={metaSchemaName}  operation="select">
                        <select>
                          <node expr="@name"/>              
                        </select>
                        <where>                          
                          <condition expr={"@id = '"+id+"'" }/>
                        </where>
                       </queryDef>);
       var metadata= metaQuery.ExecuteQuery();
        for each(var meta in metadata){                              
      var MetaVAl =meta.@name.toString();
        // logInfo("schemaName*******"+metaSchemaName+"id*******"+id+"metaname*******"+MetaVAl); 
  }
   metakeyVal=' '+MetaKey+"='"+MetaVAl+"'"+' ';

  return metakeyVal;
  }

function getPhoneNumKeyVal(phoneNumSchemaName,id,phoneNumKey){
 var phoneNumkeyVal;
    var metaQuery= xtk.queryDef.create(
                      <queryDef schema={phoneNumSchemaName}  operation="select">
                        <select>
                          <node expr="@phoneNumber"/>              
                        </select>
                        <where>                          
                          <condition expr={"@id = '"+id+"'" }/>
                        </where>
                       </queryDef>);
       var metadata= metaQuery.ExecuteQuery();
        for each(var meta in metadata){                              
      var phoneNumVAl =meta.@phoneNumber.toString();
        // logInfo("schemaName*******"+phoneNumSchemaName+"id*******"+id+"metaname*******"+phoneNumVAl); 
  }
   phoneNumkeyVal=' '+phoneNumKey+"='"+phoneNumVAl+"'"+' ';

  return phoneNumkeyVal;
  }
