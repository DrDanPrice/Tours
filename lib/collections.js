Tours = new Mongo.Collection('tours');

// Calculate a default name for a Tour in the form of 'Tour A'
Tours.defaultName = function () {
  var nextLetter = 'A', nextName = 'Tour ' + nextLetter;
  while (Tours.findOne({name: nextName})) {
    // not going to be too smart here, can go past Z
    nextLetter = String.fromCharCode(nextLetter.charCodeAt(0) + 1);
    nextName = 'Tour ' + nextLetter;
  }

  return nextName;
};

TourObjects = new Mongo.Collection('tour_objects');
TourObjects.allow({
  insert: function(userId, doc) {
    return true;
  },
  update: function(userId, doc) {
    return true;
  }
});