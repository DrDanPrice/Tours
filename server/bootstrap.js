// if the database is empty on server start, create some sample data.
Meteor.startup(function () {
  if (Tours.find().count() === 0) {
    var data = [
      {name: "Example Tour",
       items: ["Weird Object",
         "One Language",
         "Database Everywhere",
         "Latency Compensation",
         "Full Stack Reactivity",
         "Embrace the Ecosystem",
         "Simplicity Equals Productivity"
       ]
      }
    ];

    var timestamp = (new Date()).getTime();
    _.each(data, function(tour) {
      var tour_id = Tours.insert({name: tour.name,
        incompleteCount: tour.items.length});

      _.each(tour.items, function(text) {
        TourObjects.insert({tourId: tour_id,
                      text: text,
                      createdAt: new Date(timestamp)});
        timestamp += 1; // ensure unique timestamp.
      });
    });
  }
});
