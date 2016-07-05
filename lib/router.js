Router.configure({
  // we use the  appBody template to define the layout for the entire app
  layoutTemplate: 'appBody',

  // the appNotFound template is used for unknown routes and missing tours
  notFoundTemplate: 'appNotFound',

  // show the appLoading template whilst the subscriptions below load their data
  loadingTemplate: 'appLoading',

  // wait on the following subscriptions before rendering the page to ensure
  // the data it's expecting is present
  waitOn: function () {
    return [
      Meteor.subscribe('publicTours'),
      Meteor.subscribe('privateTours')
    ];
  }
});

dataReadyHold = null;

if (Meteor.isClient) {
  // Keep showing the launch screen on mobile devices until we have loaded
  // the app's data
  dataReadyHold = LaunchScreen.hold();

  // Show the loading screen on desktop
  Router.onBeforeAction('loading', {except: ['join', 'signin']});
  Router.onBeforeAction('dataNotFound', {except: ['join', 'signin']});
}

Router.route('join');
Router.route('signin');

Router.route('toursShow', {
  path: '/tours/:_id',
  // subscribe to tour_objects before the page is rendered but don't wait on the
  // subscription, we'll just render the items as they arrive
  onBeforeAction: function () {
    this.tour_objectsHandle = Meteor.subscribe('all_tour_objects');

    if (this.ready()) {
      // Handle for launch screen defined in app-body.js
      dataReadyHold.release();
    }
  },
  data: function () {
    return Tours.findOne(this.params._id);
  },
  action: function () {
    this.render();
  }
});

Router.route('toursObjectShow', {
  path: '/tourObject/:_id',
  // subscribe to tour_objects before the page is rendered but don't wait on the
  // subscription, we'll just render the items as they arrive
  onBeforeAction: function () {
    this.tour_objectsHandle = Meteor.subscribe('tour_object_by_id', this.params._id);

    if (this.ready()) {
      // Handle for launch screen defined in app-body.js
      dataReadyHold.release();
    }
  },
  data: function () {
    if (this.params._id)
      return TourObjects.findOne(this.params._id);
    else
      return {};
  },
  action: function () {
    this.render('tour_object_show');
  }
});

Router.route('newToursObject', {
  onBeforeAction: function () {
    this.tour_objectsHandle = Meteor.subscribe('publicTours', this.params._id);

    if (this.ready()) {
      dataReadyHold.release();
    }
  },
  path: '/newTourObject/:tour_id',
  data: function () {
      return {};
  },
  action: function () {
    this.render('tour_object_show');
  }
});

Router.route('home', {
  path: '/',
  action: function () {
    Router.go('toursShow', Tours.findOne());
  }
});
