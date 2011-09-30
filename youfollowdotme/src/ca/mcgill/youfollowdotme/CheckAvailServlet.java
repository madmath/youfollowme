/* Copyright 2010 Mathieu Perreault and Marc Beaupre */

package ca.mcgill.youfollowdotme;

import java.io.IOException;
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
public class CheckAvailServlet extends HttpServlet {

	private static final Logger log = Logger.getLogger(CheckAvailServlet.class.getName());

	@Override
	public void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws IOException {
		// Get User associated with the Google Account.
		UserService userService = UserServiceFactory.getUserService();
        User user = userService.getCurrentUser();
        // Get PersistenceManager.
        PersistenceManager pm = PMF.get().getPersistenceManager();
		String username;
        try {
			username = req.getRequestURI().split("/")[2].toLowerCase();
		} catch (Exception e) {
			resp.setContentType("text/plain");
			resp.getWriter().print("NOTAVAILABLE");
			log.info("sending NOTAVAILABLE");
			return;
		}
		if (username != null || !username.equals("")) {
			log.info("Got username request: " + username);
			SocialProfile sp;
    		try {
    			sp = pm.getObjectById(SocialProfile.class, username);
    			if (sp.getAuthor().equals(user)) {
    				resp.setContentType("text/plain");
    				resp.getWriter().print("OWNER");
    				log.info("sending OWNER");
    			} else {
    				resp.setContentType("text/plain");
    				resp.getWriter().print("NOTAVAILABLE");
    				log.info("sending NOTAVAILABLE");
    			}
    		} catch (JDOObjectNotFoundException e) {
    			resp.setContentType("text/plain");
    			resp.getWriter().print("AVAILABLE");
    			log.info("sending AVAILABLE");
    		}
		} else {
			resp.setContentType("text/plain");
			resp.getWriter().print("NOTAVAILABLE");
			log.info("sending NOTAVAILABLE (empty or null username)");
		}
	}

}
