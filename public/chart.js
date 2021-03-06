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

google.charts.load('current', {
    'packages': ['corechart']
});

function drawChart(chartData) {    
    var data = google.visualization.arrayToDataTable(chartData);
    var options = {
        title: 'Data Visualize',
        curveType: 'function',
        legend: {
            position: 'bottom'
        }
    };

    var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
    chart.draw(data, options);
}

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
    var chartArray = [];
    chartArray.push(['Time', 'R', 'G', 'B']);
    for (var key in snapVal) {
        //key는 유저 id를 말한다 예)park 이 보낸 데이터들
        if (snapVal.hasOwnProperty(key)) {                
            console.log("key/value", key, snapVal[key]);
            for (var obj in snapVal[key]) {
                var rgb = snapVal[key][obj];
                var rgbObj = angular.fromJson(rgb)                
                rgb = [count++, rgbObj['r'], rgbObj['g'], rgbObj['b']];                 
                chartArray.push(rgb);
            }            
        }
    }
   
    drawChart(chartArray);
});


var RGBArray = [9, 10, 11];

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
    updates['/user-posts/' + uid + '/' + newPostKey] = postData;
    var result=firebase.database().ref().update(updates);
    console.log("pushed result", result);
}
$(function () {
    $("#puchColor").click(function () {
        PushRGB();
    });
    $("#addColor").click(function () {
        RGBArray = [250, 130, 10];         
        AddRGB();
    });
    $("#changeColor").click(function () {
        RGBArray = [155, 255, 0];
        SendRGB();
    });
    $("#sliderR").slider({
        range: "min",
        value: 37,
        min: 1,
        max: 255,
        slide: function (event, ui) {
            $("#amount").val("R " + ui.value);
            RGBArray[0] = ui.value;
            PushRGB();
        }
    });
    $("#sliderG").slider({
        range: "min",
        value: 37,
        min: 1,
        max: 255,
        slide: function (event, ui) {
            $("#amount").val("G " + ui.value);
            RGBArray[1] = ui.value;
            PushRGB();
        }
    });
    $("#sliderB").slider({
        range: "min",
        value: 37,
        min: 1,
        max: 255,
        slide: function (event, ui) {
            $("#amount").val("B " + ui.value);
            RGBArray[2] = ui.value;
            PushRGB();
        }
    });
});
