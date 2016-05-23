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

Meteor.publish('tour_by_id', function(object_id) {
  return Tours.find({_id: object_id});
});

Meteor.publish('tour_object_by_id', function(object_id) {
  return TourObjects.find({_id: object_id});
});