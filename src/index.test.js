import { makeWithSchema } from './'

describe('with basic schema', () => {
  const schema = {
    first: null,
    second: null,
    'weird.nesting': null,
    normal: {
      first: null,
      second: null,
    },
  }

  it('returns all necessary fields according to schema with nulls by default', () => {
    const withSchema = makeWithSchema(schema)

    expect(withSchema()).toEqual(schema)
  })

  it('ignores additional fields', () => {
    const withSchema = makeWithSchema(schema)
    const input = {
      new: 'First',
      'weird.second': 'Weird Nesting',
      normal: {
        new: true,
      },
    }

    expect(withSchema(input)).toEqual(schema)
  })

  it('mixes values with nulls', () => {
    const withSchema = makeWithSchema(schema)
    const input = {
      first: 'First',
      'weird.nesting': 'Weird Nesting',
      normal: {
        first: 'Normal First',
      },
    }

    expect(withSchema(input)).toEqual({
      ...schema,
      ...input,
      normal: {
        ...schema.normal,
        ...input.normal,
      },
    })
  })

  it('allows negative values to be returned', () => {
    const withSchema = makeWithSchema(schema)
    const input = {
      first: 0,
      second: false,
      'weird.nesting': undefined,
    }

    expect(withSchema(input)).toEqual({
      ...schema,
      first: 0,
      second: false,
      'weird.nesting': null,
    })
  })
})

describe('with pointing to other path', () => {
  const schema = {
    first: 'a',
    second: 'b',
    normal: {
      first: 'c',
      second: 'd.a',
    },
  }

  it('returns all necessary fields with values according to passed paths', () => {
    const withSchema = makeWithSchema(schema)
    const input = {
      a: 'First',
      b: 'Second',
      c: 'Will be nested First',
      d: { a: 'Nested Second' },
    }

    expect(withSchema(input)).toEqual({
      first: 'First',
      second: 'Second',
      normal: {
        first: 'Will be nested First',
        second: 'Nested Second',
      },
    })
  })
})

describe('with computed values', () => {
  it('returns all necessary fields with values according to passed paths', () => {
    const schema = {
      first: (full) => `computed: ${full.first}`,
      normal: {
        second: (full) => `computed: ${full.normal.second}`,
      },
    }

    const withSchema = makeWithSchema(schema)
    const input = {
      first: 'First',
      normal: { second: 'Second' },
    }

    expect(withSchema(input)).toEqual({
      first: 'computed: First',
      normal: {
        second: 'computed: Second',
      },
    })
  })

  it('returns null if computed value applies to an empty object', () => {
    const schema = {
      first: (full) => `computed: ${full.first}`,
      normal: {
        second: (full) => `computed: ${full.normal.second}`,
      },
    }

    const withSchema = makeWithSchema(schema)
    const input = {}

    expect(withSchema(input)).toEqual({
      first: null,
      normal: {
        second: null,
      },
    })
  })

  describe('when computed value fails', () => {
    /* eslint-disable no-console */

    beforeEach(() => {
      console.error.mockImplementationOnce(() => null)
    })

    const input = {
      dontTouchThisFieldInComputedValue: false,
    }

    it('returns null if computed value fails', () => {
      const schema = {
        something: (full) => full.nothing.nothing,
      }
      const withSchema = makeWithSchema(schema)

      expect(withSchema(input)).toEqual({
        something: null,
      })
    })

    it('notifies developers if computed value fails', () => {
      const error = new Error('Hello')
      const schema = {
        something: () => {
          throw error
        },
      }
      const withSchema = makeWithSchema(schema)

      withSchema(input)

      expect(console.error).toHaveBeenCalledWith(error)
    })

    /* eslint-enable */
  })
})
