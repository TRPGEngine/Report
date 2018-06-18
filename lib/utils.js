exports.generateReportModels = function generateReportModels(name, struct, options) {
  return {
    daily(orm, db) {
      return db.define(name + '_daily', struct, options);
    },
    weekly(orm, db) {
      return db.define(name + '_weekly', struct, options);
    },
    monthly(orm, db) {
      return db.define(name + '_monthly', struct, options);
    }
  }
}
