//AWS COGNITO USERPOOL IDS
var AdmimUserpoolID = "ap-southeast-1_5uiXeZzFB"; //USERPOOL ID
var AdminAppClientID = "2qis1u4uur3e17ua9a28r7b6ol"; //APPCLIENT ID

//AWS API GATEWAY URLS
var DCBBookingsCreateUserDBAPI = "https://ai18n4h2ec.execute-api.ap-southeast-1.amazonaws.com/UserSignupDCBBookings/user-signup"; //API for writing to the main USER DB of dcbbookings in dynamo DB
var DCBBookingsResourceRoomAPI = "https://ai18n4h2ec.execute-api.ap-southeast-1.amazonaws.com/Resos/resource/room";
var DCBBookingsChangeUserInfoAPI = "https://ai18n4h2ec.execute-api.ap-southeast-1.amazonaws.com/ChangeUserInfo/user-changeinfo";
//email of the current user
var userEmail;

//when true, user data will have successfully been fetched or updated
var userInfoFetchSuccess = false;
var userInfoUpdateSuccess = false;

//when true, user data will have unsuccesfully been fetched or updated
var userInfoFetchError= false;
var userInfoUpdateError =false;

//when true room data will have sucessfully be fetched
var roomDataFetchSuccess= false; 

//when true resos data will have sucessfully be fetched
var indiResosDataFetchSuccess = false; 

//all data of users
var userDataFull;

//Individual User Data
var individualData;

//Individual Room Data
var indiRoomData;

//All Resos Array [ResosID,ResosType]
var allResos = [];
var allResosHTML = ""; //all Resos dynamic HTML

//All Bookmarked Array [ResosID, ResosType]
var BookmarkedResos = [];
var BookmarkedResosHTML = ""; //all bookmarked Resos dynamic HTML

//all rooms data
var allRooms;

//List Of All Room Admins, used when creating a resos. 
var adminEmailArray


//timetable vars
var previewUploadTable = []; 
var timetableHTML = "";//preview table
var tbl = "";//offical booking table
//booking values for pushing values into the db
var bookval;
var lockval;
var lessonval;
var unbookedval; 

//random loading text that'll give you fun messages to look at
var randomLoadingText = ["Looking at kittens...","Playing with yarnballs...","Sniffing catnip...","Scratching the post...","Sharpening claws...","Stalking a mouse..."]