/* Copyright 2010 Mathieu Perreault and Marc Beaupre */

package ca.mcgill.youfollowdotme;

import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

import com.google.appengine.api.datastore.Key;

@PersistenceCapable
public class SocialAccount {

	@PrimaryKey
    @Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
    private Key key;

	@Persistent
	private String username;

	@Persistent
	private String serviceType;

	@Persistent
	private String authToken;


	public SocialAccount(String username, String serviceType){
		this.username = username;
		this.serviceType = serviceType;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getServiceType() {
		return serviceType;
	}

	public void setServiceType(String serviceType) {
		this.serviceType = serviceType;
	}

	public String getAuthToken() {
		return authToken;
	}

	public void setAuthToken(String authToken) {
		this.authToken = authToken;
	}

	@Override
	public String toString() {
		return "Social Account\nType: " + this.getServiceType() + "\nUsername: " +
			this.getUsername() + "\nToken: " + this.getAuthToken();
	}
}
