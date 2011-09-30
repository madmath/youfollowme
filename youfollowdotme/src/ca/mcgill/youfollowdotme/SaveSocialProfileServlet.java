/* Copyright 2010 Mathieu Perreault and Marc Beaupre */

package ca.mcgill.youfollowdotme;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.logging.Logger;

import javax.jdo.JDOObjectNotFoundException;
import javax.jdo.PersistenceManager;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;

@SuppressWarnings("serial")
public class SaveSocialProfileServlet extends HttpServlet {

	private static final Logger log = Logger.getLogger(SaveSocialProfileServlet.class.getName());

	@Override
	public void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws IOException {
		// Get User associated with the Google Account.
		UserService userService = UserServiceFactory.getUserService();
        User user = userService.getCurrentUser();
        // Get PersistenceManager.
        PersistenceManager pm = PMF.get().getPersistenceManager();
        boolean update = false;
        // If user is not logged in to the Google Account.
        if (user != null) {
        	// Get youfollowme username (required).
        	String yfmu = req.getParameter("yfmUsername").toLowerCase();
        	if (isNullOrBlank(yfmu)) {
        	    log.info("Setting status code to Bad Request");
        		resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
        		return;
        	} else {
        		// yfmUsername is valid at this point.
        		// Check if there is a SocialProfile for this username in the database.
        		SocialProfile sp;
        		try {
        			sp = pm.getObjectById(SocialProfile.class, yfmu);
        			update = true;
        			if (!sp.getAuthor().equals(user)) {
        				log.info("Setting the response to Forbidden");
        				resp.setStatus(HttpServletResponse.SC_FORBIDDEN);
        				return;
        			}
        		} catch (JDOObjectNotFoundException e) {
        			sp = new SocialProfile(user, yfmu, new Date());
        		}
    			// Get parameters from the request and add them to SocialProfile.
    			String description = req.getParameter("description");
    			if (description != null && !description.equals("Write something about yourself...")) {
    				sp.setDescription(description);
    			}
    			String fullName = req.getParameter("fullName");
    			if (fullName != null && !fullName.equals("Name")) {
    				sp.setFullName(fullName);
    			}
    			String title = req.getParameter("title");
    			if (title != null && !title.equals("Title")) {
    				sp.setTitle(title);
    			}
    			String phoneNumber = req.getParameter("phoneNumber");
    			if (phoneNumber != null && !phoneNumber.equals("Phone")) {
    				sp.setPhoneNumber(phoneNumber);
    			}
    			String email = req.getParameter("email");
    			if (email != null && !email.equals("Email")) {
    				sp.setEmail(email);
    			}
    			String address = req.getParameter("address");
    			if (address != null && !address.equals("Address")) {
    				sp.setAddress(address);
    			}

    			// Get Accounts and if they are not null, add them to ArrayList.
    			ArrayList<SocialAccount> accounts = new ArrayList<SocialAccount>();
        		String[] accountsa = req.getParameterValues("accounts[]");
    			String[] types = req.getParameterValues("types[]");
        		for (int i = 0; i < accountsa.length ;i++){
    				String currentAccount = accountsa[i];
    				String currentServiceType = types[i];
    				if (!isNullOrBlank(currentAccount) && !currentAccount.equals("your username or url")) {
    					SocialAccount sa = new SocialAccount(currentAccount, currentServiceType);
    					// If there is a token here, do sa.setToken(token);
    					accounts.add(sa);
    				}
    			}
    			sp.setAccounts(accounts);
    			// Save it to the database!
    			if (update) {
    				pm.close();
    			} else {
    				pm.makePersistent(sp);
    			}
    			log.info("We wrote this Profile to the database: " + sp.toString());
    			resp.setContentType("text/plain");
    			resp.getWriter().print("OK");
        	}
        } else {
        	log.info("Forbidden because user is logged out: " + user);
            resp.setStatus(HttpServletResponse.SC_FORBIDDEN);
        }
	}

	public static boolean isNullOrBlank(String param) {
		return param == null || param.trim().length() == 0;
	}

}
