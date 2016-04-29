var EDITING_KEY = 'editingTour';
Session.setDefault(EDITING_KEY, false);

// Track if this is the first time the tour template is rendered
var firstRender = true;
var tourRenderHold = LaunchScreen.hold();
tourFadeInHold = null;

Template.toursShow.onRendered(function() {
  if (firstRender) {
    // Released in app-body.js
    tourFadeInHold = LaunchScreen.hold();

    // Handle for launch screen defined in app-body.js
    tourRenderHold.release();

    firstRender = false;
  }

  this.find('.js-title-nav')._uihooks = {
    insertElement: function(node, next) {
      $(node)
        .hide()
        .insertBefore(next)
        .fadeIn();
    },
    removeElement: function(node) {
      $(node).fadeOut(function() {
        this.remove();
      });
    }
  };
});

Template.toursShow.helpers({
  editing: function() {
    return Session.get(EDITING_KEY);
  },

  tour_objectsReady: function() {
    return Router.current().tour_objectsHandle.ready();
  },

  tour_objects: function(tourId) {
      tour = Tours.find({_id: tourId}).fetch()[0];
      return TourObjects.find({_id: {$in: tour.artwork_included}});
  }
});

var editTour = function(tour, template) {
  Session.set(EDITING_KEY, true);

  // force the template to redraw based on the reactive change
  Tracker.flush();
  template.$('.js-edit-form input[type=text]').focus();
};

var saveTour = function(tour, template) {
  Session.set(EDITING_KEY, false);
  Tours.update(tour._id, {$set: {name: template.$('[name=name]').val()}});
};

var deleteTour = function(tour) {
  // ensure the last public tour cannot be deleted.
  if (! tour.userId && Tours.find({userId: {$exists: false}}).count() === 1) {
    return alert("Sorry, you cannot delete the final public tour!");
  }

  var message = "Are you sure you want to delete the tour " + tour.name + "?";
  if (confirm(message)) {
    // we must remove each item individually from the client
    Tours.remove(tour._id);
    Router.go('home');
    return true;
  } else {
    return false;
  }
};

var toggleTourPrivacy = function(tour) {
  if (! Meteor.user()) {
    return alert("Please sign in or create an account to make private tours.");
  }

  if (tour.userId) {
    Tours.update(tour._id, {$unset: {userId: true}});
  } else {
    // ensure the last public tour cannot be made private
    if (Tours.find({userId: {$exists: false}}).count() === 1) {
      return alert("Sorry, you cannot make the final public tour private!");
    }

    Tours.update(tour._id, {$set: {userId: Meteor.userId()}});
  }
};

Template.toursShow.events({
  'click .js-cancel': function() {
    Session.set(EDITING_KEY, false);
  },

  'keydown input[type=text]': function(event) {
    // ESC
    if (27 === event.which) {
      event.preventDefault();
      $(event.target).blur();
    }
  },

  'blur input[type=text]': function(event, template) {
    // if we are still editing (we haven't just clicked the cancel button)
    if (Session.get(EDITING_KEY))
      saveTour(this, template);
  },

  'submit .js-edit-form': function(event, template) {
    event.preventDefault();
    saveTour(this, template);
  },

  // handle mousedown otherwise the blur handler above will swallow the click
  // on iOS, we still require the click event so handle both
  'mousedown .js-cancel, click .js-cancel': function(event) {
    event.preventDefault();
    Session.set(EDITING_KEY, false);
  },

  'change .tour-edit': function(event, template) {
    if ($(event.target).val() === 'edit') {
      editTour(this, template);
    } else if ($(event.target).val() === 'delete') {
      deleteTour(this, template);
    } else {
      toggleTourPrivacy(this, template);
    }

    event.target.selectedIndex = 0;
  },

  'click .js-edit-tour': function(event, template) {
    editTour(this, template);
  },

  'click .js-toggle-tour-privacy': function(event, template) {
    toggleTourPrivacy(this, template);
  },

  'click .js-delete-tour': function(event, template) {
    deleteTour(this, template);
  },

  'click .js-tour_object-add': function(event, template) {
    template.$('.js-tour_object-new input').focus();
  },

  'submit .js-tour_object-new': function(event) {
    event.preventDefault();

    var $input = $(event.target).find('[type=text]');
    if (! $input.val())
      return;

    var to_id = TourObjects.insert({
      title: $input.val(),
      checked: false,
      createdAt: new Date()
    });
    Tours.update(this._id, {$push: {artwork_included: to_id}});
    $input.val('');
  }
});