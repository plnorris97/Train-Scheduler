// Initialize Firebase
var config = {
    apiKey: "AIzaSyDeWDF-rlcTmrT0HxUp--auO7AdX-Mum1E",
    authDomain: "train-scheduler-e2fb4.firebaseapp.com",
    databaseURL: "https://train-scheduler-e2fb4.firebaseio.com",
    projectId: "train-scheduler-e2fb4",
    storageBucket: "train-scheduler-e2fb4.appspot.com",
    messagingSenderId: "416072776967"
};

firebase.initializeApp(config);   

// Create a variable to reference the database
var database = firebase.database();

// At the initial load and subsequent value changes, get a snapshot of the stored data.
// This function allows you to update your page in real-time when the firebase database changes.

// 2. Button for adding trains
$("#add-train-btn").on("click", function(event) {
    event.preventDefault();
  
    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var trainDestination = $("#destination-input").val().trim();
    var firstTime = moment($("#first-time-input").val().trim(), "HH:mm").format("X");
    var trainFrequency = $("#frequency-input").val().trim();
  
    // Creates local "temporary" object for holding train data
    var newTrain = {
      name: trainName,
      destination: trainDestination,
      time: firstTime,
      frequency: trainFrequency
    };
  
    // Uploads train data to the database
    database.ref().push(newTrain);
  
    // Logs everything to console
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.time);
    console.log(newTrain.frequency);
  
    alert("Train successfully added");
  
    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#frequency-input").val("");
  });
  
  // 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
  database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());
  
    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var firstTime = childSnapshot.val().time;
    var trainFrequency = childSnapshot.val().frequency;
  
    // Train Info
    console.log(trainName);
    console.log(trainDestination);
    console.log(firstTime);
    console.log(trainFrequency);
  
    // Declare the time based variables
    
    var currentTimeCalc = moment().subtract(1, "years");

    var firstTrain = moment(firstTime, "HH:mm").subtract(1, "years");

    var diffTime = moment().diff(moment(firstTrain), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    var timeRemaining = diffTime % trainFrequency;
    console.log(timeRemaining);

    var minTilTrain = trainFrequency - timeRemaining;
    console.log("MINUTES TILL TRAIN: " + minTilTrain);

    var nextTrain = moment().add(minTilTrain, "minutes").format ("hh:mm A");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("HH:mm"));

    var beforeCalc = moment(firstTrain).diff(currentTimeCalc, "minutes");
    var beforeMinutes = Math.ceil(moment.duration(beforeCalc).asMinutes());


    if ((currentTimeCalc - firstTrain) < 0) {
        nextTrain = childSnapshot.val().firstTrain;
        console.log("Before First Train");
        timeRemaining = beforeMinutes;
    }
      else {
        nextTrain = moment().add(timeRemaining, "minutes").format("hh:mm A");
        minutesRemaining = trainFrequency - timeRemaining;
        console.log("Working");
    }
  
    // Create the new row
    var newRow = $("<tr>").append(
      $("<td>").text(trainName),
      $("<td>").text(trainDestination),
      $("<td>").text(trainFrequency),
      $("<td>").text(nextTrain),
      $("<td>").text(minTilTrain),
    );
  
    // Append the new row to the table
    $("#train-table > tbody").append(newRow);
  });

