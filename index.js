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

It is a transform stream, use to transform itemes of a stream to a
another form.

A stream like a array, they are all have items.
And we can `map`,`filter`, and `reduce` on a array,
and now with help of `ObjectStream`, we can do these on stream.

You can find the source at [GitHub](https://github.com/KeepZen/ObjectStream).
*/
class ObjectStream extends Transform{
  /**
  Do **NOT** create instance with `new`.
  Just use static methodes `map`, `filter`,
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
    this[mapFn] = operater.map;
    if(operater.speard){
      this.speard = true;
    }
    if(operater.flowUndefined === false){
      this.flowUndefined = false;
    }
    this[filterFn] = operater.filter;
    this[reduceFn] = operater.reduce;
    this.reduceRet = operater.initRest;
    this.once('pipe',(src)=>{this.upstream=src});
  }
  /**
  Map data with 'map' operater, and flow the result to downstream.
  @private
  */
  _map(data,callback){
    // console.log(this[mapFn].name);
    let ret=this[mapFn](data);
    if(
      this.speard === true
      && ret instanceof Array
    ){
      for(let r of ret){
        this.push(r);//Flow result to downstream.
      }
      /** Inform upstream now can flow more data. */
      callback();
      return;
    }
    if(this.flowUndefined == false && ret === undefined){
      callback();
      return;
    }
    this.push(ret);
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
      this.upstream.once(
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
  Map a stream with function `f`.
  @arg {function} f - f(data)=>data'
  @arg {boolean} speard - Wheather to speard the result if it is a array.
    The Default value is `false`.
  @arg {boolean} flowUndefined - Wheather flow the `undefined` to downstream.
    The default is **YES**.
  @return {ObjectStream}
  */
  static map(
    f,
    {
      speard,
      flowUndefined=true,
    }={}
  ){
    return new ObjectStream({map:f,speard,flowUndefined});
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
  @arg {function} f - (obj)=>boolean .
  @return {ObjectStream}
  */
  static filter (f){
    return ObjectStream.cond( [ {pred:f,mapper:v=>v} ] );
  }

  /**
  Get a read stream, which read `fineName` file line by line.

  Note: The empty line will be ignore.
  @arg {string} fileName - The file which will be read.
  @return {ObjectStream}
  @deprecate
  Replace with
  `ObjectStream.from(fs.createReadStream(fileName),chuckToLineString)
  `
  */
  static lineStreamFrom(fileName){
    // console.log(`fileName:${fileName}`)

    return ObjectStream
      .from(fs.createReadStream(fileName))
      .pipe(ObjectStream.map(toLine(),{speard:true}));

  }

  /**
  Like tee in bash.

  Read item form upstream, wirite the item to downstream and
  to a file named by `fileName`.

  @arg {string} fileName - Which file write the items.
  @arg {function} serizationFN - A funstion map the item to
    a string or a buffer. The default is `JONS.stringify`.
  @return {ObjectStream}
  */
  static tee(fileName,serizationFN=JSON.stringify){
    return ObjectStream.map(function mapper(data){
      fs.appendFile(fileName,serizationFN(data));
      return data;
    });
  }

  /**
  Process the items with condition.

  If the some condition can not be hanlder,
  it jest be ignored, and not to flow to downstream.

  @arg {Array(object)} conds - The iteme of the array, is a object,
  like `{pred,mapper}`, the `precd` is `function(object)=>boolean`,
  and `mapper` is `function(object)=>annotherObject`.
  @return {ObjectStream}
  */
  static cond( conds ){
    return ObjectStream.map(
      function condHandler(data){
        for(let cond of conds){
          if(cond.pred(data)){
            return cond.mapper(data);
          }
        }
      },
      {
        flowUndefined:false,
      }
    )
  }

  /**
  If-then-else clause in stream.

  @arg {function} cond - function(obj)=>boolean.
  @arg {function} then - function(obj)=>anotherObj.
    The condition is satisfied, the function will be called.
  @arg {function} elseFun - function(obj)=>anotherObje.
    The condition is not satisfied this function will be called.

    This is option. If there is not `elseFn`, the item which don't satisfy
    the condtion, will be ignored.
  @return {ObjectStream}
  */
  static if(cond,then,elseFn=Function.prototype){
    return ObjectStream.cond([
      {pred:cond,mapper:then},
      { pred:()=>true,mapper:elseFn,},
    ]);
  }

  /**
  Create a new stream from a upstream.
  @arg {readStream} upstream
  @arg {Function} where - A Function return boolean. Default is function always return true.
  @return {ObjectStream}
  */
  static from(upstream,where=()=>true){
    if( !(upstream instanceof fs.ReadStream) ){
      throw Error('upstream must be a readStream');
    }
    return upstream.pipe(
      ObjectStream.filter(where)
    );
  }

}

module.exports = ObjectStream;
