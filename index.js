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

It is a transform stream. Transform a stream item to a another form.

A stream like a array, they are all have items.
We can `map`,`filter`, and `reduce` on a array,
and now with help of `ObjectStream`, we can do these on stream.
*/
class ObjectStream extends Transform{
  /**
  Do **NOT** create  instance with `new`. Just use static method `map`, `filter`,
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
      this.reduceRet = operater.initRest;
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
    // console.log(`${__filename},reduceRet:${JSON.stringify(this.reduceRet,null,2)}`)
    this.reduceRet = this[reduceFn](this.reduceRet,data);
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
  Get a read stream, which read `fineName` file line by line.

  Note: The empty line will be ignore.
  @arg {string} fileName - The file which will be read.
  @return {ObjectStream}
  */
  static lineStreamFrom(fileName){
    // console.log(`fileName:${fileName}`)
    let l = ObjectStream.map(toLine());
    fs.createReadStream(fileName).pipe(l);
    return l;
  }
  /**
  Map a stream with function `f`.
  @arg {function} f - f(data)=>data'
  @return {ObjectStream}
  */
  static map(f){
    return new ObjectStream({map:f});
  }

  /**
  Reduce a stream with function `f`.

  The return stream will read many time from upstream, but just write once to
  downstream.
  @arg {function} f - (result,data)=>resultType;
  @arg {object} initResult - The initination of result pass to reducer `f`.
  @return {ObjectStream}
  */
  static reduce(f,initResult){
    return new ObjectStream({reduce:f,initRest:initResult});
  }

  /**
  Filter the stream.

  Iff the `f(obj) == true`,
  the `obj` will flow to downstream.
  @arg {function} f - (obj)=>bool .
  @return {ObjectStream}
  */
  static filter (f){
    return new ObjectStream({filter:f});
  }

  /**
  Like tee in bash.

  Read item form upstream, wirite the item to downstream and to a file.

  @arg {string} fileName - Which file write the items.
  @arg {function} serizationFN - A funstion map the item to
    a string or a buffer. The default is JONS.stringify
  @return {ObjectStream}
  */
  static tee(fileName,serizationFN=JSON.stringify){
    return ObjectStream.map(function mapper(data){
      fs.appendFile(fileName,serizationFN(data));
      return data;
    });
  }
}

module.exports = ObjectStream;
