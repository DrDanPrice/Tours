Tours = new Mongo.Collection('tours');
Tours.allow({
  update: function () {
    return true;
  },
  insert: function () {
    return true;
  }
});
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
  insert: function (userId, doc) {
    return true;
  },
  update: function (userId, doc) {
    return true;
  }
});

var Images = new FilesCollection({
  collectionName: 'Images',
  allowClientCode: false, // Disallow remove files from Client,
  onBeforeUpload: function (file) {
    // Allow upload files under 10MB, and only in png/jpg/jpeg formats
    if (file.size <= 10485760 && /png|jpg|jpeg/i.test(file.ext)) {
      return true;
    } else {
      return 'Please upload image, with size equal or less than 10MB';
    }
  }
})

if (Meteor.isClient) {
  Meteor.subscribe('files.images.all');
}

if (Meteor.isServer) {
  Meteor.publish('files.images.all', function () {
    return Images.collection.find({});
  });
}

Meteor.methods({
  tourObjectUpsert: function (doc) {
    try {
      if (doc._id)
        return TourObjects.update({_id: doc._id}, {$set: doc});
      else
        return TourObjects.insert(doc);
    } catch (e) {
      throw new Meteor.Error(e)
    }
  }
});

TourObjectSchema = new SimpleSchema(
  {
    "_id": {
      type: String,
      optional: true,
      autoform: {
        label: false,
        afFieldInput: {
          type: "hidden"
        }
      }
    },
    "title": {
      label: "Title",
      type: String
    },
    "display_sections": {
      type: Array,
      optional: true
    },
    "display_sections.$": {
      type: Object,
      optional: true
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
      autoform: {
        rows: 3
      },
      optional: true
    },
    "artist_name": {
      label: "Artist Name",
      type: String,
      optional: true
    },
    "location_lat": {
      label: "Location, Latitude",
      type: Number,
      decimal: true,
      optional: true
    },
    "location_long": {
      label: "Location, Longitude",
      type: Number,
      decimal: true,
      optional: true
    },
    "image": {
      type: String,
      label: 'Choose image file',
      optional: true,
      autoform: {
        afFieldInput: {
          type: 'fileUpload',
          collection: 'Images'
        }
      }
    },
    "tags": {
      type: [String],
      autoform: {
        type: 'tags',
        afFieldInput: "bootstrap-tagsinput options"
      },
      optional: true
    }
  }
);

TourObjects.attachSchema(TourObjectSchema);
