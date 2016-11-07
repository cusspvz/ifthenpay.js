# ifthenpay
ifthenpay unofficial javascript module

## Installation

```
npm i --save ifthenpay
```

## Usage

### JS ES6/ES7/ES2015/ES2016 a.k.a. ES-awesome

#### Generating multibanco's payment codes
```es6
import IfThenPay from 'ifthenpay'

const ifthenpay = new IfThenPay({
  entity: '99999'
  subentity: '999'
})

// Generate a multibanco payment codes
console.log( ifthenpay.generate( 55.34 ) )
/*> Object {
  "entity": "99999",
  "reference": "999000014",
  "value": 55.34
} */
```

#### Connecting with an express server
```es6
import IfThenPay from 'ifthenpay'
import Express from 'express'

const server = Express().listen(80)
const preSharedKey = '99999999999999999999999999999'

const ifthenpay = new IfThenPay({
  entity: '99999'
  subentity: '999',
  webhook: {
    server, preSharedKey,
    callback: async function ({ id, value }) {
      // fetch from database
      const payment = await database.fetch( id )

      if ( payment.value !== value ) {
        throw new Error( "Payment's value is different from the received value!?" )
        // Warn dev team?
      }

      if ( payment.completed ) {
        throw new Error( "Payment was already completed" )
        // Warn dev team?
      }

      // Just because everything went fine, lets save
      await payment.set( 'completed', true ).save()

      // We don't need to return nothing fancy, if callback runs without errors
      // this module will assume everything is fine and will respond with a 200
      // http status to the IfThenPay webhook request.
    }
  }
})

```

### JS ES5 / CommonJS


#### Generating multibanco's payment codes
```js
var IfThenPay = require( 'ifthenpay' )

var ifthenpay = new IfThenPay({
  entity: '99999'
  subentity: '999'
})

// Generate a multibanco payment codes
console.log( ifthenpay.generate( 55.34 ) )
/*> Object {
  "entity": "99999",
  "reference": "999000014",
  "value": 55.34
} */
```

#### Connecting with an express server
```js
var IfThenPay = require( 'ifthenpay' )
var Express = require( 'express' )

var server = Express().listen(80)
var preSharedKey = '99999999999999999999999999999'

var ifthenpay = new IfThenPay({
  entity: '99999'
  subentity: '999',
  webhook: {
    server: server, preSharedKey: preSharedKey,
    callback: function ({ id, value }) {
      return Promise.try(function () {
        // fetch from database
        return database.fetch( id )
      })
      .then(function ( payment ) {
        if ( payment.value !== value ) {
          throw new Error( "Payment's value is different from the received value!?" )
          // Warn dev team?
        }

        if ( payment.completed ) {
          throw new Error( "Payment was already completed" )
          // Warn dev team?
        }

        return payment.set( 'completed', true ).save()
      })

      // We don't need to return nothing fancy, if callback runs without errors
      // this module will assume everything is fine and will respond with a 200
      // http status to the IfThenPay webhook request.
    }
  }
})

```

## API

### `IfThenPay`

#### `options.entity`
`Number [0-9]{5}`
Option provided by IfThen.

#### `options.subentity`
`Number [0-9]{1,3}`
Option provided by IfThen.

#### `options.webhook`
`Object | false`
Object with options for webhook handling.

#### `options.webhook.server`
`Express/Rest`

Will be used to set up a route handler

#### `options.webhook.preSharedKey`
`String .{1,50}`
Pre shared key provided to IfThen.

#### `options.webhook.callback`
`Function ( Object: { entity, subentity, id, reference, value } )`

Method for handling validation on your side, such database payments comparison.

Method will receive most needed variables, already parsed and validated.

The callback won't be called in case:
- There isn't a match between pre-shared keys;
- Entity does not match
- Reference contains a different subentity
- Entity/Reference/Value has a bad Checksum

The callback should return a promise in case it contains async operations.
In case you wan't to delay the payment webhook for later, you must throw up an
error or a rejected promise.

## LICENSE - POL-v1

[Private-Open License v1](https://raw.githubusercontent.com/cusspvz/pol/master/POL-1.0.md)
