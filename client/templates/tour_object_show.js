Template.tour_object_show.helpers({
  tourObject: function () {
    return Template.currentData();
  }
});

TourObjects.attachSchema(new SimpleSchema(
  {
    "title": {
      label: "Title",
      type: String
    },
    "display_sections": {
      type: Array
    },
    "display_sections.$": {
      type: Object
    },
    "display_sections.$.name": {
      label: "Section Title",
      type: String
    },
    "display_sections.$.section_data": {
      type: Array
    },
    "display_sections.$.section_data.$": {
      type: Object,
      optional: true
    },
    "display_sections.$.section_data.$.element_title": {
      label: "Title",
      type: String,
      optional: true
    },
    "display_sections.$.section_data.$.element_content": {
      label: "Content",
      type: String,
      optional: true
    },
    "artist_name": {
      label: "Artist Name",
      type: String
    },
    location_lat: {
      label: "Location, Latitude",
      type: String
    },
    location_long: {
      label: "Location, Longitude",
      type: String
    },
    image: {
      type: String
    },
    tags: {
      type: String
    }
  }
));