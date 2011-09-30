
var pageShown;
var linecount;
var whichPage;
var numBoxes;
var tmpid;
var tmpidp;
var tofillusername;
var backgroundsUrl = [undefined, undefined, "http://farm4.static.flickr.com/3168/2995101968_dcc2fd69ef_o.jpg", "http://farm1.static.flickr.com/43/108641309_7026b56115_o.jpg","http://farm2.static.flickr.com/1259/1441640750_942a70a952_o.jpg","http://farm1.static.flickr.com/78/203977901_831fafc920_o.jpg"];
var backgroundsAuthor = [undefined, undefined, "Gidzy", "SeeMidTN.com (aka Brent)", "WireLizard", "The Pug Father"];
var backgroundsDark = [false, true, true, true, true, true];
var bcindex = 0;

String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g,"");
}

String.prototype.startsWith = function(str){
    return (this.indexOf(str) === 0);
}
// This function is executed when the page is loaded.
$(document).ready(function(event){
  if (window.location == "http://youfollow.me/" || window.location == "http://www.youfollow.me/" || window.location == "http://www.youfollow.me" || window.location == "http://youfollow.me") {
	  window.location = "http://hey.youfollow.me/";
  }
  // Nice fading effect.
  changeBackgrounds();
  $("#cb").click(function(event){
    event.preventDefault();
    changeBackgrounds();
  });
  if (whichPage == "create") {
      $(".vanish").click(function(event) {
                var saveIt = $(event.target).val();
                if (isDefaultKeyword(saveIt)){
                    $(event.target).css("color", "black");
                    $(event.target).val("");
                    $(event.target).blur(function(ev) {
                        if ($(ev.target).val() == "") {
                            $(ev.target).css("color", "grey");
                            $(ev.target).val(saveIt);
                        }
                    });
                } else {
                    $(event.target).css("color", "black");
                }
            });
      $("#restofpage").hide();
      linecount = 0;
      if (tofillusername != null) {
        usernameIsAvailable(tofillusername);
        $("input[id='usernameInput']").val(tofillusername);
      }
      $("input[id='usernameInput']").keyup(function(event){
        $('#loadingcheck').show();
        usernameIsAvailable($("#usernameInput").val());
      });
  $("#submitbutton").click(saveData);    
  } else {
    for (var i = 0; i < numBoxes; i++) {
        var service = $("#socialbox"+i);
        if (service.hasClass("Twitter")){
            // Twitter updating code...
            var username = service.children("#username"+i).html().trim();
            refreshTweets(username, i);
            continue;
        }
        if (service.hasClass("Google")){
            // Google Buzz updating code...
            var username = service.children("#username"+i).html().trim().split("@")[0];
            refreshBuzz(username, i);
            continue;
        }
        if (service.hasClass("Picasa")){
            // Picasa updating code...
            var username = service.children("#username"+i).html().trim().split("@")[0];
            refreshPicasa(username, i);
            continue;
        }
        if (service.hasClass("Flickr")){
            // Picasa updating code...
            var username = service.children("#username"+i).html().trim().split("@")[0];
            refreshFlickr(username, i);
            continue;
        }
        if (service.hasClass("Other")){
            // Other updating code
            var url = service.children("#username"+i).html().trim();
            addOtherService(url, i);
            continue;
        }
    }
  }
});

function isDefaultKeyword(text) {
    if (text == "Name") {
        return true;
    } else if (text == "Phone") {
        return true;
    } else if (text == "Email") {
        return true;
    } else if (text == "Address") {
        return true;
    } else if (text == "Title") {
        return true;
    } else if (text == "your username or url") {
        return true;
    } else if (text == "Write something about yourself...") {
        return true;
    } else {
        return false;
    }
}
function changeBackgrounds() {
    if (backgroundsUrl[bcindex] == undefined) {
        $("#bckimg").html("");
        $("#attribution").html("");
    } else {
        $("#bckimg").html("<img src='"+backgroundsUrl[bcindex]+"' id='backgroundimg'/>");
        $("#attribution").html("Photo by "+backgroundsAuthor[bcindex] + " on <a href='http://www.flickr.com'>Flickr</a>");
    }
    
    if (backgroundsDark[bcindex]){
        $("body").css("color", "white");
        $("body").css("background", "black");
        $("#logo img").attr("src","/img/logowhitesmall.png");
    } else {
        $("body").css("color", "black");
        $("body").css("background", "white");
        $("#logo img").attr("src","/img/logoblacksmall.png");
    }
    bcindex = (bcindex + 1) % backgroundsUrl.length;
}

function usernameIsAvailable(username) {
    $.get("/check/"+username, function (data) {
        if (data == "AVAILABLE") {
           $('#loadingcheck').hide();
           $("#taken").hide();
           $("#avail").show();
           $("#yours").html('');
           $("#restofpage").show();
        } else if (data == "OWNER") {
           $('#loadingcheck').hide();
            $("#taken").hide();
           $("#avail").hide();
           $("#restofpage").hide();
           $("#yours").html("<h3>it's your page! go to <a href='/"+username+"'>it</a>, or edit <a href='#edit'>it</a></h3>");
           $("a[href='#edit']").click(function(event){
             $.getJSON("/fetch/"+username, function(data) {
                if (data.success) {
                    $("#usernameInput").val(data.yfmUsername);
                    $("#nameInput").val(data.fullName);
                    $("#titleInput").val(data.title);
                    $("#emailInput").val(data.email);
                    $("#phoneInput").val(data.phoneNumber);
                    $("#addressInput").val(data.address);
                    $("#descriptionInput").val(data.description);
                    for (var j = 0; j < data.accounts.length; j++){
                        $("#account" + j).val(data.accounts[j].username);
                        var sele = "#type" + j;
                        $("#type" + j +" :selected").attr("selected", "");
                        $(sele).children("#"+data.accounts[j].serviceType.split(" ")[0]).attr("selected", "selected");
                    }
                }
             });
             $("#restofpage").show();
           });
        } else {
           $('#loadingcheck').hide();
           $("#taken").show();
           $("#avail").hide();
           $("#yours").html('');
        $("#restofpage").hide();
        }
    });
}

function addOtherService(url, i) {
    if (!url.startsWith("http://")) {
        url = "http://" + url;
    }
    $('#tweetarea'+i).append("<h3>You can also find me on <a href='"+url+"'>here</a> as well!</h3>");
}

function refreshTweets(username, what) {
  var urlJSON = "http://search.twitter.com/search.json?since_id=0&q=from:"+username+"&callback=?";
  var username = "";
  // Form the request url. callback=? is meant for jquery JSONP.
  $.getJSON(urlJSON, function(json) {
    if (json == null) {  
      return;
    }
    $('#tweetarea'+what).hide();
    var lengthof = json.results.length > 4 ? 4 : json.results.length;
      // Populate the list with the Buzzes.
      for (var j = 0; j < lengthof; j++) {
      //$.each(json.data.items, function(i,item){
        var item = json.results[j];
        if (j == 0) {
           username = item.from_user;
           $('#span14'+what).append("<fieldset><legend><img src='" + item.profile_image_url + "' width='48' height='48'/><span class='inset'>&nbsp;Twitter&nbsp;</span></legend><div id='postarea"+what+"'>");
        }
        $('#postarea'+what).append(createTweet(item.text.replace("\n", "")));//, item.actor.thumbnailUrl))
        if (j == lengthof - 1) {
            $('#postarea'+what).append("<span id='followmelink'><a href='http://www.twitter.com/"+username+"'>Follow me on Twitter!</a></span>");
            $('#span14'+what).append("</fieldset></div>");
            $('#tweetarea'+what).fadeTo("fast", 1.0);
            return;
        }
        //});
      }
      $('#tweetarea'+what).show();
  });
}

function refreshPicasa(username, which) {
    var urlPicasa = "https://picasaweb.google.com/data/feed/api/user/"+username+"?kind=photo&max-results=4&alt=json"
      // Use the standard request to be able to specify a custom callback field.
      $.ajax({
        url: urlPicasa,
        dataType: 'jsonp',
        jsonpCallback: 'popPicasa'    
      });
      tmpidp = which;
}

function refreshFlickr(username, whats){
    var flickrUrl = "http://api.flickr.com/services/rest/?method=flickr.people.findByUsername&api_key=b51089ec3e651d01f57e7c8ba73bf19a&username="+username+"&format=json&jsoncallback=?";
    $.getJSON(flickrUrl, function(data) {
        if (data.stat == "ok") {
            var flickrNSID = data.user.nsid;
                if (flickrNSID == null) {
                    return;
            }
            flickrUrl = "http://api.flickr.com/services/rest/?method=flickr.people.getPublicPhotos&api_key=b51089ec3e651d01f57e7c8ba73bf19a&user_id=" + flickrNSID+ "&per_page=8&page=1&format=json&jsoncallback=?";
            $('#tweetarea'+whats).hide();
            $.getJSON(flickrUrl, function(data){
                var lengthof = data.photos.photo.length;
                $.each(data.photos.photo, function(i,item){
                    //build the url of the photo in order to link to it
                    var photoURL = 'http://farm' + item.farm + '.static.flickr.com/' + item.server + '/' + item.id + '_' + item.secret + '_s.jpg'
                    if (i == 0) {
                       $('#span14'+whats).append("<fieldset><legend>Flickr</span></legend><div id='postarea"+whats+"'>");
                    }
                    $("#postarea"+whats).append("<a href='http://www.flickr.com/photos/"+flickrNSID+"/"+item.id+"'><img src='"+photoURL+"'/></a>&nbsp;");
                    if (i == lengthof - 1) {
                        $('#postarea'+whats).append("<br/><span id='followmelink'><a href='http://www.flickr.com/photos/"+flickrNSID+"'>Follow me on Flickr!</a></span>");
                        $('#span14'+whats).append("</fieldset></div>");
                        $('#tweetarea'+whats).fadeTo("fast", 1.0);
                    }
                });
            });
            $('#tweetarea'+whats).fadeTo("fast", 1.0);
        }
    });
}

// Refresh the Google Buzz list.
function refreshBuzz(username, which) {
  var urlBuzz = "https://www.googleapis.com/buzz/v1/activities/"+username+"/@public?alt=json";
  var kurlJSON = urlBuzz;
  // Use the standard request to be able to specify a custom callback field.
  $.ajax({
    url: kurlJSON,
    dataType: 'jsonp',
    jsonpCallback: 'popBuzz'    
  });
  tmpid = which;
}

// Callback function when the data from Google Buzz comes back.
function popBuzz(json) {
  if (json == null || json.data == null) {
    return;
  }
  $('#tweetarea'+tmpid).hide();
  // Populate the list with the Buzzes.
  var lengthof = json.data.items.length > 4 ? 4 : json.data.items.length;
  for (var j = 0; json.data.items != undefined && j < lengthof; j++) {
  //$.each(json.data.items, function(i,item){
    var item = json.data.items[j];
    if (j == 0) {
        var thumbURL = item.actor.thumbnailUrl == ""? "": "<img src='" + item.actor.thumbnailUrl + "' width='48' height='48'/>"; 
       $('#span14'+tmpid).append("<fieldset><legend>"+thumbURL+"<span class='inset'>&nbsp;Google Buzz&nbsp;</span></legend><div id='postarea"+tmpid+"'>");
    }
    if (j == lengthof - 1) {
        $('#postarea'+tmpid).append("<span id='followmelink'><a href='"+item.actor.profileUrl+"'>Follow me on Google Buzz!</a></span>");
        $('#span14'+tmpid).append("</fieldset></div>");
        $('#tweetarea'+tmpid).fadeTo("fast", 1.0);
        return;
    }
    $('#postarea'+tmpid).append(createTweet(item.object.content.replace("\n", "")));//, item.actor.thumbnailUrl));
    //});
  }
}

function popPicasa(json) {
  if (json == null || json.feed == null) {
    return;
  }
  $('#tweetarea'+tmpidp).hide();
  // Populate the list with the Buzzes.
  for (var j = 0; json.feed.entry != undefined && j < json.feed.entry.length; j++) {
  //$.each(json.data.items, function(i,item){
    var item = json.feed.entry[j];
    if (j == 0) {
       $('#span14'+tmpidp).append("<fieldset><legend><img src='" + json.feed['gphoto$thumbnail']['$t'] + "' width='48' height='48'/><span class='inset'>&nbsp;Google Picasa&nbsp;</span></legend><div id='postarea"+tmpidp+"'>");
    }
    $("#postarea"+tmpidp).append("<a href='"+ item.link[1].href+"'><img src='"+item['media$group']['media$thumbnail'][1].url+"'/></a>&nbsp;");
    if (j == 3) {
        $('#postarea'+tmpidp).append("<br/><span id='followmelink'><a href='"+json.feed.author[0].uri['$t']+"'>Follow me on Google Picasa!</a></span>");
        $('#span14'+tmpidp).append("</fieldset></div>");
        $('#tweetarea'+tmpidp).fadeTo("fast", 1.0);
    }
    //});
  }
  $('#tweetarea'+tmpidp).show();
}

function saveData() {
    var yfmUsername = $("#usernameInput").val();
    var fullName = $("#nameInput").val();
    var title = $("#titleInput").val();
    var email = $("#emailInput").val();
    var phoneNumber = $("#phoneInput").val();
    var address = $("#addressInput").val();
    var description = $("#descriptionInput").val();
    var account0 = $("#account0").val(); var type0 = $("#type0 option:selected").text();
    var account1 = $("#account1").val(); var type1 = $("#type1 option:selected").text();
    var account2 = $("#account2").val(); var type2 = $("#type2 option:selected").text();
    var account3 = $("#account3").val(); var type3 = $("#type3 option:selected").text();
    var account4 = $("#account4").val(); var type4 = $("#type4 option:selected").text();
    var account5 = $("#account5").val(); var type5 = $("#type5 option:selected").text();
    
    $.get("/save/", {"yfmUsername":yfmUsername, "fullName":fullName, "title":title, "email":email, "phoneNumber":phoneNumber, "address":address, "description":description, "accounts[]":[account0, account1, account2, account3, account4, account5], "types[]":[type0, type1, type2, type3, type4, type5]}, function(data){
        if (data == "OK") {
            window.location.replace("/" + yfmUsername);
        }
    });
}

// Create a DOM structure supporting the "tweets" (or Buzzes).
function createTweet(text) {
  var tweetdom = "<div class='socialpost'>";
  if (text != null) {
    tweetdom += text;
  }
  tweetdom += "</div>";
  return tweetdom;
}
















