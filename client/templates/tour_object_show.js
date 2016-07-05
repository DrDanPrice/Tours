Template.tour_object_show.helpers({
  formObject: function () {
    if (Template.currentData() && Template.currentData()._id != null)
      return Template.currentData();
    else
      return null;
  }
});

AutoForm.addHooks(
  "tourObjectForm",
  {
    onSuccess: function (formType, result) {
      var tour_id = Router.current().params.tour_id;
      if (tour_id) {
        var updatedTour = Tours.findOne({_id: tour_id});
        updatedTour.artwork_included.push(result);
        console.log("client", updatedTour);
        // Meteor.call('editTour', tour_id, updatedTour);
        Tours.update({_id: tour_id}, {$set: updatedTour});
      }
      Router.go('toursObjectShow', {_id: result});
    }
  }
);