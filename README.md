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
    * [.map(f, speard, flowUndefined)](#ObjectStream.map) ⇒ [<code>ObjectStream</code>](#ObjectStream)
    * [.reduce(f, initResult)](#ObjectStream.reduce) ⇒ [<code>ObjectStream</code>](#ObjectStream)
    * [.filter(f)](#ObjectStream.filter) ⇒ [<code>ObjectStream</code>](#ObjectStream)
    * [.lineStreamFrom(fileName)](#ObjectStream.lineStreamFrom) ⇒ [<code>ObjectStream</code>](#ObjectStream)
    * [.tee(fileName, serizationFN)](#ObjectStream.tee) ⇒ [<code>ObjectStream</code>](#ObjectStream)
    * [.cond(conds)](#ObjectStream.cond) ⇒ [<code>ObjectStream</code>](#ObjectStream)
    * [.if(cond, then, elseFun)](#ObjectStream.if) ⇒ [<code>ObjectStream</code>](#ObjectStream)
    * [.from(upstream, where)](#ObjectStream.from) ⇒ [<code>ObjectStream</code>](#ObjectStream)

<a name="new_ObjectStream_new"></a>

### new ObjectStream()
Do **NOT** create instance with `new`.
  Just use static methodes `map`, `filter`,
  or `reduce`.

<a name="ObjectStream.map"></a>

### ObjectStream.map(f, speard, flowUndefined) ⇒ [<code>ObjectStream</code>](#ObjectStream)
Map a stream with function `f`.

**Kind**: static method of [<code>ObjectStream</code>](#ObjectStream)  

| Param | Type | Description |
| --- | --- | --- |
| f | <code>function</code> | f(data)=>data' |
| speard | <code>boolean</code> | Wheather to speard the result if it is a array.     The Default value is `false`. |
| flowUndefined | <code>boolean</code> | Wheather flow the `undefined` to downstream.     The default is **YES**. |

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

<a name="ObjectStream.lineStreamFrom"></a>

### ObjectStream.lineStreamFrom(fileName) ⇒ [<code>ObjectStream</code>](#ObjectStream)
Get a read stream, which read `fineName` file line by line.

  Note: The empty line will be ignore.

**Kind**: static method of [<code>ObjectStream</code>](#ObjectStream)  
**Deprecate**: Replace with
  `ObjectStream.from(fs.createReadStream(fileName),chuckToLineString)
  `  

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

