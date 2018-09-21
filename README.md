<a name="ObjectStream"></a>

## ObjectStream
Object Stream.

This is a transform stream. Transform a stream item to a another form.

A stream like a array, they are all have items.
We can 'map','filter', and 'reduce' a array,
and now with help of ObjectStream, we can do these on stream.

**Kind**: global class  

* [ObjectStream](#ObjectStream)
    * [new ObjectStream()](#new_ObjectStream_new)
    * _instance_
        * [._map()](#ObjectStream+_map) ℗
        * [._filter()](#ObjectStream+_filter) ℗
        * [._reduce()](#ObjectStream+_reduce) ℗
        * [._transform()](#ObjectStream+_transform) ℗
    * _static_
        * [.lineStreamFrom(fileName)](#ObjectStream.lineStreamFrom) ⇒
        * [.map(f)](#ObjectStream.map) ⇒
        * [.reduce(f)](#ObjectStream.reduce) ⇒
        * [.filter(f)](#ObjectStream.filter) ⇒

<a name="new_ObjectStream_new"></a>

### new ObjectStream()
Do **NOT** create instance with `new`, Just use static method `map`, `filter`,
  or `reduce`.

<a name="ObjectStream+_map"></a>

### objectStream._map() ℗
Map data with 'map' operater, and flow the result to downstream.

**Kind**: instance method of [<code>ObjectStream</code>](#ObjectStream)  
**Access**: private  
<a name="ObjectStream+_filter"></a>

### objectStream._filter() ℗
Filter stream.

  If data is stasify, flow to downstream, else just get more data from upstream.

**Kind**: instance method of [<code>ObjectStream</code>](#ObjectStream)  
**Access**: private  
<a name="ObjectStream+_reduce"></a>

### objectStream._reduce() ℗
Reduce the stream.

  When upstream is finish, flow the reduce result to downstream.

**Kind**: instance method of [<code>ObjectStream</code>](#ObjectStream)  
**Access**: private  
<a name="ObjectStream+_transform"></a>

### objectStream._transform() ℗
Implament of transform.

**Kind**: instance method of [<code>ObjectStream</code>](#ObjectStream)  
**Access**: private  
<a name="ObjectStream.lineStreamFrom"></a>

### ObjectStream.lineStreamFrom(fileName) ⇒
Get a read stream, which read `fineName` line by line.

**Kind**: static method of [<code>ObjectStream</code>](#ObjectStream)  
**Returns**: ObjectStream  

| Param | Type | Description |
| --- | --- | --- |
| fileName | <code>string</code> | The file which will be read. |

<a name="ObjectStream.map"></a>

### ObjectStream.map(f) ⇒
Map a stream use function.

**Kind**: static method of [<code>ObjectStream</code>](#ObjectStream)  
**Returns**: ObjectStream  

| Param | Type | Description |
| --- | --- | --- |
| f | <code>function</code> | f(data)=>data' |

<a name="ObjectStream.reduce"></a>

### ObjectStream.reduce(f) ⇒
Reduce a stream with function.

  The return stream will read many time from upstream, but just write once to
  downstream.

**Kind**: static method of [<code>ObjectStream</code>](#ObjectStream)  
**Returns**: ObjectStream.  

| Param | Type | Description |
| --- | --- | --- |
| f | <code>function</code> | (data,initData)=>initDataType; |

<a name="ObjectStream.filter"></a>

### ObjectStream.filter(f) ⇒
Filter the stream.
  Iff the `f(obj) == true` the `obj` flow to downstream.

**Kind**: static method of [<code>ObjectStream</code>](#ObjectStream)  
**Returns**: ObjectStream  

| Param | Type | Description |
| --- | --- | --- |
| f | <code>function</code> | (obj)=>bool . |

