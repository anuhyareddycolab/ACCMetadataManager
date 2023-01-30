
         loadLibrary("meta:common.js"); 
         loadLibrary("/nl/core/shared/nl.js");
         NL.require('/nl/core/shared/xtk.js')
        .require('/nl/core/schema.js')
        .require('/nl/core/shared/json2.js')
        .require('/nl/core/sql.js')
        .require('/nl/core/shared/js.js');



        function generateQuery(schemaName,clause){
        
           var eQueryDef =  <queryDef schema={schemaName}  operation="select">
                               <select/>
                               <where>                          
                                <condition expr={clause}/>
                               </where>
                             </queryDef>;                             
                           var schema = application.getSchema(schemaName);
                             
               for each(var att in schema.root.children)
                {
                  if( att.isAttribute && !att.isCalculated && !att.isMappedAsXML && !att.isMemo ){                
                    eQueryDef.select.appendChild(<node expr={NL.XTK.expandXPath(att.name)}/>);
                  }
                }
                    
                var queryDef = xtk.queryDef.create(eQueryDef);
                var result = queryDef.ExecuteQuery();
                resultString=result.toString()
                return resultString;
       }
       
       function jsonString(finalxmlString){   
            
          finalxmlString=finalxmlString.split("-collection").join("_collection");       
          var  xmlToString = DOMDocument.fromXMLString(finalxmlString);
          var jsonText = xmlToJson(xmlToString);
          return jsonText;
          
          }


      
      
      
         function xmlToJson(xml) {                                                   // XML to JSON converter function
              
              var obj = {};                                                         // Create the return object
            
              if (xml.nodeType == 1) {
              
                if (xml.attributes.length > 0) {              
                   for (var j = 0; j < xml.attributes.length; j++) {
                    var attribute = xml.attributes[j];
                    obj[attribute.nodeName] = attribute.nodeValue;
                  }
                }
              }else if (xml.nodeType == 3) {              
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
                
                 var item = xml.childNodes[i];
                  var nodeName = item.nodeName;
                 
                  if (typeof obj[nodeName] == "undefined") {
                
                     if(nodeName.indexOf("#text")<0){
                 if(nodeName.indexOf("collection")>0){
                 
                  obj[nodeName] = [];
                obj[nodeName].push(xmlToJson(item));
                    
                 }
                 else{
                 
                obj[nodeName] = xmlToJson(item);
                 }
                  }
                  } else {
                    if (typeof obj[nodeName].push == "undefined") {
                
                      var old = obj[nodeName];
                      obj[nodeName] = [];
                      obj[nodeName].push(old);
                    }
                    obj[nodeName].push(xmlToJson(item));
               
                
                  }
                }
              }
              return obj;
        }



 // ***************************************************** View Phone Number function definition **********************************************************// 


 
 
function viewPhoneNumber(phoneNumberId){
                 try{
                 var phoneVolList=[];
         var campaignId=getLatestcampaignIdfromPhoneAssignment(phoneNumberId);
                     var schemaname="meta:phoneNumberLibrary"; 
                     var phoneVolschemaname="metastg:camp_phonecallvolumesummary_stg";   
                     var phoneNumberJson={};                  
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
            <node expr="@releaseDate"/> 
            <node expr="@isReserved"/> 
            <node expr="@isPseudoNumber"/> 
            <node expr="@periodCoolOffDays"/> 
                       </select>                            
                       <where>
                        <condition expr ={"@id='"+phoneNumberId+ "'"}/>
                       </where>                                               
                      </queryDef>);
                      
                       var phoneVolquery = xtk.queryDef.create(
                     <queryDef schema={phoneVolschemaname} operation="select">
                      <select>                     
                        <node expr="@PHONE_NUMBER_ID"/> 
                        <node expr="@DID"/> 
                        <node expr="@CALL_PERIOD"/>
                        <node expr="@CALL_VOLUME"/> 
                       </select>                            
                       <where>
                        <condition expr ={"@PHONE_NUMBER_ID='"+phoneNumberId+ "'"}/>
                       </where>                                               
                      </queryDef>);
            
            var campaignquery = xtk.queryDef.create(
                     <queryDef schema="meta:campaign" operation="select">
                      <select> 
                        <node expr="@id"/>
                        <node expr="@campaignName"/> 
                        <node expr="@campaignDescription"/> 
                        <node expr="@campaignStartDate"/>
                        <node expr="@campaignendDate"/>                                           
                       </select>                            
                       <where>
                        <condition expr ={"@id='"+campaignId+ "'"}/>
                       </where>                                               
                      </queryDef>);
          
                    var queryData=query.ExecuteQuery();
                     var phoneVolData=phoneVolquery.ExecuteQuery();
          var campaignqueryData=campaignquery.ExecuteQuery();
                       var brandName=getMetaName(phoneNumberId,'iBrandId','MetaBrand');
           //logInfo("brandName: "+brandName);
           var lobName=getMetaName(phoneNumberId,'ilobId','MetaLineOfBusiness');
           //logInfo("lobName: "+lobName);
          var langName=getMetaName(phoneNumberId,'iLanguageId','MetaLanguage');
           //logInfo("langName: "+langName);
           var initiativeName=getMetaName(phoneNumberId,'iinitiativeId','MetaInitiative');
           //logInfo("initiativeName: "+initiativeName);
           var channelName=getMetaName(phoneNumberId,'iChannelId','MetaChannel');
           //logInfo("channelName: "+channelName);        
                    for each(var item in queryData)
                    {
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
             phoneJson.brandName=brandName;
                       phoneJson.lobName=lobName;
                       phoneJson.langName=langName;
             phoneJson.initiativeName=initiativeName;
                       phoneJson.channelName=channelName;
                       phoneJson.releaseDate=item.@releaseDate.toString();
                       phoneJson.isReserved=item.@isReserved.toString();
                       phoneJson.isPseudoNumber=item.@isPseudoNumber.toString();
                       phoneJson.periodCoolOffDays=item.@periodCoolOffDays.toString();
                 
             for each(var campaign in campaignqueryData)
                    {
          phoneJson.campaignName=campaign.@campaignName.toString();
          phoneJson.campaignDescription=campaign.@campaignDescription.toString();
          phoneJson.campaignStartDate=campaign.@campaignStartDate.toString();
          phoneJson.campaignEndDate=campaign.@campaignEndDate.toString();
          phoneJson.campaignId=campaign.@id.toString();
          }
          
              for each(var phoneVol in phoneVolData)
                    {
                     
                      var phoneVolJson={};                     
          phoneVolJson.date=phoneVol.@CALL_PERIOD.toString();
          phoneVolJson.volume=phoneVol.@CALL_VOLUME.toString();
          phoneVolList.push(phoneVolJson);

          }
      phoneVolList.sort(sortByProperty('date'))
          phoneJson.callVolumeData=phoneVolList;

                                                             
                     } 

                     return phoneJson;                 
                 }
                 catch(error){
                     return executeResult(300,"Error in reading phone number - "+ error + " "+ error.message + ' - ' + error.name ,"Fail");
                 }
       }
       
 
     
      
    
function getLatestcampaignIdfromPhoneAssignment(phoneNumberId){
  try{
    var campaignId = sqlGetInt("SELECT iCampaignId from MetaPhoneNumberAssignment where iPhoneNumberId="+phoneNumberId+" AND iIsMarkDeleted='0' ORDER BY  tsAssignedEnd DESC ");
   //logInfo("campaignId :"+campaignId)
   return campaignId;
    }
 catch(error){
   return executeResult(300,"Error in getLatestTouchEndDate- "+ error + " "+ error.message + ' - ' + error.name ,"Fail");
        }
  }
 
 
 // ***************************************************** Read Phone Number function definition **********************************************************// 
 
 
       function readPhoneNumbers(){
           try{
               var schemaname="meta:phoneNumberLibrary";   
               var phoneNumberJson={};
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
                <node expr="@isReserved"/> 
                              <node expr="@isPseudoNumber"/>
                              <node expr="@lobId"/>
                              <node expr="@releaseDate"/>                              
                            </select>                            
                           </queryDef>);
            
              var queryData=query.ExecuteQuery();
              var data=[];
                           
              for each(var item in queryData)
              {
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
                  phoneJson.releaseDate=item.@releaseDate.toString();
          phoneJson.isReserved=item.@isReserved.toString();
                  phoneJson.isPseudoNumber=item.@isPseudoNumber.toString();
      
                  
                  data.push(phoneJson);                             
              }
                  phoneNumberJson.methodName='getAllPhoneNumbers';
                  phoneNumberJson.data=data;
                             
              return phoneNumberJson;
                   
           }
           catch(error){
              return executeResult(300,"Error in reading phone numbers - "+ error + " "+ error.message + ' - ' + error.name ,"Fail");
           }
                           
       }


 // ***************************************************** Create Phone Number function definition **********************************************************// 
 
 
 
      function createPhoneNumber(requestBodyObject){
      
           if(JSON.stringify(requestBodyObject.data) == '{}'){           
              return executeResult(500,"Error in request payload data" ,"Fail");              
           }
           else{
              try{        
       
                   var table="phoneNumberLibrary";
                   var schemaName="meta:phoneNumberLibrary";
                   xtk.session.Write(<{table} xtkschema={schemaName} _operation="insert"  phoneNumber={requestBodyObject.data.phoneNumber} initiativeId={requestBodyObject.data.initiativeId} lobId={requestBodyObject.data.lobId} brandId={requestBodyObject.data.brandId} channelId={requestBodyObject.data.channelId} languageId={requestBodyObject.data.languageId} did={requestBodyObject.data.did} vdnName={requestBodyObject.data.vdnName} ivrNumber={requestBodyObject.data.ivrNumber} isPseudoNumber={requestBodyObject.data.isPseudoNumber} isReserved={requestBodyObject.data.isReserved} status={requestBodyObject.data.status}  groupNumber={requestBodyObject.data.groupNumber} releaseDate={requestBodyObject.data.releaseDate} periodCoolOffDays={requestBodyObject.data.periodCoolOffDays}></{table}>); //isArchived={requestBodyObject.data.isArchived} isMarkDeleted={requestBodyObject.data.isMarkDeleted} isDeleted={requestBodyObject.data.isDeleted}
                   return executeResult(200,"Record of "+table+" created successfully " ,"Success");                 
                 }
                 catch(error){                 
                   return executeResult(300,"Error in createing PhoneNumber record- "+ error + " "+ error.message + ' - ' + error.name ,"Fail");                 
                 }
           }
           
       }
       
       
       
  // ***************************************************** Update Phone Number function definition **********************************************************//
  
  
  
       function updatePhoneNumber(requestBodyObject){
       
            if(JSON.stringify(requestBodyObject.data) == '{}'){
               return executeResult(500,"Error in request payload data" ,"Fail");
             }
             else{
                try{  
                     var table="phoneNumberLibrary";
                     var schemaName="meta:phoneNumberLibrary";
                     xtk.session.Write(<{table} xtkschema={schemaName} _operation="update"  _key="@id" id={requestBodyObject.data.phoneNumberId} phoneNumber={requestBodyObject.data.phoneNumber} initiativeId={requestBodyObject.data.initiativeId} lobId={requestBodyObject.data.lobId} brandId={requestBodyObject.data.brandId} channelId={requestBodyObject.data.channelId} languageId={requestBodyObject.data.languageId} did={requestBodyObject.data.did} vdnName={requestBodyObject.data.vdnName} ivrNumber={requestBodyObject.data.ivrNumber} isPseudoNumber={requestBodyObject.data.isPseudoNumber} isReserved={requestBodyObject.data.isReserved} status={requestBodyObject.data.status}  groupNumber={requestBodyObject.data.groupNumber} releaseDate={requestBodyObject.data.releaseDate} periodCoolOffDays={requestBodyObject.data.periodCoolOffDays} ></{table}>); //isArchived={requestBodyObject.data.isArchived} isMarkDeleted={requestBodyObject.data.isMarkDeleted} isDeleted={requestBodyObject.data.isDeleted}
                     return executeResult(200,"Phone Number of id "+requestBodyObject.data.phoneNumberId+" updated successfully " ,"Success");
                   }
                   catch(error){
                     return executeResult(300,"Error in updating Phone Number record- "+ error + " "+ error.message + ' - ' + error.name ,"Fail");
                   }
             }
             
         }

       
  // ***************************************************** Get All Phone Numbers Detail**********************************************************//
  
      function getAllPhoneNumbersDetail(requestBodyObject){
          try{
            var responseObject={};
            responseObject.methodName="getAllPhoneNumbersDetail";
            var phoneData=generateQuery("meta:phoneNumberLibrary","@id != '0'");
            var phoneDataObject=jsonString(phoneData);
            var data=[];
            data.push(phoneDataObject);
            responseObject.data=data;
            return JSON.stringify(responseObject);
          }
          catch(error){
             return executeResult(300,"Error in getting all phone numbers - "+ error + " "+ error.message + ' - ' + error.name ,"Fail");
          }
      
      
      }

  function sortByProperty(property){  
   return function(a,b){  
      if(a[property] < b[property])  
         return 1;  
      else if(a[property] > b[property])  
         return -1;  
  
      return 0;  
   }  
}
   
