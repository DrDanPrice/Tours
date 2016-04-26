Meteor.publish('publicTours', function() {
  return Tours.find({userId: {$exists: false}});
});

Meteor.publish('privateTours', function() {
  if (this.userId) {
    return Tours.find({userId: this.userId});
  } else {
    this.ready();
  }
});

Meteor.publish('tour_objects', function(tourId) {
  check(tourId, String);
  var tour = Tours.find({_id: tourId}).fetch()[0];
  return TourObjects.find({_id: {$in: tour.artwork_included}});
});

Meteor.publish('all_tour_objects', function() {
    return TourObjects.find({});
});