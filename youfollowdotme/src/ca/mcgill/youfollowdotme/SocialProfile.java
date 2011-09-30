package ca.mcgill.youfollowdotme;

import com.google.appengine.api.users.User;

import java.util.Date;
import java.util.List;

import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

@PersistenceCapable
public class SocialProfile {
	
	@PrimaryKey
    @Persistent
    private String yfmUsername;
    
    @Persistent
    private User author;
    
    @Persistent
    private String description;
    
    @Persistent
    private String fullName;
    
    @Persistent
    private String title;
    
    @Persistent
    private String phoneNumber;
    
    @Persistent
    private String email;
    
    @Persistent
    private String address;
    
    @Persistent
    private List<SocialAccount> accounts;

    @Persistent
    private Date date;

    public SocialProfile(User author, String yfmUsername, Date date) {
        this.author = author;
        this.yfmUsername = yfmUsername;
        this.date = date;
    }

//    public Key getKey() {
//        return key;
//    }

    public User getAuthor() {
        return author;
    }

    public Date getDate() {
        return date;
    }

    public void setAuthor(User author) {
        this.author = author;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public List<SocialAccount> getAccounts() {
		return accounts;
	}

	public void setAccounts(List<SocialAccount> accounts) {
		this.accounts = accounts;
	}

	public String getYfmUsername() {
		return yfmUsername;
	}

	public void setYfmUsername(String yfmUsername) {
		this.yfmUsername = yfmUsername;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getFullName() {
		return fullName;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String toString() {
		StringBuffer accountsb = new StringBuffer();
		for (SocialAccount a: this.getAccounts()) {
			accountsb.append(a.toString() + "\n");
		}
		return "\nSocial Profile for username: " + this.getYfmUsername() + "\nAuthor: " + this.getAuthor().getNickname() + "\nFull Name: " +
			this.getFullName() + "\nEmail: " + this.getEmail() + "\nDescription: " + 
			this.getDescription() + "\nPhone: " + this.getPhoneNumber() + "\nAddress: " +
			this.getAddress() + ((accountsb.length() > 0) ? "\nAccounts: " + accountsb.toString() : "");
	}
}