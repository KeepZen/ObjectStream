## Classes

<dl>
<dt><a href="#ObjectStream">ObjectStream</a></dt>
<dd><p>Object Stream.</p>
<p>It is a transform stream, use to transform itemes of a stream to a
another form.</p>
<p>A stream like a array, they are all have items.
And we can <code>map</code>,<code>filter</code>, and <code>reduce</code> on a array,
and now with help of <code>ObjectStream</code>, we can do these on stream.</p>
<p>You can find the source at <a href="https://github.com/KeepZen/ObjectStream">GitHub</a>.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#getChuckToLinesHandler">getChuckToLinesHandler(code)</a> ⇒ <code>function</code></dt>
<dd><p>Get a function that can use to transform a chuck to Arrary of string.</p>
</dd>
</dl>

<a name="ObjectStream"></a>

## ObjectStream
Object Stream.

It is a transform stream, use to transform itemes of a stream to a
another form.

A stream like a array, they are all have items.
And we can `map`,`filter`, and `reduce` on a array,
and now with help of `ObjectStream`, we can do these on stream.

You can find the source at [GitHub](https://github.com/KeepZen/ObjectStream).

**Kind**: global class  

* [ObjectStream](#ObjectStream)
    * [new ObjectStream()](#new_ObjectStream_new)
    * _instance_
        * [.finish(f)](#ObjectStream+finish)
    * _static_
        * [.map(f, options)](#ObjectStream.map) ⇒ [<code>ObjectStream</code>](#ObjectStream)
        * [.reduce(f, initResult)](#ObjectStream.reduce) ⇒ [<code>ObjectStream</code>](#ObjectStream)
        * [.filter(f)](#ObjectStream.filter) ⇒ [<code>ObjectStream</code>](#ObjectStream)
        * [.filterOut(f)](#ObjectStream.filterOut) ⇒ [<code>ObjectStream</code>](#ObjectStream)
        * [.lineStreamFrom(fileName)](#ObjectStream.lineStreamFrom) ⇒ [<code>ObjectStream</code>](#ObjectStream)
        * [.tee(fileName, serizationFN)](#ObjectStream.tee) ⇒ [<code>ObjectStream</code>](#ObjectStream)
        * [.cond(conds)](#ObjectStream.cond) ⇒ [<code>ObjectStream</code>](#ObjectStream)
        * [.if(cond, then, elseFun)](#ObjectStream.if) ⇒ [<code>ObjectStream</code>](#ObjectStream)
        * [.from(upstream, where)](#ObjectStream.from) ⇒ [<code>ObjectStream</code>](#ObjectStream)
        * [.filterIn()](#ObjectStream.filterIn)

<a name="new_ObjectStream_new"></a>

### new ObjectStream()
Do **NOT** create instance with `new`.
  Just use static methodes `map`, `filter`,
  or `reduce`.

<a name="ObjectStream+finish"></a>

### objectStream.finish(f)
Add `finish` event handler for this stream.

**Kind**: instance method of [<code>ObjectStream</code>](#ObjectStream)  

| Param | Type | Description |
| --- | --- | --- |
| f | <code>function</code> | A function require no argument. |

<a name="ObjectStream.map"></a>

### ObjectStream.map(f, options) ⇒ [<code>ObjectStream</code>](#ObjectStream)
Map a stream with function `f`.

**Kind**: static method of [<code>ObjectStream</code>](#ObjectStream)  

| Param | Type | Description |
| --- | --- | --- |
| f | <code>function</code> | f(data)=>data' |
| options | <code>object</code> |  |
| options.speard | <code>boolean</code> | Wheather to speard the result if it is a array. The Default value is `false`. |
| options.flowUndefined | <code>boolean</code> | Wheather flow the `undefined` to downstream.     The default is **YES**. |

<a name="ObjectStream.reduce"></a>

### ObjectStream.reduce(f, initResult) ⇒ [<code>ObjectStream</code>](#ObjectStream)
Reduce a stream with function `f`.

  The return stream will read many time from upstream, but just write once to
  downstream.

**Kind**: static method of [<code>ObjectStream</code>](#ObjectStream)  

| Param | Type | Description |
| --- | --- | --- |
| f | <code>function</code> | (result,data)=>resultType; |
| initResult | <code>object</code> | The initination of result pass to reducer `f`. |

<a name="ObjectStream.filter"></a>

### ObjectStream.filter(f) ⇒ [<code>ObjectStream</code>](#ObjectStream)
Filter the stream.

  Iff the `f(obj) == true`,
  the `obj` will flow to downstream.

**Kind**: static method of [<code>ObjectStream</code>](#ObjectStream)  

| Param | Type | Description |
| --- | --- | --- |
| f | <code>function</code> | (obj)=>boolean . |

<a name="ObjectStream.filterOut"></a>

### ObjectStream.filterOut(f) ⇒ [<code>ObjectStream</code>](#ObjectStream)
Filter out itemes of the upstream.

**Kind**: static method of [<code>ObjectStream</code>](#ObjectStream)  

| Param | Type | Description |
| --- | --- | --- |
| f | <code>function</code> | If `f(data) == true`, the `data` will filter out from stream. |

<a name="ObjectStream.lineStreamFrom"></a>

### ObjectStream.lineStreamFrom(fileName) ⇒ [<code>ObjectStream</code>](#ObjectStream)
Get a read stream, which read `fineName` file line by line.

  Note: The empty line will be ignore.

**Kind**: static method of [<code>ObjectStream</code>](#ObjectStream)  
**Deprecate**: Replace with
  ```js
  ObjectStream.from(fs.createReadStream(fileName))
  .pipe(ObjectStream.map(chuckToStringArray,{speard:true}))
  ```  

| Param | Type | Description |
| --- | --- | --- |
| fileName | <code>string</code> | The file which will be read. |

<a name="ObjectStream.tee"></a>

### ObjectStream.tee(fileName, serizationFN) ⇒ [<code>ObjectStream</code>](#ObjectStream)
Like tee in bash.

  Read item form upstream, wirite the item to downstream and
  to a file named by `fileName`.

**Kind**: static method of [<code>ObjectStream</code>](#ObjectStream)  

| Param | Type | Description |
| --- | --- | --- |
| fileName | <code>string</code> | Which file write the items. |
| serizationFN | <code>function</code> | A funstion map the item to     a string or a buffer. The default is `JONS.stringify`. |

<a name="ObjectStream.cond"></a>

### ObjectStream.cond(conds) ⇒ [<code>ObjectStream</code>](#ObjectStream)
Process the items with condition.

  If the some condition can not be hanlder,
  it jest be ignored, and not to flow to downstream.

**Kind**: static method of [<code>ObjectStream</code>](#ObjectStream)  

| Param | Type | Description |
| --- | --- | --- |
| conds | <code>Array(object)</code> | The iteme of the array, is a object,   like `{pred,mapper}`, the `precd` is `function(object)=>boolean`,   and `mapper` is `function(object)=>annotherObject`. |

<a name="ObjectStream.if"></a>

### ObjectStream.if(cond, then, elseFun) ⇒ [<code>ObjectStream</code>](#ObjectStream)
If-then-else clause in stream.

**Kind**: static method of [<code>ObjectStream</code>](#ObjectStream)  

| Param | Type | Description |
| --- | --- | --- |
| cond | <code>function</code> | function(obj)=>boolean. |
| then | <code>function</code> | function(obj)=>anotherObj.     The condition is satisfied, the function will be called. |
| elseFun | <code>function</code> | function(obj)=>anotherObje.     The condition is not satisfied this function will be called.     This is option. If there is not `elseFn`, the item which don't satisfy     the condtion, will be ignored. |

<a name="ObjectStream.from"></a>

### ObjectStream.from(upstream, where) ⇒ [<code>ObjectStream</code>](#ObjectStream)
Create a new stream from a upstream.

**Kind**: static method of [<code>ObjectStream</code>](#ObjectStream)  

| Param | Type | Description |
| --- | --- | --- |
| upstream | <code>readStream</code> |  |
| where | <code>function</code> | A Function return boolean. Default is function always return true. |

<a name="ObjectStream.filterIn"></a>

### ObjectStream.filterIn()
Alias of [filter](#ObjectStream.filter)

**Kind**: static method of [<code>ObjectStream</code>](#ObjectStream)  
<a name="getChuckToLinesHandler"></a>

## getChuckToLinesHandler(code) ⇒ <code>function</code>
Get a function that can use to transform a chuck to Arrary of string.

**Kind**: global function  
**Returns**: <code>function</code> - - f(bufferORString)=>Array(string)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| code | <code>string</code> | <code>&quot;utf8&quot;</code> | The encode of the chuck. Default is 'uft8'. |

