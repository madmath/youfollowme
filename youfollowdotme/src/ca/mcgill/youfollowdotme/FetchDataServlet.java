package ca.mcgill.youfollowdotme;

import java.io.IOException;
import java.util.logging.Logger;

import javax.jdo.JDOObjectNotFoundException;
import javax.jdo.PersistenceManager;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;

public class FetchDataServlet extends HttpServlet {

private static final Logger log = Logger.getLogger(FetchDataServlet.class.getName());
	
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
			resp.setContentType("application/json");
			resp.getWriter().print("{'success':false}");
			log.info("sending success false");
			return;
		}
		// username is well-formed at this point.
		if (username != null || !username.equals("")) {
			log.info("Got username request: " + username);
			SocialProfile sp;
    		try {
    			sp = pm.getObjectById(SocialProfile.class, username);
    			if (sp.getAuthor().equals(user)) {
    				JSONObject myJson = new JSONObject();
    				try {
						myJson.put("success", true);
						myJson.put("fullName", sp.getFullName());
						myJson.put("phoneNumber", sp.getPhoneNumber());
						myJson.put("email", sp.getEmail());
						myJson.put("address", sp.getAddress());
						myJson.put("description", sp.getDescription());
						myJson.put("yfmUsername", sp.getYfmUsername());
						myJson.put("title", sp.getTitle());
						myJson.put("accounts", sp.getAccounts());
						resp.setContentType("application/json");
						resp.getWriter().print(myJson.toString());
						log.info("Fetched: " + sp.toString());
						return;
					} catch (JSONException e) {
						e.printStackTrace();
					}
    				resp.setContentType("text/plain");
    				resp.getWriter().print("OWNER");
    				log.info("sending OWNER");
    			} else {
    				resp.setContentType("application/json");
    				resp.getWriter().print("{'success':false}");
    				log.info("sending success false");
    			}
    		} catch (JDOObjectNotFoundException e) {
    			resp.setContentType("application/json");
				resp.getWriter().print("{'success':false}");
				log.info("sending success false");
    		}
		} else {
			resp.setContentType("application/json");
			resp.getWriter().print("{'success':false}");
			log.info("sending success false");
		}
		
		
	}
}
