//(function() {

  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyBoePGNuYbAVDtnuRDLjj0bgxBRSaBMFdc",
    authDomain: "subtrack-44207.firebaseapp.com",
    projectId: "subtrack-44207",
    storageBucket: "subtrack-44207.appspot.com",
    messagingSenderId: "597619555514",
    appId: "1:597619555514:web:a42e39858752fede6e9683"
  };

  firebase.initializeApp(firebaseConfig);
  var firestore = firebase.firestore();

  // const docRef = firestore.doc("users/subscriptionData");
  const outputHeader1 = document.querySelector("#subNameOutput");
  const outputHeader2 = document.querySelector("#subDateOutput");
  const outputHeader3 = document.querySelector("#subPayAmountOutput");
  const inputTextField1 = document.querySelector("#subName");
  const inputTextField2 = document.querySelector("#subDate");
  const inputTextField3 = document.querySelector("#subPayAmount");
  const saveButton = document.querySelector("#saveButton");
  const editButton = document.querySelector("#editButton");
  const editInputField1 = document.querySelector("#editName");
  const editInputField2 = document.querySelector("#editDate");
  const editInputField3 = document.querySelector("#editAmount");
  // const loadButton = document.querySelector("#loadButton");
  var seqID = 1;

  // var user = firebase.auth().currentUser;
  var name, email, photoUrl, uid, emailVerified;

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
    name = user.displayName;
    email = user.email;
    photoUrl = user.photoURL;
    emailVerified = user.emailVerified;
    uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
                    // this value to authenticate with your backend server, if
                    // you have one. Use User.getToken() instead.
    console.log("User != null", uid);
    var docRef = firestore.collection("users").doc("C8WwXTydF3dI7LqPR8L8tReBuDo2");
    console.log(uid);

    docRef.get().then((doc) => {
        if (doc.exists) {
            console.log("Document data:", doc.data());
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });


    if (saveButton !== null){
      saveButton.addEventListener("click", function() {
        const textToSave1 = inputTextField1.value;
        const textToSave2 = inputTextField2.value;
        const textToSave3 = inputTextField3.value;
        console.log("I am going to save " + textToSave1 + " to Firestore");
        console.log("I am going to save " + textToSave2 + " to Firestore");
        console.log("I am going to save " + textToSave3 + " to Firestore");
        console.log("Save Button != null", uid);
        var usersCollectionRef = firestore.collection('users').doc(uid);
        usersCollectionRef.get().then((doc) => {
          if (doc.exists) {
            firestore.collection('users').doc(uid).set(
              { 
                sequenceID: firebase.firestore.FieldValue.increment(1),
                [`sub${doc.data().sequenceID}`]: 
                {
                  name: textToSave1,
                  date: textToSave2,
                  pay: textToSave3,
                },
              },
              { merge: true} 
            ).then(function() {
              console.log("Status saved!");
              window.location.href = "home.html";
              console.log("Document data:", doc.data());
            }).catch((error) => {
              console.log("Error getting document:", error);
            });
         } else {
              // doc.data() will be undefined in this case
              firestore.collection('users').doc(uid).set(
                { 
                  sequenceID: 1,
                  sub0: 
                  {
                    name: textToSave1,
                    date: textToSave2,
                    pay: textToSave3,
                  },
                },
                { merge: true} 
              ).then(function() {
                console.log("Status saved!");
                window.location.href = "home.html";
                console.log("No such document!");
              }).catch((error) => {
                console.log("Error getting document:", error);
              });
          }
        });
      });
    }
  
    if (editButton !== null){
      editButton.addEventListener("click", function() {
        const textToSave1 = editInputField1.value;
        const textToSave2 = editInputField2.value;
        const textToSave3 = editInputField3.value;
        console.log("I am going to save " + textToSave1 + " to Firestore");
        console.log("I am going to save " + textToSave2 + " to Firestore");
        console.log("I am going to save " + textToSave3 + " to Firestore");
        const seqStr = 'sub' + seqID;
        seqStr;
        firestore.collection('users').doc(uid).update(
          { seqStr: 
            {
              name: textToSave1,
              date: textToSave2,
              pay: textToSave3,
            },
            sequenceID: firebase.firestore.FieldValue.increment(1),
          },
          { merge: true} 
        ).then(function() {
          console.log("Update saved!");
          seqID++;
          window.location.href = "home.html";
        }).catch(function (error) {
          console.log("Got an error: ", error);
        });
      });
    }
  
    var usersCollectionRef = firestore.collection('users').doc(uid);
  
    getRealtimeUpdates = function() {
      usersCollectionRef.onSnapshot(function (doc) {
        if (doc && doc.exists) {
          const myData = doc.data();
          console.log("Check out this document I recieved ", doc);
          console.log(myData);
          const sub = 'sub' + (myData.sequenceID - 1); 
          console.log(myData[sub]['name']);
          // var subNode = document.createElement("H1");                 
          // var subTextNode = document.createTextNode(myData[sub].name);      
          // subNode.appendChild(subTextNode);                             
          // document.getElementById("subDiv").appendChild(subNode);
          console.log(document.getElementById("subDiv"));
          var subElement = document.createElement("H1"); 
          subElement.textContent = myData[sub].name;
          subElement.setAttribute('class', 'subName');  
          subElement.setAttribute('id', 'subNameOutput');              
          document.getElementById("subDiv").appendChild(subElement); 
          console.log('HI');
          // outputHeader1.innerText = "Name: " + myData[sub]['name']; // myData.name
          // outputHeader2.innerText = "Date: "+ myData.sub]date;
          // outputHeader3.innerText = "Pay: " + myData.sub.pay;
        }
      });
    }
  
    getRealtimeUpdates();

    
    // document.body.appendChild(saveButton);
    // var subElement = document.createElement("H1");                 // Create a <p> element
    // subElement.innerHTML = myData[sub].name;                // Insert text
    // document.getElementById("subDiv").appendChild(subElement);     // Append <p> to <div> with id="myDIV"

    
    // var subNode = document.createElement("H1");                 
    // var subTextNode = document.createTextNode(myData[sub].name);      
    // subNode.appendChild(subTextNode);                             
    // document.getElementById("subDiv").appendChild(subNode);     
    
  }
  });

  // if (saveButton !== null){
  //   saveButton.addEventListener("click", function() {
  //     const textToSave1 = inputTextField1.value;
  //     const textToSave2 = inputTextField2.value;
  //     const textToSave3 = inputTextField3.value;
  //     console.log("I am going to save " + textToSave1 + " to Firestore");
  //     console.log("I am going to save " + textToSave2 + " to Firestore");
  //     console.log("I am going to save " + textToSave3 + " to Firestore");
  //     const seqStr = 'sub' + seqID;
  //     seqStr;
  //     if (firestore.collection('users').doc(uid) == null){
  //     firestore.collection('users').doc(uid).set(
  //       { seqStr: 
  //         {
  //           name: textToSave1,
  //           date: textToSave2,
  //           pay: textToSave3,
  //         },
  //         sequenceID: firebase.firestore.FieldValue.increment(1),
  //       },
  //       { merge: true} 
  //     ).then(function() {
  //       console.log("Status saved!");
  //       seqID++;
  //       window.location.href = "home.html";
  //     }).catch(function (error) {
  //       console.log("Got an error: ", error);
  //     });
  //   }
  //   else{
  //     firestore.collection('users').doc(uid).update(
  //       { seqStr: 
  //         {
  //           name: textToSave1,
  //           date: textToSave2,
  //           pay: textToSave3,
  //         },
  //         sequenceID: firebase.firestore.FieldValue.increment(1)
  //       },
  //       { merge: true} 
  //     ).then(function() {
  //       console.log("Status saved!");
  //       seqID++;
  //       window.location.href = "home.html";
  //     }).catch(function (error) {
  //       console.log("Got an error: ", error);
  //     });
  //   }
  //   });
  // }

  // if (saveButton !== null){
  //   saveButton.addEventListener("click", function() {
  //     const textToSave1 = inputTextField1.value;
  //     const textToSave2 = inputTextField2.value;
  //     const textToSave3 = inputTextField3.value;
  //     console.log("I am going to save " + textToSave1 + " to Firestore");
  //     console.log("I am going to save " + textToSave2 + " to Firestore");
  //     console.log("I am going to save " + textToSave3 + " to Firestore");
  //     const seqStr = 'sub' + seqID;
  //     seqStr;
  //     console.log("Save Button != null", uid);
  //     firestore.collection('users').doc(uid).set(
  //       { [`sub${seqID}`]: 
  //         {
  //           name: textToSave1,
  //           date: textToSave2,
  //           pay: textToSave3,
  //         },
  //         sequenceID: firebase.firestore.FieldValue.increment(1),
  //       },
  //       { merge: true} 
  //     ).then(function() {
  //       console.log("Status saved!");
  //       seqID++;
  //       window.location.href = "home.html";
  //     }).catch(function (error) {
  //       console.log("Got an error: ", error);
  //     });
  //   });
  // }

  // if (editButton !== null){
  //   editButton.addEventListener("click", function() {
  //     const textToSave1 = editInputField1.value;
  //     const textToSave2 = editInputField2.value;
  //     const textToSave3 = editInputField3.value;
  //     console.log("I am going to save " + textToSave1 + " to Firestore");
  //     console.log("I am going to save " + textToSave2 + " to Firestore");
  //     console.log("I am going to save " + textToSave3 + " to Firestore");
  //     const seqStr = 'sub' + seqID;
  //     seqStr;
  //     firestore.collection('users').doc(uid).update(
  //       { seqStr: 
  //         {
  //           name: textToSave1,
  //           date: textToSave2,
  //           pay: textToSave3,
  //         },
  //         sequenceID: firebase.firestore.FieldValue.increment(1),
  //       },
  //       { merge: true} 
  //     ).then(function() {
  //       console.log("Update saved!");
  //       seqID++;
  //       window.location.href = "home.html";
  //     }).catch(function (error) {
  //       console.log("Got an error: ", error);
  //     });
  //   });
  // }

  // var usersCollectionRef = firestore.collection('users');

  // getRealtimeUpdates = function() {
  //   usersCollectionRef.onSnapshot(function (doc) {
  //     if (doc && doc.exists) {
  //       const myData = doc.data();
  //       console.log("Check out this document I recieved ", doc);
  //       outputHeader1.innerText = "Name: " + myData.name;
  //       outputHeader2.innerText = "Date: "+ myData.date;
  //       outputHeader3.innerText = "Pay: " + myData.pay;
  //     }
  //   });
  // }

  // getRealtimeUpdates();