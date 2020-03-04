'use strict';

module.exports = function(Server) {
  Server.beforeRemote('create', function(context, user, next) {
    context.args.data.dateCreated = Date.now();
    context.args.data.dateUpdated = Date.now();
    next();
  });
  Server.beforeRemote('update', function(context, user, next) {
    context.args.data.dateUpdated = Date.now();
    next();
  });
};
