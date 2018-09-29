<a name="module_@keepzen/object-stream"></a>

## @keepzen/object-stream
You can find the source at [GitHub](https://github.com/KeepZen/ObjectStream) .


* [@keepzen/object-stream](#module_@keepzen/object-stream)
    * [~ObjectStream](#module_@keepzen/object-stream..ObjectStream)
        * [new ObjectStream()](#new_module_@keepzen/object-stream..ObjectStream_new)
        * _instance_
            * [.finish(f)](#module_@keepzen/object-stream..ObjectStream+finish)
        * _static_
            * [.filterIn](#module_@keepzen/object-stream..ObjectStream.filterIn)
            * [.transform](#module_@keepzen/object-stream..ObjectStream.transform)
            * [.map(f, options)](#module_@keepzen/object-stream..ObjectStream.map) ⇒ <code>ObjectStream</code>
            * [.reduce(f, initResult)](#module_@keepzen/object-stream..ObjectStream.reduce) ⇒ <code>ObjectStream</code>
            * [.cond(conds)](#module_@keepzen/object-stream..ObjectStream.cond) ⇒ <code>ObjectStream</code>
            * [.filter(f)](#module_@keepzen/object-stream..ObjectStream.filter) ⇒ <code>ObjectStream</code>
            * [.filterOut(f)](#module_@keepzen/object-stream..ObjectStream.filterOut) ⇒ <code>ObjectStream</code>
            * [.tee(fileName, serializationFn)](#module_@keepzen/object-stream..ObjectStream.tee) ⇒ <code>ObjectStream</code>
            * [.if(cond, then, elseFun)](#module_@keepzen/object-stream..ObjectStream.if) ⇒ <code>ObjectStream</code>
            * [.from(upstream, where)](#module_@keepzen/object-stream..ObjectStream.from) ⇒ <code>ObjectStream</code>
            * ~~[.lineStreamFrom()](#module_@keepzen/object-stream..ObjectStream.lineStreamFrom)~~
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
        * [.finish(f)](#module_@keepzen/object-stream..ObjectStream+finish)
    * _static_
        * [.filterIn](#module_@keepzen/object-stream..ObjectStream.filterIn)
        * [.transform](#module_@keepzen/object-stream..ObjectStream.transform)
        * [.map(f, options)](#module_@keepzen/object-stream..ObjectStream.map) ⇒ <code>ObjectStream</code>
        * [.reduce(f, initResult)](#module_@keepzen/object-stream..ObjectStream.reduce) ⇒ <code>ObjectStream</code>
        * [.cond(conds)](#module_@keepzen/object-stream..ObjectStream.cond) ⇒ <code>ObjectStream</code>
        * [.filter(f)](#module_@keepzen/object-stream..ObjectStream.filter) ⇒ <code>ObjectStream</code>
        * [.filterOut(f)](#module_@keepzen/object-stream..ObjectStream.filterOut) ⇒ <code>ObjectStream</code>
        * [.tee(fileName, serializationFn)](#module_@keepzen/object-stream..ObjectStream.tee) ⇒ <code>ObjectStream</code>
        * [.if(cond, then, elseFun)](#module_@keepzen/object-stream..ObjectStream.if) ⇒ <code>ObjectStream</code>
        * [.from(upstream, where)](#module_@keepzen/object-stream..ObjectStream.from) ⇒ <code>ObjectStream</code>
        * ~~[.lineStreamFrom()](#module_@keepzen/object-stream..ObjectStream.lineStreamFrom)~~

<a name="new_module_@keepzen/object-stream..ObjectStream_new"></a>

#### new ObjectStream()
Do **NOT** create instance with `new`.

  Just use static methods to get instance.

<a name="module_@keepzen/object-stream..ObjectStream+finish"></a>

#### objectStream.finish(f)
Add `finish` event handler for this stream.

**Kind**: instance method of [<code>ObjectStream</code>](#module_@keepzen/object-stream..ObjectStream)  

| Param | Type | Description |
| --- | --- | --- |
| f | <code>function</code> | A function require no argument. |

<a name="module_@keepzen/object-stream..ObjectStream.filterIn"></a>

#### ObjectStream.filterIn
Alias of [filter](#module_@keepzen/object-stream..ObjectStream.filter).

**Kind**: static property of [<code>ObjectStream</code>](#module_@keepzen/object-stream..ObjectStream)  
<a name="module_@keepzen/object-stream..ObjectStream.transform"></a>

#### ObjectStream.transform
Alias of [map](#moddule_@keepzen/object-stream..ObjectStream.map).

**Kind**: static property of [<code>ObjectStream</code>](#module_@keepzen/object-stream..ObjectStream)  
<a name="module_@keepzen/object-stream..ObjectStream.map"></a>

#### ObjectStream.map(f, options) ⇒ <code>ObjectStream</code>
Transform upstream with function `f`.

**Kind**: static method of [<code>ObjectStream</code>](#module_@keepzen/object-stream..ObjectStream)  

| Param | Type | Description |
| --- | --- | --- |
| f | <code>function</code> | `f(data)=>anotherFormOfData` |
| options | <code>object</code> |  |
| options.speard | <code>boolean</code> | Wheather to speard the result if it is a array. The Default value is `false`. |
| options.filterOutUndefined | <code>boolean</code> | Wheather filter out the     `undefined` from upstream.     The default is `false`. |

<a name="module_@keepzen/object-stream..ObjectStream.reduce"></a>

#### ObjectStream.reduce(f, initResult) ⇒ <code>ObjectStream</code>
Reduce the upstream with function `f`.

  The return stream will read many time from upstream, but just write once to
  downstream.

**Kind**: static method of [<code>ObjectStream</code>](#module_@keepzen/object-stream..ObjectStream)  

| Param | Type | Description |
| --- | --- | --- |
| f | <code>function</code> | `(result,data)=>resultType`; |
| initResult | <code>object</code> | The initialization result pass to reducer `f`. |

<a name="module_@keepzen/object-stream..ObjectStream.cond"></a>

#### ObjectStream.cond(conds) ⇒ <code>ObjectStream</code>
Process the items with conditions.

  If there are some conditions can not be handle,
  they are jest ignored, and not to flow to downstream.

**Kind**: static method of [<code>ObjectStream</code>](#module_@keepzen/object-stream..ObjectStream)  

| Param | Type | Description |
| --- | --- | --- |
| conds | <code>Array(object)</code> | The item of the array, is a object,   like `{pred,mapper}`, the `precd` is `function(object)=>boolean`,   and `mapper` is `function(object)=>annotherObject`. |

<a name="module_@keepzen/object-stream..ObjectStream.filter"></a>

#### ObjectStream.filter(f) ⇒ <code>ObjectStream</code>
Filter the stream.

  Iff the `f(obj) == true`,
  the `obj` will flow to downstream.

**Kind**: static method of [<code>ObjectStream</code>](#module_@keepzen/object-stream..ObjectStream)  

| Param | Type | Description |
| --- | --- | --- |
| f | <code>function</code> | (obj)=>boolean . |

<a name="module_@keepzen/object-stream..ObjectStream.filterOut"></a>

#### ObjectStream.filterOut(f) ⇒ <code>ObjectStream</code>
Filter out items from upstream.

**Kind**: static method of [<code>ObjectStream</code>](#module_@keepzen/object-stream..ObjectStream)  

| Param | Type | Description |
| --- | --- | --- |
| f | <code>function</code> | If `f(data) == true`, the `data` will filter out from upstream. |

<a name="module_@keepzen/object-stream..ObjectStream.tee"></a>

#### ObjectStream.tee(fileName, serializationFn) ⇒ <code>ObjectStream</code>
Like tee in shell.

  Read items form upstream, wirit the items to downstream and
  to a file named by `fileName`.

**Kind**: static method of [<code>ObjectStream</code>](#module_@keepzen/object-stream..ObjectStream)  

| Param | Type | Description |
| --- | --- | --- |
| fileName | <code>string</code> | Which file record the items. |
| serializationFn | <code>function</code> | A function map the item to   a string or a buffer. The default is `JONS.stringify`. |

<a name="module_@keepzen/object-stream..ObjectStream.if"></a>

#### ObjectStream.if(cond, then, elseFun) ⇒ <code>ObjectStream</code>
If-then-else clause in stream.

**Kind**: static method of [<code>ObjectStream</code>](#module_@keepzen/object-stream..ObjectStream)  

| Param | Type | Description |
| --- | --- | --- |
| cond | <code>function</code> | `function(obj)=>boolean`. |
| then | <code>function</code> | `function(obj)=>anotherObj`.     The condition is satisfied, the function will be called. |
| elseFun | <code>function</code> | `function(obj)=>anotherObje`.     The condition is not satisfied this function will be called.     This is option. If there is not `elseFn`, the item which don't satisfy     the condition, will be ignored. |

<a name="module_@keepzen/object-stream..ObjectStream.from"></a>

#### ObjectStream.from(upstream, where) ⇒ <code>ObjectStream</code>
Create a new stream from a upstream.

**Kind**: static method of [<code>ObjectStream</code>](#module_@keepzen/object-stream..ObjectStream)  

| Param | Type | Description |
| --- | --- | --- |
| upstream | <code>readStream</code> |  |
| where | <code>function</code> | A Function return boolean. Default is function always return true. |

<a name="module_@keepzen/object-stream..ObjectStream.lineStreamFrom"></a>

#### ~~ObjectStream.lineStreamFrom()~~
***Deprecated***

Replace with
  ```js
  ObjectStream.from(fs.createReadStream(fileName))
    .pipe(ObjectStream.map(getChuckToLinesHandler(),{speard:true}))
  ```

**Kind**: static method of [<code>ObjectStream</code>](#module_@keepzen/object-stream..ObjectStream)  
<a name="module_@keepzen/object-stream..getChuckToLinesHandler"></a>

### @keepzen/object-stream~getChuckToLinesHandler(code) ⇒ <code>function</code>
Get a function that can use to transform a chuck to Array of string.

**Kind**: inner method of [<code>@keepzen/object-stream</code>](#module_@keepzen/object-stream)  
**Returns**: <code>function</code> - - f(bufferOrString)=>Array(string)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| code | <code>string</code> | <code>&quot;utf8&quot;</code> | The encode of the chuck. Default is 'uft8'. |

