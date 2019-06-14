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
			$("#errorModule").show();
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
			$("#errorModule").show();
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
			$("#errorModule").show();
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
		  $("#ForgotPassErrMsg2").html("Sucess, Password Changed")
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
			$("#errorModule").show();
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
		listOfItems = "<a href='#'>"+data["userControlledResources"][0]+"</a>"
	}
	else
	{
		var sortedList = bubble_Sort2DArray(data["userControlledResources"],0);
		listOfItems = "";
		for(var i = 0; i<sortedList.length; i++)
		{
			listOfItems += "<a href='#' onClick='viewResos(\""+sortedList[i][0]+"\",\""+sortedList[i][1]+"\");'><i class='fa fa-external-link' aria-hidden='true'></i>&nbsp;&nbsp;"+sortedList[i][0]+" : <em>"+sortedList[i][1]+"</em></a><br>"
		}
	}
	//console.log(listOfItems);
	$("#MyResosList").html(listOfItems);
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
		tempHTML = '<div id="'+ResosID+'" class="Box '+allResos[i][1]+'"><i onClick="'+bookMarkFunction+'" class="'+bookmarkClass+'" aria-hidden="true"></i><p><strong>'+allResos[i][0]+'</strong><br><em>'+allResos[i][1]+'</em></p><button class="btnSuccessOutline" onClick="viewResos(\''+allResos[i][0]+'\',\''+allResos[i][1]+'\');">View</button></div>'
		allResosHTML += tempHTML; 
	}
	if(allResosHTML == "")//fallback incase all 3 arrays are empty
	{
		allResosHTML = "Empty List..."
	}
	$("#allResosBoxes").html(allResosHTML);
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
		tempHTML = '<div id="'+ResosID+'" class="Box '+BookmarkedResos[i][1]+'"><i onClick="'+bookMarkFunction+'" class="'+bookmarkClass+'" aria-hidden="true"></i><p><strong>'+BookmarkedResos[i][0]+'</strong><br><em>'+BookmarkedResos[i][1]+'</em></p><button class="btnSuccessOutline" onClick="viewResos(\''+BookmarkedResos[i][0]+'\',\''+BookmarkedResos[i][1]+'\');">View</button></div>'
		BookmarkedResosHTML+=tempHTML;
		//console.log(tempHTML);
	}
	if(BookmarkedResosHTML == "")
	{
		BookmarkedResosHTML = "<em><p>Empty List...</p></em>"
	}
	$("#bookmarkedResosBoxes").html(BookmarkedResosHTML);
}

function populateYourResos()
{
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

function populateAllResos(bookmarkPop,recentVisitPop,yourResosPop) // populates the all Resos HTML in main page 
//first 3 boolean parameters, when true, this function will also automically populate the bookmark div and the recently visited div and the your resos list, if these paramters aare true. 
{
	roomDataFetchSuccess = false; 
	validateFetchRoom();
	getAllRooms();
	function validateFetchRoom() // will not continue until it knows that room has been fetched
	{
		//output messages to make the wait seem more bearable
		$("#allResosBoxes").css("color","black")
		$("#allResosBoxes").html("<em><p>Fetching all room data...</p></em>");
		if(bookmarkPop == true)
		{
			$("#bookmarkedResosBoxes").css("color","black")
			$("#bookmarkedResosBoxes").html("<em><p>Fetching all room data...</p></em>");
		}
		if(yourResosPop == true)
		{
			$("#MyResosList").html("<em><p>Processing Data...</p></em>")
		}
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
		if(bookmarkPop == true)
		{
			$("#bookmarkedResosBoxes").html("<em><p>Success! building new HTML</p></em>");
		}
		if(yourResosPop == true)
		{
			$("#MyResosList").html("<em><p>Success! building new HTML</p></em>")
		}
		//output messages end
		
		if(userInfoFetchSuccess == false)
		{
			window.setTimeout(validateUserInfoFetched,1000);
		}
		else 
		{				
			dynamicGenerateAllResos(allRooms["Items"],[],[],individualData["Items"][0]) //parameters are: dataRoom, DataDeviece, datasubscription, user data
			if(bookmarkPop==true)
			{
				dynamicGenerateBookmarkedResos(individualData["Items"][0]);
			}
			if(yourResosPop == true)
			{
				dynamicGenerateYourResos(individualData["Items"][0]);
			}
			userInfoFetchSuccess = false; 
		}
	}
}
function populateBookmarkedResos()
{
	roomDataFetchSuccess = false; 
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
			$("#errorModule").show();
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
			$("#errorModule").show();
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
			$("#PreviewTable").html("<em><p>[Preview Table]</p></em>")
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
			$("#PreviewTable").html("<em><p>[Preview Table]</p></em>")
		}
	}
	else
	{
		$("#uploadBlock").show();
		$("#customUploadDocs").hide();
		$("#nextBtn").hide()
		$("#skipBtn").show()
		$("#PreviewTable").html("<em><p>[Preview Table]</p></em>")
		$("#fileToLoad").val("")
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
				"RoomID":RoomI
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
			populateAllResos(false,false,true)//updates all resos, but will not update the bookmark tab and the recently visited tab. but will update the your resos tabs
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
				populateAllResos(false,false,true)//updates all resos, but will not update the bookmark tab and the recently visited tab. but will update the your resos tabs
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

//SideNav code open and close it when screen gets too small
function openNav(val1,val2,val3) 
{
	document.getElementById("sideMenu").style.width = "20%";
	document.getElementById("sideMenu").style.minWidth = "250px";
	document.getElementById("searchBarContainer").style.width = val3;
 	document.getElementById("allResosContainer").style.marginLeft = val1;
	document.getElementById("allResosContainer").style.width = val2;
	
}
function closeNav() 
{
	document.getElementById("sideMenu").style.width = "0";
	document.getElementById("sideMenu").style.minWidth = "0";
	document.getElementById("searchBarContainer").style.width = "100%";
 	document.getElementById("allResosContainer").style.marginLeft = "3%";
	document.getElementById("allResosContainer").style.width = "97%";
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
	$("#PreviewTable").html("<em><p>[Preview Table]</p></em>")
	checkAvailableUpload();
}
function addRoomNext1() // checking to see if all fields are filled and to see if primary key repeats
{
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
			$("#PreviewTable").html("<em><p>[Preview Table]</p></em>")
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
			$("#PreviewTable").html("<em><p>[Preview Table]</p></em>")
			checkAvailableUpload();
		}
	}
	else
	{
		$("#AddResosAddRoomErrMsg2").css("color","red");
		$("#AddResosAddRoomErrMsg2").html("Err, you must make a selection");
	}
}
function AddResosSkip()//function called when users skip the upload feature. 
{
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
					periodData=[cell_data[j],userEmail,"perpetual","Week1"]
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
					periodData=[cell_data[j],userEmail,"perpetual","Week2"]
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
						periodData.push("perpetual")
						periodData.push("Week1")
						dayData.push(periodData)
					}
					else //if its not empty its a lesson
					{
						periodData.push("lesson")
						periodData.push(userEmail)
						periodData.push("perpetual")
						periodData.push("Week1")
						dayData.push(periodData)
					}
				}
				for(var j = 0; j < 2; j++) //ECA1 and ECA2
				{
					periodData = [];
					periodData.push("unbooked")
					periodData.push(userEmail)
					periodData.push("perpetual")
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
						periodData.push("perpetual")
						periodData.push("Week1")
						dayData.push(periodData)
					}
					else //if its not empty its a lesson
					{
						periodData.push("lesson")
						periodData.push(userEmail)
						periodData.push("perpetual")
						periodData.push("Week1")
						dayData.push(periodData)
					}
				}
				for(var j = 0; j < 2; j++) //ECA1 and ECA2
				{
					periodData = [];
					periodData.push("unbooked")
					periodData.push(userEmail)
					periodData.push("perpetual")
					periodData.push("Week1")
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
	$("#allResosBoxes").css("color","black")
	$("#allResosBoxes").html("<em><p>Processing Request...</p></em>");
	
	$("#bookmarkedResosBoxes").css("color","black")
	$("#bookmarkedResosBoxes").html("<em><p>Processing Request...</p></em>");
	
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
			
			populateAllResos(true,true,false)//parameters: populateBookmarks? truefalse, populate RecentlyVisited?, truefalse, populate YourResos? truefalse
		}
	}
	
}
function unBookmarkIt(resosID, resosType)// function to bookmark a certain room
{
	$("#allResosBoxes").css("color","black")
	$("#allResosBoxes").html("<em><p>Processing Request...</p></em>");
	
	$("#bookmarkedResosBoxes").css("color","black")
	$("#bookmarkedResosBoxes").html("<em><p>Processing Request...</p></em>");
	
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
			
			populateAllResos(true,true,false)//parameters: populateBookmarks? truefalse, populate RecentlyVisited? truefalse, populae your resos? truefalse
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
		max = randomLoadingText.length;
		min = 0;
		var random =Math.floor(Math.random() * (+max - +min)) + +min; 
		$("#" + elemID).html("<em>"+randomLoadingText[random]+"</em>")
	}
	function loadText()
	{
		max = randomLoadingText.length;
		min = 0;
		var random =Math.floor(Math.random() * (+max - +min)) + +min; 
		$("#" + elemID).html("<em>"+randomLoadingText[random]+"</em>")
	}
	startFunnyLoadingText = setInterval(loadText, delay);
	
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
function populateTimetableModal(timetableName)
//puts the timetable modal out of loading mode for the user
{
	$("#LoaderTimetable").hide();
	$("#preLimLoader").show()
	$('#timeTableTitle').html(timetableName);
	$("#whichWeekBtn").show();
	$("#whichWeekBtn").html("Change Week")
	$("#whichWeekBtn").attr("onClick","")
	if(resosAdmin)
	{
		$("#timetableSettings").show();
	}
}

function removeTimetableEventListeners() //used in viewRoom's document functions to for listening for user activity
//remove all event listeners from the program for new ones to be added in. 
{
	$(document).off('click', '#bookBtn')
	$(document).off('click', '#deleteBtn')
	$(document).off('click', '.row_data')
	$(document).off('click', '#contactBtn')
	$(document).off('click', '#BookRecrBtn')
	$(document).off('click', '#sendBtn')
	$(document).off('click', '#lessonLockBtn')
	$(document).off('click', '#quickLockBtn')
	$(document).off('click', '#addUserBtn')
	$(document).off('focusout', '.row_data')
}
function timetableDocFunctionsRoom()
{
	removeTimetableEventListeners();
	//--->Editing Viewport > start
	$(document).on('click', '.row_data', function(event)
	{	
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
		var coordinates = [] // stores the coordinates of the cell that was clicked. 
		var day = ""// stores the day of the cell clicked
		var period = "" //stores the period of the cell that was clicked
		var fullCurrentStatus = "" // stores the current HTML of the cell that was clicked 
		var currentBookingState = "" // stores the current booking state of the cell you are on
		var bookingDetails; // stores the current booking detailed information in an array 
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
		//putting the coordinates into the variable
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
		bookingDetails = hiddenSpan.split(' ')[1].split(',');
		
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
			}
		}
		else if(currentBookingState == bookval)//if booked state is booked
		{
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
			clickBookedEmail = bookingDetails[0];
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
		var bookRModal = $("#BookRecuring")
		var EModal = $("#emailModal")

		// if the target of the click isn't the container nor a descendant of the container
		if (!container.is(e.target) && container.has(e.target).length === 0 && !table.is(e.target) && table.has(e.target).length === 0 && !bookRModal.is(e.target) && bookRModal.has(e.target).length === 0 && !EModal.is(e.target) && EModal.has(e.target).length === 0 ) 
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
function viewResos(resosID,resosType)
{
	openTimetableModal();
	loadingModal();
	resosName = resosID;
	getSpecificResos(resosID,resosType)
	validateResosFetch()
	indiResosDataFetchSuccess = false;
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
			generateBookingTable(indiRoomData["Items"][0],resosType)
		}
	}
}
function generateBookingTable(data,resosType) //generates table for user
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
			periodData[2]="perpetual";
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
	var userBookings = []//array containing the userbookings for that week. 
	var fetchedUserBookings = data["BookingSchedule"] //array containing the fetched user bookings
	if(fetchedUserBookings[0]!="Empty List") // populating the userBookings array;
	{
		for(var i =0; i<fetchedUserBookings.length;i++)
		{
			if(fetchedUserBookings[i][fetchedUserBookings[i].length-1] == getWeekBegining(new Date()))//the last index of each period's data contains the weekbegining
			{
				userBookings.push(fetchedUserBookings[i]);
			}
		}
	}
	for(var i =0; i<userBookings.length; i++)
	{
		initialTable[userBookings[i][userBookings[i].length-2][0]][userBookings[i][userBookings[i].length-2][1]] = userBookings[i];	
	}
	//populating initital table with user bookings vals end
	
	//console.log(data["PermaSchedule"][0]);
	//populating initital table with permaSchd vals start
	if(data["PermaSchedule"].length!=0)
	{
		for(var i =0; i<data["PermaSchedule"][0].length; i++) // how many days
		{
			for(var j = 0; j<data["PermaSchedule"][0][0].length; j++)// how many periods per day
			{
				//console.log(data["PermaSchedule"][0][i][j][0]);
				if(data["PermaSchedule"][0][i][j][0] != unbookedval)//if data isn't unbooked in the perma sechdule the replace the booking with that 
				{
					//console.log(initialTable[i][j]);
					initialTable[i][j] = data["PermaSchedule"][0][i][j]
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
					hiddenState = hiddenState + "," + initialTable[i][j][k];
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
	populateTimetableModal("Room Timetable: <em>"+resosName+"</em>");
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
				$("#errorModule").show();
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
