// Register firebase module                                                                                         
var app = angular.module("app", ["firebase"]);
var firebaseRef;
// Set up controller function                                                                                       
app.controller("Ctrl", function ($scope, $firebase) {
    // Replace this fictional URL with your own
    firebaseRef = new Firebase(      
      "https://amber-fire-9368.firebaseio.com"
    );   
    // create an AngularFire ref to the data                                                                        
    var sync = $firebase(firebaseRef);

    // pull the data into a local model                                                                             
    var syncObject = sync.$asObject();

    // sync the object with three-way data binding                                                                  
    syncObject.$bindTo($scope, "data");
});

// Initialize Firebase
var config = {
    apiKey: "AIzaSyDRAjHXoopOnH8orv3uX8k0p8rkjiNkHfA",
    authDomain: "amber-fire-9368.firebaseapp.com",
    databaseURL: "https://amber-fire-9368.firebaseio.com",
    storageBucket: "amber-fire-9368.appspot.com",
};
firebase.initializeApp(config);

firebase.database().ref().child('user-posts').on('value', function (snapshot) {

    var snapVal = snapshot.val();
    console.log("snapshot.val()", snapVal);
    var count = 0;
    for (var key in snapVal) {
        //key는 유저 id를 말한다 예)park 이 보낸 데이터들
        if (snapVal.hasOwnProperty(key)) {                
            console.log("key/value", key, snapVal[key]);
            for (var obj in snapVal[key]) {
                var rgb = snapVal[key][obj]; 
                var jj = angular.fromJson(rgb)
                console.log("r g b", jj['r'], jj['g'], jj['b']);                
            }            
        }
    }
});
 