<a name="ObjectStream"></a>

## ObjectStream
Object Stream.

It is a transform stream. Transform a stream item to a another form.

A stream like a array, they are all have items.
We can `map`,`filter`, and `reduce` on a array,
and now with help of `ObjectStream`, we can do these on stream.

**Kind**: global class  

* [ObjectStream](#ObjectStream)
    * [new ObjectStream()](#new_ObjectStream_new)
    * [.lineStreamFrom(fileName)](#ObjectStream.lineStreamFrom) ⇒ [<code>ObjectStream</code>](#ObjectStream)
    * [.map(f)](#ObjectStream.map) ⇒ [<code>ObjectStream</code>](#ObjectStream)
    * [.reduce(f, initResult)](#ObjectStream.reduce) ⇒ [<code>ObjectStream</code>](#ObjectStream)
    * [.filter(f)](#ObjectStream.filter) ⇒ [<code>ObjectStream</code>](#ObjectStream)
    * [.tee(fileName, serizationFN)](#ObjectStream.tee) ⇒ [<code>ObjectStream</code>](#ObjectStream)

<a name="new_ObjectStream_new"></a>

### new ObjectStream()
Do **NOT** create  instance with `new`. Just use static method `map`, `filter`,
  or `reduce`.

<a name="ObjectStream.lineStreamFrom"></a>

### ObjectStream.lineStreamFrom(fileName) ⇒ [<code>ObjectStream</code>](#ObjectStream)
Get a read stream, which read `fineName` file line by line.

  Note: The empty line will be ignore.

**Kind**: static method of [<code>ObjectStream</code>](#ObjectStream)  

| Param | Type | Description |
| --- | --- | --- |
| fileName | <code>string</code> | The file which will be read. |

<a name="ObjectStream.map"></a>

### ObjectStream.map(f) ⇒ [<code>ObjectStream</code>](#ObjectStream)
Map a stream with function `f`.

**Kind**: static method of [<code>ObjectStream</code>](#ObjectStream)  

| Param | Type | Description |
| --- | --- | --- |
| f | <code>function</code> | f(data)=>data' |

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
| f | <code>function</code> | (obj)=>bool . |

<a name="ObjectStream.tee"></a>

### ObjectStream.tee(fileName, serizationFN) ⇒ [<code>ObjectStream</code>](#ObjectStream)
Like tee in bash.

  Read item form upstream, wirite the item to downstream and to a file.

**Kind**: static method of [<code>ObjectStream</code>](#ObjectStream)  

| Param | Type | Description |
| --- | --- | --- |
| fileName | <code>string</code> | Which file write the items. |
| serizationFN | <code>function</code> | A funstion map the item to     a string or a buffer. The default is JONS.stringify |

