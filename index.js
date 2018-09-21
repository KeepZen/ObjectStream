const {Transform}  = require('stream');
const fs = require('fs');
const mapFn = Symbol('map');
const filterFn = Symbol('filter');
const reduceFn = Symbol('reduce');

function toLine(tail=null){
  return function handler(chuck){
    let lines = chuck.toString().split("\n");
    // console.log(lines)
    let lastLine = lines.pop();
    if(tail != null){
      lines[0]=tail + lines[0];
    }
    if(lastLine != ''){
      tail = lastLine;
    }
    return lines;
  }
}
/**
Object Stream.

This is a transform stream. Transform a stream item to a another form.

A stream like a array, they are all have items.
We can 'map','filter', and 'reduce' a array,
and now with help of ObjectStream, we can do these on stream.
*/
class ObjectStream extends Transform{
  /**
  Do **NOT** create instance with `new`, Just use static method `map`, `filter`,
  or `reduce`.
  @private
  */
  constructor(operater,options){
    super(
      {
        readableObjectMode: true,
        writableObjectMode: true,
        ...options,
      }
    );
    if(typeof operater == 'object'){
      this[mapFn] = operater.map;
      this[filterFn] = operater.filter;
      this[reduceFn] = operater.reduce;
    }
    if(typeof operater == 'function'){
      this[mapFn] = operater;
    }
    this.once('pipe',(src)=>{this.upStream=src});
  }
  /**
  Map data with 'map' operater, and flow the result to downstream.
  @private
  */
  _map(data,callback){
    // console.log(this[mapFn].name);
    let ret=this[mapFn](data);
    if(ret instanceof Array){
      ret.forEach(item => this.push(item) );
    }else{
      /** Flow map result to downstream. */
      this.push(ret);
    }
    /** Inform upstream now can flow more data. */
    callback();
  }
  /**
  Filter stream.

  If data is stasify, flow to downstream, else just get more data from upstream.
  @private
  */
  _filter(data,callback){
    if(this[filterFn](data)){
      this.push(data);
    }
    callback();
  }
  /**
  Reduce the stream.

  When upstream is finish, flow the reduce result to downstream.
  @private
  */
  _reduce(data,callback){
    this.reduceRet = this[reduceFn](data,this.reduceRet);
    callback();
    if(this.listenEnd !== true){
      this.listenEnd = true;
      this.upStream.once(
        'finish',
        ()=>{
          this.push(this.reduceRet);
          this.reduceRet = undefined;
        }
      );
    }
  }
  /**
  Implament of transform.
  @private
  */
  _transform(data,encoding,callback){
    if(this[mapFn]){
      this._map(data,callback);
      return;
    }
    if(this[filterFn]){
      this._filter(data,callback);
      return;
    }
    if(this[reduceFn]){
      this._reduce(data,callback);
      return;
    }
  }
  /**
  Get a read stream, which read `fineName` line by line.
  @arg {string} fileName - The file which will be read.
  @return ObjectStream
  */
  static lineStreamFrom(fileName){
    // console.log(`fileName:${fileName}`)
    let l = new ObjectStream(toLine());
    fs.createReadStream(fileName).pipe(l);
    return l;
  }
  /**
  Map a stream use function.
  @arg {function} f - f(data)=>data'
  @return ObjectStream
  */
  static map(f){
    return new ObjectStream(f);
  }

  /**
  Reduce a stream with function.

  The return stream will read many time from upstream, but just write once to
  downstream.
  @arg {function} f - (data,initData)=>initDataType;
  @return ObjectStream.
  */
  static reduce(f){
    return new ObjectStream({reduce:f});
  }

  /**
  Filter the stream.
  Iff the `f(obj) == true` the `obj` flow to downstream.
  @arg {function} f - (obj)=>bool .
  @return ObjectStream
  */
  static filter (f){
    return new ObjectStream({filter:f});
  }
}

module.exports = ObjectStream;
