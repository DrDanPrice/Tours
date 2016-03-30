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
  return TourObjects.find({tourId: tourId});
});

Meteor.publish('all_tour_objects', function() {
    return TourObjects.find({});
});