# ActorDex

Created by: Zi Pan, Christy Wong, Kelsey Ma

https://actor-dex-final.firebaseapp.com/

Libraries Used: 
[Bulma](http://bulma.io/) | [Vue.JS](https://vuejs.org/) | [VueFire](https://github.com/vuejs/vuefire)
| [Firebase](https://firebase.google.com/) | [FirebaseUI](https://github.com/firebase/firebaseui-web)

## Documentation

### Usage

### Code: Architecture

### Code: Modification & Extension

### Thoughts: Concerns & Limitations

* Storage & Connections - Since we're currently just using the free version for Firebase, there is a limit to how much storage space we get for our database, which means there is a limit to how much users can add to the database. Additionally, there can only be 100 simultaneous connections, so there is a limit on number of users.

* Slow Page Loads - Our database includes a information about actors and actresses (names, photos, biographies, list of their movies). This means each person can have a lot of text and data associated with them. Also, since users are free to add actors to the database, our database may become increasingly large, especially if we upgrade to the paid versions of Firebase. Also if we upgrade, there would be an unlimited number of simultaneous connections, so there can be heavy page traffic. With so much data and/or traffic, a concern may be slower page loads (ie. waiting for an immense number of photos to load on the screen when viewing all actors).

* Usability - In the class, we didn't really consider user testing too much and we only conducted user research in the very beginning. We don't know if users would actually use our product, if the flow of the application makes complete sense, or what features or aspects of the application could be improved upon from a third party point of view.

* Security - Users, if logged in, are free to add and remove actors and movies. This can be a cause for concern since we are never 100% sure of what users will do (ie. input something harmful).

### Thoughts: Future Extension

* Favorite Actor Cards & Categories - We didn't get to implementing actor cards for a user's list of favorite actors and actresses. Currently, it is just a list, but we can improve upon this visually and create cards with images of the actors and their names. Furthermore, we could extend this further by allowing users to save their favorites in different lists/categories (such as "Favorite Action Stars").

* Notifications - When we first started the project, we had planned to have a notifications feature where users can see a feed of notifications whenever their favorite actors and actresses had any new social media updates. We didn't have time to implement this, but we think it would be a nice feature to include as an extension to our project.

* Movies - For our project, we had wanted to keep the collection of information strictly focused on the actors and actresses. We thought if we were to further include a collection of movies, our collection of data would become too large and difficult to manage. Therefore, currently, we only have a list of movies per actor, but they don't lead to their own page. However, if we were to extend our project, we can consider adding separate movie pages that includes the synopsis of the movie, a list of people who starred in it, the year it came out, etc.

* Filtering - Since we don't know how large our database of actors and actresses can become, it would be nice if we have a filtering system for the actors (ie. by gender, by what their name starts with, etc.) and allow users to more easily search for an actor.
