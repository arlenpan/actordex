// Initialize Firebase Database and Storage
firebase.initializeApp(config);
var ui = new firebaseui.auth.AuthUI(firebase.auth());
ui.start('#firebaseui-auth-container', uiConfig);
var database = firebase.database();
var storage = firebase.storage();

// Initialize sign in listener
window.addEventListener('load', function() {
  firebase.auth().onAuthStateChanged(function(user) {
    vm.displayContent = true;
    if (user) {
      vm.signedIn = true;
      vm.displayName = user.displayName;
      vm.email = user.email;
      vm.emailVerified = user.emailVerified;
      vm.photoURL = user.photoURL || user.providerData[0].photoURL;
      vm.uid = user.uid;
      vm.providerData = user.providerData;
      writeUserData(user.uid, user.displayName, user.email, user.photoURL);
    } else {
      vm.signedIn = false;
      vm.accountDetails = "";
    }
  }, function(error) {
    console.log(error);
  });
});

// Search if user exists - if not, write new one
function writeUserData(userId, name, email, imageUrl) {
  var ref = database.ref('users/' + userId);
  ref.once('value').then(function(snapshot) {
    if (snapshot.val() === null) {   
      ref.set({
        username: name,
        email: email,
        image: imageUrl
      });
    } 
  });
};

// Vue Component: FAVORITES LIST
var favoriteList = Vue.component('favorite-list', {
  template: '#favorite-list-temp',
  firebase: function() {
    return {favorites: database.ref('users/' + firebase.auth().currentUser.uid).child('favorites')};
  },
  methods: {
    showActorInfo: function(actor) {
      vm.showActorInfo(actor);
    }
  }
});

// Vue Component: ACTOR LIST
var actorList = Vue.component('actor-list', {
  template: '#actor-list-temp',
  firebase: {
    actors: database.ref('actors')
  },
  methods: {
    showActorInfo: function(actor) {
      vm.showActorInfo(actor);
    }
  }
});

// Vue Component: ADD FORM
var addForm = Vue.component('add-form', {
  template: '#add-form-temp',
  data: function() {
    return {
      newActorName: '',
      newActorAge: '',
      newActorBio: '',
      newActorGender: [],
      newActorCountry: ''
    };
  },
  methods: {
    addActor: function () {
      var actorName = this.newActorName;
      var actorAge = this.newActorAge;
      var actorBio = this.newActorBio;
      var actorGender = this.newActorGender;
      var actorCountry = this.newActorCountry;
      var selectedFile = document.getElementById('af-image').files[0];
      if (!actorName || !actorAge || !actorBio || !actorGender || !actorCountry || !selectedFile) {
        alert("Please fill out all the fields!");
      } else {
        var imageRef = storage.ref().child('images/' + selectedFile.name).put(selectedFile);
        imageRef.on(firebase.storage.TaskEvent.STATE_CHANGED, null, null, function() {
          var imageURL = imageRef.snapshot.downloadURL;
          database.ref('actors/' + actorName).set({
            name: actorName,
            age: actorAge,
            bio: actorBio,
            image: imageURL,
            gender: actorGender,
            country: actorCountry
          });
          vm.showActorInfo(actorName);
        });
        this.newActorName = '';
        this.newActorAge = '';
        this.newActorBio = '';
        this.newActorGender = [];
        this.newActorCountry = '';
      }
    }
  }
});

// Vue Component: ACTOR INFO
var actorInfo = Vue.component('actor-info', {
  template: '#actor-info-temp',
  props: ['name', 'age', 'bio', 'image', 'gender', 'country', 'showDelete', 'favorite'],
  methods: {
    showEditForm: function() {
      vm.showEdit = true;
    },
    showDeleteDialog: function() {
      vm.showDelete = true;
    },
    addFavorite: function() {
      var ref = database.ref('users/' + firebase.auth().currentUser.uid).child('favorites').child(this.name);
      ref.once('value').then(function(snapshot) {
        if (snapshot.val() === null) {
          ref.set(true);
          vm.currFavorite = true;
        }
      });
    },
    removeFavorite: function() {
      database.ref('users/' + firebase.auth().currentUser.uid).child('favorites').child(this.name).remove();
      vm.currFavorite = false;
    },
    back: function() {
      vm.submitAdd = false;
    }
  }
});

// VVue Component: EDIT ACTOR
var editActor = Vue.component('edit-form', {
  template: '#edit-form-temp',
  data: function() {
    return {
      editName: '',
      editAge: '',
      editBio: '',
      editGender: [],
      editCountry: '',
    };
  },
  methods: {
    editActor: function() {
      var newName = this.editName;
      var newAge = this.editAge;
      var newBio = this.editBio;
      var newGender = this.editGender;
      var newCountry = this.editCountry;
      if(newName != '') {
        database.ref('actors/' + vm.currActorName).update({name: newName});
        vm.currActorName = newName;
      }
      if(newAge != '') {
        database.ref('actors/' + vm.currActorName).update({age: newAge});
        vm.currActorAge = newAge;
      }
      if(newBio != '') {
        database.ref('actors/' + vm.currActorName).update({bio: newBio});
        vm.currActorBio = newBio;
      }
      if(newGender.length > 0) {
        database.ref('actors/' + vm.currActorName).update({gender: newGender});
        vm.currActorGender = newGender;
      }
      if(newCountry != '') {
        database.ref('actors/' + vm.currActorName).update({country: newCountry});
        vm.currActorCountry = newCountry;
      }
      var imageURL;
      var selected = document.getElementById('ef-image').files;
      if(selected.length > 0) {
        var imageRef = storage.ref().child('images/' + selected[0].name).put(selected[0]);
        imageRef.on(firebase.storage.TaskEvent.STATE_CHANGED, null, null, function() {
          imageURL = imageRef.snapshot.downloadURL;
          database.ref('actors/' + vm.currActorName).update({image: imageURL});
          vm.currActorImage = imageURL;
          vm.currActorImagePath = selected[0].name;
        });
      }
      vm.showEdit = false;
    }
  }
});

// Vue Component: DELETE ACTOR
var deleteActor = Vue.component('delete-actor', {
  template: '#delete-actor-temp',
  props: ['toggleDeleteDialog'],
  methods: {
    deleteActor: function() {
      database.ref('actors/' + vm.currActorName).remove();
      storage.ref().child('images/' + vm.currActorImagePath).delete();
      vm.submitAdd = false;
      vm.showDelete = false;
      vm.currActorName = '';
      vm.currActorAge = '';
      vm.currActorBio = '';
      vm.currActorImage = '';
      vm.currActorImagePath = '';
      vm.currActorGender = [];
      vm.currActorCountry = '';
    },
    hideDeleteDialog: function() {
      vm.showDelete = false;
    }
  }
});

// Vue Instance: BODY WRAPPER & USER BASED FUNCTIONS
var vm = new Vue({
  el: '#vm',
  data: {
    displayContent: false,
    signedIn: false,
    submitAdd: false,
    showDelete: false,
    showEdit: false,
    displayName: null,
    email: null,
    emailVerified: null,
    photoURL: null,
    uid: null,
    providerData: null,
    currActorName: '',
    currActorAge: '',
    currActorBio: '',
    currActorImage: '',
    currActorImagePath: '',
    currActorGender: '',
    currActorCountry: '',
    currFavorite: false
  },
  methods: {
    signOut: function() {
      firebase.auth().signOut().then(function() {
        console.log("Signed out!");
      })
    },
    showActorInfo: function(actor) {
      database.ref('actors/' + actor).once('value').then(function(snapshot) {
        vm.currActorName = snapshot.val().name;
        vm.currActorAge = snapshot.val().age;
        vm.currActorBio = snapshot.val().bio;
        vm.currActorImage = snapshot.val().image;
        vm.currActorGender = snapshot.val().gender;
        vm.currActorCountry = snapshot.val().country;
        var ref = database.ref('users/' + firebase.auth().currentUser.uid).child('favorites').child(vm.currActorName);
        ref.once('value').then(function(snapshot) {
          vm.currFavorite = snapshot.val();
        })
      });
      vm.submitAdd = true;
      vm.showEdit = false;
    }
  }
});