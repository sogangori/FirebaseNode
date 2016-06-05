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
        //key�� ���� id�� ���Ѵ� ��)park �� ���� �����͵�
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
    
var RGBArray = new Array([9, 10, 11]);

function SendRGB() {
    var colorsRef = firebaseRef.child("/colors");
    colorsRef.set({ "r": RGBArray[0], "b": RGBArray[1], "g": RGBArray[2] });
    console.log("RGBArray", RGBArray, colorsRef);
}
function AddRGB() {
    username = "park";
    firebase.database().ref('user/'+username).set(
        { "r": RGBArray[0], "b": RGBArray[1], "g": RGBArray[2] }
    );    
    console.log("RGBArray", RGBArray, firebase.database().ref('user/' + username));
}
function PushRGB() {
    uid = "park";
    var postData = {
        uid: uid,
        r: RGBArray[0], 
        g: RGBArray[1],
        b: RGBArray[2]
    };
    var newPostKey = firebase.database().ref().child('post').push().key;
    var updates = {};
    updates['/posts/' + newPostKey] = postData;
    updates['/user-posts/' + uid + '/' + newPostKey] = postData;
    var result=firebase.database().ref().update(updates);
    console.log("pushed result", result);
}
$(function () {    
    $("#puchColor").click(function () {
        console.log("puchColor");        
        PushRGB();
    });
    $("#addColor").click(function () {
        console.log("changeColor");
        RGBArray[0] = 200;
        RGBArray[1] = 130; 
        RGBArray[2] = 50;
        AddRGB();
    });
    $("#changeColor").click(function () {
        console.log("changeColor");
        RGBArray[0]=155;
        RGBArray[1]=255;
        RGBArray[2]=0;
        SendRGB();
    });
    $("#sliderR").slider({
        range: "min",
        value: 37,
        min: 1,
        max: 255,
        slide: function (event, ui) {
            $("#amount").val("RGB " + ui.value);
            RGBArray[0] = ui.value;
            SendRGB();
        }
    });
    $("#sliderG").slider({
        range: "min",
        value: 37,
        min: 1,
        max: 255,
        slide: function (event, ui) {
            $("#amount").val("RGB " + ui.value);
            RGBArray[1] = ui.value;
            SendRGB();
        }
    });
    $("#sliderB").slider({
        range: "min",
        value: 37,
        min: 1,
        max: 255,
        slide: function (event, ui) {
            $("#amount").val("RGB " + ui.value);
            RGBArray[2] = ui.value;
            SendRGB();
        }
    });
});
