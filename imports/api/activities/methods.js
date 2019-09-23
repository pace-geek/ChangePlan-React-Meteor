// methods related to companies

import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin';

import { Activities } from './activities.js';

export const insert = new ValidatedMethod({
    name: 'activities.insert',
    mixins : [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to create activity'
    },
    validate: new SimpleSchema({
        'activity': {
            type: Object
        },
        'activity.owner': {
            type: String,
        },
        activityOwner: {
            type: String,
        },
        'activity.type': {
            type: String,
        },
        'activity.name': {
            type: String,
        },
        'activity.description': {
            type: String,
        },
        'activity.projectId': {
            type: String,
        },
        'activity.stakeHolders': {
            type: Array,
            defaultValue: [],
        },
        'activity.stakeHolders.$': {
            type: String
        },
        'activity.responsiblePerson': {
            type: Object,
            defaultValue: Object,
        },
        'activity.completedAt': {
            type: Date,
        },
    }).validator(),
    run({ activity }) {
        return Activities.insert(activity);
    }
});




export const update = new ValidatedMethod({
    name: 'activities.update',
    mixins: [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to update activity'
    },
    validate: new SimpleSchema({
        'activity': {
            type: Object
        },
        'activity.owner': {
            type: String,
        },
        activityOwner: {
            type: String,
        },
        'activity.type': {
            type: String,
        },
        'activity.name': {
            type: String,
        },
        'activity.description': {
            type: String,
        },
        'activity.projectId': {
            type: String,
        },
        'activity.stakeHolders': {
            type: Array,
            defaultValue: [],
        },
        'activity.stakeHolders.$': {
            type: String
        },
        'activity.responsiblePerson': {
            type: Object,
            defaultValue: Object,
        },
        'activity.completedAt': {
            type: Date,
        },
    }).validator(),
    run({ activity }) {
        return Activities.update(_id, {$set: activity});
    }
});



export const remove = new ValidatedMethod({
    name: 'activities.remove',
    mixins : [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to remove activity'
    },
    validate: new SimpleSchema({
        'activity': {
            type: Object
        },
        'activity._id': {
            type: String
        }
    }).validator(),
    run({ activity }) {
        const {_id} = activity;
        return Activities.remove(_id);
    }
});

// Get list of all method names on Companies
const ACTIVITIES_METHODS = _.pluck([
    insert,
    update,
    remove
], 'name');

if (Meteor.isServer) {
    DDPRateLimiter.addRule({
        name(name) {
            return _.contains(ACTIVITIES_METHODS, name);
        },

        // Rate limit per connection ID
        connectionId() { return true; }
    }, 5, 1000);
}