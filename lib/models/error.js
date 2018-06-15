module.exports = function ReportError(orm, db) {
  let ReportError = db.define('report_error', {
    ip: {type: 'text', required: true},
    ua: {type: 'object'},
    message: {type: 'text', required: true},
    stack: {type: 'text', required: true, size: 1000},
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
    methods: {

    }
  });

  return ReportError;
}
