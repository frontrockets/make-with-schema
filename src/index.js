const _ = require('lodash')

const makeWithSchema = (schema) => (entity, master = entity) => {
  const result = {}

  Object.keys(schema).forEach((schemaKey) => {
    const ref = schema[schemaKey]

    if (_.isPlainObject(ref)) {
      result[schemaKey] = makeWithSchema(ref)(_.get(entity, schemaKey), entity)
    } else if (_.isFunction(ref)) {
      try {
        result[schemaKey] = _.isEmpty(master) ? null : ref(master)
      } catch (err) {
        result[schemaKey] = null

        // We don't want siilently bypass the issue, so we notify developers about the error
        console.error(err) // eslint-disable-line
      }
    } else if (!ref) {
      const output = _.get(entity, schemaKey)
      result[schemaKey] = _.isNil(output) ? null : output
    } else {
      result[schemaKey] = _.get(master, ref)
    }
  })

  return result
}

module.exports = makeWithSchema
