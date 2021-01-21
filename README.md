_This is part of @datarockets infrastructure_

## Install

```
npm install frontrockets/make-with-schema
```

## Usage

```jsx
import makeWithSchema from "@frontrockets/make-with-schema"


# Schema define the shape of result
  const schema = {
    a: null,
    b: null,
  }

  const withSchema = makeWithSchema(schema)

  const input = null

  const result = withSchema(input)

  Result:
  {
    a: null,
    b: null,
  }


# It ignores additional fields
  const schema = {
    a: null,
    b: null,
  }

  const withSchema = makeWithSchema(schema)

  const result withSchema({
    a: 123,
    b: null,
    new: 'Some new field',
  })

  Result:
  {
    a: 123,
    b: null,
  }


# It supports nesting
  const schema = {
    a: null,
    b: null,
    c: {
      first: null,
      second: null,
    },
    'd.e': null,
  }

  const withSchema = makeWithSchema(schema)

  const result withSchema({
    a: 123,
    b: null,
    c: {
      second: 123,
      new: 123,
    }
    'd.e': null,
  })

  Result:
  {
    a: 123,
    b: null,
    c: {
      first: null,
      second: 123,
    }
  }

# We can easily change the name of property to more  correct
  const schema = {
    c: 'awful_Variable_Name'
  }

  const withSchema = makeWithSchema(schema)

  const result withSchema({
    awful_Variable_Name: 123,
  })

  Result:
  {
    c: 123,
  }

# It supports negative values
  const schema = {
    a: null,
    b: null,
    c: null,
  }

  const withSchema = makeWithSchema(schema)

  const result withSchema({
    a: 0,
    b: false,
    c: undefined,
  })

  Result:
  {
    a: 0,
    b: false,
    c: null,
  }
```
