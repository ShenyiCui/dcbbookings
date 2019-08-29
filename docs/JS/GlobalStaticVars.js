//AWS COGNITO USERPOOL IDS
var AdmimUserpoolID = "ap-southeast-1_5uiXeZzFB"; //USERPOOL ID
var AdminAppClientID = "2qis1u4uur3e17ua9a28r7b6ol"; //APPCLIENT ID

//AWS API GATEWAY URLS
var DCBBookingsCreateUserDBAPI = "https://ai18n4h2ec.execute-api.ap-southeast-1.amazonaws.com/UserSignupDCBBookings/user-signup"; //API for writing to the main USER DB of dcbbookings in dynamo DB
var DCBBookingsResourceRoomAPI = "https://ai18n4h2ec.execute-api.ap-southeast-1.amazonaws.com/Resos/resource/room";
var DCBBookingsChangeUserInfoAPI = "https://ai18n4h2ec.execute-api.ap-southeast-1.amazonaws.com/ChangeUserInfo/user-changeinfo";
var DCBBookingsAdminUserAPI = "https://ai18n4h2ec.execute-api.ap-southeast-1.amazonaws.com/Admin/admins";//API that gives you access to admin users of DCBBookings
var DCBBookingsAdminSettingsUserAPI = "https://ai18n4h2ec.execute-api.ap-southeast-1.amazonaws.com/Admin/settings";
//AdminSettings For Admin Settings APIs (currently only used to change n add milestones)
var DCBBookingsSettingsWeekMilestone = "https://ai18n4h2ec.execute-api.ap-southeast-1.amazonaws.com/Settings/settings/weekmilestone"
//API to change milestones in the settings pane. 

//email of the current user
var userEmail;

//when true, user data will have successfully been fetched or updated
var userInfoFetchSuccess = false;
var userInfoUpdateSuccess = false;

//when true room infrmation would've been sucessfully updated
var roomInfoUpdateSuccess = false; 

//when true, resos would have been checked to see if it exists and if it doesn't it'll call a deletion function
var resosExistCheckAndDeleteComplete = false;
//list of resos that no longer exists and thus needs to be deleted, structure is a 2D array, inner array with structure
//[1]- resosID
//[2]- resosType;
//[3]- field it belongs to in MyData eg. .userControlledResources
var resosDeleteList = [];

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
var resosName; // used to store the resos ID the user is currently viewing
//var currentWeek; // used to store the current week, 0 for week 1, 1 for week 2
var currentWeekB //used to store the current weekbegining
var resosAdmin = false; //boolean, used to store whether or not you are the true admin of a room.
var clickBookedEmail = ""; //used to store the email of the person who booked the room.

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

//timetable modal variables
var PrevSelect; //stores the previously selected cell data.
var min30Periods; //boolean stores wheteher or not the current resos is using the 30 min period option

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

//array of Master Admins
var allMasterAdmins = [];
var masterAdmin = false; //will be true if you are a master admin

var currentWeek = 1; // the current Week. 

var currentResosID; // currentID the user is viewing
var currentResosType; // current resostype the user is viewing
var currentWeekBegining; //current week the user is looing at