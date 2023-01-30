/*********************************************9**********************************
 * jsspcontext.js
 *
 * Copyright:    Copyright (c) 2008-2013
 * Company:      Neolane
 *
 * $Author$
 * $Revision$
 ******************************************************************************/
NL.ns('NL');

NL.require('/nl/core/shared/nl.js')
  .require('/nl/core/shared/dataTypes.js')
  .require('/nl/core/shared/xtk.js')
  .require('/nl/core/shared/js.js')
  .require('/nl/core/shared/xml.js')
  .require('/nl/core/sql.js')
  .require('/nl/core/html.js')
  .require('/nl/core/shared/utils/hash.js')
  .require('/nl/core/shared/view.js')
  .require('/nl/core/shared/cookie.js');


NL.JSSPContext = function(request)
{
  this.request = request;
  // Indicate whether we are using a permanent link in the current context
  this._permaLink = false;
}

/**
 * Tell the context if we are using a permanent link
 * @param {Boolean} permaLink
 */
NL.JSSPContext.prototype.setPermaLink = function(permaLink)
{
  this._permaLink = permaLink;
};

/** Get the session token
  *
  * @return the session token.
  */
NL.JSSPContext.prototype.getSessionToken = function()
{
  var strToken = ""
  if( httpOnlySessionCookie() )
  {
    // In secured mode, the session token can only be in a cookie
    if( this.request.cookies.__sessiontoken )
      strToken = this.request.cookies.__sessiontoken.value
  }
  else
  {
    // Explicit session token on an URL has always precedence
    strToken = this.request.getParameter("__sessiontoken");
    if( NL.isEmpty(strToken) && this.ctx )
      // try to get it from the context (only for compatibility purposes)
      strToken = this.ctx.__sessiontoken.toString();

    if( NL.isEmpty(strToken) &&
        this.request.cookies.__sessiontoken &&
        !NL.isEmpty(this.request.cookies.__sessiontoken.value) ) {
      // Get the value from cookies
      strToken = this.request.cookies.__sessiontoken.value;
    }
  }

  // Tomcat may add quotes to the cookie values. Remove them from our session token.
  if (strToken && strToken.charAt(0) === "\"")
    strToken = strToken.substring(1, strToken.length-1);

  return strToken
}

/** Get the security token
  * @return the security token.
  */
NL.JSSPContext.prototype.getSecurityToken = function()
{
  var strToken = this.request.getHeader("X-Security-Token")
  if( !strToken )
  {
    strToken = this.request.getParameter("__securitytoken")
    if( strToken )
      strToken = decodeURIComponent(strToken);
  }
  if( !strToken )
    strToken = ""
  return strToken
}

/** Get the host of the request
 * @return the host
 */
NL.JSSPContext.prototype.host = function()
{
  var strHostName = this.request.getHeader("host");
  if( strHostName )
    return strHostName;
  return this.request.getServerName();
}

/**
  * Properly set session parameters now that we are logued */
NL.JSSPContext.prototype.initSession = function() {
  NL.session.operator       = {};
  NL.session.operator.id    = application.operator.id;
  NL.session.operator.login = application.operator.login;
  NL.session.operator.CS    = application.operator.computeString;
  // Switch to the current locale and timezone
  NL.session.setLocale(getCurrentLocale());
  NL.session.setTimezone(application.getCurrentTimezone());
}

/**
 * Helper function in charge of the redirection to the logon page.
 * We try to set the target URL attribute with the original request URL
 * in case of forward. The current request is used by default.
 * @param  {Object}  response      The HttpServletResponse
 * @param  {Boolean} noQueryString True to avoid passing the queryString of the request
 *                                 in the target URL attribute
 */
NL.JSSPContext.prototype.toLogonPage = function(response, noQueryString) {
  var targetURL         = this.request.requestURI,
      targetQueryString = this.request.queryString;

  // Note: we try to use the request URI of the forwarded request, to get the URL with the view,
  // and not the expanded one (/nms/deliverOverview.jssp ...)
  // When dealing with views, the request to a view is forwarded to a servlet (JSSP, webApp etc.).
  // In this case, the attributes javax.servlet.forward.* are populated and contains the initial request
  // attributes.
  // cf. Servlet specification: SRV.8.4.2 Forwarded Request Parameters
  // http://download.oracle.com/otndocs/jcp/servlet-2.4-fr-spec-oth-JSpec/
  //
  // Ex: being on the view  '/view/operation', the logon page should redirect to the same page
  // after login. If not looking into "javax.servlet.forward.request_uri", the request URI is used
  // and links to the technical URL of the view, aka '/nms/OperationOverview.jssp'.
  if( this.request.attributes && this.request.attributes["javax.servlet.forward.request_uri"] ) {
    targetURL = this.request.attributes["javax.servlet.forward.request_uri"];
  }

  if( this.request.attributes && this.request.attributes["javax.servlet.forward.query_string"] ) {
    targetQueryString = this.request.attributes["javax.servlet.forward.query_string"];
  }

  if( !NL.isEmpty(targetQueryString) && !NL.XTK.parseBoolean(noQueryString, false) ) {
    targetURL += '?' + targetQueryString;
  }

  response.sendRedirect('/nl/jsp/login.jsp?target=' + encodeURIComponent(targetURL));
}

/** Session token checking.
  *
  * Check the session token validity and redirected the user to the logon page
  * if it's required.
  *
  * @response the HTTP response.
  * @return   true if the authentication has been checked successfully. */
NL.JSSPContext.prototype.checkAuthentication = function(response)
{
  var strRequestUrl = this.request.getHeader("NLSSLURL");
  if( !strRequestUrl )
    strRequestUrl = this.request.requestURL;

  checkHTTPAllowed(strRequestUrl, this.request.getHeader("X-Forwarded-For"), this.request.getRemoteAddr());

  var strSessionToken = this.getSessionToken();
  var strSecurityToken = this.getSecurityToken();

  if( logonWithToken(strSessionToken, strSecurityToken, this._permaLink) )
  {
    // Not a valid session
    if( response )
    {
      // We are in a JSSP, redirect to the logon page
      // - but not if the source URL had a hardcoded sessionToken since the
      //   login page would redirect with it, and the logon will always fail
      if( !this.request.queryString || this.request.queryString.indexOf("__sessiontoken") == -1 )
        this.toLogonPage(response);
      else
        // let the error bubble up
        logError('Authentication failure');
    }

    // Notify failure to authenticate
    return false;
  }

  // Properly set session parameters now that we are logued
  this.initSession();
  // Authentication checked with success
  return true;
};

/** Pushes the security token in the document and prepare its refresh
*/
NL.JSSPContext.prototype.addDocumentSecurityToken = function ()
{
  var newSecurityToken = getNewSecurityToken(this.getSessionToken(), this.getSecurityToken(), this._permaLink);
  if( newSecurityToken !== '' ) {
    var script = "";
    script += '<script type="text/javascript">\n';
    script += 'document.__securitytoken = "' + NL.JS.escape(newSecurityToken) + '";\n';
    script += '</script>\n';
    document.write(script);
  }
}

/** Check whether we are in the console or not
  *
  * @return true if in the console, false otherwise. */
NL.JSSPContext.prototype.isConsole = function()
{
  var bIsConsole = false
  if( this.request.cookies._console != undefined )
    bIsConsole = this.request.cookies._console.value

  return bIsConsole
}

/** Load the context from the request.
  *
  * @return the context. */
NL.JSSPContext.prototype.loadContext = function()
{
  var strContext = this.request.getUTF8Parameter("ctx")
  if ( strContext.length > 0 )
  {
    // check if the content contains a </script>. If so, throw an error and stop the process
    if( strContext.match(/<\/script[^>]*>/i))
      throw "XSS Detected"

    if ( strContext.indexOf('<?xml version="1.0"?>') == 0 )
      // remove the XML processing instruction (for Opera compatibility)
      strContext = strContext.substring('<?xml version="1.0"?>'.length, strContext.length)

    this.ctx = new XML(strContext)
  }
  else
  {
    this.ctx = <ctx/>
  }

  // write the isConsole() info into the context for easier client side handling
  if( this.isConsole() )
    this.ctx.@_console = this.isConsole()

  return this.ctx
}

/** Generate the JS code to put in the client side which initialize the NL.session object
  * @return the JS code, to put inside a client-side <script> tag */
NL.JSSPContext.prototype.genClientSessionInitCode = function(noSecurityToken) {
  var strJs = 'var nls = NL.session;\n';
  strJs += 'nls.buildNumber     = ' + NL.session.buildNumber + ';\n';
  strJs += 'nls.instanceName     = "' + NL.JS.escape(NL.session.instanceName) + '";\n';

  strJs += 'nls.operator         = {};\n';
  strJs += 'nls.operator.id      = ' + NL.session.operator.id + ';\n';
  strJs += 'nls.operator.login   = "' + NL.JS.escape(NL.session.operator.login) + '";\n';
  strJs += 'nls.operator.CS      = "' + NL.JS.escape(NL.session.operator.CS) + '";\n';
  if( NL.session.locale )
    strJs += 'nls.setLocale("' + NL.JS.escape(NL.session.locale.getLocale()) + '");\n';

  if( NL.session.timezone ) {
    var timezoneName = NL.session.timezone.getName();
    strJs += 'nls.setTimezone("' + NL.JS.escape(timezoneName) + '");\n';
  }

  strJs += 'nls.serverURL        = window.location.protocol + "//" + window.location.host;\n';
  strJs += 'nls.hostName         = window.location.hostname;\n';
  strJs += 'nls.soapRouterURL    = NL.session.serverURL + "/nl/jsp/soaprouter.jsp";\n';

  strJs += 'nls.hasCampaign      = ' + application.hasPackage("nms:campaign") + ';\n';
  strJs += 'nls.hasInteraction   = ' + application.hasPackage('nms:interaction') + ';\n';
  strJs += 'nls.hasCentralLocal  = ' + application.hasPackage('nms:centralLocal') + ';\n';
  strJs += 'nls.hasMRM           = ' + application.hasPackage('nms:mrm') + ';\n';
  strJs += 'nls.hasMessageCenter = ' + application.hasPackage('nms:messageCenter') + ';\n';
  strJs += 'nls.hasPURL          = ' + application.hasPackage('nms:purl') + ';\n';
  strJs += 'nls.hasLead          = ' + application.hasPackage('crm:lead') + ';\n';
  strJs += 'nls.hasSocial        = ' + application.hasPackage('nms:social') + ';\n';
  strJs += 'nls.hasMobileApp     = ' + application.hasPackage('nms:mobileApp') + ';\n';
  strJs += 'nls.hasSurvey        = ' + application.hasPackage('nms:survey') + ';\n';
  //strJs += 'nls.hasExchangeSynchronization = ' + application.hasPackage('nms:exchangeSynchronization') + ';\n';  //## to check if really used
  strJs += 'nls.initConfManager();\n';

  // Put the current universe client-side in NL.session
  var universe = this.request.getParameter('__universe') || 'campaign';
  strJs += 'nls.universe = "' + NL.JS.escape(universe) + '";';

  // Also add the client-side security token
  //### should be moved under NL.session and not document
  if( !NL.XTK.parseBoolean(noSecurityToken, false) ) {
    var newSecurityToken = getNewSecurityToken(this.getSessionToken(), this.getSecurityToken(), this._permaLink);
    if( newSecurityToken !== '' )
      strJs += 'document.__securitytoken = "' + NL.JS.escape(newSecurityToken) + '";';
  }
  return strJs;
};
