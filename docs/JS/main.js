//TODOs for Tomorrow:

//start the view code for rooms.
//IF you are a student u should not be able to see teacher bookings
//maybe start a gitub?

//TASK COMPLETE LIST!
//If mulitple admins are being added to a room then it should also show up on your resos on the other person's account
//do all the appropriate errormodules for internet connection problems.
//length check for add room, ROom ID can only be a certain length
//!! IMPORTANT write code that'll check whether or not the file the user uploaded is valid or not, check format to make sure SIMS doenst get custom and to make sure that the length and width of the files are correct.
//write and figure out the 30 min upload code and table

//you need to change how you store your data in each hidden span. 


//YOU NEED TO WORK OUT THE VIEWPORT FOR RECURRING BOOKINGS, THE STRUCTURe IS FUCKED


function bubble_Sort2DArray(a,sortIndex)//bubble sort algorithm, used throughout to sort arrays.
{
    var swapp;
    var n = a.length-1;
    var x=a;
    do {
        swapp = false;
        for (var i=0; i < n; i++)
        {
            if (x[i][sortIndex] > x[i+1][sortIndex])
            {
               var temp = x[i];
               x[i] = x[i+1];
               x[i+1] = temp;
               swapp = true;
            }
        }
        n--;
    } while (swapp);
 return x;
}
function bubble_SortJSONArray(a,sortValue)//bubble sort algorithm, used throughout to sort JSON Arrays, sort value is the value inside the json object that will be sorted, secondary sort value will be the second data to be sorted iF the first sort array is equal. .
{
    var swapp;
    var n = a.length-1;
    var x=a;
    do {
        swapp = false;
        for (var i=0; i < n; i++)
        {
            if (x[i][sortValue] > x[i+1][sortValue])
            {
               var temp = x[i];
               x[i] = x[i+1];
               x[i+1] = temp;
               swapp = true;
            }
        }
        n--;
    } while (swapp);
 return x;
}
function bubble_SortJSONMilestoneArray(a,sortValue)//bubble sort algorithm, used throughout to sort JSON MILESTONE Arrays, sort value is the value inside the json object that will be sorted, secondary sort value will be the second data to be sorted iF the first sort array is equal
{
	var swapp;
    var n = a.length-1;
    var x=a;
    do {
        swapp = false;
        for (var i=0; i < n; i++)
        {
            if (transformCurrentWeek(x[i][sortValue]) > transformCurrentWeek(x[i+1][sortValue]))
            {
               var temp = x[i];
               x[i] = x[i+1];
               x[i+1] = temp;
               swapp = true;
            }
        }
        n--;
    } while (swapp);
 return x;
}

function Login(usernames, passwords) //used to log a user into the main page
{
	var poolData = {
    UserPoolId : AdmimUserpoolID, // your user pool id here
    ClientId : AdminAppClientID // your app client id here
	};
	var userPool =
	new AmazonCognitoIdentity.CognitoUserPool(poolData);
	var userData = {
		Username : usernames, // your username here
		Pool : userPool
	};
    var authenticationData = {
        Username : usernames, // your username here
        Password : passwords, // your password here
    };
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);

    cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            var accessToken = result.getAccessToken().getJwtToken();
			document.getElementById("LoginErrMsg").style.color="green"
			document.getElementById("LoginErrMsg").innerHTML="Sucessfully Logged In"
			self.location="Pages/Make_Booking.html"
        },
        onFailure: function(err) {
			document.getElementById("LoginErrMsg").style.color="red"
            document.getElementById("LoginErrMsg").innerHTML=(err.message || JSON.stringify(err)) + "<br> All Fields Including Email are Case Sensitive";
        }
    });
}

function Logout() // used to log a user out of the page
{
	cognitoUser=getCognitoUser();

	if (cognitoUser != null)
	{
    	cognitoUser.signOut();
		self.location="../index.html";
    }
}

function createNewUser(emails,password) //CreateNewUser
{
	var poolData = {
        UserPoolId : AdmimUserpoolID, // Your user pool id here
        ClientId : AdminAppClientID // Your client id here
    };
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    var attributeList = [];

    var dataEmail = {
        Name : 'email', //user email
        Value : emails //the variable pushed into the method
    };

    var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail); //creating a user attribuit of email

    attributeList.push(attributeEmail); //push all the attribuites into a attribute list linked-list

    userPool.signUp(emails, password, attributeList, null, function(err, result){ //function to signup
        if (err) { //if signup failed
			document.getElementById("SignupErrMsg2").style.color="red";
            document.getElementById("SignupErrMsg2").innerHTML=(err.message || JSON.stringify(err)); //why there is an error, output to user
            return;
        }
        cognitoUser = result.user; //signup sucessful
		createNewUserAddtoDB(emails,$("#whoAreYouSelect").val(),cognitoUser);
    });
}

function createNewUserAddtoDB(emailz,rolez,CUSER) // Used to create a new user on the DynamoDB side, adding to the user list to be mananged on the main landing page
{
	$.ajax({
		type:'POST',
		url:DCBBookingsCreateUserDBAPI,
		data:JSON.stringify({
			"email":emailz,
			"account":"Active",
			"bookmarkedResources":["Empty List"],
			"recentlyBookedResources":["Empty List"],
			"role":rolez,
			userBookings:["Empty List"],
			userControlledResources:["Empty List"]
		}),
		contentType:"application/json",
		success:function(data)
		{
			document.getElementById("SignupErrMsg2").style.color="green";
        	document.getElementById("SignupErrMsg2").innerHTML=("Welcome! "+ CUSER.getUsername() + " <br>Please access your email to verify your account. <br><br><em><strong>Please Check Your Junk Folder</strong></em>"); //ouput sucessful to the user
		},
		error:function(data)
		{
			document.getElementById("SignupErrMsg2").style.color="green";
			document.getElementById("SignupErrMsg2").innerHTML = ("Welcome! "+ CUSER.getUsername() + "<br>Please access your email to verify your account. <br><br><em><strong>Please Check Your Junk Folder</strong></em>");
		}
	});

}

function createNewUserAddtoDB2(emailz,rolez)// Used to create a new user on the DynamoDB side, adding to the user list to be mananged on the make booking page
{
	$.ajax({
		type:'POST',
		url:DCBBookingsCreateUserDBAPI,
		data:JSON.stringify({
			"email":emailz,
			"account":"Active",
			"bookmarkedResources":["Empty List"],
			"recentlyBookedResources":["Empty List"],
			"role":rolez,
			userBookings:["Empty List"],
			userControlledResources:["Empty List"]
		}),
		contentType:"application/json",
		success:function(data)
		{
			location.reload();
		},
		error:function(data)
		{
			document.getElementById("starterPgErrMsg").style.color="red";
			document.getElementById("starterPgErrMsg").innerHTML = ("Error in connection to database, please try again.");
		}
	});
}

function getUserInfo(UserInfo) // get user info, used in the add resos func [createResos]
{
	userInfoFetchSuccess = false;
	userInfoFetchError = false;
	$.ajax({
		type:'PATCH',
		url:DCBBookingsChangeUserInfoAPI,
		data:JSON.stringify({
			"Key":"email",
			"searchAttr":UserInfo
		}),
		contentType:"application/json",
		success:function(data)
		{
			individualData = data;
			userInfoFetchSuccess = true;
		},
		error:function(data)
		{
			userInfoFetchError = true;
			errorModuleShow()
		}
	});
}
function updateUserInfo(updateAttr, updateVal) // update user info, used in add resos func [createResos]
{
	userInfoUpdateSuccess = false;
	userInfoUpdateError = false;

	$("#AddResosAddRoomErrMsg4").css("color","black");
	$("#AddResosAddRoomErrMsg4").html("Updating User Info...");
	$.ajax({
		type:'POST',
		url:DCBBookingsChangeUserInfoAPI,
		data:JSON.stringify({
			"email":userEmail,
			"updateAttr":updateAttr,
			"updateValue":updateVal
		}),
		contentType:"application/json",
		success:function(data)
		{
			userInfoUpdateSuccess = true;
		},
		error:function(data)
		{
			userInfoUpdateError = true;
			errorModuleShow()
		}
	});
}
function updateAnyUserInfo(emailKey, updateAttr, updateVal) //update any user info, that you have the email key for.
{
	userInfoUpdateSuccess = false;
	userInfoUpdateError = false;
	$.ajax({
		type:'POST',
		url:DCBBookingsChangeUserInfoAPI,
		data:JSON.stringify({
			"email":emailKey,
			"updateAttr":updateAttr,
			"updateValue":updateVal
		}),
		contentType:"application/json",
		success:function(data)
		{
			userInfoUpdateSuccess = true;
		},
		error:function(data)
		{
			userInfoUpdateError = true;
			errorModuleShow()
		}
	});
}

function forgotPassword(username) //used to verify and send a code to the forgotten passcode
{

	var poolData = {
        UserPoolId : AdmimUserpoolID, // Your user pool id here
        ClientId : AdminAppClientID // Your client id here
    };
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

	cognitoUser = new AmazonCognitoIdentity.CognitoUser({
			Username: username,
			Pool: userPool
		});

		// call forgotPassword on cognitoUser
		cognitoUser.forgotPassword({
			onSuccess: function(result) {
				console.log('call result: ' + (result.message || JSON.stringify(result)));
				plusSlides(1);
				$("#ForgotPassErrMsg2").css("color","green")
				$("#ForgotPassErrMsg2").html("Code sent to your registered email<br><br><em><strong>Please Check your Junk Folder</strong></em>");

			},
			onFailure: function(err) {
				console.log((err.message || JSON.stringify(err)));
				$("#ForgotPassErrMsg1").html((err.message || JSON.stringify(err)));
			}
		});
}

function confirmForgottenPassword(username,code,newPassword) // used to change the password with the code sent in the forgotten password flow
{
	var poolData = {
        UserPoolId : AdmimUserpoolID, // Your user pool id here
        ClientId : AdminAppClientID // Your client id here
    };
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

	cognitoUser = new AmazonCognitoIdentity.CognitoUser({
        Username: username,
        Pool: userPool
    }),

    cognitoUser.confirmPassword(code, newPassword, {
	  onSuccess: function(result) {
		  console.log(result)
		  $("#ForgotPassErrMsg2").css("color","green")
		  $("#ForgotPassErrMsg2").html("Success, Password Changed")
		},
	  // ...
	  onFailure: function(err) {
		  console.log((err.message || JSON.stringify(err)))
	  	  $("#ForgotPassErrMsg2").css("color","red")
		  $("#ForgotPassErrMsg2").html((err.message || JSON.stringify(err)))
	  }
	})
}

function getCognitoUser() // gets the current user, makes sure that the user is currently logged in.
{
	var data =
	{
		UserPoolId : AdmimUserpoolID,
        ClientId : AdminAppClientID
    };
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(data);
    var cognitoUser = userPool.getCurrentUser();

    if (cognitoUser != null)
	{
        cognitoUser.getSession(function(err, session)
		{
            if (err)
			{
                console.log(err);
				self.location="../index.html"
                return;
            }
            console.log('session validity: ' + session.isValid());
        });
		return cognitoUser;
    }
	else
	{
		self.location="../index.html"
	}
}

function getUserEmail() // get email of current user
{
	cognitoUser = getCognitoUser()
	cognitoUser.getUserAttributes(function(err, result) {
        if (err) {
            console.log(err);
			errorModuleShow()
            return;
        }
		userEmail = result[2]["Value"];
	});
}

function dynamicGenerateUpcomingBookings(data)//dynamically generate the list for upcoming Bookings and then append it to the main page
{
	var listOfItems;
	if(data["userBookings"]=="Empty List")
	{
		listOfItems = "<a href='#'>"+data["userBookings"][0]+"</a>"
	}

	$("#upcomingBookingsList").html(listOfItems);
}
function dynamicGenerateYourResos(data)//dynamically generate the list for your resources and then append it to the main page
{
	var listOfItems;
	if(data["userControlledResources"]=="Empty List")
	{
		$("#whatResultsText").html("Your Resources:")
		listOfItems = "<em>[You do not manage any resources]<br>You may create one with the options dropdown on the top right corner</em>"
		$("#EmptyMsg").html(listOfItems);
	}
	else
	{
		var sortedList = bubble_Sort2DArray(data["userControlledResources"],0);
		
		allResosHTML = "" //HTML for appending to the main page for All Resos
		//allResos [roomid, resostype]
		var bookmarkClass = "fa fa-bookmark-o imgBtn bookmark"; //will change depending on whether or not your box is a bookmarkedBox
		var bookMarkFunction = "";
		var tempObject = [];
		var tempHTML = "";
		var ResosID = "";//id of each box
		allResos = [];
		// !!IMPORTATNT design fallback in the generate allresos section if the array is empty

		for(var i = 0; i<sortedList.length; i++) // generating Big Array containing all the roomIDs and their Resos Type
		{
			tempObject = [];
			tempObject.push(sortedList[i][0]);
			tempObject.push(sortedList[i][1]);
			allResos.push(tempObject);
		}
		//have to add the 2 other for loops for datadevice and datasub
		for(var i = 0; i<allResos.length; i++)
		{
			bookMarkFunction = 'bookmarkIt(\''+allResos[i][0]+'\',\''+allResos[i][1]+'\');'
			ResosID = allResos[i][0]+":"+allResos[i][1]; //"resosID:ResosType"
			bookmarkClass = "fa fa-bookmark-o imgBtn bookmark";
			for(var j = 0; j<data["bookmarkedResources"].length; j++)//checking if resos is bookmarked
			{
				if(data["bookmarkedResources"][j][0] == allResos[i][0] && data["bookmarkedResources"][j][1] == allResos[i][1]) // if resos is bookmarked by the user both resos type and resos ID must match
				{
					bookmarkClass = "fa fa-bookmark imgBtn bookmark"; //change the bookmarkClassImg
					bookMarkFunction = 'unBookmarkIt(\''+allResos[i][0]+'\',\''+allResos[i][1]+'\');'//change the bookmark click function
				}
			}
			tempHTML = '<div id="'+ResosID+'" class="Box '+allResos[i][1]+'"><i onClick="'+bookMarkFunction+'" class="'+bookmarkClass+'" aria-hidden="true"></i><p><strong>'+allResos[i][0]+'</strong><br><em>'+allResos[i][1]+'</em></p><button class="btnSuccessOutline" onClick="viewResos(\''+allResos[i][0]+'\',\''+allResos[i][1]+'\',\''+new Date()+'\');">View</button></div>'
			allResosHTML += tempHTML;
		}
		$("#EmptyMsg").html("");
		$("#SearchResultsAndRV").html(allResosHTML);
	}	
}
function dynamicGenerateAllResos(dataRoom,dataDevice,dataSub,userData) //requires dataRoom, DataDevice data sub and user data in array from, not raw JSON Form.
{
	allResosHTML = "" //HTML for appending to the main page for All Resos
	//allResos [roomid, resostype]
	var bookmarkClass = "fa fa-bookmark-o imgBtn bookmark"; //will change depending on whether or not your box is a bookmarkedBox
	var bookMarkFunction = "";
	var tempObject = [];
	var tempHTML = "";
	var ResosID = "";//id of each box
	allResos = [];
	// !!IMPORTATNT design fallback in the generate allresos section if the array is empty
	if(dataRoom.length!=0) // will sort room array if its not empty
	{
		dataRoom = bubble_SortJSONArray(dataRoom,"RoomID")// if array is not empty sort it alphabetically.
	}

	for(var i = 0; i<dataRoom.length; i++) // generating Big Array containing all the roomIDs and their Resos Type
	{
		tempObject = [];
		tempObject.push(dataRoom[i]["RoomID"]);
		tempObject.push("room");
		allResos.push(tempObject);
	}
	//have to add the 2 other for loops for datadevice and datasub
	for(var i = 0; i<allResos.length; i++)
	{
		bookMarkFunction = 'bookmarkIt(\''+allResos[i][0]+'\',\''+allResos[i][1]+'\');'
		ResosID = allResos[i][0]+":"+allResos[i][1]; //"resosID:ResosType"
		bookmarkClass = "fa fa-bookmark-o imgBtn bookmark";
		for(var j = 0; j<userData["bookmarkedResources"].length; j++)//checking if resos is bookmarked
		{
			if(userData["bookmarkedResources"][j][0] == allResos[i][0] && userData["bookmarkedResources"][j][1] == allResos[i][1]) // if resos is bookmarked by the user both resos type and resos ID must match
			{
				bookmarkClass = "fa fa-bookmark imgBtn bookmark"; //change the bookmarkClassImg
				bookMarkFunction = 'unBookmarkIt(\''+allResos[i][0]+'\',\''+allResos[i][1]+'\');'//change the bookmark click function
			}
		}
		tempHTML = '<div id="'+ResosID+'" class="Box '+allResos[i][1]+'"><i onClick="'+bookMarkFunction+'" class="'+bookmarkClass+'" aria-hidden="true"></i><p><strong>'+allResos[i][0]+'</strong><br><em>'+allResos[i][1]+'</em></p><button class="btnSuccessOutline" onClick="viewResos(\''+allResos[i][0]+'\',\''+allResos[i][1]+'\',\''+new Date()+'\');">View</button></div>'
		allResosHTML += tempHTML;
	}
	if(allResosHTML == "")//fallback incase all 3 arrays are empty
	{
		allResosHTML = "Empty List..."
	}
	$("#SearchResultsAndRV").html(allResosHTML);
}
function dynamicGenerateBookmarkedResos(userData)//requires user data in array from, not raw JSON Form.
{
	BookmarkedResos = userData["bookmarkedResources"];
	BookmarkedResosHTML = "";
	var tempHTML = "";
	var n= 0; // number of times the code will loop

	if(BookmarkedResos.length != 0)//will only sort if the array isnt empty
	{
		BookmarkedResos = bubble_Sort2DArray(BookmarkedResos,0);
		if(BookmarkedResos[0]!="Empty List")//will only loop if the list isnt empty.
		{
			n = BookmarkedResos.length;
		}
	}

	var bookmarkClass = "fa fa-bookmark imgBtn bookmark"; //change the bookmarkClassImg
	var bookMarkFunction = "";

	for(var i = 0; i<n; i++)
	{
		var ResosID = BookmarkedResos[i][0]+":"+BookmarkedResos[i][1]+"BM"
		bookMarkFunction = 'unBookmarkIt(\''+BookmarkedResos[i][0]+'\',\''+BookmarkedResos[i][1]+'\');'//change the bookmark click function
		tempHTML = '<div id="'+ResosID+'" class="Box '+BookmarkedResos[i][1]+'"><i onClick="'+bookMarkFunction+'" class="'+bookmarkClass+'" aria-hidden="true"></i><p><strong>'+BookmarkedResos[i][0]+'</strong><br><em>'+BookmarkedResos[i][1]+'</em></p><button class="btnSuccessOutline" onClick="viewResos(\''+BookmarkedResos[i][0]+'\',\''+BookmarkedResos[i][1]+'\',\''+new Date()+'\');">View</button></div>'
		BookmarkedResosHTML+=tempHTML;
		//console.log(tempHTML);
	}
	if(BookmarkedResosHTML == "")
	{
		BookmarkedResosHTML = "<em><p>Empty List...</p></em>"
	}
	$("#SearchResultsAndRV").html(BookmarkedResosHTML);
}

function populateYourResos()
{
	$("#SearchResultsAndRV").html('<p id="EmptyMsg" style="color: white; margin: 0;"></p>');
	$("#EmptyMsg").html("<em>LOADING...</em>");
	$("#whatResultsText").html('<i onClick="goBackToRV();" class="imgBtn fa fa-arrow-left" aria-hidden="true"></i> Back')
	$("#viewTextMainPage").html("[My Resources]")
	$("#searchBarAndTitle").hide();
	
	$("#MainPageModule").removeClass("MainPageSearch")
	$("#MainPageModule").addClass("moveUpSearch")
	
	$("#SearchResultsAndRV").removeClass("withSearchBarWidth")
	$("#SearchResultsAndRV").addClass("withoutSearchBarWidth")
	
	roomDataFetchSuccess = false;
	userInfoFetchSuccess = false; 
	validateUserInfoFetched();
	getUserInfo(userEmail);
	function validateUserInfoFetched()
	{
		//output messages to make the wait seem more bearable

		$("#MyResosList").html("<em><p>Fetching new data...</p></em>")

		//output messages end

		if(userInfoFetchSuccess == false)
		{
			window.setTimeout(validateUserInfoFetched,1000);
		}
		else
		{
			dynamicGenerateYourResos(individualData["Items"][0]);
			userInfoFetchSuccess = false;
		}
	}
}

function populateAllResos() // populates the all Resos HTML in main page
//first 3 boolean parameters, when true, this function will also automically populate the bookmark div and the recently visited div and the your resos list, if these paramters aare true.
{
	$("#SearchResultsAndRV").html('<p id="EmptyMsg" style="color: white; margin: 0;"></p>');
	$("#EmptyMsg").html("<em>LOADING...</em>");
	$("#whatResultsText").html('<i onClick="goBackToRV();" class="imgBtn fa fa-arrow-left" aria-hidden="true"></i> Back')
	$("#viewTextMainPage").html("[All Resources]")
	$("#searchBarAndTitle").hide();
	
	$("#MainPageModule").removeClass("MainPageSearch")
	$("#MainPageModule").addClass("moveUpSearch")
	
	$("#SearchResultsAndRV").removeClass("withSearchBarWidth")
	$("#SearchResultsAndRV").addClass("withoutSearchBarWidth")
	
	roomDataFetchSuccess = false;
	validateFetchRoom();
	getAllRooms();
	function validateFetchRoom() // will not continue until it knows that room has been fetched
	{
		//output messages to make the wait seem more bearable
		$("#allResosBoxes").css("color","black")
		$("#allResosBoxes").html("<em><p>Fetching all room data...</p></em>");
		//output messages end

		if(roomDataFetchSuccess == false) //if data is not fetched
		{
			window.setTimeout(validateFetchRoom,1000);
		}
		else
		{
			roomDataFetchSuccess = false;
			userInfoFetchSuccess = false;
			validateUserInfoFetched();
			getUserInfo(userEmail);
		}
	}
	//dont forget to run loops to make sure dataDevice and dataSub are also fetched before running the one below
	function validateUserInfoFetched()
	{
		//output messages to make the wait seem more bearable
		$("#allResosBoxes").html("<em><p>Success! building new HTML</p></em>");
		//output messages end

		if(userInfoFetchSuccess == false)
		{
			window.setTimeout(validateUserInfoFetched,1000);
		}
		else
		{
			dynamicGenerateAllResos(allRooms["Items"],[],[],individualData["Items"][0]) //parameters are: dataRoom, DataDeviece, datasubscription, user data
			userInfoFetchSuccess = false;
		}
	}
}
function populateBookmarkedResos()
{
	$("#SearchResultsAndRV").html('<p id="EmptyMsg" style="color: white; margin: 0;"></p>');
	$("#EmptyMsg").html("<em>LOADING...</em>");
	$("#whatResultsText").html('<i onClick="goBackToRV();" class="imgBtn fa fa-arrow-left" aria-hidden="true"></i> Back')
	$("#viewTextMainPage").html("[Bookmarks]")
	$("#searchBarAndTitle").hide();
	
	$("#MainPageModule").removeClass("MainPageSearch")
	$("#MainPageModule").addClass("moveUpSearch")
	
	$("#SearchResultsAndRV").removeClass("withSearchBarWidth")
	$("#SearchResultsAndRV").addClass("withoutSearchBarWidth")
	
	roomDataFetchSuccess = false;
	userInfoFetchSuccess = false; 
	validateFetchRoom();
	getAllRooms();
	function validateFetchRoom() // will not continue until it knows that room has been fetched
	{
		if(roomDataFetchSuccess == false) //if data is not fetched
		{
			window.setTimeout(validateFetchRoom,1000);
		}
		else
		{
			roomDataFetchSuccess = false;
			userInfoFetchSuccess = false;
			validateUserInfoFetched();
			getUserInfo(userEmail);
		}
	}
	//dont forget to run loops to make sure dataDevice and dataSub are also fetched before running the one below
	function validateUserInfoFetched()
	{
		if(userInfoFetchSuccess == false)
		{
			window.setTimeout(validateUserInfoFetched,1000);
		}
		else
		{
			dynamicGenerateBookmarkedResos(individualData["Items"][0]) //parameters are: user data
			userInfoFetchSuccess = false;
		}
	}
}

function getAllRooms()//get All the Rooms from the list
{
	$.ajax({ // checking to see if primary key repeats
		type:"GET",
		url:DCBBookingsResourceRoomAPI,
		success: function(data)
		{
			allRooms = data;
			roomDataFetchSuccess = true;
			//console.log(data);
		},
		error: function(data) //connection to database problem
		{
			errorModuleShow()
			//error Module
		}
	});
}
function getAllUsers()//get the user data of all users
{
	userInfoFetchSuccess = false;
	userInfoFetchError = false;
	$.ajax({
		type:'GET',
		url:DCBBookingsCreateUserDBAPI,
		success: function (data)
		{
			userDataFull = data;
			userInfoFetchSuccess = true;
		},
		error: function (data)
		{
			console.log(data)
			userInfoFetchError = true;
			errorModuleShow()
		}
	});
}

function firstLoginCheck()//called as an initilizer in the main login page, Will pull user information and check to see if user exists, if not, it'll fill in the data
{
    //checking to see if the user exists in the main user DB
    $.ajax({
        type:'GET',
        url:DCBBookingsCreateUserDBAPI,
        success: function (data)
        {
            FunnyloadingTxt("loaderTxt",false,2000);
            NProgress.inc();
            userDataFull = data;
            //console.log(data)
            var userExists = false;
            for(var i =0; i<data["Items"].length; i++)
            {
                if(data["Items"][i]["email"]==userEmail) //if user email is already part of the big email list
                {
                    userExists = true;
                    individualData = data["Items"][i];
                }
            }
            if(userExists==false) //if its not the sign up modal will open for them to complete the signup.
            {
                openStarterModal();
            }
            else // user exists, calling the check if exist feature to see if a resource as been deleted. Making sure user info is the most up to date
            {
                checkIfResosExists();
                validateCheckIfExistandDelete();
            }
        },
        error: function (data)
        {
            errorModuleShow();
        }
    });
}

function checkAvailableUpload()//this method will check what option has been chosen for the upload code and then populate the modal accordingly by hiding and showing the different modals.
{
	$("#skipBtn").show()
	$("#SimUploadDocs").hide();
	if($("#uploadSource").val()!="invalid" && $("#uploadMethods").val()!="invalid")
	{
		$("#uploadBlock").hide();
		$("#fileLoadForm").show();
		if($("#uploadSource").val()=="custom")//if user chose custom upload docs
		{
			$("#PreviewTable").css("color","black")
			$("#skipBtn").hide()
			$("#customUploadDocs").show();
			$("#previewWhichRoom").hide();
			$("#SimUploadDocs").hide();
			$("#fileToLoad").attr("onChange","readCustomUploadCSV("+$("#30MinPeriodCB").prop('checked')+")");
			$("#nextBtn").attr("onClick","plusAResosSlides(1); populateReviewInfo();");
			// clear files
			$("#fileToLoad").val("")
			previewUploadTable = [];
			timetableHTML = "";
			$("#PreviewTable").html("<em><p align='center'>[Preview Table]</p></em>")
		}
		else // if user chose sims upload docs
		{
			$("#PreviewTable").css("color","black")
			$("#skipBtn").hide()
			$("#customUploadDocs").hide();
			$("#previewWhichRoom").show();
			$("#SimUploadDocs").show();
			$("#fileToLoad").attr("onChange","readSimsUploadCSV()");
			$("#nextBtn").attr("onClick","plusAResosSlides(1); populateReviewInfo();");
			// clear files
			$("#fileToLoad").val("")
			previewUploadTable = [];
			timetableHTML = "";
			$("#PreviewTable").html("<em><p align='center'>[Preview Table]</p></em>")
		}
	}
	else
	{
		$("#uploadBlock").show();
		$("#customUploadDocs").hide();
		$("#nextBtn").hide()
		$("#skipBtn").show()
		$("#PreviewTable").html("<em><p align='center'>[Preview Table]</p></em>")
		$("#fileToLoad").val("")
		$("#fileLoadForm").hide();
	}
}

function createResos(resosType) //creates new Resos depending on the type you enter in your parameter
{
	if(resosType=="room")// if its room type
	{
		$("#AddResosAddRoomErrMsg4").css("color","black");
		$("#AddResosAddRoomErrMsg4").html("Creating Resource...");
		var addResosRoomDescription = new nicEditors.findEditor('AddResosDescription');

		//parameters to push into the database from the modal information the user entered
		var AccessR = $("#AccessRightsSelect").val().trim();
		var BookingSched = ["Empty List"];
		var Depart = $("#department").val().trim();
		var Descript = addResosRoomDescription.getContent().trim()+" "+getTimeStamp();
		var BookRights = $("#BookingRights").val().trim();

		var Min30P = "";
		if($("#30MinPeriodCB").prop('checked'))
		{
			Min30P = "true";
		}
		else
		{
			Min30P = "false";
		}


		var PlanAH = ""
		if($("#planAheadCB").prop('checked'))
		{
			PlanAH = "30";
		}
		else
		{
			PlanAH = "0";
		}

		var PermaSched= previewUploadTable;
		var RoomAdm = adminEmailArray;
		var RoomI = $("#RoomID").val().trim();
		// parameters end

		//pushing new info the the database
		$.ajax({
			type:'POST',
			url:DCBBookingsResourceRoomAPI,

			data:JSON.stringify({
				"AccessRights":AccessR,
				"BookingSchedule":BookingSched,
				"Department":Depart,
				"Description":Descript,
				"Min30Periods":Min30P,
				"PermaSchedule":PermaSched,
				"PlanAhead":PlanAH,
				"RoomAdmin":RoomAdm,
				"RoomID":RoomI,
				"BookingRights":BookRights
			}),
			contentType:"application/json",
			success:function(data)
			{
				$("#AddResosAddRoomErrMsg4").css("color","green");
				$("#AddResosAddRoomErrMsg4").html("Success! Resource succesfully created");
				fetchUserandUpdate = true;
				if(RoomAdm.length == 1)//if the only admin is yourself
				{
					fetchAndUpdateUserControlledResos("room"); // updating user information
				}
				else//there is more than 1 admin.
				{
					fetchAndUpdateMultiAdminControlledResos("room",RoomAdm)//updating user information
				}
				closeAddResos()
			},
			error:function(data)
			{
				$("#AddResosAddRoomErrMsg4").css("color","red");
				$("#AddResosAddRoomErrMsg4").html("Err, connection failed, Please try again");
			}
		});
	}
}

function fetchAndUpdateUserControlledResos(resoType) // get user info and then updates it used to add a new Resos under the user controlled resos field, used in the add resos func [createResos]
{
	var newResosList = [];
	var tempObject = [];
	var errMsgID = "";
	if(resoType == "room")
	{
		errMsgID = "#AddResosAddRoomErrMsg4";
	}

	$(errMsgID).css("color","black");
	$(errMsgID).html("Fetching User Info...");
	getUserInfo(userEmail);
	userInfoFetchSuccess = false;
	userInfoFetchError = false;
	userInfoUpdateSuccess = false;
	userInfoUpdateError = false;
	validateFetch();
	function validateFetch()//will run until it knows that user info has been sucessfully fetched
	{
		if(userInfoFetchSuccess===false) // will be true if user data is fetched
		{
			if(userInfoFetchError === false) // will be true if user data fetch failed
			{
				window.setTimeout(validateFetch, 1000);
			}
			else
			{
				$(errMsgID).css("color","red");
				$(errMsgID).html("Err, Resource successfully created but failed to fetch user data to update... Falling to backup procedure <br> <strong>Please find and click on your newly created resource</strong>");
				userInfoFetchError = false;
			}
		}
		else
		{
			$(errMsgID).css("color","green");
			$(errMsgID).html("Success! User data succesfully fetched");
			createNewListOfUserResos()
			userInfoFetchSuccess = false;
		}
	}
	function createNewListOfUserResos()
	{
		if(individualData["Items"][0]["userControlledResources"][0]=="Empty List")
		{
			tempObject = [$("#RoomID").val().trim(),resoType];
			newResosList.push(tempObject);
		}
		else
		{
			tempObject = [$("#RoomID").val().trim(),resoType];
			newResosList = individualData["Items"][0]["userControlledResources"];
			newResosList.push(tempObject);
		}
		$(errMsgID).css("color","black");
		$(errMsgID).html("Updating User Info...");
		updateUserInfo("userControlledResources",newResosList);
		validateUpdate();
	}
	function validateUpdate()//will run util it knows that user info has been sucessfully updated
	{
		if(userInfoUpdateSuccess===false) // will be true if user data is fetched
		{
			if(userInfoUpdateError === false) // will be true if user data fetch failed
			{
				window.setTimeout(validateUpdate, 1000);
			}
			else
			{
				$(errMsgID).css("color","red");
				$(errMsgID).html("Err, Room successfully created but failed to update user data... Falling to backup procedure <br> <strong>Please find and click on your newly created room</strong>");
				userInfoUpdateError = false;
			}
		}
		else
		{
			$(errMsgID).css("color","green");
			$(errMsgID).html("Success! Resource succesfully created <br> User info sucessfully fetched and updated");
			populateYourResos();//updates all resos, but will not update the bookmark tab and the recently visited tab. but will update the your resos tabs
			userInfoUpdateSuccess = false;
		}
	}
}
function fetchAndUpdateMultiAdminControlledResos(resoType,adminArray)// get user info of all admins and then updates it used to add a new Resos under the user controlled resos field, used in the add resos func [createResos]
//adminArray is the array of what the users typed into the extra admin field, in the create resos section.
{
	var newResosList = [];
	var tempObject = [];
	var errMsgID = "";
	var iStop = 0;
	if(resoType == "room")
	{
		errMsgID = "#AddResosAddRoomErrMsg4";
	}

	$(errMsgID).css("color","black");
	$(errMsgID).html("Fetching User Info...");

	userInfoFetchSuccess = false;
	userInfoFetchError = false;
	userInfoUpdateSuccess = false;
	userInfoUpdateError = false;

	getAllUsers();
	validateFetch();

	function validateFetch()//will run until it knows that all user info has been sucessfully fetched
	{
		if(userInfoFetchSuccess===false) // will be true if user data is fetched
		{
			if(userInfoFetchError === false) // will be true if user data fetch failed
			{
				window.setTimeout(validateFetch, 1000);
			}
			else
			{
				$(errMsgID).css("color","red");
				$(errMsgID).html("Err, Resource successfully created but failed to fetch user data to update... Falling to backup procedure <br> <strong>Please find and click on your newly created resource</strong>");
				userInfoFetchError = false;
			}
		}
		else
		{
			$(errMsgID).css("color","green");
			$(errMsgID).html("Success! User data succesfully fetched");
			createAllAdminFullData()
			userInfoFetchSuccess = false;
		}
	}

	var adminListFullData = []; // creating a list of Keys to be used during the updating of the arrays...
	var AllAdminsUserInfoIndex = []; // creating the list of indexes of admin user's information.
	function createAllAdminFullData()
	{
		for(var i = 0; i<adminArray.length;i++)
		{
			for(var j = 0; j<userDataFull["Items"].length; j ++)
			{
				if(userDataFull["Items"][j]["email"].toLowerCase().trim()==adminArray[i].toLowerCase().trim())//if key matches what the users wrote
				{
					adminListFullData.push(userDataFull["Items"][j]["email"])
					AllAdminsUserInfoIndex.push(j);
				}
			}
		}
		iStop = adminListFullData.length;
		loopi();//calling lock loop function. where each request will only run once the previous one has finished.
	}
	//Function Loop to lock and slow down requests, to prevent overflow, used to update and create new lists of Resos.
	var i = 0;
	function loopi()
	{
		createNewListOfUserResos();
		function createNewListOfUserResos()
		{
			tempObject = [];
			newResosList = [];

			if(userDataFull["Items"][AllAdminsUserInfoIndex[i]]["userControlledResources"][0]=="Empty List")
			{
				tempObject = [$("#RoomID").val().trim(),resoType];
				newResosList.push(tempObject);
			}
			else
			{
				tempObject = [$("#RoomID").val().trim(),resoType];
				newResosList = userDataFull["Items"][AllAdminsUserInfoIndex[i]]["userControlledResources"];
				newResosList.push(tempObject);
			}
			$(errMsgID).css("color","black");
			$(errMsgID).html("Updating info of room admin user: "+adminListFullData[i]);
			updateAnyUserInfo(adminListFullData[i],"userControlledResources",newResosList);
			validateUpdate();
		}
		function validateUpdate()//will run util it knows that user info has been sucessfully updated
		{
			if(userInfoUpdateSuccess===false) // will be true if user data is fetched
			{
				if(userInfoUpdateError === false) // will be true if user data fetch failed
				{
					window.setTimeout(validateUpdate, 1000);
				}
				else
				{
					$(errMsgID).css("color","red");
					$(errMsgID).html("Err, Room successfully created but failed to update user data... Falling to backup procedure <br> <strong>Please find and click on your newly created room</strong>");
					userInfoUpdateError = false;
				}
			}
			else
			{
				$(errMsgID).css("color","green");
				$(errMsgID).html("Success! Resource succesfully created <br> User info sucessfully fetched and updated");
				populateYourResos();//updates all resos, but will not update the bookmark tab and the recently visited tab. but will update the your resos tabs
				userInfoUpdateSuccess = false;
				//checking if loop needs to be rerun
				if(i<iStop)
				{
					i+=1;
					createNewListOfUserResos();
				}
			}
		}
	}
}

//add room logic start-->
function addRoomClearAll()//clears all the input fields from previous entries
{
	$("#RoomID").val("");
	$("#department").val("");
	nicEditors.findEditor( "AddResosDescription" ).setContent( '' );//set empty
	$("#AddResosAddRoomErrMsg1").html("");
	$("#AddResosAddRoomErrMsg2").html("");
	$("#AddResosAddRoomErrMsg4").html("");
	$("#addresosContent").addClass("width700");
	$("#addresosContent").removeClass("width80Percent");
	previewUploadTable = [];
	timetableHTML = "";
	$("#fileToLoad").val("")
	$('#uploadSource option[value="invalid"]').prop("selected", "selected");
	$("#PreviewTable").html("<em><p align='center'>[Preview Table]</p></em>")
	checkAvailableUpload();
}
function addRoomNext1() // checking to see if all fields are filled and to see if primary key repeats
{
	$("#addRoom1").hide();
	$("#AddResosAddRoomErrMsg1").css("color","black");
	$("#AddResosAddRoomErrMsg1").html("Processing Information...");
	var addResosRoomDescription = new nicEditors.findEditor('AddResosDescription');

	if($("#RoomID").val().trim().length!=0 && $("#department").val().trim().length!=0 && addResosRoomDescription.getContent().trim().length!=0) // checking to see if all fields are filled
	{

		$.ajax({ // checking to see if primary key repeats
			type:"GET",
			url:DCBBookingsResourceRoomAPI,
			success: function(data)
			{
				allRooms = data;
				validateAddRoom1();
			},
			error: function(data) //connection to database problem
			{
				$("#AddResosAddRoomErrMsg1").css("color","red");
				$("#AddResosAddRoomErrMsg1").html("Err, failed to fetch all rooms, try again.");
			}
		});
	}
	else // fields are not all filled
	{
		$("#addRoom1").show();
		$("#AddResosAddRoomErrMsg1").css("color","red");
		$("#AddResosAddRoomErrMsg1").html("Err, Fields cannot be empty");
	}
}
function validateAddRoom1() //checking to see if primary key repeats
{
	var roomExist = false;
	for(var i = 0; i<allRooms["Items"].length;i++)
	{
		if(allRooms["Items"][i]["RoomID"]==$("#RoomID").val().trim())
		{
			roomExist = true;
		}
	}
	if(roomExist == true) //key repeats
	{
		$("#AddResosAddRoomErrMsg1").css("color","red");
		$("#AddResosAddRoomErrMsg1").html("Err, this room name already exists");
	}
	else // key is unique, next slide
	{
		var maxIDLength = "Technologyd5dddd".length
		if($("#RoomID").val().trim().length > maxIDLength)
		{
			$("#AddResosAddRoomErrMsg1").css("color","red");
			$("#AddResosAddRoomErrMsg1").html("Err, the room name must be "+maxIDLength+" characters or shorter");
		}
		else
		{
			$("#AddResosAddRoomErrMsg1").html("");
			$("#RoomAdmin1").val(userEmail);
			plusAResosSlides(1);
		}
	}
}
function addRoomNext2() //checking to make sure that select isnt invalid
{
	$("#addRoom2").hide();
	if($("#AccessRightsSelect").val()!="invalid")
	{
		plusAResosSlides(1);
		checkAvailableUpload();
		$("#AddResosAddRoomErrMsg2").html("");
		$("#addresosContent").removeClass("width700");
		$("#addresosContent").addClass("width80Percent");

		if($("#30MinPeriodCB").prop('checked'))
		{
			var op = document.getElementById("uploadSource").getElementsByTagName("option");
				for (var i = 0; i < op.length; i++) {
				  // lowercase comparison for case-insensitivity
				  (op[i].value.toLowerCase() == "sims")
					? op[i].disabled = true
					: op[i].disabled = false ;
				}
			// getting rid of all files once its 30min checkbox changes, for reuploading
			$('#uploadSource option[value="invalid"]').prop("selected", "selected");
			$('#uploadMethods option[value="invalid"]').prop("selected", "selected");
			$("#fileToLoad").val("")
			previewUploadTable = [];
			timetableHTML = "";
			$("#PreviewTable").html("<em><p align='center'>[Preview Table]</p></em>")
			checkAvailableUpload();
		}
		else
		{
			var op = document.getElementById("uploadSource").getElementsByTagName("option");
				for (var i = 0; i < op.length; i++) {
					op[i].disabled = false ;
				}
			// getting rid of all files once its 30min checkbox changes, for reuploading
			$('#uploadSource option[value="invalid"]').prop("selected", "selected");
			$('#uploadMethods option[value="invalid"]').prop("selected", "selected");
			$("#fileToLoad").val("")
			previewUploadTable = [];
			timetableHTML = "";
			$("#PreviewTable").html("<em><p align='center'>[Preview Table]</p></em>")
			checkAvailableUpload();
		}
	}
	else
	{
		$("#addRoom2").show();
		$("#AddResosAddRoomErrMsg2").css("color","red");
		$("#AddResosAddRoomErrMsg2").html("Err, you must make a selection");
	}
}
function AddResosSkip()//function called when users skip the upload feature.
{
	$("#addRoom3").hide();
	plusAResosSlides(1);
	timetableHTML = "Empty Permanent Schedule, User Skipped Upload"; // skipped so preview Upload Table is null;
	populateReviewInfo();
}
function populateReviewInfo() //populating the review info section
{
	var addResosRoomDescription = new nicEditors.findEditor('AddResosDescription'); // getting the niceEdit value for description
	$("#RoomName").html($("#RoomID").val());

	$("#depart").html($("#department").val());

	var descriptionString = addResosRoomDescription.getContent().trim();
	$("#descrip").html("<br>"+descriptionString);
	var adminEmails = $("#RoomAdmin1").val().trim() + ";" + $("#RoomAdmin2").val().trim()
	adminEmails = adminEmails.trim();
	adminEmailArray = adminEmails.split(";")
	adminEmailArray = adminEmailArray.filter(function(el) { return el; }); // filters out empty string from array
	adminEmailArray = adminEmailArray.map(Function.prototype.call, String.prototype.trim)//trims all string in array
	var newAdminEmailString = "";
	for(var i = 0; i < adminEmailArray.length; i++) //Displays all Admin
	{
		newAdminEmailString = newAdminEmailString + adminEmailArray[i].trim() + "<br>"
	}
	$("#roomAdmins").html("<br>"+newAdminEmailString);

	var accessRString = "";
	if($("#AccessRightsSelect").val()=="Student")
	{
		accessRString = "Only accessible to students"
	}
	else if($("#AccessRightsSelect").val()=="Teacher")
	{
		accessRString = "Only accessible to Teachers"
	}
	else if($("#AccessRightsSelect").val()=="TeacherStudent")
	{
		accessRString = "Accessible to both students and teachers"
	}
	$("#AccessR").html(accessRString);

	var planAhString = ""
	if($("#planAheadCB").prop('checked'))
	{
		planAhString="Booking ability of a period WILL close 30 minutes piror";
	}
	else
	{
		planAhString="Booking ability of a period WILL NOT close 30 minutes piror";
	}
	$("#PlanAh").html(planAhString);

	var Min30PString = ""
	if($("#30MinPeriodCB").prop('checked'))
	{
		Min30PString="Each period WILL be split into two thirty minute sections"
	}
	else
	{
		Min30PString="Each period WILL NOT be split into two thirty minute sections"
	}
	$("#30minP").html(Min30PString);

	$("#reviewInfoPreviewInfo").html(timetableHTML)
}

function preTimeableClasses()//change the classes of the modal to adjust its width Pre timeable
{
	$("#addresosContent").addClass("width700");
	$("#addresosContent").removeClass("width80Percent");
}
function reviewInfoClasses()//change the classes of the modal to adjust its width for reviewing information
{
	$("#addresosContent").addClass("widthReviewInfo");
	$("#addresosContent").removeClass("width80Percent");
}
function preReviewInfoClasses()//change the classes of the modal to adjust its width Pre reviewing information for non-30 minute periods
{
	$("#addresosContent").addClass("width80Percent");
	$("#addresosContent").removeClass("widthReviewInfo");
}
//add room logic end-->

//Read and upload Timetables start-->
//1 boolean parameter, if true then the 30 min booking option is checked, a different logic path will build the 3D array
function readCustomUploadCSV(min30) //read data and populate it in an giant linked list for a custom CSV File,
{
	$("#PreviewTable").css("color","black")
	$("#nextBtn").show();
	var week1Data = [];
	var week2Data = [];

	var dayData = [];
	var periodData = []; //["status","bookeduser","perpetual","Week1"]

	var CSVExWidth = 16;//CSV File expected width to validate correct file using lenght check later
	if(min30 == true)//if min30p is chcked then the expected width value will increase.
	{
		CSVExWidth = 25;
	}


	var fileToLoad = document.getElementById("fileToLoad").files[0];
	var fileReader = new FileReader();
	fileReader.onload = function(fileLoadedEvent)
	{

		var textFromFileLoaded = fileLoadedEvent.target.result;
		var timetable_data = textFromFileLoaded.split(/\r?\n|\r/);

		//console.log("Width: "+timetable_data[0].length)
		//console.log("Height: "+timetable_data.length)

		if(timetable_data[0].length == CSVExWidth && timetable_data.length == 21) // validating that the the correct file is uploaded with a length check.
		{
			for(var i = 2; i<7; i++) //reading first week data
			{
				var cell_data = timetable_data[i].split(",");
				dayData = [];
				for(var j = 1; j<cell_data.length;j++)
				{
					periodData=[cell_data[j],userEmail,"P","Week1"]
					dayData.push(periodData);
				}
				week1Data.push(dayData);
			}
			for(var i = 10; i<15; i++) //reading second week data
			{
				var cell_data = timetable_data[i].split(",");
				dayData = [];
				for(var j = 1; j<cell_data.length;j++)
				{
					periodData=[cell_data[j],userEmail,"P","Week2"]
					dayData.push(periodData);
				}
				week2Data.push(dayData);
			}

			previewUploadTable = [];
			previewUploadTable.push(week1Data);
			previewUploadTable.push(week2Data);
			//if min30p is chcked then the HTML table will be built with a slightly different function to accomindate for the extra periods per day
			//else it'll just build it normally with 1 hour periods
			generatePreviewTable(previewUploadTable,min30);

		}
		else//if length check failed, it'll output err msg
		{
			$("#PreviewTable").css("color","red")
			$("#PreviewTable").html("Error: file dimensions do not match, please do not delete or add unnecessary data. <br>Please also ensure that you are adding the correct file type.")
		}

	}
	fileReader.readAsText(fileToLoad, "UTF-8");

}
function readSimsUploadCSV() //read data and populate it in an giant linked list for a SIMS File
{
	$("#PreviewTable").css("color","black")
	$("#nextBtn").show();
	var week1Data = [];
	var week2Data = [];

	var dayData = [];
	var periodData = []; //["status","bookeduser","perpetual","Week1"]

	var fileToLoad = document.getElementById("fileToLoad").files[0];
	var fileReader = new FileReader();
	fileReader.onload = function(fileLoadedEvent)
	{
		var textFromFileLoaded = fileLoadedEvent.target.result;
		var timetable_data = textFromFileLoaded.split(/\r?\n|\r/); // only need rows index 7 onwards, exclusive

		//console.log("Width: "+timetable_data[0].length)
		//console.log("Height: "+timetable_data.length)

		if(timetable_data[0].length == 10 && timetable_data.length == 27)
		{
			timetable_data.splice(22, 5); //deleting row 22, bus row, useless.
			timetable_data.splice(0, 8); // deleting rows 0 to 7 cuz they're useless

			var UselessRowsSims = [13,11,8,6,3,1]//the rows that need to be deleted cuz they r useless
			//deleting uselessRows
			for(var i = 0; i<UselessRowsSims.length; i++)
			{
				timetable_data.splice(UselessRowsSims[i], 1);
			}

			//generating the array, WEEK 1
			for(var i = 1; i < 6; i++) // i is the number of cols
			{
				dayData = [];
				for(var j = 0; j < timetable_data.length; j++) // j is the number of rows
				{
					periodData = [];
					if(timetable_data[j].split(",")[i]=="") //if its empty its unbooked
					{
						periodData.push("unbooked")
						periodData.push(userEmail)
						periodData.push("P")
						periodData.push("Week1")
						dayData.push(periodData)
					}
					else //if its not empty its a lesson
					{
						periodData.push("lesson")
						periodData.push(userEmail)
						periodData.push("P")
						periodData.push("Week1")
						dayData.push(periodData)
					}
				}
				for(var j = 0; j < 2; j++) //ECA1 and ECA2
				{
					periodData = [];
					periodData.push("unbooked")
					periodData.push(userEmail)
					periodData.push("P")
					periodData.push("Week1")
					dayData.push(periodData)
				}

				week1Data.push(dayData);
			}
			//generating the array, WEEK 2
			for(var i = 6; i < 11; i++) // i is the number of cols
			{
				dayData = [];
				for(var j = 0; j < timetable_data.length; j++) // j is the number of rows
				{
					periodData = [];
					if(timetable_data[j].split(",")[i]=="") //if its empty its unbooked
					{
						periodData.push("unbooked")
						periodData.push(userEmail)
						periodData.push("P")
						periodData.push("Week2")
						dayData.push(periodData)
					}
					else //if its not empty its a lesson
					{
						periodData.push("lesson")
						periodData.push(userEmail)
						periodData.push("P")
						periodData.push("Week2")
						dayData.push(periodData)
					}
				}
				for(var j = 0; j < 2; j++) //ECA1 and ECA2
				{
					periodData = [];
					periodData.push("unbooked")
					periodData.push(userEmail)
					periodData.push("P")
					periodData.push("Week2")
					dayData.push(periodData)
				}
				week2Data.push(dayData);
			}
			previewUploadTable.push(week1Data)
			previewUploadTable.push(week2Data)
			generatePreviewTable(previewUploadTable,false);
		}
		else
		{
			$("#PreviewTable").css("color","red")
			$("#PreviewTable").html("Error: file dimensions do not match, please do not delete or add unnecessary data. <br> Please also ensure that you are adding the correct file type.<br>The SIMS uploads can only support a file output of <strong>1 room</strong>.")
		}

	}
	fileReader.readAsText(fileToLoad, "UTF-8");
}
function generatePreviewTable(data,min30)
{
	timetableHTML = "";
	var Days = ["Monday","Tuesday","Wednesday","Thursday","Friday"]
	timetableHTML +="<strong><p>Week 1:</p></strong>"
	//Week 1 Code
	timetableHTML +='<table class="table table-hover">'
	if(min30 == false) //if min30p is not checked then the tables headers will generate normally
	{
		//--->create table header > start
		timetableHTML +='<thead>';
			timetableHTML +='<tr>';
			timetableHTML +='<th>Day</th>';
			timetableHTML +='<th>Period 1</th>';
			timetableHTML +='<th>Period 2</th>';
			timetableHTML +='<th>Break</th>';
			timetableHTML +='<th>Period 3</th>';
			timetableHTML +="<th>Period 4</th>";
			timetableHTML +='<th>Lunch</th>';
			timetableHTML +='<th>Period 5</th>';
			timetableHTML +='<th>Period 6</th>';
			timetableHTML +='<th>ECA 1</th>';
			timetableHTML +='<th>ECA 2</th>';
			timetableHTML +='</tr>';
		timetableHTML +='</thead>';
		//--->create table header > end
	}
	else
	{
		//--->create table header > start
		timetableHTML +='<thead>';
			timetableHTML +='<tr>';
				timetableHTML +='<th>Day</th>';
				timetableHTML +='<th>P1</th>';
				timetableHTML +='<th>P1</th>';
				timetableHTML +='<th>P2</th>';
				timetableHTML +='<th>P2</th>';
				timetableHTML +='<th>Br</th>';
				timetableHTML +='<th>P3</th>';
				timetableHTML +='<th>P3</th>';
				timetableHTML +="<th>P4</th>";
				timetableHTML +="<th>P4</th>";
				timetableHTML +='<th>Lun</th>';
				timetableHTML +='<th>Lun</th>';
				timetableHTML +='<th>P5</th>';
				timetableHTML +='<th>P5</th>';
				timetableHTML +='<th>P6</th>';
				timetableHTML +='<th>P6</th>';
				timetableHTML +='<th>E1</th>';
				timetableHTML +='<th>E1</th>';
				timetableHTML +='<th>E2</th>';
				timetableHTML +='<th>E2</th>';
			timetableHTML +='</tr>';
		timetableHTML +='</thead>';
		//--->create table header > end
	}//else the headers will generate with extra values

	for(var i = 0; i<5;i++) // generate the 5 day week
	{
		timetableHTML += '<tr>'
		timetableHTML += '<td>'+Days[i]+'</td>'
		for(var j = 0; j<data[0][i].length; j++)
		{
			var classVal = data[0][i][j][0]; // [0] week 1, [i] Which day [j] which period [0] which data [booking status,userEmail,"perpetual","Week1"]
			timetableHTML += '<td class="'+classVal+'">'+data[0][i][j][0]+'</td>'
		}
		timetableHTML += '</tr>'
	}
	timetableHTML += '</table>'

	timetableHTML +="<strong><p>Week 2:</p></strong>"

	//Week 2 Code
	timetableHTML +='<table class="table table-hover">'

	if(min30 == false) //if min30p is not checked then the tables headers will generate normally
	{
		//--->create table header > start
		timetableHTML +='<thead>';
			timetableHTML +='<tr>';
			timetableHTML +='<th>Day</th>';
			timetableHTML +='<th>Period 1</th>';
			timetableHTML +='<th>Period 2</th>';
			timetableHTML +='<th>Break</th>';
			timetableHTML +='<th>Period 3</th>';
			timetableHTML +="<th>Period 4</th>";
			timetableHTML +='<th>Lunch</th>';
			timetableHTML +='<th>Period 5</th>';
			timetableHTML +='<th>Period 6</th>';
			timetableHTML +='<th>ECA 1</th>';
			timetableHTML +='<th>ECA 2</th>';
			timetableHTML +='</tr>';
		timetableHTML +='</thead>';
		//--->create table header > end
	}
	else
	{
		//--->create table header > start
		timetableHTML +='<thead>';
			timetableHTML +='<tr>';
				timetableHTML +='<th>Day</th>';
				timetableHTML +='<th>P1</th>';
				timetableHTML +='<th>P1</th>';
				timetableHTML +='<th>P2</th>';
				timetableHTML +='<th>P2</th>';
				timetableHTML +='<th>Br</th>';
				timetableHTML +='<th>P3</th>';
				timetableHTML +='<th>P3</th>';
				timetableHTML +="<th>P4</th>";
				timetableHTML +="<th>P4</th>";
				timetableHTML +='<th>Lun</th>';
				timetableHTML +='<th>Lun</th>';
				timetableHTML +='<th>P5</th>';
				timetableHTML +='<th>P5</th>';
				timetableHTML +='<th>P6</th>';
				timetableHTML +='<th>P6</th>';
				timetableHTML +='<th>E1</th>';
				timetableHTML +='<th>E1</th>';
				timetableHTML +='<th>E2</th>';
				timetableHTML +='<th>E2</th>';
			timetableHTML +='</tr>';
		timetableHTML +='</thead>';
		//--->create table header > end
	}//else the headers will generate with extra values

	for(var i = 0; i<5;i++) // generate the 5 day week
	{
		timetableHTML += '<tr>'
		timetableHTML += '<td>'+Days[i]+'</td>'
		for(var j = 0; j<data[0][i].length; j++)
		{
			var classVal = data[1][i][j][0]; // [1] week 2, [i] Which day [j] which period [0] which data [booking status,userEmail,"perpetual","Week2"]
			timetableHTML += '<td class="'+classVal+'">'+data[1][i][j][0]+'</td>'
		}
		timetableHTML += '</tr>'
	}

	timetableHTML += '</table>'

	$("#PreviewTable").html(timetableHTML);
}

//Read and upload Timetables end-->

//bookmark and unbookmark function. Will populate the online DB with the new booking.
function bookmarkIt(resosID, resosType)// function to bookmark a certain room
{	
	$("#SearchResultsAndRV").html('<p id="EmptyMsg" style="color: white; margin: 0;"></p>');
	$("#EmptyMsg").html("<em><p>Processing Request...</p></em>");

	userInfoFetchSuccess = false;
	validateFetchedUserInfo();
	getUserInfo(userEmail);
	var newBookmarkArray = [];
	var tempObject = [];
	function validateFetchedUserInfo() // ensuring that use data is fetched before updating it
	{
		if(userInfoFetchSuccess == false)
		{
			window.setTimeout(validateFetchedUserInfo,1000);
			userInfoFetchSuccess = false;
		}
		else
		{
			$("#bookmarkedResosBoxes").html("<em><p>Updating user information...</p></em>");
			$("#allResosBoxes").html("<em><p>Updating user information...</p></em>");

			if(individualData["Items"][0]["bookmarkedResources"][0]=="Empty List") //if the list is empty
			{
				tempObject.push(resosID);
				tempObject.push(resosType);
				newBookmarkArray.push(tempObject);
			}
			else // if the list isnt empty
			{
				tempObject.push(resosID);
				tempObject.push(resosType);
				for(var i = 0; i<individualData["Items"][0]["bookmarkedResources"].length; i++)
				{
					newBookmarkArray.push(individualData["Items"][0]["bookmarkedResources"][i])
				}
				newBookmarkArray.push(tempObject);
			}
			updateUserInfo("bookmarkedResources",newBookmarkArray); // updating user information
			userInfoUpdateSuccess = false;
			validateUpdatedUserInfo(); // making sure that the thing is being bookmarked.
		}
	}
	function validateUpdatedUserInfo()
	{
		if(userInfoUpdateSuccess== false)
		{
			window.setTimeout(validateUpdatedUserInfo,1000)
			userInfoUpdateSuccess = false;
		}
		else
		{
			$("#bookmarkedResosBoxes").html("<em><p>Populating new values...</p></em>");
			$("#allResosBoxes").html("<em><p>Populating new values...</p></em>");

			 populateBookmarkedResos()//parameters: populateBookmarks? truefalse, populate RecentlyVisited?, truefalse, populate YourResos? truefalse
		}
	}

}
function unBookmarkIt(resosID, resosType)// function to bookmark a certain room
{
	$("#SearchResultsAndRV").html('<p id="EmptyMsg" style="color: white; margin: 0;"></p>');
	$("#EmptyMsg").html("<em><p>Processing Request...</p></em>");

	userInfoFetchSuccess = false;
	validateFetchedUserInfo();
	getUserInfo(userEmail);
	var newBookmarkArray = [];
	var tempObject = [];
	function validateFetchedUserInfo() // ensuring that use data is fetched before updating it
	{
		if(userInfoFetchSuccess == false)
		{
			window.setTimeout(validateFetchedUserInfo,1000);
			userInfoFetchSuccess = false;
		}
		else
		{
			$("#bookmarkedResosBoxes").html("<em><p>Updating user information...</p></em>");
			$("#allResosBoxes").html("<em><p>Updating user information...</p></em>");

			tempObject.push(resosID)
			tempObject.push(resosType)
			newBookmarkArray = individualData["Items"][0]["bookmarkedResources"];
			newBookmarkArray.splice( newBookmarkArray.indexOf(tempObject), 1);// removing array from position.

			updateUserInfo("bookmarkedResources",newBookmarkArray); // updating user information
			userInfoUpdateSuccess = false;
			validateUpdatedUserInfo(); // making sure that the thing is being bookmarked.
		}
	}
	function validateUpdatedUserInfo()
	{
		if(userInfoUpdateSuccess== false)
		{
			window.setTimeout(validateUpdatedUserInfo,1000)
			userInfoUpdateSuccess = false;
		}
		else
		{
			$("#bookmarkedResosBoxes").html("<em><p>Populating new values...</p></em>");
			$("#allResosBoxes").html("<em><p>Populating new values...</p></em>");

			populateBookmarkedResos()//parameters: populateBookmarks? truefalse, populate RecentlyVisited? truefalse, populae your resos? truefalse
		}
	}

}

function FunnyloadingTxt(elemID,start,delay)//function to load funny loading text for the user to look at.
//params:elemID element ID to load the text into,string
//boolean:start, when true, it'll start the function when false it'll end the function
//delay between each message in ms, int
{
	var startFunnyLoadingText;
	if(start == true)
	{
		$("#" + elemID).html("<em>Welcome! Please hold for few seconds while we load everything in</em>")
        window.setTimeout(startLoading,3000);
	}
    function startLoading()
    {
        startFunnyLoadingText = setInterval(loadText, delay);
    }
	function loadText()
	{
		max = randomLoadingText.length;
		min = 0;
		var random =Math.floor(Math.random() * (+max - +min)) + +min;
		$("#" + elemID).html("<em>"+randomLoadingText[random]+"</em>")
	}
	if(start==false)
	{
		clearInterval(startFunnyLoadingText);
		$("#" + elemID).html("")
	}
}

//TIMESTAMP START
function getTimeStamp() //getting the offical timestamp
{
	var today = new Date();
	var date =today.getFullYear() + "/" +(today.getMonth()+1)+'/'+today.getDate()+"_"+getDayFromNum();
	var dateTime = date+"_"+formatAMPM(today);
	return (dateTime);
}
function getDayFromNum() //get the day from the number
{
	var d = new Date();
	var weekday = new Array(7);
	weekday[0] =  "Sun";
	weekday[1] = "Mon";
	weekday[2] = "Tue";
	weekday[3] = "Wed";
	weekday[4] = "Thur";
	weekday[5] = "Fri";
	weekday[6] = "Sat";

	return weekday[d.getDay()];
}
function formatAMPM(date) //format time in AMPM
{
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var ampm = hours >= 12 ? 'PM' : 'AM';
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	minutes = minutes < 10 ? '0'+minutes : minutes;
	var strTime = hours + ':' + minutes +  '_' + ampm;
	return strTime;
}
function getDayFromNum2(n)// get day from num full day name
{
	var weekday = new Array(5);
	weekday[0] = "Monday";
	weekday[1] = "Tuesday";
	weekday[2] = "Wednesday";
	weekday[3] = "Thursday";
	weekday[4] = "Friday";
	return weekday[n];
}
//TIMESTAMP END

function loadingModal()
//puts the timetable modal into loading mode for the user
{
	$("#timeTable").html("");
	$("#LoaderTimetable").show();
	$("#preLimLoader").hide()
	$("#viewPort").show();
	$("#timetableSettings").hide();
	$("#viewPort_Content").hide();
	$('#timeTableTitle').html('Loading...');
	$("#whichWeekBtn").hide();
	$("#whichWeekBtn").attr("onClick","")
}
function populateTimetableModal(timetableName,resosID,resosType,weekBegining)
//puts the timetable modal out of loading mode for the user
{
	$("#LoaderTimetable").hide();
	$("#preLimLoader").show()
	$('#timeTableTitle').html(timetableName);
	$("#whichWeekBtn").show();
	if(weekBegining == getWeekBegining(new Date()))
	{
		$("#whichWeekBtn").val("Change Week")
	}
	else
	{
		$("#whichWeekBtn").val(weekBegining)
	}
	$("#whichWeekBtn").attr("onChange","changeWeekFunc('"+resosID+"','"+resosType+"')")
	if(resosAdmin)
	{
		$("#timetableSettings").show();
        $("#timetableSettings").attr("onClick","getAResosSettingFromModal('"+resosID+"','"+resosType+"')")
	}
}
function changeWeekFunc(resosID, resosType)
{
	viewResos(resosID,resosType,  moment($('#whichWeekBtn').datepicker('getDate')).add(30, 'm').toDate())
}

function addToRecentlyVisted(resosID, resosType) //adds to the recenly visited list
{
	var recentlyVisitedTemp = [];
	var emptyList = [];
	var currentData;
	userInfoFetchSuccess = false;
	getUserInfo(userEmail);
	checkUserFetch();
	function checkUserFetch()
	{
		if(userInfoFetchSuccess == false)
		{
			window.setTimeout(checkUserFetch, 1000);
		}
		else
		{
			currentData = individualData.Items[0].recentlyBookedResources;
			if(currentData[0]=="Empty List")
			{
				emptyList.push(resosID)
				emptyList.push(resosType)
				recentlyVisitedTemp.push(emptyList)
			}
			else
			{
				recentlyVisitedTemp = currentData;
				
				
				emptyList.push(resosID)
				emptyList.push(resosType)
				
				var doesntExist = true; 
				
				for(var i =0; i<recentlyVisitedTemp.length; i++)
				{
					if(compareArray(emptyList,recentlyVisitedTemp[i]))
					{
						doesntExist = false; 
					}
				}
				
				if(doesntExist == true)
				{
					if(recentlyVisitedTemp.length >= 4)
					{
						recentlyVisitedTemp.shift();
					}
					recentlyVisitedTemp.push(emptyList)
				}
				
			}
			
			updateUserInfo("recentlyBookedResources",recentlyVisitedTemp)
			
			userInfoUpdateSuccess = false;
			validateUpdate()
			function validateUpdate()
			{
				if(userInfoUpdateSuccess == false)
				{
					window.setTimeout(validateUpdate,1000);
				}
				else
				{
					userInfoUpdateSuccess = false; 
				}
			}
			
		}
	}
}

function populateRecentlyVisted()
{
	userInfoFetchSuccess = false;
	getUserInfo(userEmail);

	checkUserFetch();
	function checkUserFetch()
	{
		if(userInfoFetchSuccess == false)
		{
			window.setTimeout(checkUserFetch, 1000);
		}
		else
		{
			console.log(individualData.Items[0].recentlyBookedResources)
			if(individualData.Items[0].recentlyBookedResources[0]!="Empty List")
			{
				generateRecentlyVisitedHTML(individualData.Items[0].recentlyBookedResources);
			}
			userInfoFetchSuccess = false;
		}
	}
}
function generateRecentlyVisitedHTML(data)
{
	allResosHTML = "" //HTML for appending to the main page for All Resos
	//allResos [roomid, resostype]
	var bookmarkClass = "fa fa-bookmark-o imgBtn bookmark"; //will change depending on whether or not your box is a bookmarkedBox
	var bookMarkFunction = "";
	var tempObject = [];
	var tempHTML = "";
	var ResosID = "";//id of each box
	allResos = [];
	var userData = individualData.Items[0];
	// !!IMPORTATNT design fallback in the generate allresos section if the array is empty
	for(var i = 0; i<data.length; i++) // generating Big Array containing all the roomIDs and their Resos Type
	{
		tempObject = [];
		tempObject.push(data[i][0]);
		tempObject.push(data[i][1]);
		allResos.push(tempObject);
	}
	//have to add the 2 other for loops for datadevice and datasub
	for(var i = 0; i<allResos.length; i++)
	{
		bookMarkFunction = 'bookmarkIt(\''+allResos[i][0]+'\',\''+allResos[i][1]+'\');'
		ResosID = allResos[i][0]+":"+allResos[i][1]; //"resosID:ResosType"
		bookmarkClass = "fa fa-bookmark-o imgBtn bookmark";
		for(var j = 0; j<userData["bookmarkedResources"].length; j++)//checking if resos is bookmarked
		{
			if(userData["bookmarkedResources"][j][0] == allResos[i][0] && userData["bookmarkedResources"][j][1] == allResos[i][1]) // if resos is bookmarked by the user both resos type and resos ID must match
			{
				bookmarkClass = "fa fa-bookmark imgBtn bookmark"; //change the bookmarkClassImg
				bookMarkFunction = 'unBookmarkIt(\''+allResos[i][0]+'\',\''+allResos[i][1]+'\');'//change the bookmark click function
			}
		}
		tempHTML = '<div id="'+ResosID+'" class="Box '+allResos[i][1]+'"><i onClick="'+bookMarkFunction+'" class="'+bookmarkClass+'" aria-hidden="true"></i><p><strong>'+allResos[i][0]+'</strong><br><em>'+allResos[i][1]+'</em></p><button class="btnSuccessOutline" onClick="viewResos(\''+allResos[i][0]+'\',\''+allResos[i][1]+'\',\''+new Date()+'\');">View</button></div>'
		allResosHTML += tempHTML;
	}
	if(allResosHTML == "")//fallback incase all 3 arrays are empty
	{
		allResosHTML = "<em>[Please Visit a Resource]</em>"
	}
	$("#SearchResultsAndRV").html(allResosHTML);
}

function removeTimetableEventListeners() //used in viewRoom's document functions to for listening for user activity
//remove all event listeners from the program for new ones to be added in.
{
	$(document).off('click', '#bookBtn')
	$(document).off('click', '#deleteBtn')
	$(document).off('click', '#rbookBtn')
	$(document).off('click', '#BookRecrBtn')
	$(document).off('click', '.row_data')
	$(document).off('click', '#contactBtn')
	$(document).off('click', '#BookRecrBtn')
	$(document).off('click', '#sendBtn')
	$(document).off('click', '#lessonLockBtn')
	$(document).off('click', '#quickLockBtn')
	$(document).off('click', '#rLockBtn')
	$(document).off('click', '#addUserBtn')
	$(document).off('focusout', '.row_data')
}
function timetableDocFunctionsRoom()
{
	removeTimetableEventListeners();
	var coordinates = [] // stores the coordinates of the cell that was clicked.
	var day = ""// stores the day of the cell clicked
	var period = "" //stores the period of the cell that was clicked
	var fullCurrentStatus = "" // stores the current HTML of the cell that was clicked
	var currentBookingState = "" // stores the current booking state of the cell you are on
	var bookingDetails; // stores the current booking detailed information in an array
	var timeStamp;//stores the timestamp the booking was made at. 
	var RoombookingSchedule; // booking scheudle for the room. 
	var intendedCoors; // stores the current coor the user is on
	var formattedCurrentDate; // stores the formatted current date in DD, month thingy week Begining
	var permaSchd; //stores the permanent scheudle of a room. 
	var weekNow; //stores the current week now. If its variable currentWeek == 0 then weekNow will be Week1, else it'll be Week2
	
	//--->Editing Viewport > start
	$(document).on('click', '.row_data', function(event)
	{
		$("#Description").html("");
		//selecting the currently clicked cell, adding the selected color class to it >>>> start
		if(PrevSelect!=null)
		{
			PrevSelect.removeClass("selected");// remove the select look from the previously selected cell
		}
		var row_div = $(this)
		row_div.addClass("selected");
		PrevSelect = row_div;//storing the selected cell
		//selecting the currently clicked cell, adding the selected color class to it >>>> end

		//exatracting the information from the cell you just clicked on >>>> start
		//structure of each period in the fetched userbookings
		/*
		[0] - booking email
		[1] - perpectual, nonperpectual booking etc.
		[2] - HowManyWeeks your non-perpectual booking will go for [startWeekBegining][EndWeekBegining] or just -1
		[3] - week 1, week 2 or both
		[4] - timeStamp
		[5] - ECADescription [name][description]
		[6] - coordinate of booking [row][col] on the table
		[7] - week begining
		*/
		
		//Structure of lesson / Recurring Lock
		/*
		[0] - booking value, unbooked, etc
		[1] - booking email
		[2] - perpectual, nonperpectual booking etc.
		[3] - week 1, week 2 or both
		*/
		
		//putting the coordinates into the variable
		coordinates = [];
		coordinates.push(parseInt($(this).closest('tr').attr('row_name')));
		coordinates.push(parseInt($(this).attr('col_name')));
		//console.log(coordinates);

		//getting the current day
		var row_id = $(this).closest('tr').attr('row_id');
		var row = document.getElementById(row_id);
		var cell = row.getElementsByTagName("td");
		day = cell[0].textContent;
		//getting the current period
		period = getPeriod(coordinates[1],min30Periods)

		// storing the full HTML of the currently clicked div
		fullCurrentStatus = $(this).html();
		//getting the current booking status
		currentBookingState = fullCurrentStatus.split(' ')[0]
		//getting the hidden span content
		var hiddenSpan = extractHiddenContent(fullCurrentStatus)
		hiddenSpan = hiddenSpan.substr(hiddenSpan.indexOf(" ") + 1);
		bookingDetails = hiddenSpan.split('%');
		//console.log(bookingDetails)
		//exatracting the information from the cell you just clicked on >>>> end


		//populating the viewport with extracted information from the cell >>>> start
		$("#viewPort").show();
		$("#viewPort_Content").show();
		$("#deleteBtn").hide();
		$("#contactBtn").hide();
		$("#bookBtn").hide();
		$("#rbookBtn").hide();
		$("#lessonLockBtn").hide();
		$("#quickLockBtn").hide();
		$("#rLockBtn").hide();
		$("#preLimLoader").hide();

		$("#bookingDetails").html("<strong>Week Beginning: </strong>" + getWeekBegining(new Date()) + "<br><strong>Time:</strong> "+day+" "+period);

		if(currentBookingState == unbookedval)//if booked state is unbooked
		{
			$("#bookingStatus").html("<strong>Status: </strong>unbooked<br>")
			$("#bookBtn").show();
			$("#rbookBtn").show();
			//the checkRoomAdmin function was called in the generate booking table area, used to determine whether the current user is a resos admin. or a master admin.
			if(resosAdmin==true)
			{
				$("#lessonLockBtn").show();
				$("#quickLockBtn").show();
				$("#rLockBtn").show();
			}
		}
		else if(currentBookingState == bookval)//if booked state is booked
		{
			timeStamp = bookingDetails[4].replace(/_/g, ' ');
			//structure of each period in the fetched userbookings
			/*
			[0] - booking email
			[1] - perpectual, nonperpectual booking etc.
			[2] - HowManyWeeks your non-perpectual booking will go for [startWeekBegining][EndWeekBegining] or just -1
			[3] - week 1, week 2 or both
			[4] - timeStamp
			[5] - ECADescription [name][description]
			[6] - coordinate of booking [row][col] on the table
			[7] - week begining
			*/
			
			//Structure of lesson / Recurring Lock
			/*
			[0] - booking value, unbooked, etc
			[1] - booking email
			[2] - perpectual, nonperpectual booking etc.
			[3] - week 1, week 2 or both
			*/
			
			clickBookedEmail = bookingDetails[0];
			//console.log(bookingDetails)
			if(userEmail == clickBookedEmail)//if user is the one who made the booking
			{
				$("#bookingStatus").html("<strong>Status: </strong> booked <strong><em>[Timestamp: "+timeStamp+"]</em></strong><br><strong>Email: </strong>"+clickBookedEmail)
				$("#deleteBtn").show();
				if($(this).hasClass("disable"))//if time to make booking has elasped.
				{
					$("#deleteBtn").attr("disabled", "disabled");
					if(Recurrence=true)
					{
						$("#deleteBtn").removeAttr("disabled");
					}
				}
				else
				{
					$("#deleteBtn").removeAttr("disabled");
				}
			}
			else
			{
				$("#bookingStatus").html("<strong>Status: </strong> booked <strong><em>[Timestamp: "+timeStamp+"]</em></strong><br><strong>Email: </strong>"+clickBookedEmail)
				$("#contactBtn").show();
				if($(this).hasClass("disable"))
				{
					$("#contactBtn").attr("disabled", "disabled");
					if(Recurrence=true)
					{
						$("#contactBtn").removeAttr("disabled");
					}
				}
				else
				{
					$("#contactBtn").removeAttr("disabled");
				}
			}
			if(resosAdmin == true)
			{
				$("#deleteBtn").show();
				$("#deleteBtn").removeAttr("disabled");
			}
			
			if(bookingDetails[2] != "-1" || bookingDetails[5] != "N.A")
			{
				var onWhatWeek = bookingDetails[3]; 
				if(bookingDetails[3] == "Week1Week2")
				{
					onWhatWeek = "Week 1 & Week 2"
				}
				else if(bookingDetails[3] == "Week1")
				{
					onWhatWeek = "Week 1"
				}
				else if(bookingDetails[3] == "Week2")
				{
					onWhatWeek = "Week 2"
				}
				
				var weekStart; 
				var weekEnd; 
				
				var weekStartNum; 
				var weekEndNum;
				
				var weeksLeft; 
				if(bookingDetails[1] == "NP")
				{
					weekStart = getWeekBegining(new Date(currentWeekBegining));
					weekEnd = bookingDetails[2].split(",")[2]+","+bookingDetails[2].split(",")[3]
					
					weekStartNum = transformCurrentWeek(weekStart)
					weekEndNum = transformCurrentWeek(weekEnd)
					
					//console.log(weekStart)
					//console.log(weekEnd)
					//console.log(weekStartNum)
					//console.log(weekEndNum)
					weeksLeft = DifferenceInDays(transformYYYYMMDDtoDate(weekStartNum.toString()),transformYYYYMMDDtoDate(weekEndNum.toString()))
					weeksLeft = Math.trunc(weeksLeft / 7) + 1
					
				}
				else if(bookingDetails[1] == "P")
				{
					weeksLeft = "Perpetual"
				}
				$("#Description").html(
					"<strong>ECA:</strong> " + bookingDetails[5].split(",")[0] + "<br>" + 
					"<strong>Description:</strong> " + bookingDetails[5].split(",")[1] + "<br>" + 
					"<strong>On Week:</strong> " + onWhatWeek + "<br>" + 
					"<strong>Weeks Left:</strong> " + weeksLeft + "<br>"
				)
			}
		}
		else if(currentBookingState == lessonval) //if booked state is lesson
		{
			clickBookedEmail = bookingDetails[0];
			if(userEmail == clickBookedEmail)
			{
				$("#bookingStatus").html("<strong>Status: </strong> lesson<br><strong>Email: </strong>"+clickBookedEmail)
				$("#deleteBtn").show();
				$("#deleteBtn").removeAttr("disabled");				}
			else
			{
				$("#bookingStatus").html("<strong>Status: </strong> lesson<br><strong>Email: </strong>"+clickBookedEmail)
				$("#contactBtn").show();
				$("#contactBtn").removeAttr("disabled");
			}
			if(resosAdmin == true)
			{
				$("#deleteBtn").show();
				$("#deleteBtn").removeAttr("disabled");
			}
		}
		else if(currentBookingState ==lockval) //if booked state is lock
		{
			if(resosAdmin == true)
			{
				$("#bookingStatus").html("<strong>Status: </strong> locked")
				$("#deleteBtn").show();
				$("#deleteBtn").removeAttr("disabled");
			}
			else
			{
				$("#bookingStatus").html("<strong>Status: </strong> locked")
			}
		}

		//populating the viewport with extracted information from the cell >>>> end
	});
	//--->Editing Viewport > end

	//--->MakingviewPort Dissapear when user clicks away > start
	$(document).mouseup(function(e)
	{
		var container = $("#viewPort");
		var table = $("#timeTable");
		var bookRModal = $("#BookRecurring")
		var EModal = $("#emailModal")
		var datePicking = $(".ui-datepicker")
		
		// if the target of the click isn't the container nor a descendant of the container
		if (!container.is(e.target) && container.has(e.target).length === 0 && !table.is(e.target) && table.has(e.target).length === 0 && !bookRModal.is(e.target) && bookRModal.has(e.target).length === 0 && !EModal.is(e.target) && EModal.has(e.target).length === 0 && !datePicking.is(e.target) && datePicking.has(e.target).length === 0)
		{
			$("#viewPort_Content").hide()
			$("#preLimLoader").show();
			if(PrevSelect!=null)
			{
				PrevSelect.removeClass("selected")
			}
		}
	});
	//--->MakingviewPort Dissapear  when user clicks away > end
	
	//-->Quickbooking a period Start
	$(document).on('click', '#bookBtn', function(event) 
	{
		//need to first see if the slot's been taken aready
		//then if its not then it will excecute the Booking Function 

		//structure of each period in the fetched userbookings
		/*
		[0] - booking value, unbooked, etc
		[1] - booking email
		[2] - perpectual, nonperpectual booking etc.
		[3] - HowManyWeeks your non-perpectual booking will go for [startWeekBegining][EndWeekBegining] or just -1
		[4] - week 1, week 2 or both
		[5] - timeStamp
		[6] - ECADescription [name][description]
		[7] - coordinate of booking [row][col] on the table
		[8] - week begining
		*/

		//Structure of lesson / Recurring Lock
		/*
		[0] - booking value, unbooked, etc
		[1] - booking email
		[2] - perpectual, nonperpectual booking etc.
		[3] - week 1, week 2 or both
		*/
		
		// in order to compare to see if smth like this already exists, you have to compare Week Begining and Coordinate. With a quick sequential search. Ineffcient but who cares its easy to code. Aint no body gonna do a binary ass search. You can figure it out if you first pull room data and isolate the BookingSchedule field, in Items. 
		
		//getSpecificResos(resosID, resosType) 
		// gets the information of a very specific resosID, stores it in indiRoomData when indiResosDataFetchSuccess is true
		
		preLimLoader("Booking...") //output showing user the room is currently being booked
		
		event.preventDefault(); //prevent's default function from excecuting
		
		//console.log(coordinates) //in a [x,y] format row, col
		//console.log(day) 
		//console.log(period)
		//console.log(fullCurrentStatus), Useless in this context
		//console.log(currentBookingState), Useless in this context
		//console.log(bookingDetails) //["email@temp.com", "perpetual", "Week1"]
		//need to retrieve Week Begining. 
		
		getSpecificResos(currentResosID, currentResosType)
		indiResosDataFetchSuccess = false;
		validateResosFetch()
		
		intendedCoors = coordinates
		formattedCurrentDate = getWeekBegining(currentWeekBegining);
		
		function validateResosFetch()
		{
			if(indiResosDataFetchSuccess == false)
			{
				window.setTimeout(validateResosFetch,1000)
			}
			else
			{
				indiResosDataFetchSuccess = false;
				RoombookingSchedule = indiRoomData.Items[0].BookingSchedule
				validatePeriodAvailbility()
			}
		}
		function validatePeriodAvailbility()//makes sure that the period isnt booked b4
		{
			//console.log(indiRoomData)
			
			
			if(RoombookingSchedule[0]=="Empty List")
			{
				RoombookingSchedule = [];
				validatedAndBook()
			}
			else
			{
				var freeForBooking = true; 
				for(var i = 0; i < RoombookingSchedule.length; i++)
				{
					if(RoombookingSchedule[i][RoombookingSchedule[0].length-1] == formattedCurrentDate && RoombookingSchedule[i][RoombookingSchedule[0].length-2] == intendedCoors) // will only allow book to occur if the room hasnt been taken. 
					{
						freeForBooking = false; 
					}
				}
				if(freeForBooking == false)
				{
					preLimLoader("Error: Slot is already booked")
					exitpreLimLoaderErr() //exiting the err output after a few seconds
					viewResos(currentResosID,currentResosType,currentWeekBegining) //refreshes the room
				}
				else
				{
					validatedAndBook()
				}
			}
		}
		
		//booking start
		function validatedAndBook()
		{
			var newPeriodObject = [];
			//structure of each period in the fetched userbookings
			/*
			[0] - booking value, unbooked, etc
			[1] - booking email
			[2] - perpectual, nonperpectual booking etc.
			[3] - HowManyWeeks your non-perpectual booking will go for [startWeekBegining][EndWeekBegining] or just -1
			[4] - week 1, week 2 or both
			[5] - timeStamp
			[6] - ECADescription [name][description]
			[7] - coordinate of booking [row][col] on the table
			[8] - week begining
			*/
			
			//Structure of lesson / Recurring Lock
			/*
			[0] - booking value, unbooked, etc
			[1] - booking email
			[2] - perpectual, nonperpectual booking etc.
			[3] - week 1, week 2 or both
			*/
			newPeriodObject.push(bookval)
			newPeriodObject.push(userEmail)
			newPeriodObject.push("NP")
			newPeriodObject.push(-1)
			var CurrentWeekString;
			if(currentWeek==1)
			{
				CurrentWeekString = "Week1"
			}
			else if(currentWeek==2)
			{
				CurrentWeekString = "Week2"
			}
			newPeriodObject.push(CurrentWeekString)
			newPeriodObject.push(getTimeStamp())
			newPeriodObject.push("N.A")
			newPeriodObject.push(intendedCoors)
			newPeriodObject.push(formattedCurrentDate)
			
			//console.log(newPeriodObject);
			
			RoombookingSchedule.push(newPeriodObject)
			
			updateRoomDetails(currentResosID, "BookingSchedule", RoombookingSchedule)
			
			roomInfoUpdateSuccess = false; 
			validateRoomInfoUpdate()	
			
		}
		function validateRoomInfoUpdate()
		{
			if(roomInfoUpdateSuccess == false)//makes sure that the room update is suscessful b4 reloading the room. 
			{
				window.setTimeout(validateRoomInfoUpdate, 1000)
			}
			else
			{
				viewResos(currentResosID, "room", currentWeekBegining)
				roomInfoUpdateSuccess = false; 
			}
		}
		
	});
	//-->Quickbooking a period End
	
	//-->quicklocking a period Start
	$(document).on('click', '#quickLockBtn', function(event) 
	{
		//need to first see if the slot's been taken aready
		//then if its not then it will excecute the Booking Function 

		//structure of each period in the fetched userbookings
		/*
		[0] - booking value, unbooked, etc
		[1] - booking email
		[2] - perpectual, nonperpectual booking etc.
		[3] - HowManyWeeks your non-perpectual booking will go for [startWeekBegining][EndWeekBegining] or just -1
		[4] - week 1, week 2 or both
		[5] - timeStamp
		[6] - ECADescription [name][description]
		[7] - coordinate of booking [row][col] on the table
		[8] - week begining
		*/

		//Structure of lesson / Recurring Lock
		/*
		[0] - booking value, unbooked, etc
		[1] - booking email
		[2] - perpectual, nonperpectual booking etc.
		[3] - week 1, week 2 or both
		*/
		
		// in order to compare to see if smth like this already exists, you have to compare Week Begining and Coordinate. With a quick sequential search. Ineffcient but who cares its easy to code. Aint no body gonna do a binary ass search. You can figure it out if you first pull room data and isolate the BookingSchedule field, in Items. 
		
		//getSpecificResos(resosID, resosType) 
		// gets the information of a very specific resosID, stores it in indiRoomData when indiResosDataFetchSuccess is true
		
		preLimLoader("Locking Period...") //output showing user the room is currently being booked
		
		event.preventDefault(); //prevent's default function from excecuting
		
		//console.log(coordinates) //in a [x,y] format row, col
		//console.log(day) 
		//console.log(period)
		//console.log(fullCurrentStatus), Useless in this context
		//console.log(currentBookingState), Useless in this context
		//console.log(bookingDetails) //["email@temp.com", "perpetual", "Week1"]
		//need to retrieve Week Begining. 
		
		getSpecificResos(currentResosID, currentResosType)
		indiResosDataFetchSuccess = false;
		validateResosFetch()
		
		intendedCoors = coordinates
		formattedCurrentDate = getWeekBegining(currentWeekBegining);
		
		function validateResosFetch()
		{
			if(indiResosDataFetchSuccess == false)
			{
				window.setTimeout(validateResosFetch,1000)
			}
			else
			{
				indiResosDataFetchSuccess = false;
				RoombookingSchedule = indiRoomData.Items[0].BookingSchedule
				validatePeriodAvailbility()
			}
		}
		function validatePeriodAvailbility()//makes sure that the period isnt booked b4
		{
			//console.log(indiRoomData)
			
			
			if(RoombookingSchedule[0]=="Empty List")
			{
				RoombookingSchedule = [];
				validatedAndBook()
			}
			else
			{
				var freeForBooking = true; 
				for(var i = 0; i < RoombookingSchedule.length; i++)
				{
					if(RoombookingSchedule[i][RoombookingSchedule[0].length-1] == formattedCurrentDate && RoombookingSchedule[i][RoombookingSchedule[0].length-2] == intendedCoors) // will only allow book to occur if the room hasnt been taken. 
					{
						freeForBooking = false; 
					}
				}
				if(freeForBooking == false)
				{
					preLimLoader("Error: Slot is already booked")
					exitpreLimLoaderErr() //exiting the err output after a few seconds
					viewResos(currentResosID,currentResosType,currentWeekBegining) //refreshes the room
				}
				else
				{
					validatedAndBook()
				}
			}
		}
		
		//booking start
		function validatedAndBook()
		{
			var newPeriodObject = [];
			//structure of each period in the fetched userbookings
			/*
			[0] - booking value, unbooked, etc
			[1] - booking email
			[2] - perpectual, nonperpectual booking etc.
			[3] - HowManyWeeks your non-perpectual booking will go for [startWeekBegining][EndWeekBegining] or just -1
			[4] - week 1, week 2 or both
			[5] - timeStamp
			[6] - ECADescription [name][description]
			[7] - coordinate of booking [row][col] on the table
			[8] - week begining
			*/
			
			//Structure of lesson / Recurring Lock
			/*
			[0] - booking value, unbooked, etc
			[1] - booking email
			[2] - perpectual, nonperpectual booking etc.
			[3] - week 1, week 2 or both
			*/
			newPeriodObject.push(lockval)
			newPeriodObject.push(userEmail)
			newPeriodObject.push("NP")
			newPeriodObject.push(-1)
			var CurrentWeekString;
			if(currentWeek==1)
			{
				CurrentWeekString = "Week1"
			}
			else if(currentWeek==2)
			{
				CurrentWeekString = "Week2"
			}
			newPeriodObject.push(CurrentWeekString)
			newPeriodObject.push(getTimeStamp())
			newPeriodObject.push("N.A")
			newPeriodObject.push(intendedCoors)
			newPeriodObject.push(formattedCurrentDate)
			
			//console.log(newPeriodObject);
			
			RoombookingSchedule.push(newPeriodObject)
			
			updateRoomDetails(currentResosID, "BookingSchedule", RoombookingSchedule)
			
			roomInfoUpdateSuccess = false; 
			validateRoomInfoUpdate()	
			
		}
		function validateRoomInfoUpdate()
		{
			if(roomInfoUpdateSuccess == false)//makes sure that the room update is suscessful b4 reloading the room. 
			{
				window.setTimeout(validateRoomInfoUpdate, 1000)
			}
			else
			{
				viewResos(currentResosID, "room", currentWeekBegining)
				roomInfoUpdateSuccess = false; 
			}
		}
		
	
	});
	//-->quicklocking a period End
	
	//-->locking a period in perma schedule recurring Booking Start
	$(document).on('click', '#rLockBtn', function(event) 
	{
		var indexOfBookingThatsInterrupting; //index of the booking that called the confirm lesson alert. Index of the userbooking that's basically blocking ur lesson. 
		
		//need to first see if the slot's been taken aready
		//then if its not then it will excecute the Booking Function 

		//structure of each period in the fetched userbookings
		/*
		[0] - booking value, unbooked, etc
		[1] - booking email
		[2] - perpectual, nonperpectual booking etc.
		[3] - HowManyWeeks your non-perpectual booking will go for [startWeekBegining][EndWeekBegining] or just -1
		[4] - week 1, week 2 or both
		[5] - timeStamp
		[6] - ECADescription [name][description]
		[7] - coordinate of booking [row][col] on the table
		[8] - week begining
		*/
		
		//Structure of lesson / Recurring Lock
		/*
		[0] - booking value, unbooked, etc
		[1] - booking email
		[2] - perpectual, nonperpectual booking etc.
		[3] - week 1, week 2 or both
		*/

		// in order to compare to see if smth like this already exists, you have to compare Week Begining and Coordinate. With a quick sequential search. Ineffcient but who cares its easy to code. Aint no body gonna do a binary ass search. You can figure it out if you first pull room data and isolate the BookingSchedule field, in Items. 
		
		//getSpecificResos(resosID, resosType) 
		// gets the information of a very specific resosID, stores it in indiRoomData when indiResosDataFetchSuccess is true
		
		preLimLoader("Locking Period in Perma Shchd...") //output showing user the room is currently being booked
		event.preventDefault(); //prevent's default function from excecuting
		
		//console.log(coordinates) //in a [x,y] format row, col
		//console.log(day) 
		//console.log(period)
		//console.log(fullCurrentStatus), Useless in this context
		//console.log(currentBookingState), Useless in this context
		//console.log(bookingDetails) //["email@temp.com", "perpetual", "Week1"]
		//need to retrieve Week Begining. 
		
		getSpecificResos(currentResosID, currentResosType)
		indiResosDataFetchSuccess = false;
		validateResosFetch()
		
		intendedCoors = coordinates
		formattedCurrentDate = getWeekBegining(currentWeekBegining);
		//console.log(formattedCurrentDate)
		
		function validateResosFetch()
		{
			if(indiResosDataFetchSuccess == false)
			{
				window.setTimeout(validateResosFetch,1000)
			}
			else
			{
				indiResosDataFetchSuccess = false;
				
				RoombookingSchedule = indiRoomData.Items[0].BookingSchedule;
				permaSchd = indiRoomData.Items[0].PermaSchedule;
				
				validatePeriodAvailbility()
			}
		}
		function validatePeriodAvailbility()//makes sure that the period isnt booked b4
		{
			//console.log(indiRoomData)
			
			
			if(RoombookingSchedule[0]=="Empty List")
			{
				RoombookingSchedule = [];
				validatedAndBook()
			}
			else
			{
				var freeForBooking = true; 
				
				// bascially what this block of code validates is that booking your lesson won't fuck with someone's scheule the next week. Ofc you can still still book if u want. But yeah... 
				
				//seeing if its week 1 or week 2, putting it in word form in order to compare in the array. 
				//console.log(currentWeek)
				if(currentWeek == 1)  
				{
					weekNow = "Week1"
				}
				else if(currentWeek == 2)
				{
					weekNow = "Week2"
				}
				//console.log(permaSchd);
				// looping through all the scheudle's booked by users to see if anything is being over ridden. Will check whether a schedule is in the same week and if its the same coordinates. If it is, then the lesson will interfere. 
				for(var i = 0; i < RoombookingSchedule.length; i++)
				{
					/*console.log(RoombookingSchedule[i][4] + " : "+ weekNow)
					console.log(RoombookingSchedule[i][RoombookingSchedule[0].length-2] + " : "+ intendedCoors)
					
					console.log((RoombookingSchedule[i][4] == weekNow || RoombookingSchedule[i][4] == "Week1Week2"))
					console.log(compareArray(RoombookingSchedule[i][RoombookingSchedule[0].length-2],intendedCoors))
					
					console.log((RoombookingSchedule[i][4] == weekNow || RoombookingSchedule[i][4] == "Week1Week2") && compareArray(RoombookingSchedule[i][RoombookingSchedule[0].length-2],intendedCoors))*/
					
					if((RoombookingSchedule[i][4] == weekNow || RoombookingSchedule[i][4] == "Week1Week2") && compareArray(RoombookingSchedule[i][RoombookingSchedule[0].length-2],intendedCoors)) // will only allow book to occur if the room hasnt been taken. 
					{
						
						freeForBooking = false; 
						indexOfBookingThatsInterrupting = i;
					}
				}
				if(freeForBooking == false)
				{
					confirmLock()
				}
				else
				{
					validatedAndBook()
				}
			}
		}
		
		//booking start
		function validatedAndBook()
		{
			var newPeriodObject = [];
			//structure of each period in the fetched userbookings
			/*
			[0] - booking value, unbooked, etc
			[1] - booking email
			[2] - perpectual, nonperpectual booking etc.
			[3] - HowManyWeeks your non-perpectual booking will go for [startWeekBegining][EndWeekBegining] or just -1
			[4] - week 1, week 2 or both
			[5] - timeStamp
			[6] - ECADescription [name][description]
			[7] - coordinate of booking [row][col] on the table
			[8] - week begining
			*/
			
			//Structure of lesson / Recurring Lock
			/*
			[0] - booking value, unbooked, etc
			[1] - booking email
			[2] - perpectual, nonperpectual booking etc.
			[3] - week 1, week 2 or both
			*/
			newPeriodObject.push(lockval)
			newPeriodObject.push(userEmail)
			newPeriodObject.push("P")
			var CurrentWeekString;
			if(currentWeek==1)
			{
				CurrentWeekString = "Week1"
			}
			else if(currentWeek==2)
			{
				CurrentWeekString = "Week2"
			}
			newPeriodObject.push(CurrentWeekString)
			
			permaSchd[currentWeek-1][intendedCoors[0]][intendedCoors[1]] = newPeriodObject
						
			updateRoomDetails(currentResosID, "PermaSchedule", permaSchd)
			
			roomInfoUpdateSuccess = false; 
			validateRoomInfoUpdate()	
			
		}
		function validateRoomInfoUpdate()
		{
			if(roomInfoUpdateSuccess == false)//makes sure that the room update is suscessful b4 reloading the room. 
			{
				window.setTimeout(validateRoomInfoUpdate, 1000)
			}
			else
			{
				viewResos(currentResosID, "room", currentWeekBegining)
				roomInfoUpdateSuccess = false; 
			}
		}
		
		function confirmLock()
		{
			var PoNP;
			if(RoombookingSchedule[indexOfBookingThatsInterrupting][2] == "P")
			{
				PoNP = "Perpetual"
			}
			else if(RoombookingSchedule[indexOfBookingThatsInterrupting][2] == "NP")
			{
				PoNP = "Non-Perpetual"
			}
			$.confirm
			({
				boxWidth: '480px',
				useBootstrap: false,
				icon: 'fa fa-warning',
				title: 'Confirm Lock',
				content: 'Locking this period reucurringly for this week will override some of your other user\'s bookings are you sure you want to continue? <br><br><center><strong>BOOKING BEING OVERRIDDEN</strong></center><br><strong>Type: </strong>'+PoNP+'<br><strong>Week Begining: </strong>'+RoombookingSchedule[indexOfBookingThatsInterrupting][RoombookingSchedule[0].length-1]+'<br><strong>User: </strong>'+RoombookingSchedule[indexOfBookingThatsInterrupting][1]+'<br><strong>Coordinates: </strong>[' + RoombookingSchedule[indexOfBookingThatsInterrupting][RoombookingSchedule[0].length-2][0]+', '+ RoombookingSchedule[indexOfBookingThatsInterrupting][RoombookingSchedule[0].length-2][1]+']',
				theme: 'modern',
				draggable: false,
				buttons:
				{
					confirm:
					{
						btnClass: 'btn-green',
						text:'Lock',
						action: function()
						{
							validatedAndBook()
						}
					},
					cancel:
					{
						text:'Cancel',
						action: function()
						{
							preLimLoader("Exiting function...")
							exitpreLimLoaderErr() //exiting the err output after a few seconds
							//viewResos(currentResosID,currentResosType,currentWeekBegining) //refreshes the room
						}
					},
				}
			});
		}
		
	});
	//-->locking a period in perma schedule recurring Booking End
	
	//-->locking a lesson period Start
	$(document).on('click', '#lessonLockBtn', function(event) 
	{
		var indexOfBookingThatsInterrupting; //index of the booking that called the confirm lesson alert. Index of the userbooking that's basically blocking ur lesson. 
		
		//need to first see if the slot's been taken aready
		//then if its not then it will excecute the Booking Function 

		//structure of each period in the fetched userbookings
		/*
		[0] - booking value, unbooked, etc
		[1] - booking email
		[2] - perpectual, nonperpectual booking etc.
		[3] - HowManyWeeks your non-perpectual booking will go for [startWeekBegining][EndWeekBegining] or just -1
		[4] - week 1, week 2 or both
		[5] - timeStamp
		[6] - ECADescription [name][description]
		[7] - coordinate of booking [row][col] on the table
		[8] - week begining
		*/
		
		//Structure of lesson / Recurring Lock
		/*
		[0] - booking value, unbooked, etc
		[1] - booking email
		[2] - perpectual, nonperpectual booking etc.
		[3] - week 1, week 2 or both
		*/
		
		// in order to compare to see if smth like this already exists, you have to compare Week Begining and Coordinate. With a quick sequential search. Ineffcient but who cares its easy to code. Aint no body gonna do a binary ass search. You can figure it out if you first pull room data and isolate the BookingSchedule field, in Items. 
		
		//getSpecificResos(resosID, resosType) 
		// gets the information of a very specific resosID, stores it in indiRoomData when indiResosDataFetchSuccess is true
		
		preLimLoader("Creating Lesson...") //output showing user the room is currently being booked
		event.preventDefault(); //prevent's default function from excecuting
		
		//console.log(coordinates) //in a [x,y] format row, col
		//console.log(day) 
		//console.log(period)
		//console.log(fullCurrentStatus), Useless in this context
		//console.log(currentBookingState), Useless in this context
		//console.log(bookingDetails) //["email@temp.com", "perpetual", "Week1"]
		//need to retrieve Week Begining. 
		
		getSpecificResos(currentResosID, currentResosType)
		indiResosDataFetchSuccess = false;
		validateResosFetch()
		
		intendedCoors = coordinates
		formattedCurrentDate = getWeekBegining(currentWeekBegining);
		//console.log(formattedCurrentDate)
		
		function validateResosFetch()
		{
			if(indiResosDataFetchSuccess == false)
			{
				window.setTimeout(validateResosFetch,1000)
			}
			else
			{
				indiResosDataFetchSuccess = false;
				
				RoombookingSchedule = indiRoomData.Items[0].BookingSchedule;
				permaSchd = indiRoomData.Items[0].PermaSchedule;
				
				validatePeriodAvailbility()
			}
		}
		function validatePeriodAvailbility()//makes sure that the period isnt booked b4
		{
			//console.log(indiRoomData)
			
			
			if(RoombookingSchedule[0]=="Empty List")
			{
				RoombookingSchedule = [];
				validatedAndBook()
			}
			else
			{
				var freeForBooking = true; 
				
				// bascially what this block of code validates is that booking your lesson won't fuck with someone's scheule the next week. Ofc you can still still book if u want. But yeah... 
				
				//seeing if its week 1 or week 2, putting it in word form in order to compare in the array. 
				//console.log(currentWeek)
				if(currentWeek == 1)  
				{
					weekNow = "Week1"
				}
				else if(currentWeek == 2)
				{
					weekNow = "Week2"
				}
				//console.log(permaSchd);
				// looping through all the scheudle's booked by users to see if anything is being over ridden. Will check whether a schedule is in the same week and if its the same coordinates. If it is, then the lesson will interfere. 
				for(var i = 0; i < RoombookingSchedule.length; i++)
				{
					/*console.log(RoombookingSchedule[i][4] + " : "+ weekNow)
					console.log(RoombookingSchedule[i][RoombookingSchedule[0].length-2] + " : "+ intendedCoors)
					
					console.log((RoombookingSchedule[i][4] == weekNow || RoombookingSchedule[i][4] == "Week1Week2"))
					console.log(compareArray(RoombookingSchedule[i][RoombookingSchedule[0].length-2],intendedCoors))
					
					console.log((RoombookingSchedule[i][4] == weekNow || RoombookingSchedule[i][4] == "Week1Week2") && compareArray(RoombookingSchedule[i][RoombookingSchedule[0].length-2],intendedCoors))*/
					
					if((RoombookingSchedule[i][4] == weekNow || RoombookingSchedule[i][4] == "Week1Week2") && compareArray(RoombookingSchedule[i][RoombookingSchedule[0].length-2],intendedCoors)) // will only allow book to occur if the room hasnt been taken. 
					{
						
						freeForBooking = false; 
						indexOfBookingThatsInterrupting = i;
					}
				}
				if(freeForBooking == false)
				{
					confirmLesson()
				}
				else
				{
					validatedAndBook()
				}
			}
		}
		
		//booking start
		function validatedAndBook()
		{
			var newPeriodObject = [];
			//structure of each period in the fetched userbookings
			/*
			[0] - booking value, unbooked, etc
			[1] - booking email
			[2] - perpectual, nonperpectual booking etc.
			[3] - HowManyWeeks your non-perpectual booking will go for [startWeekBegining][EndWeekBegining] or just -1
			[4] - week 1, week 2 or both
			[5] - timeStamp
			[6] - ECADescription [name][description]
			[7] - coordinate of booking [row][col] on the table
			[8] - week begining
			*/
			
			//Structure of lesson / Recurring Lock
			/*
			[0] - booking value, unbooked, etc
			[1] - booking email
			[2] - perpectual, nonperpectual booking etc.
			[3] - week 1, week 2 or both
			*/
			
			newPeriodObject.push(lessonval)
			newPeriodObject.push(userEmail)
			newPeriodObject.push("P")
			newPeriodObject.push(weekNow)
			
			permaSchd[currentWeek-1][intendedCoors[0]][intendedCoors[1]] = newPeriodObject
						
			updateRoomDetails(currentResosID, "PermaSchedule", permaSchd)
			
			roomInfoUpdateSuccess = false; 
			validateRoomInfoUpdate()	
			
		}
		function validateRoomInfoUpdate()
		{
			if(roomInfoUpdateSuccess == false)//makes sure that the room update is suscessful b4 reloading the room. 
			{
				window.setTimeout(validateRoomInfoUpdate, 1000)
			}
			else
			{
				viewResos(currentResosID, "room", currentWeekBegining)
				roomInfoUpdateSuccess = false; 
			}
		}
		
		function confirmLesson()
		{
			var PoNP;
			if(RoombookingSchedule[indexOfBookingThatsInterrupting][2] == "P")
			{
				PoNP = "Perpetual"
			}
			else if(RoombookingSchedule[indexOfBookingThatsInterrupting][2] == "NP")
			{
				PoNP = "Non-Perpetual"
			}
			$.confirm
			({
				boxWidth: '480px',
				useBootstrap: false,
				icon: 'fa fa-warning',
				title: 'Confirm Booking',
				content: 'Booking this lesson will override some of your other user\'s bookings are you sure you want to continue? <br><br><center><strong>BOOKING BEING OVERRIDDEN</strong></center><br><strong>Type: </strong>'+PoNP+'<br><strong>Week Begining: </strong>'+RoombookingSchedule[indexOfBookingThatsInterrupting][RoombookingSchedule[0].length-1]+'<br><strong>User: </strong>'+RoombookingSchedule[indexOfBookingThatsInterrupting][1]+'<br><strong>Coordinates: </strong>[' + RoombookingSchedule[indexOfBookingThatsInterrupting][RoombookingSchedule[0].length-2][0]+', '+ RoombookingSchedule[indexOfBookingThatsInterrupting][RoombookingSchedule[0].length-2][1]+']',
				theme: 'modern',
				draggable: false,
				buttons:
				{
					confirm:
					{
						btnClass: 'btn-green',
						text:'Book',
						action: function()
						{
							validatedAndBook()
						}
					},
					cancel:
					{
						text:'Cancel',
						action: function()
						{
							preLimLoader("Exiting function...")
							exitpreLimLoaderErr() //exiting the err output after a few seconds
							//viewResos(currentResosID,currentResosType,currentWeekBegining) //refreshes the room
						}
					},
				}
			});
		}
		
	});
	//-->locking a lesson period End
	
	//deleting a period start
	$(document).on('click', '#deleteBtn', function(event) 
	{
		preLimLoader("Deleting Event...")
		event.preventDefault();
		
		intendedCoors = coordinates
		formattedCurrentDate = getWeekBegining(currentWeekBegining);
		RoombookingSchedule = indiRoomData.Items[0].BookingSchedule;
		permaSchd = indiRoomData.Items[0].PermaSchedule;
		//console.log(bookingDetails)
		//console.log(RoombookingSchedule)
		// we have to search for the booking in the room booking schedule, remove it, then plug it back into the equation. 
		//if the booking doesnt exist in the scheulde it must exist in the permanent schedule. Find out if theyre in week 1 or week 2, then just pluck out the coordinate 
		
		//converts the booking schedule within the hiddenspan back into it's original state in the initaltable period 3 dimentional array. START
		var bookingDetailsArrayConverted = [];
		bookingDetailsArrayConverted.push(currentBookingState)
		for(var i = 0; i<bookingDetails.length; i++)
		{
			if(i == 2)
			{
				bookingDetailsArrayConverted.push(parseInt(bookingDetails[i]))
			}
			else if(i == 6)
			{
				bookingDetailsArrayConverted.push(bookingDetails[i].split(",").map(Number));
			}
			else
			{
				bookingDetailsArrayConverted.push(bookingDetails[i])
			}
		}
		//converts the booking schedule within the hiddenspan back into it's original state in the initaltable period 3 dimentional array. END
		
		//console.log(bookingDetailsArrayConverted);
		//Deleting away from the userBookingSchedule. Array Start
		var deletedFromUserBookingSchd = false; 
		//console.log(RoombookingSchedule);
		for(var i = RoombookingSchedule.length-1; i>-1; i--)
		{
			if(compareArray(RoombookingSchedule[i],bookingDetailsArrayConverted))
			{
				deletedFromUserBookingSchd = true; 
				RoombookingSchedule.splice(i, 1);
				if(RoombookingSchedule.length == 0)
				{
					RoombookingSchedule.push("Empty List");
				}
			}
		}
		//console.log(RoombookingSchedule)
		//Deleting away from the roombookingSchedule. Array End

		//Deleting away from the permanment schedule Array start
		
		//needs to figure out the week, and the coordinates, then purge from the permsched array. 
		
		if(deletedFromUserBookingSchd == false)
		{
			var newEmptyPeriod = [];
			//console.log(bookingDetails)
			var weekYoureDeletingFrom; 
			if(bookingDetails[2] == "Week1")//if its a lesson in permaschd
			{
				weekYoureDeletingFrom = 0;
				newEmptyPeriod.push("unbooked")
				newEmptyPeriod.push(userEmail)
				newEmptyPeriod.push("P")
				newEmptyPeriod.push("Week1")
			}
			else if(bookingDetails[2] == "Week2")
			{
				weekYoureDeletingFrom = 1; 
				newEmptyPeriod.push("unbooked")
				newEmptyPeriod.push(userEmail)
				newEmptyPeriod.push("P")
				newEmptyPeriod.push("Week2")
			}
			else if(bookingDetails[3] == "Week1")//if its a recurring perpectual booking in permaschd
			{
				weekYoureDeletingFrom = 0;
				newEmptyPeriod.push("unbooked")
				newEmptyPeriod.push(userEmail)
				newEmptyPeriod.push("P")
				newEmptyPeriod.push("Week1")
			}
			else if(bookingDetails[3] == "Week2")
			{
				weekYoureDeletingFrom = 1; 
				newEmptyPeriod.push("unbooked")
				newEmptyPeriod.push(userEmail)
				newEmptyPeriod.push("P")
				newEmptyPeriod.push("Week2")
			}
			/*
			console.log("")
			console.log(weekYoureDeletingFrom)
			console.log(intendedCoors)
			console.log(newEmptyPeriod)
			console.log("")
			*/
			//console.log(intendedCoors)
			//console.log(weekYoureDeletingFrom)
			permaSchd[weekYoureDeletingFrom][intendedCoors[0]][intendedCoors[1]] = newEmptyPeriod; 
		}
		//Deleting away from the permanment schedule Array end
		
		//Starting the Update of the new room schedule
		roomInfoUpdateSuccess = false; 
		if(deletedFromUserBookingSchd == false)
		{
			updateRoomDetails(currentResosID, "PermaSchedule", permaSchd)
			validateUpdate();
		}
		else
		{
			updateRoomDetails(currentResosID, "BookingSchedule", RoombookingSchedule)
			validateUpdate();
		}
		
		function validateUpdate()
		{
			if(roomInfoUpdateSuccess == false)
			{
				window.setTimeout(validateUpdate,1000);
			}
			else
			{
				viewResos(currentResosID, "room", currentWeekBegining)
				roomInfoUpdateSuccess = false; 
			}
		}
	});
	// deleting a period end
	
	//Booking a Recurring booking start from the timetable modal
	$(document).on('click', '#rbookBtn', function(event) {
		openRecurringModal()
	});
	//Booking a Recurring booking end
	
	//Booking a Recurring booking start from the rbookModal
	$(document).on('click', '#BookRecrBtn', function(event) 
	{
		var indexOfBookingThatsInterrupting; //index of the booking that called the confirm lesson alert. Index of the userbooking that's basically blocking ur lesson. 
		
		//need to first see if the slot's been taken aready
		//then if its not then it will excecute the Booking Function 

		//structure of each period in the fetched userbookings
		/*
		[0] - booking value, unbooked, etc
		[1] - booking email
		[2] - perpectual, nonperpectual booking etc.
		[3] - HowManyWeeks your non-perpectual booking will go for [startWeekBegining][EndWeekBegining] or just -1
		[4] - week 1, week 2 or both
		[5] - timeStamp
		[6] - ECADescription [name][description]
		[7] - coordinate of booking [row][col] on the table
		[8] - week begining
		*/
		
		//Structure of lesson / Recurring Lock
		/*
		[0] - booking value, unbooked, etc
		[1] - booking email
		[2] - perpectual, nonperpectual booking etc.
		[3] - week 1, week 2 or both
		*/
		
		// in order to compare to see if smth like this already exists, you have to compare Week Begining and Coordinate. With a quick sequential search. Ineffcient but who cares its easy to code. Aint no body gonna do a binary ass search. You can figure it out if you first pull room data and isolate the BookingSchedule field, in Items. 
		
		//getSpecificResos(resosID, resosType) 
		// gets the information of a very specific resosID, stores it in indiRoomData when indiResosDataFetchSuccess is true
		
		
		event.preventDefault(); //prevent's default function from excecuting
		
		//console.log(coordinates) //in a [x,y] format row, col
		//console.log(day) 
		//console.log(period)
		//console.log(fullCurrentStatus), Useless in this context
		//console.log(currentBookingState), Useless in this context
		//console.log(bookingDetails) //["email@temp.com", "perpetual", "Week1"]
		//need to retrieve Week Begining. 
		
		getSpecificResos(currentResosID, currentResosType)
		indiResosDataFetchSuccess = false;
		validateUserInformation()
		
		
		intendedCoors = coordinates
		formattedCurrentDate = getWeekBegining(currentWeekBegining);
		//console.log(formattedCurrentDate)
		
		var ECA; // ECA name
		var DESCRIP; // ECA description
		var PoNP; //Perpetual or Non Perpectual
		var Week1OWeek2; // week 1 or week 2 booking
		var StartWeek; // start week begining
		var EndWeek;  // end week begining
		
		function validateResosFetch()
		{
			if(indiResosDataFetchSuccess == false)
			{
				window.setTimeout(validateResosFetch,1000)
			}
			else
			{
				indiResosDataFetchSuccess = false;
				
				RoombookingSchedule = indiRoomData.Items[0].BookingSchedule;
				permaSchd = indiRoomData.Items[0].PermaSchedule;
				
				validatePeriodAvailbility()
			}
		}
		function validatePeriodAvailbility()//makes sure that the period isnt booked b4
		{
			//console.log(indiRoomData)	
			if(RoombookingSchedule[0]=="Empty List")
			{
				RoombookingSchedule = [];
				validatedAndBook()
			}
			else
			{
				var freeForBooking = true; 
				
				// bascially what this block of code validates is that booking your lesson won't fuck with someone's scheule the next week. Ofc you can still still book if u want. But yeah... 
				
				//seeing if its week 1 or week 2, putting it in word form in order to compare in the array. 
				//console.log(currentWeek)
				if(currentWeek == 1)  
				{
					weekNow = "Week1"
				}
				else if(currentWeek == 2)
				{
					weekNow = "Week2"
				}
				//console.log(permaSchd);
				// looping through all the scheudle's booked by users to see if anything is being over ridden. Will check whether a schedule is in the same week and if its the same coordinates. If it is, then the lesson will interfere. 
				for(var i = 0; i < RoombookingSchedule.length; i++)
				{
					/*console.log(RoombookingSchedule[i][4] + " : "+ weekNow)
					console.log(RoombookingSchedule[i][RoombookingSchedule[0].length-2] + " : "+ intendedCoors)
					
					console.log((RoombookingSchedule[i][4] == weekNow || RoombookingSchedule[i][4] == "Week1Week2"))
					console.log(compareArray(RoombookingSchedule[i][RoombookingSchedule[0].length-2],intendedCoors))
					
					console.log((RoombookingSchedule[i][4] == weekNow || RoombookingSchedule[i][4] == "Week1Week2") && compareArray(RoombookingSchedule[i][RoombookingSchedule[0].length-2],intendedCoors))*/
					
					if((RoombookingSchedule[i][4] == weekNow || RoombookingSchedule[i][4] == "Week1Week2") && compareArray(RoombookingSchedule[i][RoombookingSchedule[0].length-2],intendedCoors)) // will only allow book to occur if the room hasnt been taken. 
					{
						
						freeForBooking = false; 
						indexOfBookingThatsInterrupting = i;
					}
				}
				if(freeForBooking == false)
				{
					RBookConfliction()
				}
				else
				{
					validatedAndBook()
				}
			}
		}
		
		function validateUserInformation()
		{
			if($("#eca").val().indexOf(",")==-1 && $("#ecaDes").val().indexOf(",")==-1)
			{	
				if($("#eca").val().length >0 && $("#ecaDes").val().length >0)
				{
					validateResosFetch()
					preLimLoader("Booking recurringly...") //output showing user the room is currently being booked
				}
				else
				{
					$("#RBookErrMsg").html("Please fill in your information")
				}
			}
			else
			{
				$("#RBookErrMsg").html("Error: Character ',' is forbidden. It breaks the code and that'll make me cry );")
			}
			
			
		}
		
		//booking start
		function validatedAndBook()
		{
			recurringBookingModal.style.display = "none";
			var newPeriodObject = [];
			var newECAObject = [];
			var newStartEndWeekObject = [];
			
			ECA = $("#eca").val()
			DESCRIP = $("#ecaDes").val()
			newECAObject.push(ECA);
			newECAObject.push(DESCRIP);
			
			PoNP = $("#Recurrence").val()
			Week1OWeek2 = $("#AlternatingWeeks").val()
			
			StartWeek = $("#startDate").val()
			EndWeek = $("#endDate").val()
			newStartEndWeekObject.push(StartWeek)
			newStartEndWeekObject.push(EndWeek)
			
			//structure of each period in the fetched userbookings
			/*
			[0] - booking value, unbooked, etc
			[1] - booking email
			[2] - perpectual, nonperpectual booking etc.
			[3] - HowManyWeeks your non-perpectual booking will go for [startWeekBegining][EndWeekBegining] or just -1
			[4] - week 1, week 2 or both
			[5] - timeStamp
			[6] - ECADescription [name][description]
			[7] - coordinate of booking [row][col] on the table
			[8] - week begining
			*/
			
			//Structure of lesson / Recurring Lock
			/*
			[0] - booking value, unbooked, etc
			[1] - booking email
			[2] - perpectual, nonperpectual booking etc.
			[3] - week 1, week 2 or both
			*/
			
			newPeriodObject.push(bookval)
			newPeriodObject.push(userEmail)
			newPeriodObject.push(PoNP)
			newPeriodObject.push(newStartEndWeekObject)
			newPeriodObject.push(Week1OWeek2)
			newPeriodObject.push(getTimeStamp())
			newPeriodObject.push(newECAObject)
			newPeriodObject.push(intendedCoors)
			newPeriodObject.push(getWeekBegining(new Date(currentWeekBegining)))
			
			if(PoNP == "P")
			{
				newStartEndWeekObject = []
				
				newStartEndWeekObject.push(getWeekBegining(new Date(currentWeekBegining)))
				var newDateObj = moment(new Date(currentWeekBegining)).add(30, 'y').toDate()
				var newDateBegin = getWeekBegining(newDateObj);
				newStartEndWeekObject.push(newDateBegin)
				
				console.log(newDateBegin)
				
				newPeriodObject = []
				newPeriodObject.push(bookval)
				newPeriodObject.push(userEmail)
				newPeriodObject.push(PoNP)
				newPeriodObject.push(newStartEndWeekObject)
				newPeriodObject.push(Week1OWeek2)
				newPeriodObject.push(getTimeStamp())
				newPeriodObject.push(newECAObject)
				newPeriodObject.push(intendedCoors)
				newPeriodObject.push(getWeekBegining(new Date(currentWeekBegining)))
				
				
				RoombookingSchedule.push(newPeriodObject)
				updateRoomDetails(currentResosID, "BookingSchedule", RoombookingSchedule)
				roomInfoUpdateSuccess = false; 
				validateRoomInfoUpdate()	
			}
			else if(PoNP == "NP")
			{
				RoombookingSchedule.push(newPeriodObject)
				updateRoomDetails(currentResosID, "BookingSchedule", RoombookingSchedule)
				roomInfoUpdateSuccess = false; 
				validateRoomInfoUpdate()
			}
		}
		function validateRoomInfoUpdate()
		{
			if(roomInfoUpdateSuccess == false)//makes sure that the room update is suscessful b4 reloading the room. 
			{
				window.setTimeout(validateRoomInfoUpdate, 1000)
			}
			else
			{
				viewResos(currentResosID, "room", currentWeekBegining)
				roomInfoUpdateSuccess = false; 
			}
		}
		
		function RBookConfliction()
		{
			var PoNP;
			if(RoombookingSchedule[indexOfBookingThatsInterrupting][2] == "P")
			{
				PoNP = "Perpetual"
			}
			else if(RoombookingSchedule[indexOfBookingThatsInterrupting][2] == "NP")
			{
				PoNP = "Non-Perpetual"
			}
			$.confirm
			({
				boxWidth: '480px',
				useBootstrap: false,
				icon: 'fa fa-warning',
				title: 'Recurring Booking Confliction',
				content: 'You may not book this period as there is a confliction<br><br><center><strong>BOOKING CONFLICTION</strong></center><br><strong>Type: </strong>'+PoNP+'<br><strong>Week Begining: </strong>'+RoombookingSchedule[indexOfBookingThatsInterrupting][RoombookingSchedule[0].length-1]+'<br><strong>User: </strong>'+RoombookingSchedule[indexOfBookingThatsInterrupting][1]+'<br><strong>Coordinates: </strong>[' + RoombookingSchedule[indexOfBookingThatsInterrupting][RoombookingSchedule[0].length-2][0]+', '+ RoombookingSchedule[indexOfBookingThatsInterrupting][RoombookingSchedule[0].length-2][1]+']',
				theme: 'modern',
				draggable: false,
				buttons:
				{
					confirm:
					{
						btnClass: 'btn-green',
						text:'Okay',
						action: function()
						{
							preLimLoader("Exiting function...")
							exitpreLimLoaderErr() //exiting the err output after a few seconds
							//viewResos(currentResosID,currentResosType,currentWeekBegining) //refreshes the room
						}
					},
				}
			});
		}
	});
	//Booking a Recurring booking end
	
}
function updateRoomDetails(roomID, UpdateAttr, UpdateVal)//updates room detail, changes properties of anything. 
{
	//console.log(UpdateVal)
	//console.log(UpdatedBookingSchedule)
	roomInfoUpdateSuccess = false; 
	$.ajax
   ({
		type:'PUT',
		url:DCBBookingsResourceRoomAPI,
		data: JSON.stringify(
				{
					"RoomID": roomID,
					"updateAttr":UpdateAttr,
					"updateValue": UpdateVal
				}
			  ),

		contentType:"application/json",

		success: function(data){
			exitpreLimLoader()
			roomInfoUpdateSuccess = true; 
		},

		error: function(data)
		{
			errorModuleShow()
		}
   });
}
function getPeriod(colCoor, min30)//first parameter is a column coordinate of the cell you clicked, min 30 is whether or not it is a 30 min period room
{
	if(min30)
	{
		var period = new Array(19);
		period[0] =  "Period 1 <em>[1]</em>";
		period[1] =  "Period 1 <em>[2]</em>";
		period[2] =  "Period 2 <em>[1]</em>";
		period[3] =  "Period 2 <em>[2]</em>";
		period[4] =  "Break";
		period[5] =  "Period 3 <em>[1]</em>";
		period[6] =  "Period 3 <em>[2]</em>";
		period[7] =  "Period 4 <em>[1]</em>";
		period[8] =  "Period 4 <em>[2]</em>";
		period[9] =  "Lunch";
		period[10] =  "Lunch";
		period[11] =  "Period 5 <em>[1]</em>";
		period[12] =  "Period 5 <em>[2]</em>";
		period[13] =  "Period 6 <em>[1]</em>";
		period[14] =  "Period 6 <em>[2]</em>";
		period[15] =  "ECA 1 <em>[1]</em>";
		period[16] =  "ECA 1 <em>[2]</em>";
		period[17] =  "ECA 2 <em>[1]</em>";
		period[18] =  "ECA 2 <em>[2]</em>";
		return period[colCoor];
	}
	else
	{
		var period = new Array(10);
		period[0] =  "Period 1";
		period[1] =  "Period 2";
		period[2] =  "Break";
		period[3] =  "Period 3";
		period[4] =  "Period 4";
		period[5] =  "Lunch";
		period[6] =  "Period 5";
		period[7] =  "Period 6";
		period[8] =  "ECA 1";
		period[9] =  "ECA 2";
		return period[colCoor];
	}

}
function checkIfResosAdmin()//function that checks whether or not you are the admin of the resos
{
	//seeing if you are an admin of the room
	resosAdmin = false;
	for(var i = 0; i< indiRoomData["Items"][0]["RoomAdmin"].length; i++)
	{
		if(indiRoomData["Items"][0]["RoomAdmin"][i].trim().toLowerCase()==userEmail.trim().toLowerCase())
		{
			resosAdmin = true;
		}
	}
}

//View Room Start
function viewResos(resosID,resosType,weekBegining)
{
	addToRecentlyVisted(resosID,resosType)
	currentResosID = resosID; // currentID the user is viewing
	currentResosType = resosType; // current resostype the user is viewing
	openTimetableModal();
	loadingModal();
	resosName = resosID;
	getSpecificResos(resosID,resosType)
	validateResosFetch()
	indiResosDataFetchSuccess = false;
	currentWeekBegining = new Date(weekBegining)
	function validateResosFetch()
	{
		if(indiResosDataFetchSuccess == false)
		{
			window.setTimeout(validateResosFetch,1000)
		}
		else
		{
			indiResosDataFetchSuccess = false;
			//console.log(indiRoomData);
			calculateCurrentWeek(new Date(weekBegining));
			validateWeekChange()
			
		}
	}
	function validateWeekChange()
	{
		if(currentWeek==null)
		{
			window.setTimeout(validateWeekChange,1000)
		}
		else
		{
			generateBookingTable(indiRoomData["Items"][0],resosType,currentWeek-1,weekBegining)
		}
	}
}
function generateBookingTable(data,resosType,weekNum,weekBegin) //generates table for user
{
	checkIfResosAdmin()
	var tableRowLength = 5;//the length of the table you are making
	var tableColLength = 0;
	if(data["Min30Periods"]=="false")//normal headers
	{
		tableColLength = 10;
		bookval = "booked";
		lockval = "locked";
		lessonval = "lesson";
		unbookedval = "unbooked";
		min30Periods = false;
	}
	else
	{
		tableColLength = 19;
		bookval = "bkd";
		lockval = "lck";
		lessonval = "lsn";
		unbookedval = "unb";
		min30Periods = true;
	}
	//building initial empty table start
	var initialTable = [];
	var weekData = [];
	var dayData=[];
	var periodData=[];
	weekData = []
	for(var i = 0; i<tableRowLength;i++)
	{
		dayData=[];
		for(var j = 0; j<tableColLength; j++)
		{
			periodData[0]=unbookedval;
			periodData[1]="email@temp.com";
			periodData[2]="P";
			periodData[3]="Week1";
			dayData.push(periodData);
		}
		weekData.push(dayData);
	}
	initialTable = weekData
	//console.log(initialTable);
	//building initial empty table end

	//populating initital table with user bookings vals start
	//structure of each period in the fetched userbookings
	/*
	[0] - booking value, unbooked, etc
	[1] - booking email
	[2] - perpectual, nonperpectual booking etc.
	[3] - HowManyWeeks your non-perpectual booking will go for [startWeekBegining][EndWeekBegining] or just -1
	[4] - week 1, week 2 or both
	[5] - timeStamp
	[6] - ECADescription [name][description]
	[7] - coordinate of booking [row][col] on the table
	[8] - week begining
	*/
	
	//Structure of lesson / Recurring Lock
	/*
	[0] - booking value, unbooked, etc
	[1] - booking email
	[2] - perpectual, nonperpectual booking etc.
	[3] - week 1, week 2 or both
	*/
	
	var userBookings = []//array containing the userbookings for that week.
	var fetchedUserBookings = data["BookingSchedule"] //array containing the fetched user bookings
	//console.log(fetchedUserBookings)
	
	if(fetchedUserBookings[0]!="Empty List") // populating the userBookings array;
	{
		for(var i =0; i<fetchedUserBookings.length;i++)
		{
			if(fetchedUserBookings[i][3]==-1)
			{
				if(fetchedUserBookings[i][fetchedUserBookings[i].length-1] == getWeekBegining(new Date(weekBegin)))//the last index of each period's data contains the weekbegining
				{
					userBookings.push(fetchedUserBookings[i]);
				}
			}
			else if(Array.isArray(fetchedUserBookings[i][3]))
			{
				var weekNow;
				if(currentWeek == 1)
				{
					weekNow = "Week1"
				}
				else if(currentWeek == 2)
				{
					weekNow = "Week2"
				}
				if((transformCurrentWeek(fetchedUserBookings[i][3][0]) <= transformCurrentWeek(getWeekBegining(new Date(weekBegin))) && transformCurrentWeek(fetchedUserBookings[i][3][1]) >= transformCurrentWeek(getWeekBegining(new Date(weekBegin)))) && (fetchedUserBookings[i][4] == weekNow || fetchedUserBookings[i][4] == "Week1Week2"))//the last index of each period's data contains the weekbegining
				{
					userBookings.push(fetchedUserBookings[i]);
				}
			}
			
		}
		//console.log(userBookings);
	}
	for(var i =0; i<userBookings.length; i++)
	{
		initialTable[userBookings[i][userBookings[i].length-2][0]][userBookings[i][userBookings[i].length-2][1]] = userBookings[i];
	}
	//console.log(initialTable);
	//populating initital table with user bookings vals end

	//console.log(data["PermaSchedule"][0]);
	//populating initital table with permaSchd vals start
	if(data["PermaSchedule"].length!=0)
	{
		for(var i =0; i<data["PermaSchedule"][weekNum].length; i++) // how many days CHANGE WEEK HERE. data["PermaSchedule"][0] for week 1 data["PermaSchedule"][1] for week 2
		{
			for(var j = 0; j<data["PermaSchedule"][weekNum][0].length; j++)// how many periods per day
			{
				//console.log(data["PermaSchedule"][0][i][j][0]);
				if(data["PermaSchedule"][weekNum][i][j][0] != unbookedval)//if data isn't unbooked in the perma sechdule the replace the booking with that
				{
					//console.log(initialTable[i][j]);
					initialTable[i][j] = data["PermaSchedule"][weekNum][i][j]
				}
			}
		}
	}
	//populating initital table with permaSchd vals end

	//console.log(initialTable)
	tbl = "";//clearing table
	tbl +='<table class="table table-hover">';

	//creating table headers start
	if(data["Min30Periods"]=="false")//normal headers
	{
		//--->create table header > start
		tbl +='<thead>';
			tbl +='<tr>';
			tbl +='<th>Day</th>';
			tbl +='<th>Period 1</th>';
			tbl +='<th>Period 2</th>';
			tbl +='<th>Break</th>';
			tbl +='<th>Period 3</th>';
			tbl +="<th>Period 4</th>";
			tbl +='<th>Lunch</th>';
			tbl +='<th>Period 5</th>';
			tbl +='<th>Period 6</th>';
			tbl +='<th>ECA 1</th>';
			tbl +='<th>ECA 2</th>';
			tbl +='</tr>';
		tbl +='</thead>';
		//--->create table header > end
	}
	else //30 min period headers
	{

		//--->create table header > start
		tbl +='<thead>';
			tbl +='<tr>';
				tbl +='<th>Day</th>';
				tbl +='<th>P1</th>';
				tbl +='<th>P1</th>';
				tbl +='<th>P2</th>';
				tbl +='<th>P2</th>';
				tbl +='<th>Br</th>';
				tbl +='<th>P3</th>';
				tbl +='<th>P3</th>';
				tbl +="<th>P4</th>";
				tbl +="<th>P4</th>";
				tbl +='<th>Lun</th>';
				tbl +='<th>Lun</th>';
				tbl +='<th>P5</th>';
				tbl +='<th>P5</th>';
				tbl +='<th>P6</th>';
				tbl +='<th>P6</th>';
				tbl +='<th>E1</th>';
				tbl +='<th>E1</th>';
				tbl +='<th>E2</th>';
				tbl +='<th>E2</th>';
			tbl +='</tr>';
		tbl +='</thead>';
		//--->create table header > end
	}
	//creating table headers end

	//--->create table body > start
	tbl +='<tbody>';
		for(var i = 0; i <initialTable.length; i++)
		{
			row_id = random_id();
			tbl +='<tr row_name="'+i+'" row_id="'+row_id+'" id="'+row_id+'">'
			tbl +='<td ><div class="bold" col_name="Day">'+getDayFromNum2(i)+'</div></td>';
			for(var j = 0; j<initialTable[0].length; j++)
			{
				var bookState = initialTable[i][j][0];
				var hiddenState = initialTable[i][j][1];
				for(var k = 2; k<initialTable[i][j].length; k++)
				{
					hiddenState = hiddenState + "%" + initialTable[i][j][k];
				}
				var newString = bookState +' <span class="hidden">'+hiddenState+'</span>'
				tbl +='<td ><div class="'+bookState+' row_data pointerCursor" edit_type="click" col_name="'+j+'">'+newString+'</div></td>';
			}
			tbl +='</tr>'
		}
	tbl +='</tbody>';
	//--->create table body > end
	tbl +='</table">';
	$("#timeTable").html(tbl);
	populateTimetableModal("Room Timetable: <em>"+resosName+"</em><br>Week Begining: "+getWeekBegining(new Date(weekBegin))+" Week "+currentWeek, resosName, resosType, getWeekBegining(new Date(weekBegin)));
	timetableDocFunctionsRoom()//activating document functions for room

}
function getSpecificResos(resosID, resosType) // gets the information of a very specific resosID
{
	if(resosType=="room")
	{
		indiRoomDataFetchSuccess = false;
		$.ajax({
			type:'PATCH',
			url:DCBBookingsResourceRoomAPI,
			data:JSON.stringify({
				"Key":"RoomID",
				"searchAttr":resosID
			}),
			contentType:"application/json",
			success:function(data)
			{
				indiRoomData = data;
				indiResosDataFetchSuccess =true;
			},
			error:function(data)
			{
				errorModuleShow()
			}
		});
	}
}
var random_id = function() //generates a random ROW ID, for identifying cell data.
{
	var id_num = Math.random().toString(9).substr(2,3);
	var id_str = Math.random().toString(36).substr(2);
	return id_num + id_str;
}
//View Room End

function getWeekBegining(date) //generates the week begining date for a given date value.
{
  var day = date.getDay() || 7;
    if( day !== 0 )
        date.setHours(-24 * (day - 2));

	date = date.toUTCString();
	date = date.split(' ').slice(0, 4).join(' ');
		
    return date;
}
function extractHiddenContent(s)//extracts the hidden content from within a span.
{
  var span = document.createElement('span');
  span.innerHTML = s;
  return span.textContent || span.innerText;
};

function goBackToRV()
{
	$("#SearchResultsAndRV").html('<p id="EmptyMsg" style="color: white; margin: 0;"></p>');
	$("#EmptyMsg").html("<em>Loading...</em>");
	$("#whatResultsText").html('Recently Visted:')
	$("#viewTextMainPage").html("")
	$("#searchBarAndTitle").show();
	
	$("#MainPageModule").addClass("MainPageSearch")
	$("#MainPageModule").removeClass("moveUpSearch")
	
	$("#SearchResultsAndRV").addClass("withSearchBarWidth")
	$("#SearchResultsAndRV").removeClass("withoutSearchBarWidth")
	populateRecentlyVisted();
}

function generateAdminTable() // generates admin table and the doc functions that come with it
{
	removeTimetableEventListeners()
	$("#AdminUserTable").html("<em>Processing Data...</em>")
	$("#LoaderUser").show()
	$.ajax({
		type: 'GET',
		url: DCBBookingsAdminUserAPI,
		success: function (data)
		{
			$("#LoaderUser").hide()
			tbl = ''
				//--->create data table > start

			tbl += '<table class="table table-hover">'

				//--->create table header > start
				tbl += '<thead>';
					tbl += '<tr>';
						tbl += '<th></th>';
						tbl += '<th>Email</th>';
						tbl += '<th>Options</th>';
					tbl += '</tr>';
				tbl += '</thead>';
				//--->create table header > end


				//--->create table body > start
				tbl += '<tbody>';

					//--->create table body rows > start
					$.each(data.Items, function (index, val)
					{
						//you can replace with your database row id
						row_id = random_id();

						//loop through ajax row data
						tbl += '<tr id="' + row_id + '" row_id="' + row_id + '">';
							tbl += '<td ><div edit_type="click" col_name="email"> <span class="hidden">' + val['email'] + '</span></div></td>';
							tbl += '<td ><div edit_type="click" class="row_data" col_name="userEmail">' + val['userEmail'] + '</div></td>';
						//--->edit options > start
						tbl += '<td>';

						tbl += '<span class="btn_edit" > <a href="#" class="btn btn-link " row_id="' + row_id + '" > Edit</a> | </span>';
						tbl += '<span class="btn_delete"> <a href="#" class="btn btn-link"  row_id="' + row_id + '"> Delete</a> </span>';

						//only show this button if edit button is clicked
						tbl += '<span class="btn_save"> <a href="#" class="btn btn-link"  row_id="' + row_id + '"> Save</a> | </span>';
						tbl += '<span class="btn_cancel"> <a href="#" class="btn btn-link" row_id="' + row_id + '"> Cancel</a></span>';

						tbl += '</td>';
						//--->edit options > end

						tbl += '</tr>';
					});

					//--->create table body rows > end

				tbl += '</tbody>';
				//--->create table body > end

			tbl += '</table>'
				//--->create data table > end

			//out put table data
			$(document).find('#AdminUserTable').html(tbl);

			$(document).find('.btn_save').hide();
			$(document).find('.btn_cancel').hide();
		},
		error: function (data) {
			errorModuleShow()
		}
	});

	//--->make div editable > start
	$(document).on('click', '.row_data', function(event)
	{
		event.preventDefault();
		if($(this).attr('edit_type') == 'button')
		{
			return false;
		}
		//make div editable
		$(this).closest('div').attr('contenteditable', 'true');
		//add bg css
		$(this).addClass('editColor').css('padding','6px');
		$(this).focus();
		//--->add the original entry > start
		//--->add the original entry > end
	})
	//--->make div editable > end

	//--->save single field data > start
	$(document).on('focusout', '.row_data', function(event)
	{
		event.preventDefault();
		if($(this).attr('edit_type') == 'button')
		{
			return false;
		}

		var row_id = $(this).closest('tr').attr('row_id');
		var row_div = $(this)

		.removeClass('editColor') //add bg css
		.css('padding','')

		var col_name = row_div.attr('col_name');
		var col_val = row_div.html();
		var Row = document.getElementById(row_id);
		var Cells = Row.getElementsByTagName("td");
		var colEmail = Cells[0].textContent;
		$.ajax({
			type:'PATCH',
			url:DCBBookingsAdminUserAPI,
			data: JSON.stringify(
					{
						"email":extractHiddenContent(colEmail).trim(),
						"updateAttr":col_name,
						"updateValue":col_val
					}
				  ),

			contentType:"application/json",

			success: function(data){
				generateAdminTable()
			},

			error: function(data)
			{
				errorModuleShow()
			}
		});

		var arr = {};
		arr[col_name] = col_val;
		//use the "arr"	object for your ajax call
		$.extend(arr, {row_id:row_id});
		//out put to show
		console.log(JSON.stringify(arr, null, 2));
	})
	//--->save single field data > end

	//--->button > AddUser > start
	$(document).on('click', '#addUserBtn', function(event)
	{
		$.ajax({
			type:'POST',
			url:DCBBookingsAdminUserAPI,
			data: JSON.stringify(
					{
						"email":$("#emailInput").val(),
						"userEmail":$("#emailInput").val()
					}
				  ),

			contentType:"application/json",

			success: function(data){
				generateAdminTable()
				$("#emailInput").val("");
			},

			error: function(data)
			{
				errorModuleShow()
			}
		});
	});
	//--->button > edit > end

	//--->button > edit > start
	$(document).on('click', '.btn_edit', function(event)
	{
		event.preventDefault();
		var tbl_row = $(this).closest('tr');

		var row_id = tbl_row.attr('row_id');

		tbl_row.find('.btn_save').show();
		tbl_row.find('.btn_cancel').show();

		//hide edit button
		tbl_row.find('.btn_edit').hide();
		tbl_row.find('.btn_delete').hide();

		//--->add the original entry > start
		tbl_row.find('.row_data').each(function(index, val)
		{
			//this will help in case user decided to click on cancel button
			$(this).attr('original_entry', $(this).html());
		});
		//--->add the original entry > end

		//make the whole row editable
		tbl_row.find('.row_data')
		.attr('contenteditable', 'true')
		.attr('edit_type', 'button')
		.addClass('editColor')
		.css('padding','3px')

	});
	//--->button > edit > end

	//--->button > cancel > start
	$(document).on('click', '.btn_cancel', function(event)
	{
		event.preventDefault();

		var tbl_row = $(this).closest('tr');

		var row_id = tbl_row.attr('row_id');

		//hide save and cacel buttons
		tbl_row.find('.btn_save').hide();
		tbl_row.find('.btn_cancel').hide();

		//show edit button
		tbl_row.find('.btn_edit').show();
		tbl_row.find('.btn_delete').show();

		//make the whole row editable
		tbl_row.find('.row_data')
		.attr('edit_type', 'click')
		.removeClass('editColor')
		.css('padding','')

		tbl_row.find('.row_data').each(function(index, val)
		{
			$(this).html( $(this).attr('original_entry') );
		});
	});
	//--->button > cancel > end

	//--->save whole row entery > start
	$(document).on('click', '.btn_save', function(event)
	{
		event.preventDefault();
		var tbl_row = $(this).closest('tr');
		var row_id = tbl_row.attr('row_id');
		//hide save and cacel buttons
		tbl_row.find('.btn_save').hide();
		tbl_row.find('.btn_cancel').hide();

		//show edit button
		tbl_row.find('.btn_edit').show();
		tbl_row.find('.btn_delete').show();

		//make the whole row editable
		tbl_row.find('.row_data')
		.attr('edit_type', 'click')
		.removeClass('editColor')
		.css('padding','')


		editingMultiple = false;
		editingSelect = false;

		//--->get row data > start
		var arr = {};
		tbl_row.find('.row_data').each(function(index, val) // normal Text Data Save
		{
			var col_name = $(this).attr('col_name');
			var col_val  =  $(this).html();

			var Row = document.getElementById(row_id);
			var Cells = Row.getElementsByTagName("td");
			var colEmail = Cells[0].textContent;

			$.ajax({
				type:'PATCH',
				url:DCBBookingsAdminUserAPI,
				data: JSON.stringify(
						{
							"email":extractHiddenContent(colEmail).trim(),
							"updateAttr":col_name,
							"updateValue":col_val
						}),
				contentType:"application/json",
				success: function(data){
					generateAdminTable()
				},
				error: function(data)
				{
					errorModuleShow()
				}
			});
			arr[col_name] = col_val;
		});
		//--->get row data > end

		//use the "arr"	object for your ajax call
		$.extend(arr, {row_id:row_id});
		//out put to show
		console.log(JSON.stringify(arr, null, 2))
	});
	//--->save whole row entery > end

	//--->Delete whole row entry > start
	$(document).on('click', '.btn_delete', function(event)
	{
		var row_id = $(this).closest('tr').attr('row_id');
		var row_div = $(this)

		var col_name = row_div.attr('col_name');
		var col_val = row_div.html();

		var Row = document.getElementById(row_id);
		var Cells = Row.getElementsByTagName("td");

		var colEmail = Cells[0].textContent;

		$.ajax({
			type:'PUT',
			url:DCBBookingsAdminUserAPI,
			data: JSON.stringify(
				{
					"email":extractHiddenContent(colEmail).trim()
				}),
			contentType:"application/json",
			success: function(data){
				generateAdminTable()
			},
			error: function(data)
			{
				errorModuleShow()
			}
		});
	});
}
function changeSettingTitle(title) //changes the title of the setting page
{
    if($(window).width() < 1150)
	{
        closeSettingsNav();
    }
	$("#SettingsTitleP").html(title);
}

function getAllAdmins()//gets all admins and puts them in the allMasterAdmins array
{
	$.ajax({
		type: 'GET',
		url: DCBBookingsAdminUserAPI,
		success: function (data)
		{
			$.each(data.Items, function (index, val)
			{
				allMasterAdmins.push(val['email']);
			});
		},
		error: function (data)
		{
			errorModuleShow()
		}
	});
}

function Search() //search My resos list code
{
	if($("#searchForResos").val().trim().toLowerCase().length != 0)
	{


		var dataOfRoomsList = []
		var tempRoomsList = []
		var dataOfRooms = allRooms.Items;
		var bookmarkedResos = individualData.Items[0].bookmarkedResources // array

		//console.log(bookmarkedResos)

		$("#SearchResultsAndRV").html('<p id="EmptyMsg" style="color: white; margin: 0;"></p>');
		$("#EmptyMsg").html("<em>LOADING...</em>");
		$("#whatResultsText").html('<i onClick="goBackToRV();" class="imgBtn fa fa-arrow-left" aria-hidden="true"></i> Back')

		for(var i = 0; i<dataOfRooms.length; i++)
		{
			//console.log(dataOfRooms[i].RoomID.trim().toLowerCase().includes($("#searchForResos").val().trim().toLowerCase()))

			//console.log(dataOfRooms[i].Department.trim().toLowerCase().includes( $("#searchForResos").val().trim().toLowerCase()))

			if
			(
				dataOfRooms[i].RoomID.trim().toLowerCase().includes($("#searchForResos").val().trim().toLowerCase()) 
			   ||
				dataOfRooms[i].Department.trim().toLowerCase().includes( $("#searchForResos").val().trim().toLowerCase())

			)
			{
				tempRoomsList = []
				tempRoomsList.push(dataOfRooms[i].RoomID)
				tempRoomsList.push("room")

				dataOfRoomsList.push(tempRoomsList)
				console.log(dataOfRoomsList)
			}
		}
		console.log(dataOfRoomsList)
		//populating List
		var tempHTML = "";
		var searchResos = "";
		bookmarkedResos
		for(var i = 0; i<dataOfRoomsList.length; i++)
		{
			var ResosID = ""

			for(var j = 0; j<bookmarkedResos.length; j++)
			{
				var foundBookmark = false; 

				//console.log(bookmarkedResos[i])
				//console.log(dataOfRoomsList[i])

				if(compareArray(bookmarkedResos[j],dataOfRoomsList[i]))
				{
					foundBookmark = true; 	
				}

			}



			if(foundBookmark == true)
			{
				//Bookmarked Resos
				ResosID = dataOfRoomsList[i][0]+":"+dataOfRoomsList[i][1]+"BM"
				bookMarkFunction = 'BookmarkIt(\''+dataOfRoomsList[i][0]+'\',\''+dataOfRoomsList[i][1]+'\');'//change the bookmark click function
				bookmarkClass = "fa fa-bookmark imgBtn bookmark";
			}
			else
			{
				//unbookedmarked Resos
				ResosID = dataOfRoomsList[i][0]+":"+dataOfRoomsList[i][1]
				bookMarkFunction = 'unBookmarkIt(\''+dataOfRoomsList[i][0]+'\',\''+dataOfRoomsList[i][1]+'\');'//change the bookmark click function
				bookmarkClass = "fa fa-bookmark-o imgBtn bookmark";
			}

			tempHTML = '<div id="'+ResosID+'" class="Box '+dataOfRoomsList[i][1]+'"><i onClick="'+bookMarkFunction+'" class="'+bookmarkClass+'" aria-hidden="true"></i><p><strong>'+dataOfRoomsList[i][0]+'</strong><br><em>'+dataOfRoomsList[i][1]+'</em></p><button class="btnSuccessOutline" onClick="viewResos(\''+dataOfRoomsList[i][0]+'\',\''+dataOfRoomsList[i][1]+'\',\''+new Date()+'\');">View</button></div>'

			searchResos+=tempHTML;
		}
		//populating list end
		$("#SearchResultsAndRV").html(searchResos);

		if(dataOfRoomsList.length == 0)
		{
			$("#SearchResultsAndRV").html('<p id="EmptyMsg" style="color: white; margin: 0;"></p>');
			$("#EmptyMsg").html("<em>No Search Results Found...</em>");
		}
	}
	
}
function getMyResos()//gets user resos and populates it on the search feature in settings in slide 2, Open Slide
{
	$("#myResosList").html("<em>Processing Data...</em>")
	var listOfMyResos = "";
	var myResosArray = [];
	individualData = null;
	getUserInfo(userEmail);
	validateIndiFetch();
	function validateIndiFetch()
	{
		if(individualData!=null)
		{
			myResosArray = bubble_Sort2DArray(individualData["Items"][0]["userControlledResources"],0);
			if(myResosArray!="Empty List")
			{
				for(var i = 0; i<myResosArray.length;i++)
				{
					listOfMyResos += '<li><a class="imgBtn" onClick="openResosSettings(\''+myResosArray[i][0]+'\',\''+myResosArray[i][1]+'\'); checkAvailableUpload(); $(\'#customUploadDocs\').hide(); $(\'#SimUploadDocs\').hide();">'+myResosArray[i][0]+': <em>'+myResosArray[i][1]+'</em></a></li>'
				}
				$("#myResosList").html(listOfMyResos);
			}
		}
		else
		{
			window.setTimeout(validateIndiFetch,1000)
		}
	}
}
function openResosSettings(resosID, resosType) // open resos settings
{
    $("#resosSettingsErrMsg").css("color","black")
    $("#resosSettingsErrMsg").html("")
    document.getElementById("saveResosChanges").disabled = false;

	$("#viewResosInfo").hide()
	$("#resosSettingsLoader").show();
	openResosSettingsModal()

	$("#settingsTitle").html("Loading data...")
	$("#resosIDval").val("")
	indiRoomData = null;

	getSpecificResos(resosID,resosType);
	validataIndiRoomFetch();

	function validataIndiRoomFetch()
	{
		if(indiRoomData==null)
		{
			window.setTimeout(validataIndiRoomFetch,1000);
		}
		else
		{
			$("#viewResosInfo").show();
			$("#resosSettingsLoader").hide();
			$("#settingsTitle").html(resosID+": "+resosType + " settings")
			$("#resosIDval").val(resosID)
			var roomItem = indiRoomData["Items"][0];

			$("#departmentVal").val(roomItem.Department);

			var timeSt; // timestamp from the description
			var str = roomItem.Description;
			var lastIndex = str.lastIndexOf(" ");

			timeSt = str.substring(lastIndex, str.length);
			str = str.substring(0, lastIndex);
			nicEditors.findEditor("DescriptionVal").setContent(str);

			$("#accessRightSelect").val(roomItem.AccessRights);
			$("#bookingRightSelect").val(roomItem.BookingRights);
			var admins = roomItem.RoomAdmin

			$("#RoomAdmin1").val(admins[0])

			var otherAdminStr = "";
			for(var i = 1; i<admins.length; i++)
			{
				otherAdminStr = otherAdminStr + admins[i] + "; "
			}
			$("#RoomAdmin2").val(otherAdminStr)

			if(roomItem.PlanAhead != "0")
			{
				$( "#planAheadCB" ).prop( "checked", true );
			}
			if(roomItem.Min30Periods == "true")
			{
				$("#30MinPeriodCB").prop("checked", true)
			}
			if(roomItem.PermaSchedule.length != 0)
			{
				var myBool = JSON.parse(roomItem.Min30Periods);
				generatePreviewTable(roomItem.PermaSchedule, myBool)
			}
            $("#deleteResos").attr("onClick","deleteResosFunc('"+resosID+"','"+resosType+"');");
		}
	}

}
function resosSaveChanges()
{
    var roomItemFromData = indiRoomData["Items"][0];
}

function getAResosSettingFromModal(resosID, resosType)//called in the make booking page in the timetable modal to direct the user to the settings html page
{
    localStorage.SettingsSlideNum = "2";
    localStorage.openResosSettingsID = resosID;
    localStorage.openResosSettingsType = resosType;

    self.location = "Settings.html"
}
function openedSettingsCheckPrelim()//called when the settings page is loaded in to see if there is anything that needs to be loaded in.
{
    if(localStorage.SettingsSlideNum)
    {
        currentSettingsSlide(Number(localStorage.SettingsSlideNum))
        if(localStorage.SettingsSlideNum=="2")
        {
            getMyResos();
            changeSettingTitle('My Resource Settings');
        }
        localStorage.removeItem("SettingsSlideNum");
    }
    if(localStorage.openResosSettingsID && localStorage.openResosSettingsType)
    {
        openResosSettings(localStorage.openResosSettingsID, localStorage.openResosSettingsType)
        localStorage.removeItem("openResosSettingsID");
        localStorage.removeItem("openResosSettingsType");
    }
}

function deleteResosFunc(resosID, resosType)//called when user clicks the btn to delete resos, confirmation will show
{
    $.confirm
    ({
        boxWidth: '400px',
        useBootstrap: false,
        icon: 'fa fa-warning',
        title: 'Confirm Deletion',
        content: 'Are you sure you want to delete: '+resosID +'. <br> Resource Type: '+resosType,
        theme: 'modern',
        draggable: false,
        buttons:
        {
            confirm:
            {
                btnClass: 'btn-red',
                text:'Delete',
                action: function()
                {
                    $("#resosSettingsErrMsg").html("Deleting Resource...")
                    document.getElementById("saveResosChanges").disabled = true;
                    delResosFromServer(resosID, resosType);
                }
            },
            cancel:
            {
                text:'Cancel',
                action: function()
                {
                    //$.alert('Canceled!');
                }
            },
        }
    });
}
function delResosFromServer(resosID, resosType) // actual deletion function AJAX that'll delete from the main server
{
    var delResosAPI = "";
    var uniqueResosID = "";
    if(resosType == "room")
    {
        delResosAPI = DCBBookingsResourceRoomAPI
        uniqueResosID = "RoomID";//resos database primary Key
    }

    var obj = {};
    obj[uniqueResosID] = resosID;
    // making it extensible because diffrent resos have different Resos Primary Key IDs
    var myJSON = JSON.stringify(obj);

    $.ajax({
        type:'DELETE',
        url: delResosAPI,
        data: myJSON,
        contentType:"application/json",
        success: function(data)
        {
            $("#resosSettingsErrMsg").html("Deleted From Main Server...")
            localStorage.SettingsSlideNum = "2";
            window.setTimeout(reloadPg,2000);
        },
        error: function(data)
        {
            errorModuleShow()
        }
    });

    function reloadPg()
    {
        location.reload();
    }
}
function checkIfResosExists() //Checks if Resos still exists, if it doens't Delete it from everything.
{
    individualData = null;
    allRooms = null;
    resosExistCheckAndDeleteComplete = false;

    var myData; // my data array
    var allRoomsData; //all room data array
    var allDeviceData; // all device data array
    var allSubscriptionData; // all subscription data array

    getUserInfo(userEmail);
    validateIndiDataFetch();
    function validateIndiDataFetch() // validating that your data has been fetched
    {
        $("#resosSettingsErrMsg").html("Fetching my data...")
        if(individualData == null)
        {
            window.setTimeout(validateIndiDataFetch,1000)
        }
        else
        {
            myData = individualData["Items"][0]
            getAllRooms();
            validateResosFetch();
        }
    }
    function validateResosFetch() // validating that all resos data has been fetched
    {
        $("#resosSettingsErrMsg").html("Fetching all resources & seeing if it still exists...")
        if(allRooms == null)
        {
            window.setTimeout(validateResosFetch,1000)
        }
        else
        {
            allRoomsData = allRooms["Items"]
            for(var i =0; i<allRoomsData.length; i++)
            {
                allResos.push([allRoomsData[i].RoomID,"room"])
            }
            checkMyData();
        }
    }

    function checkMyData()//checking if my resos data still exists in the all resos list
    {
        var tempList = [];

        var noInstanceFound = true;
        // checking the bookedmark resos list
        for(var i = 0; i<myData.bookmarkedResources.length; i++)
        {
            noInstanceFound = true;
            for(var j =0; j<allResos.length; j++)
            {
                if(myData.bookmarkedResources[0] != "Empty List")
                {
                    if(myData.bookmarkedResources[i][0]==allResos[j][0] && myData.bookmarkedResources[i][1]==allResos[j][1])
                    {
                        noInstanceFound = false;
                    }
                }
                else
                {
                    noInstanceFound = false
                }
            }
            if(noInstanceFound)
            {
                tempList = myData.bookmarkedResources[i];
                tempList.push("bookmarkedResources")
                resosDeleteList.push(tempList)
            }
        }

        //checking the userControlledResources field
        noInstanceFound = true;
        for(var i = 0; i<myData.userControlledResources.length; i++)
        {
            noInstanceFound = true;
            for(var j =0; j<allResos.length; j++)
            {
                if(myData.userControlledResources[0] != "Empty List")
                {
                    if(myData.userControlledResources[i][0]==allResos[j][0] && myData.userControlledResources[i][1]==allResos[j][1])
                    {
                        noInstanceFound = false;
                    }
                }
                else
                {
                    noInstanceFound = false
                }
            }
            if(noInstanceFound)
            {
                tempList = myData.userControlledResources[i];
                tempList.push("userControlledResources")
                resosDeleteList.push(tempList)
            }
        }

        //checking the recentlyBookedResources field
        noInstanceFound = true;
        for(var i = 0; i<myData.recentlyBookedResources.length; i++)
        {
            noInstanceFound = true;
            for(var j =0; j<allResos.length; j++)
            {
                if(myData.recentlyBookedResources[0] != "Empty List")
                {
                    if(myData.recentlyBookedResources[i][0]==allResos[j][0] && myData.recentlyBookedResources[i][1]==allResos[j][1])
                    {
                        noInstanceFound = false;
                    }
                }
                else
                {
                    noInstanceFound = false
                }
            }
            if(noInstanceFound)
            {
                tempList = myData.recentlyBookedResources[i];
                tempList.push("recentlyBookedResources")
                resosDeleteList.push(tempList)
            }
        }

        if(resosDeleteList.length != 0)//if theres smth to delete call the next fucntion
        {
            removeOldData()
        }
        else //if the lsit is empty then nothing has changed, it won't call the next function. and the check resos func ends here.
        {
            resosExistCheckAndDeleteComplete = true;
        }
    }

    var newRecentlyVistedArray;
    var newBookmarkedArray;
    var newUserControlledArray;
    function removeOldData()//removing data that has been deleted from the main resos lists
    {
        newRecentlyVistedArray = myData.recentlyBookedResources;
        newBookmarkedArray = myData.bookmarkedResources;
        newUserControlledArray = myData.userControlledResources;

        if(newRecentlyVistedArray[0] != "Empty List")
        {
            for(var i =resosDeleteList.length-1; i>- 1; i--)
            //deleting backwards to prevent structure collasp.
            {
                if(resosDeleteList[i][2] == "recentlyBookedResources")
                {
                    newRecentlyVistedArray = removeA(newRecentlyVistedArray, resosDeleteList[i]);
                }
            }

        }

        if(newBookmarkedArray[0] != "Empty List")
        {
            for(var i =resosDeleteList.length-1; i> -1; i--)
            //deleting backwards to prevent structure collasp.
            {
                if(resosDeleteList[i][2] == "bookmarkedResources")
                {
                    newBookmarkedArray = removeA(newBookmarkedArray, resosDeleteList[i]);
                }
            }
        }

        if(newUserControlledArray[0] != "Empty List")
        {
            for(var i =resosDeleteList.length-1; i> -1; i--)
            //deleting backwards to prevent structure collasp.
            {
                if(resosDeleteList[i][2] == "userControlledResources")
                {
                    newUserControlledArray = removeA(newUserControlledArray, resosDeleteList[i]);
                }
            }
        }
        pushNewData();
    }
    function pushNewData()//push new data into my resos dataSub
    {
        $("#resosSettingsErrMsg").html("Pushing new data...")
        updateUserInfo("recentlyBookedResources",newRecentlyVistedArray);
        //pushing new recently visted data
        userInfoUpdateSuccess = false
        validateRecentlyVisitedUpdate();
        function validateRecentlyVisitedUpdate()
        {
            if(userInfoUpdateSuccess == true)
            {
                userInfoUpdateSuccess = false
                updateUserInfo("bookmarkedResources",newBookmarkedArray);
                validateBookmarkedResourcesUpdate();
            }
            else
            {
                window.setTimeout(validateRecentlyVisitedUpdate,1000);
            }
        }

        //pushing new bookmarked Resources data
        function validateBookmarkedResourcesUpdate()
        {
            if(userInfoUpdateSuccess == true)
            {
                userInfoUpdateSuccess = false
                updateUserInfo("userControlledResources",newUserControlledArray);
                validateUpdateserControlledResourcesUpdate()
            }
            else
            {
                window.setTimeout(validateBookmarkedResourcesUpdate,1000);
            }
        }

        //UpdateserControlledResources
        function validateUpdateserControlledResourcesUpdate()
        {
            if(userInfoUpdateSuccess == true)
            {
                resosExistCheckAndDeleteComplete = true;
            }
            else
            {
                window.setTimeout(validateUpdateserControlledResourcesUpdate,1000);
            }
        }
    }
}

function getCurrentPageName()//returns the page name the user is currently on.
{
    var currentPageName = "";
    var urlSplitArray = window.location.href.split('/')
    currentPageName = urlSplitArray[urlSplitArray.length-1]
    return currentPageName;
}
function removeA(arr, Rval)
//remove a certain value from the array. (arr, "value")
{
    var index = arr.indexOf(Rval);
    if (index > -1)
    {
        arr.splice(index, 1);
    }
    return arr;
}

function openSettingsNav()//opening side navigation bar for settings
{
	$("#settingSideNav").show();
	$("#HiddenMenuBtn").hide()
	if($(window).width() < 1280 && $(window).width() >= 1150)
	{
		document.getElementById("mainSettingsPanel").style.left = "400px";
		document.getElementById("settingsTitleCard").style.left = "400px";
		document.getElementById("mainSettingsPanel").style.width = "68.75%";
		document.getElementById("settingsTitleCard").style.width = "68.75%";
        document.getElementById("settingSideNav").style.width = "400px";
	}
	else if($(window).width() >= 1280)
	{
		document.getElementById("mainSettingsPanel").style.left = "31.25%";
		document.getElementById("settingsTitleCard").style.left = "31.25%";
		document.getElementById("mainSettingsPanel").style.width = "68.75%";
		document.getElementById("settingsTitleCard").style.width = "68.75%";
        document.getElementById("settingSideNav").style.width = "31.25%";
	}
	else if($(window).width() < 1150)
	{
		$("#closeSideNavSettings").show()
        document.getElementById("settingSideNav").style.width = "100%";
	}

}
function closeSettingsNav()//closing side navigation bar for settings
{
	$("#settingSideNav").hide();
	$("#HiddenMenuBtn").show()
	document.getElementById("mainSettingsPanel").style.left = "0px";
	document.getElementById("settingsTitleCard").style.left = "0px";
	document.getElementById("mainSettingsPanel").style.width = "100%";
	document.getElementById("settingsTitleCard").style.width = "100%";
	$("#closeSideNavSettings").hide()
}

function errorModuleShow()//error module for lost of connection
{
    $.alert
    ({
        boxWidth: '400px',
        useBootstrap: false,
        icon: 'fa fa-warning',
        title: 'REQUEST ERROR:',
        content: 'Connection Broken',
        theme: 'modern',
        draggable: false,
        buttons:
        {
            reload:
            {
                btnClass: 'btn-red',
                text:'Reload',
                action: function()
                {
                    location.reload();
                }
            },
        }
    });
}

function WeekBeginMilestone()//used in the change week module to get the week begining of the chosen week
{
	var weekBegining = getWeekBegining($('.datepicker').datepicker('getDate'));
	$("#WBChosen").val(weekBegining);
	calculateCurrentWeek(new Date());
}
function generateMilestoneTable()
{
	$("#currentWeekTxt").html("Currently it is a week: # &nbsp;&nbsp;&nbsp;&nbsp;" + '<a href="#" onClick="AlternateWeekNow();">Alternate Now</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;')
	calculateCurrentWeek(new Date());
	currentWeekStall()
	function currentWeekStall()
	{
		if(currentWeek == null)
		{
			window.setTimeout(currentWeekStall,1000)
		}
		else
		{
			$("#currentWeekTxt").html("Currently it is a week: "+currentWeek.toString()+" &nbsp;&nbsp;&nbsp;&nbsp;" + '<a href="#" onClick="AlternateWeekNow();">Alternate Now</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;')
		}
	}
	removeTimetableEventListeners()
	$("#currentMSTable").html("<em>Processing Data...</em>")
	$.ajax({
		type: 'GET',
		url: DCBBookingsSettingsWeekMilestone,
		success: function (data)
		{
			var sortedDates = bubble_SortJSONMilestoneArray(data.Items,"WeekBegining")
			tbl = ''
				//--->create data table > start

			tbl += '<table class="table table-hover">'

				//--->create table header > start
				tbl += '<thead>';
					tbl += '<tr>';
						tbl += '<th></th>';
						tbl += '<th>Week Begining</th>';
						tbl += '<th>Week</th>';
						tbl += '<th>Options</th>';
					tbl += '</tr>';
				tbl += '</thead>';
				//--->create table header > end


				//--->create table body > start
				tbl += '<tbody>';

					//--->create table body rows > start
					$.each(data.Items, function (index, val)
					{
						//you can replace with your database row id
						row_id = random_id();

						//loop through ajax row data
						tbl += '<tr id="' + row_id + '" row_id="' + row_id + '">';
							tbl += '<td ><div col_name="emptyCol"></div></td>';
							tbl += '<td ><div col_name="WeekBegining">' + val['WeekBegining'] + '</div></td>';
							tbl += '<td ><div edit_type="click" class="row_data" col_name="Week">' + val['Week'] + '</div></td>';
						//--->edit options > start
						tbl += '<td>';

						tbl += '<span class="btn_edit" > <a href="#" class="btn btn-link " row_id="' + row_id + '" > Edit</a> | </span>';
						tbl += '<span class="btn_delete"> <a href="#" class="btn btn-link"  row_id="' + row_id + '"> Delete</a> </span>';

						//only show this button if edit button is clicked
						tbl += '<span class="btn_save"> <a href="#" class="btn btn-link"  row_id="' + row_id + '"> Save</a> | </span>';
						tbl += '<span class="btn_cancel"> <a href="#" class="btn btn-link" row_id="' + row_id + '"> Cancel</a></span>';

						tbl += '</td>';
						//--->edit options > end

						tbl += '</tr>';
					});

					//--->create table body rows > end

				tbl += '</tbody>';
				//--->create table body > end

			tbl += '</table>'
				//--->create data table > end

			//out put table data
			$(document).find('#currentMSTable').html(tbl);

			$(document).find('.btn_save').hide();
			$(document).find('.btn_cancel').hide();
		},
		error: function (data) {
			errorModuleShow()
		}
	});

	//--->make div editable > start
	$(document).on('click', '.row_data', function(event)
	{
		event.preventDefault();
		if($(this).attr('edit_type') == 'button')
		{
			return false;
		}
		//make div editable
		$(this).closest('div').attr('contenteditable', 'true');
		//add bg css
		$(this).addClass('editColor').css('padding','6px');
		$(this).focus();
		//--->add the original entry > start
		//--->add the original entry > end
	})
	//--->make div editable > end

	//--->save single field data > start
	$(document).on('focusout', '.row_data', function(event)
	{
		
		event.preventDefault();
		if($(this).attr('edit_type') == 'button')
		{
			return false;
		}

		var row_id = $(this).closest('tr').attr('row_id');
		var row_div = $(this)

		.removeClass('editColor') //add bg css
		.css('padding','')

		var col_name = row_div.attr('col_name');
		var col_val = row_div.html();
		
		var Row = document.getElementById(row_id);
		var Cells = Row.getElementsByTagName("td");
		var WeekBeginingPK = Cells[1].textContent;
		
		if((col_val == "1" || col_val == "2") && col_val.length != 0)
		{
			showUserOutputMsgMilestone
			(
				"success",
				"Saving Data...",
				3000
			);
			$.ajax({
				type:'PATCH',
				url:DCBBookingsSettingsWeekMilestone,
				data: JSON.stringify(
						{
							"WeekBegining":extractHiddenContent(WeekBeginingPK).trim(),
							"updateAttr":col_name,
							"updateValue":col_val
						}
					  ),

				contentType:"application/json",

				success: function(data){
					generateMilestoneTable()
					showUserOutputMsgMilestone
					(
						"success",
						"Data Saved... Updating table",
						3000
					);
				},

				error: function(data)
				{
					errorModuleShow()
				}
			});
		}
		else
		{
			showUserOutputMsgMilestone
			(
				"error",
				"Field must be filled and the weeks can only be the values 1 or 2",
				3000
			);
			generateMilestoneTable()
		}
		
		var arr = {};
		arr[col_name] = col_val;
		//use the "arr"	object for your ajax call
		$.extend(arr, {row_id:row_id});
		//out put to show
		console.log(JSON.stringify(arr, null, 2));
	})
	//--->save single field data > end

	//--->button > AddMilestone > start
	$(document).on('click', '#createMilestoneBtn', function(event)
	{
		$("#milestoneErrMsg").html("")

		if($("#WBChosen").val().length!=0 && $("#WBWeekNum").val().length!=0 && $("#pickADate").val().length!=0 && ($("#WBWeekNum").val() == 1 ||$("#WBWeekNum").val() == 2))
		{
			showUserOutputMsgMilestone
			(
				"success",
				"Input validated, Posting Data...",
				3000
			);
			$.ajax({
				type:'POST',
				url:DCBBookingsSettingsWeekMilestone,
				data: JSON.stringify(
						{
							"WeekBegining":$("#WBChosen").val(),
							"Week":$("#WBWeekNum").val().toString()
						}
					  ),

				contentType:"application/json",

				success: function(data){
					generateMilestoneTable()
					$("#WBChosen").val("");
					$("#WBWeekNum").val("");
					$("#pickADate").val("");
					showUserOutputMsgMilestone
					(
						"success",
						"Data Posted...",
						3000
					);
				},

				error: function(data)
				{
					errorModuleShow()
				}
			});
		}
		else
		{
			showUserOutputMsgMilestone
			(
				"error",
				"All fields must be filled and the weeks can only be the values 1 or 2",
				3000
			);
			$("#WBChosen").val("");
			$("#WBWeekNum").val("");
			$("#pickADate").val("");
		}
		
	});
	//--->button > edit > end

	//--->button > edit > start
	$(document).on('click', '.btn_edit', function(event)
	{
		event.preventDefault();
		var tbl_row = $(this).closest('tr');

		var row_id = tbl_row.attr('row_id');

		tbl_row.find('.btn_save').show();
		tbl_row.find('.btn_cancel').show();

		//hide edit button
		tbl_row.find('.btn_edit').hide();
		tbl_row.find('.btn_delete').hide();

		//--->add the original entry > start
		tbl_row.find('.row_data').each(function(index, val)
		{
			//this will help in case user decided to click on cancel button
			$(this).attr('original_entry', $(this).html());
		});
		//--->add the original entry > end

		//make the whole row editable
		tbl_row.find('.row_data')
		.attr('contenteditable', 'true')
		.attr('edit_type', 'button')
		.addClass('editColor')
		.css('padding','3px')

	});
	//--->button > edit > end

	//--->button > cancel > start
	$(document).on('click', '.btn_cancel', function(event)
	{
		event.preventDefault();

		var tbl_row = $(this).closest('tr');

		var row_id = tbl_row.attr('row_id');

		//hide save and cacel buttons
		tbl_row.find('.btn_save').hide();
		tbl_row.find('.btn_cancel').hide();

		//show edit button
		tbl_row.find('.btn_edit').show();
		tbl_row.find('.btn_delete').show();

		//make the whole row editable
		tbl_row.find('.row_data')
		.attr('edit_type', 'click')
		.removeClass('editColor')
		.css('padding','')

		tbl_row.find('.row_data').each(function(index, val)
		{
			$(this).html( $(this).attr('original_entry') );
		});
	});
	//--->button > cancel > end

	//--->save whole row entery > start
	$(document).on('click', '.btn_save', function(event)
	{
		event.preventDefault();
		var tbl_row = $(this).closest('tr');
		var row_id = tbl_row.attr('row_id');
		//hide save and cacel buttons
		tbl_row.find('.btn_save').hide();
		tbl_row.find('.btn_cancel').hide();

		//show edit button
		tbl_row.find('.btn_edit').show();
		tbl_row.find('.btn_delete').show();

		//make the whole row editable
		tbl_row.find('.row_data')
		.attr('edit_type', 'click')
		.removeClass('editColor')
		.css('padding','')


		editingMultiple = false;
		editingSelect = false;

		//--->get row data > start
		var arr = {};
		tbl_row.find('.row_data').each(function(index, val) // normal Text Data Save
		{
			var col_name = $(this).attr('col_name');
			var col_val  =  $(this).html();

			var Row = document.getElementById(row_id);
			var Cells = Row.getElementsByTagName("td");
			var WeekBeginingPK = Cells[1].textContent;

			if((col_val == "1" || col_val == "2") && col_val.length != 0)
			{
				showUserOutputMsgMilestone
				(
					"success",
					"Saving Data...",
					3000
				);
				$.ajax({
					type:'PATCH',
					url:DCBBookingsSettingsWeekMilestone,
					data: JSON.stringify(
							{
								"WeekBegining":extractHiddenContent(WeekBeginingPK).trim(),
								"updateAttr":col_name,
								"updateValue":col_val
							}),
					contentType:"application/json",
					success: function(data){
						generateMilestoneTable()
						showUserOutputMsgMilestone
						(
							"success",
							"Data Saved... Updating table",
							3000
						);
					},
					error: function(data)
					{
						errorModuleShow()
					}
				});
			}
			else
			{
				showUserOutputMsgMilestone
				(
					"error",
					"Field must be filled and the weeks can only be the values 1 or 2",
					3000
				);
				generateMilestoneTable()
			}
			
			arr[col_name] = col_val;
		});
		//--->get row data > end

		//use the "arr"	object for your ajax call
		$.extend(arr, {row_id:row_id});
		//out put to show
		console.log(JSON.stringify(arr, null, 2))
	});
	//--->save whole row entery > end

	//--->Delete whole row entry > start
	$(document).on('click', '.btn_delete', function(event)
	{
		var row_id = $(this).closest('tr').attr('row_id');
		var row_div = $(this)

		var col_name = row_div.attr('col_name');
		var col_val = row_div.html();

		var Row = document.getElementById(row_id);
		var Cells = Row.getElementsByTagName("td");

		var WeekBeginingPK = Cells[1].textContent;

		$.ajax({
			type:'DELETE',
			url:DCBBookingsSettingsWeekMilestone,
			data: JSON.stringify(
				{
					"WeekBegining":extractHiddenContent(WeekBeginingPK).trim()
				}),
			contentType:"application/json",
			success: function(data){
				generateMilestoneTable()
			},
			error: function(data)
			{
				errorModuleShow()
			}
		});
	});
}
function AlternateWeekNow()
{
	var sortedDates; 
	var PrimaryKey; 
	var weekThatWillBeChanged; 
	$.ajax({
		type: 'GET',
		url: DCBBookingsSettingsWeekMilestone,
		success: function (data)
		{
			sortedDates = bubble_SortJSONMilestoneArray(data.Items,"WeekBegining")
			//console.log(sortedDates);
			
			//compare dates and then find the index of the date that is cloesest to ur milestone
			
			for(var i = sortedDates.length-1; i>-1; i--)
			{
				var currentDate = new Date();
				
				//console.log(currentDate)
				//console.log(transformYYYYMMDDtoDate(transformCurrentWeek(sortedDates[i]["WeekBegining"]).toString()))
				
				if(Date.parse(currentDate) < Date.parse(transformYYYYMMDDtoDate(transformCurrentWeek(sortedDates[i]["WeekBegining"]).toString())))
				{
					foundIndex = i-1; 
				}
			}
			PrimaryKey = sortedDates[foundIndex].WeekBegining;
			weekThatWillBeChanged = sortedDates[foundIndex].Week;
			
			
			//console.log(PrimaryKey + " "+ weekThatWillBeChanged);
			ExcecuteChangeWeek(PrimaryKey, weekThatWillBeChanged)
		},
		error: function (data)
		{
			errorModuleShow()
		}
	});
	
	function ExcecuteChangeWeek(PK, CurrentWeekNum)
	{
		var updateVal = "0";
		if(CurrentWeekNum == 1)
		{
			updateVal = "2";
		}
		else if(CurrentWeekNum == 2)
		{
			updateVal = "1";
		}
		showUserOutputMsgMilestone
		(
			"success",
			"Saving Data...",
			3000
		);
		
		$.ajax({
			type:'PATCH',
			url:DCBBookingsSettingsWeekMilestone,
			data: JSON.stringify(
					{
						"WeekBegining":PK.trim(),
						"updateAttr":"Week",
						"updateValue":updateVal
					}),
			contentType:"application/json",
			success: function(data){
				generateMilestoneTable()
				showUserOutputMsgMilestone
				(
					"success",
					"Data Saved... Updating table",
					3000
				);
			},
			error: function(data)
			{
				errorModuleShow()
			}
		});
	}
}

function showUserOutputMsgMilestone(status, message, delay)
{
	if(status=="success")
	{
		$("#milestoneErrMsg").css("color","green")
	}
	else if(status=="error")
	{
		$("#milestoneErrMsg").css("color","red")
	}

	$("#milestoneErrMsg").html(message)

	window.setTimeout(clearMsg,delay)

	function clearMsg()
	{
		$("#milestoneErrMsg").html("");
	}

}
function calculateCurrentWeek(DateGiven)// calcualtes the current week for the timetable so they know what to use. returns the value 1 or 2
{
	currentWeek = null; 
	var sortedDates;
	var foundIndex; //index of the date that is needed. 
	var currentDate
	$.ajax({
		type: 'GET',
		url: DCBBookingsSettingsWeekMilestone,
		success: function (data)
		{
			sortedDates = bubble_SortJSONMilestoneArray(data.Items,"WeekBegining")
			//console.log(sortedDates);
			
			//compare dates and then find the index of the date that is cloesest to ur milestone
			
			for(var i = sortedDates.length-1; i>-1; i--)
			{
				currentDate = new Date(DateGiven);
				//console.log(transformYYYYMMDDtoDate(transformCurrentWeek(sortedDates[i]["WeekBegining"]).toString()))
				
				if(Date.parse(currentDate) < Date.parse(transformYYYYMMDDtoDate(transformCurrentWeek(sortedDates[i]["WeekBegining"]).toString())))
				{
					foundIndex = i-1; 
				}
			}
			
			var daysDiff = DifferenceInDays(transformYYYYMMDDtoDate(transformCurrentWeek(sortedDates[foundIndex]["WeekBegining"]).toString()),DateGiven)-1;
			
			var numOfWeeksSince = Math.trunc(daysDiff/7);
			var decimal = (daysDiff/7) - numOfWeeksSince;
			decimal = decimal.toFixed(5)
			if(decimal == 0.85714)//if its monday
			{
				numOfWeeksSince+=1;
			}
			var OddOrEvenWeeksSince = numOfWeeksSince % 2;
			
			if(OddOrEvenWeeksSince == 0) // if odd or even since is 0 it means an even number of weeks have passed so the num of weeks is the same else if its odd the current week will be alternate to the one on the milestone table
			{
				currentWeek = parseInt(sortedDates[foundIndex]["Week"])
				if(currentWeek == 1)
				{
					currentWeek = 1
				}
				else if(currentWeek == 2)
				{
					currentWeek = 2
				}
			}
			else if(OddOrEvenWeeksSince == 1)
			{ 
				currentWeek = parseInt(sortedDates[foundIndex]["Week"])
				if(currentWeek == 1)
				{
					currentWeek = 2
				}
				else if(currentWeek == 2)
				{
					currentWeek = 1
				}
			}
			
			//console.log(sortedDates[foundIndex]['WeekBegining']); 
			//console.log(daysDiff);	
			//console.log(daysDiff/7)
			//console.log(numOfWeeksSince)
			//console.log(OddOrEvenWeeksSince)
			//console.log(currentWeek)
						
			return currentWeek; 
			
		},
		error: function (data)
		{
			errorModuleShow()
		}
	});
}
function DifferenceInDays(firstDate, secondDate) //calculates the difference in days between 2 date objects
{
    return Math.round((secondDate-firstDate)/(1000*60*60*24));
}
function transformYYYYMMDDtoDate(YYYYMMDDS)//transfrom a string in the form of YYYYMMDD to a date.
{
	var dateString = YYYYMMDDS;
	var year = dateString.substring(0,4);
	var month = dateString.substring(4,6);
	var day = dateString.substring(6,8);
	var date = new Date(year, month-1, day);
	return date;
}
function transformCurrentWeek(Week) //transfroms the current week into a week that can be compared using bubblesort.
{
	var monthConversion = 
		'{"Jan":'+'"01"'+
		',"Feb":'+'"02"'+
		',"Mar":'+'"03"'+
		',"Apr":'+'"04"'+
		',"May":'+'"05"'+
		',"Jun":'+'"06"'+
		',"Jul":'+'"07"'+
		',"Aug":'+'"08"'+
		',"Sep":'+'"09"'+
		',"Oct":'+'"10"'+
		',"Nov":'+'"11"'+
		',"Dec":'+'"12"'+'}';
	var monthObj = JSON.parse(monthConversion);
	var newDate = Week.substr(Week.indexOf(" ") + 1); //format Day Month Year
	
	var dateArray = newDate.split(" ");
	
	var dateString = dateArray[2] + monthObj[dateArray[1]] + dateArray[0]
	
	return parseInt(dateString)
}

function preLimLoader(loadingText)//used in the timetable function to load text about the user used in the timetable modal 
{
	$("#viewPort_Content").hide()
	$("#preLimLoader").show()
	$("#preLimLoader").html(loadingText)
}
function exitpreLimLoader()//used to exit the prelim loader 
{
	$("#viewPort_Content").hide()
	$("#preLimLoader").show()
	$("#preLimLoader").html("Event Successful...")
	window.setTimeout(function(){
		$("#preLimLoader").html("[Click on a Timeslot to View Bookings]")
	},3000)
}
function exitpreLimLoaderErr()//used to exit the prelim loader in the event of an error
{
	window.setTimeout(function(){
		$("#preLimLoader").html("[Click on a Timeslot to View Bookings]")
	},3000)
}

// compares 2 arrays to see if they are the same. If they are it'll return true, if not true it'll return false. 
function compareArray(a, b) 
{
	var valuesEqual = true; 
	// if length is not equal 
	if(a.length!=b.length) 
	{
		valuesEqual = false; 
	}
	else
	{ 
		// comapring each element of array 
		for(var i=0;i<a.length;i++) 
		{
			if(Array.isArray(a[i]) && Array.isArray(b[i]))
			{
				valuesEqual = compareArray2(a[i],b[i])
			}
			//console.log("value 1: "+a[i] + "\nvalue 2: "+b[i])
			//console.log("current value comparison: " + (a[i]===b[i]))
			else if(a[i]!=b[i]) 
			{
				valuesEqual = false; 
			}
		}	
	}
	return valuesEqual
}
// compares 2 arrays to see if they are the same. If they are it'll return true, if not true it'll return false. 
function compareArray2(a, b) 
{
	var valuesEqual = true; 
	// if length is not equal 
	if(a.length!=b.length) 
	{
		valuesEqual = false; 
	}
	else
	{ 
		// comapring each element of array 
		for(var i=0;i<a.length;i++) 
		{
			if(Array.isArray(a[i]) && Array.isArray(b[i]))
			{
				valuesEqual = compareArray(a[i],b[i])
			}
			//console.log("value 1: "+a[i] + "\nvalue 2: "+b[i])
			//console.log("current value comparison: " + (a[i]===b[i]))
			else if(a[i]!=b[i]) 
			{
				valuesEqual = false; 
			}
		}	
	}
	return valuesEqual
};

