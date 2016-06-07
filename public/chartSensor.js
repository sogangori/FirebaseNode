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

firebase.database().ref().child('light').on('value', function (snapshot) {

    var snapVal = snapshot.val();
    //console.log("snapshot.val()", snapVal);
    var count = 0;
    var chartArray = [];
    chartArray.push(['Time', 'light']);
    for (var key in snapVal) {
        //key는 유저 id를 말한다 예)park 이 보낸 데이터들
        if (snapVal.hasOwnProperty(key)) {                
            //console.log("key/value", key, snapVal[key]);
            for (var obj in snapVal[key]) {
                var light = snapVal[key][obj];
                chartArray.push([count++, light]);
            }            
        }
    }
   
    drawChart(chartArray);
});


firebase.database().ref().child('sensor').on('value', function (snapshot) {
	var snapVal = snapshot.val();
    console.log("sensor snapshot.val()", snapVal);
	$("#amountInterval").val("Interval " + snapVal["interval"]);
	$("#sliderSensorIntervalServer").slider({
		value:snapVal["interval"],
		min: 1,
        max: 60
	});
});
 

function PushSensor(value) {    
    var postData = {
        light: value
    };
    var newPostKey = firebase.database().ref().child('light').push().key;
    var updates = {};
    updates['/light/' + newPostKey] = postData;
    var result=firebase.database().ref().update(updates);
    console.log("pushed result", result);
}
function SetSensorInterval(value) { 
    firebase.database().ref().child('sensor').set({"interval":value});   
    console.log("SetSensorInterval", value);
}

$(function () { 
    $("#sliderSensor").slider({
        range: "min",
        value: 150,
        min: 1,
        max: 300,
        slide: function (event, ui) {
            $("#amount").val("LightSensor " + ui.value);            
            PushSensor(ui.value);
        }
    });
    $("#sliderSensorInterval").slider({
        range: "min",
        value: 1,
        min: 1,
        max: 60,
        slide: function (event, ui) {
            $("#amountInterval").val("Interval " + ui.value);            
            SetSensorInterval(ui.value);
        }
    });    
});
