# ifthenpay.js
ifthenpay unofficial javascript module

![mbifthenpay](https://cloud.githubusercontent.com/assets/3604053/20067844/96bc292e-a50e-11e6-8f88-df02451b3d84.png)

## What is this?

Portugal has a payment service called **Referências Multibanco**, which means
"multi bank references" in English.

**Multibanco** allows portuguese people to get way more from an ATM service.

Portuguese people can, over a Smartphone or an ATM:
* Pre-charge their phones
* Pay bills (electric, ISP and other contract bills)
* Pay for one-shot services
* Send money to others just by knowing their number
* Pay taxes
* much more, I can't remember all cases.

Those services are offered by a all-bank-shared company called SIBS.

For being able to generate **Referências Multibanco**, you must engage with your
bank's Account Manager and pay a Setup + Anual fee, but it is only worth if you
have a noticeable business flow going.

To bypass this scenario, some products emerged by allowing the small companies
to enter into the **Multibanco** scene with a pay-as-you-go business model as
you may find on Credit Cards.

IfThenPay is one of them. I've choosed to work with them because they've created
an algorithm to allow their customers to create their custom  **Multibanco**
references on the go.

Note: At them time, I have not any kind of engagement with **IfThenPay**, and
I'm the owner of this Software.


## Why should I use it?

* Does NOT require API connections for generating **Multibanco** references.
* IfThenPay connects to your server's endpoint (webhook) when a payment is made
* This project does not require any module on production
* It is Isomorphic/Universal, can run over both browser or server engines.
* Server-side webhook can work with node's http interface or server frameworks
such as express or restify.
* Has a test framework harassing hardly for bugs.
* Standalone compressed released is about 5KB!!!

## Installation

```bash
npm i --save ifthenpay
```

NOTE:
In case you're including this in a bundle, and need to cut down the server part
to decrease bundle's size, please include the browser implementation instead.

```js
var IfThenPay = require( 'ifthenpay/browser' )
```

## Usage


### Using a standalone release build

**HINT:** Check out newest releases [here](https://github.com/cusspvz/ifthenpay.js/releases)!

```html
<script type="text/javascript" src="/path/to/ifthenpay.min.js"></script>
<script type="text/javascript">

  window.onload = function () {
    var ifthenpay = IfThenPay({ /* ... */ })
  }

</script>
```

### JS ES-stage-0 a.k.a. ES-awesome

#### Generating multibanco's payment codes
```js
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

#### Connecting with a node http server
```js
import http from 'http'

const server = http.createServer().listen(80)
const preSharedKey = '99999999999999999999999999999'

const ifthenpay = new IfThenPay({
  entity: '99999'
  subentity: '999',
  webhook: {
    autosetup: true,
    server, preSharedKey,
    callback: async function ({ id, value }) {
      // Callback logic
    }
  }
})
```

#### Connecting with an express server
```js
import IfThenPay from 'ifthenpay'
import Express from 'express'

const server = Express().listen(80)
const preSharedKey = '99999999999999999999999999999'

const ifthenpay = new IfThenPay({
  entity: '99999'
  subentity: '999',
  webhook: {
    autosetup: true,
    server, preSharedKey,
    callback: async function ({ id, value }) {
      // Callback logic
    }
  }
})

```

#### Callback logic
Callback allows you to do something whenever IfThenPay warns your server about
a successful payment.

```js
const ifthenpay = new IfThenPay({
  entity: '99999'
  subentity: '999',
  webhook: {
    autosetup: true,
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
    autosetup: true,
    server: server, preSharedKey: preSharedKey,
    callback: function (context) {
      // Callback logic
    }
  }
})

```

#### Callback logic

```js
var ifthenpay = new IfThenPay({
  entity: '99999'
  subentity: '999',
  webhook: {
    autosetup: true,
    server: server, preSharedKey: preSharedKey,
    callback: function (context) {
      var id = context.id
      var value = context.value

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

#### `options.webhook.autosetup`
`Boolean | false`
Defines if webhook should auto mount the middleware handler on the server.
Needed for those who are using other routers, such as Restify.

#### `options.webhook.url`
`String | false`

URL to strict responses. If not defined, it will respond to all requests.

#### `options.webhook.server`
`http.Server / Express / Restify`

Will be used to set up a route handler

#### `options.webhook.preSharedKey`
`String .{1,50}`
Pre shared key provided to IfThen.

#### `options.webhook.callback`
`Function ( Object: { entity, subentity, id, reference, value, terminal, date } )`

NOTE: all parameters are mandatory, except for terminal and date.

Method for handling validation on your side, such database payments comparison.

Method will receive most needed variables, already parsed and validated.

The callback won't be called in case:
- There isn't a match between pre-shared keys
- Entity does not match
- Reference contains a different subentity
- Entity/Reference/Value has a bad Checksum

The callback should return a promise in case it contains async operations.
In case you wan't to delay the payment webhook for later, you must throw up an
error or a rejected promise.

## LICENSE - POL-v1

[Private-Open License v1](https://raw.githubusercontent.com/cusspvz/pol/master/POL-1.0.md)
