var MyApp = function(){
	var login = $("#login-form");
	var searchPanel = $("#searchPanel");
	var search = $("#search");
	var searchField = $("#search-field");
	var getMessageButton = $("#getMessages");
	var loginbutton = $("#login-btn");
	var email = $("#email");
	var password = $("#password");
	var messages = $("#messages");
	
	var searchText = function(text){
		$('li').removeClass();
		$('li:contains("' + text + '")').addClass("highlight");	
	};
	
	var renderMessages = function(jsondata){
		messages.empty();
		for(var i=0; i<jsondata.length; i++){
			messages.append("<li>" + jsondata[i].body + "</li>");
		}
	}
	
	var getMessages = function(){
		$.ajax('/messages', 
			{
				type: "GET",
				data: "token=" + localStorage.getItem("token"),
				success: function(data){
					try{
						var jsondata = $.parseJSON(data);
					} catch(err){
						alert("error gettting remote messages");
						return false;
					}
					
					
					if(jsondata.hasOwnProperty("error")){
						login.removeClass("hidden");
						searchPanel.addClass("hidden");
					} else {
						localStorage.setItem("messagesData", data);
						renderMessages(jsondata);
					}
				},
				error: function(){
					alert("error gettting messages");
				}
			}
		);	
	};
	
	return {
		init: function(){
			var token = localStorage.getItem("token");
			
			if(token) {
				searchPanel.removeClass("hidden");
				var localMessages = localStorage.getItem("messagesData");
				if(localMessages){
					renderMessages($.parseJSON(localMessages));
				}
				
				getMessages();
			} else {
				login.removeClass("hidden");
			}
			
			//Process login form 
			loginbutton.click(function(e){
				e.preventDefault();
				
				if(email.val().indexOf("@") < 0){
					email.parent().addClass("has-error");
					return false;
				}
				
				$.ajax('/login', 
					{
						type: "POST",
						
						data: {"email": email.val(), "password": password.val()},
						success: function(data){
							if(!data){return false;}
							try{
								var jsondata = $.parseJSON(data);
							} catch (err){
								alert("Error Loggin in");
								return false;
							}
							
							if(jsondata.hasOwnProperty("token")){
								localStorage.setItem("token", jsondata.token);
								login.remove();
								searchPanel.removeClass("hidden");
							} else {
								alert("Error Loggin in");
							}
								
							
						},
						error: function(){
							alert("error");
						}
					}
				);
			});
			
			email.keyup(function(){
				var that = $(this);
				if(that.val().indexOf("@") < 0){
					that.parent().addClass("has-error");
				} else {
					that.parent().removeClass("has-error").addClass("has-success");
				}
			});
			
			//Manually get the messages
			getMessageButton.click(function(e){
				e.preventDefault();
				getMessages();
				return false;
			});
			
			//Handle the seach button click 
			search.click(function(e){
				e.preventDefault();
				searchText(searchField.val());
			});

		}
	}
}

$(document).ready(function(){
	
	var app = new MyApp();
	app.init();
	
});