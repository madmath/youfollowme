<!-- Copyright 2010 Mathieu Perreault and Marc Beaupre -->

<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="com.google.appengine.api.users.User" %>
<%@ page import="com.google.appengine.api.users.UserService" %>
<%@ page import="com.google.appengine.api.users.UserServiceFactory" %>
<%@ page import="javax.jdo.PersistenceManager" %>
<%@ page import="javax.jdo.JDOObjectNotFoundException" %>
<%@ page import="ca.mcgill.youfollowdotme.PMF" %>
<%@ page import="java.util.Date" %>
<%@ page import="java.util.List" %>
<%@ page import="ca.mcgill.youfollowdotme.SocialProfile" %>
<%@ page import="ca.mcgill.youfollowdotme.SocialAccount" %>
<%@ page import="java.util.logging.Logger" %>

<html>
<link href='http://fonts.googleapis.com/css?family=Molengo&subset=latin' rel='stylesheet' type='text/css'>
<link rel="stylesheet" href="css/blueprint/screen.css" type="text/css" media="screen, projection">
<link rel="stylesheet" href="css/blueprint/print.css" type="text/css" media="print">	
<!--[if lt IE 8]><link rel="stylesheet" href="css/blueprint/ie.css" type="text/css" media="screen, projection"><![endif]-->
<link type="text/css" rel="stylesheet" href="/css/main.css" />
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js" type="text/javascript"></script> 
<script type="text/javascript" src="/js/main.js"></script>
<%
	Logger log = Logger.getLogger("JSPPAGE");
	UserService userService = UserServiceFactory.getUserService();
	User user = userService.getCurrentUser();
	if (request.getRequestURI().equals("/") || request.getRequestURI().startsWith("/@")) {
		// The person is here to create a profile.
	    
	    if (user != null) { // User is logged in.

        if (request.getRequestURI().startsWith("/@")) {
            String whatuser = request.getRequestURI().split("@")[1];
%>
            <script>tofillusername = "<%=whatuser%>";</script>
<%
        }
%>
<script>whichPage = "create";</script>
<span id="bckimg">
</span>
<body class='bg'>		
<div class="container">
    <a href="#cb" id="cb">Change background</a>
    <a href="<%= userService.createLogoutURL(request.getRequestURI()) %>" style="align:right">Sign out</a>
    <span id="attribution"></span>
	<div class="span-24 last" id="yfmheader">
		<span id="yfmh1">youfollow.me/</span><input id="usernameInput" type="text" name="yfmUsername" size="300"/><span id='loadingcheck' style='display:none'><img src='img/ajax-loader.gif' /></span>
	</div>
	<span id="yours"></span><span id="taken" style="display:none"><h3>taken :(</h3></span><span id="avail" style="display:none"><h3>it can be yours! :)</h3></span>
	<div class="span-24 last" id="restofpage">
		
		<div class="span-7">
			<h3>Who are you?</h3>
			<div class="secondaryInputs vanish">
				<input id="nameInput" type="text" name="fullName" value="Name"/>
				<input id="titleInput" type="text" name="jobtitle" value="Title"/>
				<input id="emailInput" type="text" name="emaila" value="Email"/>
				<input id="phoneInput" type="text" name="phoneNumber" value="Phone"/>
				<input id="addressInput" type="text" name="address" value="Address"/>
			</div>
			<textarea id="descriptionInput" rows="10" columns="15" class="vanish">Write something about yourself...</textarea>
			<div id="logo"><img src="/img/logoblacksmall.png"/></div>
			<img src="http://code.google.com/appengine/images/appengine-silver-120x30.gif" 
alt="Powered by Google App Engine" />
		</div>
		<div class="span-11">
			<h3>What networks are you on?</h3>
	 		<div id="socialcontainer">
	 		<%
	 		for (int i = 0; i < 6; i++) {
	 		%>
	 		<span id="aline<%=i%>" class="secondaryInputs vanish">
		 		<input type="text" value="your username or url" id="account<%=i%>" />&nbsp;&nbsp;&nbsp;&nbsp;
		 		</span>
		 		<select class="socialline" name="network" id="type<%=i%>" >
		 		<option id="Twitter">Twitter</option>
		 		<option id="Picasa"<% if(i==2){
                %> selected="selected"<%
                }%>>Picasa Web</option>
				<option id="Google" <% if(i==1){
				%> selected="selected"<%
				}%>>Google Buzz</option>
				<option id="Flickr"<% if(i==4){
                %> selected="selected"<%
                }%>>Flickr</option>
				<option id="Other" <% if(i==3){
                %> selected="selected"<%
                }%>>Other</option>
				</select>&nbsp;
				<br />
	 		<%
	 		}
	 		%>
	 		<span class="button orange" id="submitbutton" style="float:right">Save!</span>
	 		</div>
		</div>
	</div>

<%
		} else { // User IS NOT signed in, signin damnit! %>
		    <span id="bckimg">
            </span>
            <body>
            <div class="container">
            <div class="span-24 last" id="yfmheadershow">
                <div id="yfmh1">youfollow.me</div>
                <h3>Please sign-in to your <a href='<%=userService.createLoginURL(request.getRequestURI())%>'>Google Account</a> to use youfollow.me</h3>
            </div>
		    <%
		}
	} else {
		// The person is here to see a profile.	
		String slashwhat = request.getRequestURI().substring(1);
		PersistenceManager pm = PMF.get().getPersistenceManager();
		SocialProfile sp = null;
		boolean fetchedItems = false;
		try {
			sp = pm.getObjectById(ca.mcgill.youfollowdotme.SocialProfile.class, slashwhat);
			fetchedItems = true;
			//if (sp.getAuthor().equals(user)) {
			//  isAuthor = true;
			//} 
		} catch (JDOObjectNotFoundException e) {
		  fetchedItems = false;
		}
		if (fetchedItems) {		
%>
	<script>whichPage = "show";</script>
	<span id="bckimg">
    </span>
	<body>
	<div class="container">
	<a href="#cb" id="cb">Change background</a>&nbsp;&nbsp;<a href="/@<%=slashwhat%>" id="oown">Owner of this page?</a>
	<span id="attribution"></span>
	<div class="span-24 last" id="yfmheadershow">
		<span id="yfmh1">youfollow.me/</span><span id="userfield"><%=slashwhat%></span>
	</div>
	<div class="span-24 last" id="restofpage">
		<div class="span-7" id="socialaccountsheader">
			<h3>Who I am</h3>
			<h4><%=sp.getFullName() == null? "": sp.getFullName()%></h4>
			<h4><%=sp.getTitle() == null? "": sp.getTitle()%></h4>
			<h4><%=sp.getEmail() == null? "": sp.getEmail()%></h4>
			<h4><%=sp.getAddress() == null? "": sp.getAddress()%></h4>
			<h4><%=sp.getPhoneNumber() == null? "": sp.getPhoneNumber()%></h4>
			<h4><%=sp.getDescription() == null? "": sp.getDescription()%></h4>
			<div class="qrcode"><h3>My QR</h3><img src='http://chart.apis.google.com/chart?cht=qr&chs=200x200&chl=http://youfollow.me/<%=slashwhat%>' />
			<br><a href='http://chart.apis.google.com/chart?cht=qr&chs=400x400&chl=http://youfollow.me/<%=slashwhat%>' style="align:center">Print this code</a></div>
			<div id="logo"><img src="/img/logoblacksmall.png"/></div>
			<img src="http://code.google.com/appengine/images/appengine-silver-120x30.gif" 
alt="Powered by Google App Engine" />
		</div>
		<div class="span-11" id = "socialaccountsheader">
			<h3>Where you can follow me</h3>
	 		<div class="socialcontainer">
	 		    <script>numBoxes = <%=sp.getAccounts().size()%>;</script>
	 		    <%
	 		        for (int i = 0; i < sp.getAccounts().size(); i++) {
	 		            SocialAccount a = sp.getAccounts().get(i);
	 		            %>
	 		            <div class="<%=a.getServiceType().split(" ")[0]%>" id="socialbox<%=i%>">
	 		            <span id="username<%=i%>" style="display:none"><%=a.getUsername()%></span>
    	 		            <div id="tweetarea<%=i%>" class="span-17 last">
        	 		            <div class="span-17 last" id="span14<%=i%>">
        	 		            
        	 		            </div>
	 		                </div>
                        </div>
	 		            <%
	 		        }
	 		    %>
	 		</div>
		</div>
	</div>
<%} else {
    response.sendRedirect("/@"+slashwhat);
}
	}
%>
</div>
</body>
</html>