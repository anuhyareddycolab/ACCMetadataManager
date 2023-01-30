loadLibrary("meta:common.js");  


function resetPassword(requestBodyObject)
{
var login=requestBodyObject.data.login;
logMessage(login,debugFlag);
var password=requestBodyObject.data.password;
logMessage(password,debugFlag);
   if(login.length == 0 || password == 0){
            return executeResult(300,"Error in request payload  data" ,"Fail");
          }
          else{
            login=decryptMethod(login);
               try{
                    var data = xtk.queryDef.create(
                                   <queryDef schema="xtk:operator" operation="get">
                                       <select>                                        
                                           <node expr="@name"/>               
                                       </select>
                                       <where>
                                           <condition expr={"@name='"+login+"'"}/>    
                                       </where>                                                                                  
                                     </queryDef>);                                                        
                                  var queryData=data.ExecuteQuery();
                    
                    var resetPasswordResponse = NLWS.xtkOperator.ResetPassword(login,password);
                    return executeResult(200,"Password reset successfully" ,"Success");   
                  }
                  catch(error){
                      return executeResult(300,"Error in reset password- "+ error + " "+ error.message + ' - ' + error.name ,"Fail");
                   }
       }
}
    
 
