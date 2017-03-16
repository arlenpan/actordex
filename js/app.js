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
    addForm: function() {
      vm.showAdd = true;
      vm.showFail = false;
    },
    showActorInfo: function(actor) {
      vm.showActorInfo(actor);
    }
  }
});

// Vue Component: SEARCH BAR 
var searchBar = Vue.component('search-bar', {
  template: '#search-bar-temp',
  data: function() {
    return { selection: '' }
  },
  firebase: {
    actors: database.ref('actors')
  },
  methods: {
    viewActor: function() {
      var actorSel = this.selection;
      database.ref('actors/' + actorSel).once('value').then(function(snapshot) {
        var ifExists = snapshot.val();
        if (ifExists){
          vm.showActorInfo(actorSel);
        } else {
          vm.showFail = true;
        }
      });
    }
  }
});

// Vue Component: SEARCH FAILED
var searchFail = Vue.component('search-fail', {
  template: '#fail-search-temp',
  methods: {
    toggleShowFail: function() {
      vm.showFail = false;
    },
    toggleShowLogin: function() {
      vm.showLogin = true;
      vm.showFail = false;
    }
  }
});

// Vue Component: SEARCH FAILED
var searchFailSignin = Vue.component('search-fail-signin', {
  template: '#fail-search-signin-temp',
  methods: {
    addForm: function() {
      vm.showAdd = true;
      vm.showFail = false;
    },
    toggleShowFail: function() {
      vm.showFail = false;
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
    cancel: function() {
      vm.showAdd = false;
    },
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
  data: function () {
    return {
      newMovieName: ''
    }
  },
  props: ['name', 'age', 'bio', 'image', 'gender', 'country', 'showDelete', 'favorite', 'movies', 'showDeleteMovie', 'signedIn'],
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
    },
    addNewMovie: function() {
      if(this.newMovieName != '') {
        vm.currActorMovies.push(this.newMovieName);
        this.newMovieName = '';
        database.ref('actors/' + vm.currKey).update({movies: vm.currActorMovies});
      }
    },
    removeMovie: function() {
      vm.currActorMovies.splice(arguments[0], 1);
      database.ref('actors/' + vm.currKey).update({movies: vm.currActorMovies});
    }
  }
});

// Vue Component: NEW MOVIE TO ADD
var newMovieItem = Vue.component('new-movie-item', {
  template: '#movie-item-temp',
  props: ['title', 'showDeleteMovie']
});

// Vue Component: DELETE MOVIE
var deleteMovie = Vue.component('delete-movie', {
  template: '#delete-movie-temp'
});

// Vue Component: EDIT ACTOR
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
    cancel: function() {
      vm.showEdit = false;
    },
    editActor: function() {
      var newName = this.editName;
      var newAge = this.editAge;
      var newBio = this.editBio;
      var newGender = this.editGender;
      var newCountry = this.editCountry;
      if(newName != '') {
        database.ref('actors/' + vm.currKey).update({name: newName});
        vm.currActorName = newName;
      }
      if(newAge != '') {
        database.ref('actors/' + vm.currKey).update({age: newAge});
        vm.currActorAge = newAge;
      }
      if(newBio != '') {
        database.ref('actors/' + vm.currKey).update({bio: newBio});
        vm.currActorBio = newBio;
      }
      if(newGender.length > 0) {
        database.ref('actors/' + vm.currKey).update({gender: newGender});
        vm.currActorGender = newGender;
      }
      if(newCountry != '') {
        database.ref('actors/' + vm.currKey).update({country: newCountry});
        vm.currActorCountry = newCountry;
      }
      var imageURL;
      var selected = document.getElementById('ef-image').files;
      if(selected.length > 0) {
        var imageRef = storage.ref().child('images/' + selected[0].name).put(selected[0]);
        imageRef.on(firebase.storage.TaskEvent.STATE_CHANGED, null, null, function() {
          imageURL = imageRef.snapshot.downloadURL;
          database.ref('actors/' + vm.currKey).update({image: imageURL});
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
      database.ref('actors/' + vm.currKey).remove();
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
      vm.currActorMovies = [];
      vm.currKey = '';
    },
    hideDeleteDialog: function() {
      vm.showDelete = false;
    }
  }
});

// Vue Component: ACTOR NOT FOUND
// var actorNotFound = Vue.component('actor-not-found', {
//   template: '#actor-not-found-temp'
// });

// Vue Instance: BODY WRAPPER & USER BASED FUNCTIONS
var vm = new Vue({
  el: '#vm',
  data: {
    displayContent: false,
    signedIn: false,
    submitAdd: false,
    showDelete: false,
    showDeleteMovie: false,
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
    currActorMovies: [],
    currFavorite: false,
    currKey: '',
    selectionValue: '',
    showLogin: false,
    showFav: false,
    showAdd: false,
    showFail: false
  },
  methods: {
    signOut: function() {
      firebase.auth().signOut().then(function() {
        console.log("Signed out!");
      })
    },
    showFavList: function() {
      vm.showFav = true;
      vm.showAdd = false;
    },
    showActorInfo: function(actor) {
      database.ref('actors/' + actor).once('value').then(function(snapshot) {
        vm.currActorName = snapshot.val().name;
        vm.currActorAge = snapshot.val().age;
        vm.currActorBio = snapshot.val().bio;
        vm.currActorImage = snapshot.val().image;
        vm.currActorGender = snapshot.val().gender;
        vm.currActorCountry = snapshot.val().country;
        if(snapshot.val().movies == null) {
          vm.currActorMovies = [];
        } else {
          vm.currActorMovies = snapshot.val().movies;
        }
        vm.currKey = snapshot.key;
        if (this.signedIn) {
          var ref = database.ref('users/' + firebase.auth().currentUser.uid).child('favorites').child(vm.currActorName);
          ref.once('value').then(function(snapshot) {
            vm.currFavorite = snapshot.val();
          })
        }
      });
      vm.submitAdd = true;
      vm.showEdit = false;
      vm.showFav = false;
      vm.showAdd = false;
      vm.showFail = false;
    }
  }
});