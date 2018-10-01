<a name="module_@keepzen/object-stream"></a>

## @keepzen/object-stream
You can find the source at [GitHub](https://github.com/KeepZen/ObjectStream).

Now do not need to write the tedious of `.pipe(ObjectStream.someMethod(f))`s.
`map(f)`, `reduce(f)` and other methods have piped this stream into the new one.


* [@keepzen/object-stream](#module_@keepzen/object-stream)
    * [~ObjectStream](#module_@keepzen/object-stream..ObjectStream)
        * [new ObjectStream()](#new_module_@keepzen/object-stream..ObjectStream_new)
        * _instance_
            * [.transform](#module_@keepzen/object-stream..ObjectStream+transform) ⇒ <code>ObjectStream</code>
            * [.filterIn](#module_@keepzen/object-stream..ObjectStream+filterIn) ⇒ <code>ObjectStream</code>
            * [.source()](#module_@keepzen/object-stream..ObjectStream+source) ⇒ <code>ReadableStream</code> \| <code>ObjectStream</code>
            * [.finish(f)](#module_@keepzen/object-stream..ObjectStream+finish)
            * [.map(f, options)](#module_@keepzen/object-stream..ObjectStream+map) ⇒ <code>ObjectStream</code>
            * [.reduce(f, initResult)](#module_@keepzen/object-stream..ObjectStream+reduce) ⇒ <code>ObjectStream</code>
            * [.cond(conds)](#module_@keepzen/object-stream..ObjectStream+cond) ⇒ <code>ObjectStream</code>
            * [.filter(f)](#module_@keepzen/object-stream..ObjectStream+filter) ⇒ <code>ObjectStream</code>
            * [.filterOut(f)](#module_@keepzen/object-stream..ObjectStream+filterOut) ⇒ <code>ObjectStream</code>
            * [.if(cond, then, elseFun)](#module_@keepzen/object-stream..ObjectStream+if) ⇒ <code>ObjectStream</code>
            * [.observer(f)](#module_@keepzen/object-stream..ObjectStream+observer) ⇒ <code>ObjectStream</code>
        * _static_
            * [.create()](#module_@keepzen/object-stream..ObjectStream.create) ⇒ <code>ObjectStream</code>
            * [.from(upstream, where)](#module_@keepzen/object-stream..ObjectStream.from) ⇒ <code>ObjectStream</code>
    * [~getChuckToLinesHandler(code)](#module_@keepzen/object-stream..getChuckToLinesHandler) ⇒ <code>function</code>

<a name="module_@keepzen/object-stream..ObjectStream"></a>

### @keepzen/object-stream~ObjectStream
ObjectStream.

It is a transform stream, use to transform items of upstream to a
another form.

A stream like a array, they are all have items.
We can `map`, `filter`, and `reduce` on an array,
and now with help of `ObjectStream`, we can do these on stream.

**Kind**: inner class of [<code>@keepzen/object-stream</code>](#module_@keepzen/object-stream)  

* [~ObjectStream](#module_@keepzen/object-stream..ObjectStream)
    * [new ObjectStream()](#new_module_@keepzen/object-stream..ObjectStream_new)
    * _instance_
        * [.transform](#module_@keepzen/object-stream..ObjectStream+transform) ⇒ <code>ObjectStream</code>
        * [.filterIn](#module_@keepzen/object-stream..ObjectStream+filterIn) ⇒ <code>ObjectStream</code>
        * [.source()](#module_@keepzen/object-stream..ObjectStream+source) ⇒ <code>ReadableStream</code> \| <code>ObjectStream</code>
        * [.finish(f)](#module_@keepzen/object-stream..ObjectStream+finish)
        * [.map(f, options)](#module_@keepzen/object-stream..ObjectStream+map) ⇒ <code>ObjectStream</code>
        * [.reduce(f, initResult)](#module_@keepzen/object-stream..ObjectStream+reduce) ⇒ <code>ObjectStream</code>
        * [.cond(conds)](#module_@keepzen/object-stream..ObjectStream+cond) ⇒ <code>ObjectStream</code>
        * [.filter(f)](#module_@keepzen/object-stream..ObjectStream+filter) ⇒ <code>ObjectStream</code>
        * [.filterOut(f)](#module_@keepzen/object-stream..ObjectStream+filterOut) ⇒ <code>ObjectStream</code>
        * [.if(cond, then, elseFun)](#module_@keepzen/object-stream..ObjectStream+if) ⇒ <code>ObjectStream</code>
        * [.observer(f)](#module_@keepzen/object-stream..ObjectStream+observer) ⇒ <code>ObjectStream</code>
    * _static_
        * [.create()](#module_@keepzen/object-stream..ObjectStream.create) ⇒ <code>ObjectStream</code>
        * [.from(upstream, where)](#module_@keepzen/object-stream..ObjectStream.from) ⇒ <code>ObjectStream</code>

<a name="new_module_@keepzen/object-stream..ObjectStream_new"></a>

#### new ObjectStream()
Do **NOT** create instance with `new`.

  Just use static methods to get instance.

<a name="module_@keepzen/object-stream..ObjectStream+transform"></a>

#### objectStream.transform ⇒ <code>ObjectStream</code>
Alias of [map](#module_@keepzen/object-stream..ObjectStream+map) method.

**Kind**: instance property of [<code>ObjectStream</code>](#module_@keepzen/object-stream..ObjectStream)  

| Param | Type |
| --- | --- |
| f | <code>functtion</code> | 

<a name="module_@keepzen/object-stream..ObjectStream+filterIn"></a>

#### objectStream.filterIn ⇒ <code>ObjectStream</code>
Alias of[filter](#module_@keepzen/object-stream..ObjectStream+filter)
    method.

**Kind**: instance property of [<code>ObjectStream</code>](#module_@keepzen/object-stream..ObjectStream)  

| Param | Type |
| --- | --- |
| f, | <code>function</code> | 

<a name="module_@keepzen/object-stream..ObjectStream+source"></a>

#### objectStream.source() ⇒ <code>ReadableStream</code> \| <code>ObjectStream</code>
Get the source of this stream.

**Kind**: instance method of [<code>ObjectStream</code>](#module_@keepzen/object-stream..ObjectStream)  
<a name="module_@keepzen/object-stream..ObjectStream+finish"></a>

#### objectStream.finish(f)
Add `finish` event handler for this stream.

**Kind**: instance method of [<code>ObjectStream</code>](#module_@keepzen/object-stream..ObjectStream)  

| Param | Type | Description |
| --- | --- | --- |
| f | <code>function</code> | A function require no argument. |

<a name="module_@keepzen/object-stream..ObjectStream+map"></a>

#### objectStream.map(f, options) ⇒ <code>ObjectStream</code>
Transform upstream with function `f`.

**Kind**: instance method of [<code>ObjectStream</code>](#module_@keepzen/object-stream..ObjectStream)  

| Param | Type | Description |
| --- | --- | --- |
| f | <code>function</code> | `f(data)=>anotherFormOfData` |
| options | <code>object</code> |  |
| options.spread | <code>boolean</code> | Whether to spread the result if it is a array. The Default value is `false`. |
| options.filterOutUndefined | <code>boolean</code> | Whether filter out the     `undefined` from upstream.     The default is `false`. |

<a name="module_@keepzen/object-stream..ObjectStream+reduce"></a>

#### objectStream.reduce(f, initResult) ⇒ <code>ObjectStream</code>
Reduce the upstream with function `f`.

  The return stream will read many time from upstream, but just write once to
  downstream.

**Kind**: instance method of [<code>ObjectStream</code>](#module_@keepzen/object-stream..ObjectStream)  

| Param | Type | Description |
| --- | --- | --- |
| f | <code>function</code> | `(result,data)=>resultType`; |
| initResult | <code>object</code> | The initialization result pass to reducer `f`. |

<a name="module_@keepzen/object-stream..ObjectStream+cond"></a>

#### objectStream.cond(conds) ⇒ <code>ObjectStream</code>
Process the items with conditions.

  If there are some conditions can not be handle,
  they are jest ignored, and not to flow to downstream.

**Kind**: instance method of [<code>ObjectStream</code>](#module_@keepzen/object-stream..ObjectStream)  

| Param | Type | Description |
| --- | --- | --- |
| conds | <code>Array(object)</code> | The item of the array, is a object,   like `{pred,mapper}`, the `precd` is `function(object)=>boolean`,   and `mapper` is `function(object)=>annotherObject`. |

<a name="module_@keepzen/object-stream..ObjectStream+filter"></a>

#### objectStream.filter(f) ⇒ <code>ObjectStream</code>
Filter the stream.

  Iff the `f(obj) == true`,
  the `obj` will flow to downstream.

**Kind**: instance method of [<code>ObjectStream</code>](#module_@keepzen/object-stream..ObjectStream)  

| Param | Type | Description |
| --- | --- | --- |
| f | <code>function</code> | (obj)=>boolean . |

<a name="module_@keepzen/object-stream..ObjectStream+filterOut"></a>

#### objectStream.filterOut(f) ⇒ <code>ObjectStream</code>
Filter out items from upstream.

**Kind**: instance method of [<code>ObjectStream</code>](#module_@keepzen/object-stream..ObjectStream)  

| Param | Type | Description |
| --- | --- | --- |
| f | <code>function</code> | If `f(data) == true`, the `data` will filter out from upstream. |

<a name="module_@keepzen/object-stream..ObjectStream+if"></a>

#### objectStream.if(cond, then, elseFun) ⇒ <code>ObjectStream</code>
If-then-else clause in stream.

**Kind**: instance method of [<code>ObjectStream</code>](#module_@keepzen/object-stream..ObjectStream)  

| Param | Type | Description |
| --- | --- | --- |
| cond | <code>function</code> | `function(obj)=>boolean`. |
| then | <code>function</code> | `function(obj)=>anotherObj`.     The condition is satisfied, the function will be called. |
| elseFun | <code>function</code> | `function(obj)=>anotherObje`.     The condition is not satisfied this function will be called.     This is option. If there is not `elseFn`, the item which don't satisfy     the condition, will be ignored. |

<a name="module_@keepzen/object-stream..ObjectStream+observer"></a>

#### objectStream.observer(f) ⇒ <code>ObjectStream</code>
Just observe the stream items with function `f`, not change them.

**Kind**: instance method of [<code>ObjectStream</code>](#module_@keepzen/object-stream..ObjectStream)  

| Param | Type | Description |
| --- | --- | --- |
| f | <code>function</code> | The function use to observer stream item. |

<a name="module_@keepzen/object-stream..ObjectStream.create"></a>

#### ObjectStream.create() ⇒ <code>ObjectStream</code>
Create a ObjectStream instance.

  You can use `.map(f)`, `.filter(f)` or other methods to get a new stream object,
  but the function `f`  will never be called, until some data be write to this
  stream or one readable stream pipe to this object.

**Kind**: static method of [<code>ObjectStream</code>](#module_@keepzen/object-stream..ObjectStream)  
**Returns**: <code>ObjectStream</code> - .  
<a name="module_@keepzen/object-stream..ObjectStream.from"></a>

#### ObjectStream.from(upstream, where) ⇒ <code>ObjectStream</code>
Create a new stream from a upstream.

**Kind**: static method of [<code>ObjectStream</code>](#module_@keepzen/object-stream..ObjectStream)  

| Param | Type | Description |
| --- | --- | --- |
| upstream | <code>ReadableStream</code> |  |
| where | <code>function</code> | A Function return boolean. Default is function always return true. |

<a name="module_@keepzen/object-stream..getChuckToLinesHandler"></a>

### @keepzen/object-stream~getChuckToLinesHandler(code) ⇒ <code>function</code>
Get a function that can use to transform a chuck to Array of string.

**Kind**: inner method of [<code>@keepzen/object-stream</code>](#module_@keepzen/object-stream)  
**Returns**: <code>function</code> - - f(bufferOrString)=>Array(string)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| code | <code>string</code> | <code>&quot;utf8&quot;</code> | The encode of the chuck. Default is 'uft8'. |

