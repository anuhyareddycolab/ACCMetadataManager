<%
/*******************************************************************************
 * embhlogon.jsp
 *
 * Copyrigth: Neolane 2001-2013
 *
 * TODO: handle device screen display
 *       no footer for small screen devices
 *       high address bar on small screen devices
 *
 * Authentication form
 ******************************************************************************/
%><%@ page session="false"%><%@
  page import="com.neolane.fwk.core.NlException, com.neolane.fwk.dom.DomUtil"%><%@
  page import="com.neolane.fwk.net.HTMLUtil, com.neolane.fwk.soap.SoapMethodCall"%><%@
  page import="com.neolane.fwk.xtk.JSPContext, com.neolane.gen.nl.LogonStr"%><%@
  page import="javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse"%><%@
  page import="java.util.Date, java.text.SimpleDateFormat, java.util.Locale, java.util.Calendar"%><%@
  page import="org.w3c.dom.Document, org.w3c.dom.NodeList, org.w3c.dom.Attr, javax.xml.xpath.XPathConstants"%><%

  response.setContentType("text/html; charset=utf-8");
  response.addHeader("Pragma", "no-cache");
  response.addHeader("Cache-Control", "no-cache");
  response.setDateHeader("Expires", System.currentTimeMillis());
  
  String strInstallUrl     = "/meta/home.jssp";

  String strTargetUrl  = request.getParameter("target");
 
  String strGoto       = request.getParameter("goto");
  String strRememberMe = request.getParameter("rememberMe");
  boolean bRememberMe  = strRememberMe != null && strRememberMe.equals("on");
  String strIMSStatus  = request.getParameter("ims");
  boolean bRedirectToIMS  = strIMSStatus != null && strIMSStatus.equals("1");
  String strIMSRedirectUrl  = "";
  boolean showAdobeIdLogin = false;
  String strToken = request.getParameter("tokenLogon");
  boolean bIsTokenLogon = (strToken != null) && (strToken.length() > 0);
  String strError = null;
  String strLogin = request.getParameter("login");
  if( strLogin == null )
    strLogin = "";
  else
    strLogin = HTMLUtil.utf8Decode(strLogin);

  if ( strTargetUrl != null && !bRedirectToIMS)
    strTargetUrl = HTMLUtil.utf8Decode(strTargetUrl);

  if(bIsTokenLogon)
    bRedirectToIMS = false;

  String strDevice = request.getParameter("device");

  Cookie[] cookies = request.getCookies();
  if ( strGoto == null || strGoto.length() == 0 )
  { // read the target page from a permanent cookie
    for(int i = 0; cookies != null && strGoto == null && i < cookies.length; i++ )
      if( cookies[i].getName().equals("goto") &&  cookies[i].getValue().equals("null") == false )
        strGoto = cookies[i].getValue();
  }
  if ( strTargetUrl == null && strGoto != null
      && strGoto.equals("null") == false && strGoto.length() > 0 )
    strTargetUrl = strGoto;
  boolean bIsConsole = false;
  JSPContext ctx = new JSPContext(request, this);

  // Do not even render the page to avoid someone subtmiting a login/pwd in clear text over http
  // - we catch here since this is a common error and letting the exception flow will lead
  //   to it be processed in exception.jsp, which will lead to a stack trace in web.log
  try
  {
    ctx.checkHttpAllowed();
  }
  catch( NlException ex )
  {
    JSPContext.showError(response, ex);
    return;
  }

  try
  {
    // Check whether we are in the console or not
    for(int i = 0; cookies != null && i < cookies.length; i++ )
    {
      if( cookies[i].getName().equals("_console") && cookies[i].getValue().equals("1") )
        bIsConsole = true;
    }

    // check if IMS config is present
    showAdobeIdLogin = ctx.useIMSLogin(request.getHeader("host"));

    if(!bRedirectToIMS) 
    {
      ctx.loadContext();
      String strAction = request.getParameter("action");
      String strSessionToken;
      String strSecurityToken;
      JSPContext jspContext = new JSPContext(request, this);
      if( (strAction != null && strAction.equals("submit") ) || bIsTokenLogon)
      {
        if( strAction != null && strAction.equals("submit") )
        {
          // try to authentificate
          String strPassword = request.getParameter("password");
          if( strPassword == null )
            strPassword = "";
          else
            strPassword = HTMLUtil.utf8Decode(strPassword);

          SoapMethodCall soapCall = new SoapMethodCall("xtk:session", "logon",
                                                      SoapMethodCall.SOAP_ENCODING_NATIVE,
                                                       "", "",
                                                      ctx.getRemoteAddr(),
                                                      ctx.getForwardedForAddr());
          soapCall.writeString("login", strLogin);
          soapCall.writeString("password", strPassword);
          String strParameters = "";
          if( bRememberMe )
            strParameters = "<parameters rememberMe='true'/>";
          soapCall.writeElement("parameters", strParameters);
          soapCall.finalizeDocument();

          // do the SOAP call
          jspContext.executeSOAPCall(soapCall);

          strSessionToken = soapCall.getNextString();
          soapCall.skip();
          strSecurityToken = soapCall.getNextString();
          soapCall.checkNoMoreArgs();
        }
        else //if(bIsTokenLogon)
        {
          SoapMethodCall soapCall = new SoapMethodCall("xtk:session", "BearerTokenLogon",
                                                       SoapMethodCall.SOAP_ENCODING_NATIVE,
                                                       "", "",
                                                       ctx.getRemoteAddr(),
                                                       ctx.getForwardedForAddr());
          soapCall.writeString("bearerToken", strToken);
          String strParameters = "";
          soapCall.finalizeDocument();
          jspContext.executeSOAPCall(soapCall);
          strSessionToken = soapCall.getNextString();
          soapCall.skip();
          strSecurityToken = soapCall.getNextString();
          soapCall.checkNoMoreArgs();
          if(strTargetUrl == null)
            strTargetUrl = strInstallUrl;
        }

        // Successfull logon: redirect to the target page, but add the session token in cookie
        // create the cookie directly in the header to add HttpOnly
        StringBuffer strTokenCookie = new StringBuffer("__sessiontoken=" + strSessionToken);
        strTokenCookie.append("; Path=/");
        if( ctx.httpOnlySessionCookie() )
          strTokenCookie.append("; HttpOnly");
        if( request.getHeader("NLSSLURL") != null )
          strTokenCookie.append("; Secure");
        if( bRememberMe )
        {
          String strLongSessionTimeOutSec = ctx.getConfig("shared/authentication/@longSessionTimeOutSec");
          int maxAge = Integer.parseInt(strLongSessionTimeOutSec);
          Date date = new Date();
          date.setTime(date.getTime() + maxAge * 1000);
          // See http://en.wikipedia.org/wiki/HTTP_cookie#Expires_and_Max-Age to understand this format
          String DATE_FORMAT = "EEE, dd-MMM-yyyy HH:mm:ss";
          SimpleDateFormat sdf = new SimpleDateFormat(DATE_FORMAT, new Locale("en", "US"));
          strTokenCookie.append("; Expires=" + sdf.format(date) + " GMT");
        }
        response.setHeader("Set-Cookie", strTokenCookie.toString());

        // Handle relogin request from the login popup when an expired session
        // is detected client-side.
        if( request.getParameter( "popup" ) != null )
        {
          // the only thing needed by the client is the security token
          if( ctx.useSecurityToken() )
            response.getOutputStream().print( strSecurityToken );
          response.getOutputStream().close();
          return;
        }

        if ( strGoto != null )
        {
          Cookie gotoCookie = new Cookie("goto", strGoto);
          gotoCookie.setMaxAge(30 * 86400); // keep the cookie 30 days
          gotoCookie.setPath("/view/logon");
          response.addCookie(gotoCookie);
        }

        if ( request.getParameter("device") != null )
          // add the device in the XML context
          strTargetUrl += "&_xp_2fuserContext_2f_40device=" + request.getParameter("device");

        // Remove an existing security token in the URL
        if( strTargetUrl.indexOf("__securitytoken=") > -1 )
        {
          strTargetUrl = strTargetUrl.replaceAll("__securitytoken=([^&])*[&]", "");
          strTargetUrl = strTargetUrl.replaceAll("__securitytoken=([^&])*$", "");
        }

        if( strSecurityToken != "" && ctx.useSecurityToken() )
        {
          if( strTargetUrl.indexOf("?") == -1 )
            strTargetUrl += "?";
          else
            strTargetUrl += "&";
          strTargetUrl += "__securitytoken=" + strSecurityToken;
        }

        String strLowerTarget = strTargetUrl.toLowerCase();
        // check if target is an OOB path
        if( !strLowerTarget.startsWith("/pipelined/") && !strLowerTarget.startsWith("/view/") && !strLowerTarget.startsWith("/nms/") &&
            !strLowerTarget.startsWith("/xtk/") && !strLowerTarget.startsWith("/nl/") && !strLowerTarget.startsWith("/crm/") &&
            !strLowerTarget.startsWith("/webapp/") && !strLowerTarget.startsWith("/report/") && !strLowerTarget.startsWith("/strings/") )
        { 
          // Redirect URL is not an OOB one. Checks namespace of JSSPs
          String strJsspNamespaceQuery =
            "<queryDef schema='xtk:entity' operation='select' xtkschema='xtk:queryDef'>"+
              "<select>"+
                "<node expr='\"/\" + lower(@namespace) + \"/\"' alias='@namespace' groupBy='true'/>"+
              "</select>"+
              "<where>"+
                "<condition expr='@entitySchema = \"xtk:jssp\"'/>"+
               "</where>"+
            "</queryDef>";
          SoapMethodCall call = new SoapMethodCall("xtk:queryDef", "ExecuteQuery",
                                                   SoapMethodCall.SOAP_ENCODING_NATIVE,
                                                   strSessionToken,
                                                   strSecurityToken,
                                                   ctx.getRemoteAddr(),
                                                   ctx.getForwardedForAddr());
          call.writeDocument("document", strJsspNamespaceQuery);
          call.finalizeDocument();
          jspContext.executeSOAPCall(call);
          Document xmlResult = call.getNextDocument();
          NodeList nodeList = (NodeList)DomUtil.evaluateXPath("/entity-collection/entity/@namespace", xmlResult.getDocumentElement(), XPathConstants.NODESET);
          int iLen = nodeList.getLength();
          boolean bNotFound = true;
          for( int iIndex=0; iIndex<iLen && bNotFound ; iIndex++)
            bNotFound = !strLowerTarget.startsWith(((Attr)nodeList.item(iIndex)).getValue());

          if( bNotFound )
            throw new NlException(LogonStr.ERR_BADREDIRECT());

        }    

        // Ok
        jspContext.sendRedirect(response, strTargetUrl);
        return;
      }
    }
    else //if we need to redirect to IMS
    {
      strIMSRedirectUrl = "/nms/imslogin.jssp?" + request.getQueryString();
      response.sendRedirect(strIMSRedirectUrl);
      return;
    }
  }
  catch( Exception ex )
  {
    // Login error
    strError = ctx.getExceptionMessage(ex);
  }
  finally
  {
    // if not redirect to ims, use the same url for IMS login link
    if(strTargetUrl == null)
      strIMSRedirectUrl = "/nms/imslogin.jssp";
    else
      strIMSRedirectUrl = "/nms/imslogin.jssp?target=" + HTMLUtil.utf8Encode(strTargetUrl);
  }

%><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<% if(!bRedirectToIMS) { %>
<html lang="en">
  <head>
    <link rel="shortcut icon" href="#" />
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />

    <!-- Bootstrap CSS -->
    <link
      rel="stylesheet"
      href="http://zeus2embhapp90.embhdb.com/res/EMBH_Dev/bootstrap.min.css"
      crossorigin="anonymous"
    />

    <!-- Bootstrap JS -->
    <script
      src="http://zeus2embhapp90.embhdb.com/res/EMBH_Dev/jquery-3.5.1.min.js"
      crossorigin="anonymous"
    ></script>
    <script
      src="http://zeus2embhapp90.embhdb.com/res/EMBH_Dev/popper.min.js"
      crossorigin="anonymous"
    ></script>
    <script
      src="http://zeus2embhapp90.embhdb.com/res/EMBH_Dev/bootstrap.min.js"
      crossorigin="anonymous"
    ></script>

    <!-- Custom CSS -->

    <style type="text/css">
      #InputEmail::placeholder,
      #InputPassword::placeholder {
        font-weight: 500 !important;
        font-size: 0.8rem !important;
        color: black !important;
      }
      #InputEmail::-webkit-input-placeholder,
      #InputPassword::-webkit-input-placeholder {
        /* Chrome/Opera/Safari */
        font-weight: 500 !important;
        font-size: 0.8rem !important;
        color: black !important;
      }
      #InputEmail::-moz-placeholder,
      #InputPassword::-moz-placeholder {
        /* Firefox 19+ */
        font-weight: 500 !important;
        font-size: 0.8rem !important;
        color: black !important;
      }
      #InputEmail:-ms-input-placeholder,
      #InputPassword:-ms-input-placeholder {
        /* IE 10+ */
        font-weight: 500 !important;
        font-size: 0.8rem !important;
        color: black !important;
      }
      #InputEmail:-moz-placeholder,
      #InputPassword:-moz-placeholder {
        /* Firefox 18- */
        font-weight: 500 !important;
        font-size: 0.8rem;
        color: black !important;
      }
    </style>

    <link
      rel="stylesheet"
      href="http://zeus2embhapp90.embhdb.com/res/EMBH_Dev/Style.css"
    />
    <title>Login Page</title>
  </head>

  <body>
    <div class="container-fluid header">
      <div class="row" id="loginDiv">
        <div class="col-lg-3 col-md-2"></div>

        <div class="col-lg-5 col-md-8 col-sm-12 vertical-center">
          <div class="card">
            <div class="card-body">
              <!-- <h5 class="card-title form-group text-center">Card title</h5> -->
              <img
                src="https://www.emblemhealth.com/content/experience-fragments/emblemhealth/header-nav/member-dark-logo/_jcr_content/root/header-nav/logo.coreimg.png/1568924933865/emblem-logo-dark.png"
                class="img-fluid center"
                alt="Logo"
              />
           <form method="post" autocorrect="off" autocapitalize="off" name="loginForm" action="/nl/jsp/embhlogon.jsp">
		   <input type="hidden" name="action" value="submit" />
		    <% if ( strTargetUrl != null ) { %>
                <input type="hidden" name="target" value="<%= HTMLUtil.encode(strTargetUrl) %>"/>
              <% } %>
              <% if ( strTargetUrl == null ) { %>
                <input type="hidden" name="goto" value="<%= strInstallUrl %>"/>
              <% } %>

              <%
                // In case there has been an error, display it and again the login form
                if( strError != null && strError.equals("") == false ) {
              %>
                <div id="form-error">
                  <img alt="" src="/nl/img/stop.png" />
                  <span class="errorBox">
                  <%
                    String strMsg = "Invalid login or password. Connection denied.";
                    out.write(strMsg);
                  %>
                  </span>
                </div>
              <% } %>
                      <div class="form-group">
                 
                    <input id="login" name="login" tabindex="1" type="email" class="form-control" aria-describedby="emailHelp"placeholder="Email Address*" value="<%= DomUtil.escapeXmlString(strLogin) %>" />
                  </div>
              
               <div class="form-group">
                    <input id="password" name="password" placeholder="Password*"class="form-control"  type="password" autocomplete="off" />
                 
                </div>
             <div class="form-group">
                  <center>

                  <button id="validate" type="submit" class="btn button-login">  Login </button>
               </center>
                </div>
				
				 <div class="form-group">
                  <center>
                    <a id="forgetPassword" href="/meta/forgotPassword.jssp">Forget your password?</a>
                  </center>
				 </div>
                 

               
              </form>
            </div>
          </div>
        </div>
        <div class="col-lg-4 col-md-2"></div>
      </div>
    </div>
	<script type="text/javascript">
      function setFocus() {
        document.loginForm.login.focus();
      }
    </script>
  </body>
</html>
<% } %>
