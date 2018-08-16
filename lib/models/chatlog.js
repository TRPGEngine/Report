const utils = require('../utils');

module.exports = utils.generateReportModels('report_chatlog', {
  count: {type: 'integer', required: true},
  start: {type: 'date', time: false},
  end: {type: 'date', time: false},
  createAt: {type: 'date', time: true},
}, {
  hooks: {
    beforeCreate: function(next) {
      if (!this.createAt) {
        this.createAt = new Date();
      }
      return next();
    }
  },
})
