# Tours
This is a development repository for a Tours framework (backend & management interface) developed using Meteor. It is based on the Meteor To Dos sample.

## Prerequisites

* We are running with a local [MongoDB](https://docs.mongodb.org/manual/installation/) and assume that there is a database called "Tours".

On Mac OS install via [homebrew](http://brew.sh/):

`brew install mongodb`

* [meteor](https://www.meteor.com/install)

On Mac OS or Linux:

`curl https://install.meteor.com/ | sh`


## Testing in local development environment

`MONGO_URL=mongodb://localhost:27017/Tours meteor`

1 - File upload
2 - Yes, on the Tour Management App, the pending items are the file upload and
making tour objects available to all tours. We were initially thinking about
adding in a selector to add tour object to tours using something like a type
ahead input selector. Also, there were some considerations on handling the
way that the many-to-many relation between tours and tour objects (reusing
tour objects or duplicating them for each tour).
3 - Build tours
4 - anonymous users are allowed to create objects
5 - all views look like edit views!!!
6 - submit goes to page not found
7 - image upload is a text field, and gets $in needs array error from mongo if text entered
8 - Viewport argument key "minimal-ui" not recognized and ignored.
9 - New tour doesn't create anything and goes to page not found
10 - js-bson: Failed to load c++ bson extension, using pure JS version -- might be only Mac problem; try on linux
