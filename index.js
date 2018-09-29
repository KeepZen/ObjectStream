const {Transform,Readable}  = require('stream');
const fs = require('fs');
const fn = Symbol('fn');
const reduceRet = Symbol('reduceRet');
const pushS = Symbol('push');
/**
You can find the source at [GitHub](https://github.com/KeepZen/ObjectStream) .
@module @keepzen/object-stream
*/

/**
Get a function that can use to transform a chuck to Array of string.

@arg {string} code - The encode of the chuck. Default is 'uft8'.
@return {function} - f(bufferOrString)=>Array(string)
*/
function getChuckToLinesHandler(code='utf8'){
  let tail=null;
  return function chuckToLinesHandler(chuck){
    let lines = chuck.toString(code).split("\n");
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

/*
Create a readable stream maper with function `f`.
@arg {Object} required -
@arg {function} reqiored.push - `f(any)=>undefined;`
  Use to push data to downstream.
@arg {fucnction} required.f - `f(obj)=>anotherObj;`
  Uset to transform `obj` to `anotherObj`
@arg {object} options
@arg {boolean} options.speard - If the result is an array wheather speard it.
@arg {boolean} options.filterOutUndefined - If the result is
 undefined wheather filter out it.
@return {function} - `f(any,string,functionNoArg,functionWithOneArg)`
@package
*/
function streamMaperMaker(f, { speard=false,filterOutUndefined=true}={},) {
  return function maper(data,encoding,wantMoreData,push){
    let ret = f(data);
    if(speard === true && ret instanceof Array) {
      if(filterOutUndefined){
        ret = ret.filter( t=> t!==undefined );
      }
      ret.forEach(push);
      wantMoreData();
      return;
    }

    if( !(filterOutUndefined && ret == undefined) ){
      push(ret);
    }
    wantMoreData();
  }
}

/*
create a stream reducer with function `f`.
@arg {function} f - `f(initResult,data)=>typeOfInitResult`
@arg {any} initResult
@return {function} - `f(any,string,functionNoArg,functionWithOneArg)`
*/
function streamReducerMaker(f,initResult){
  return function reducer(data,encoding,wantMoreData,push){
    initResult = f(initResult,data);
    push(initResult);
    wantMoreData();
  }
}
/**
ObjectStream.

It is a transform stream, use to transform items of upstream to a
another form.

A stream like a array, they are all have items.
We can `map`, `filter`, and `reduce` on an array,
and now with help of `ObjectStream`, we can do these on stream.
*/

class ObjectStream extends Transform{
  /**
  Do **NOT** create instance with `new`.

  Just use static methods to get instance.
  */
  constructor(f,type='mapper'){
    super(
      {
        readableObjectMode: true,
        writableObjectMode: true,
      }
    );
    this[fn]=f;
    // this[type] = type;
    if(type == 'reducer'){
      this[pushS] =(data)=>{
        this[reduceRet] = data;
      };
    }else{
      this[pushS]=this.push.bind(this);
    }

    let upstreamPipeHandler=(src)=>{
      this.upstream=src;
      if( type != 'mapper' ){
        this.upstream.once('finish', ()=>{this.push(this[reduceRet]);}, );
      }
    }
    this.once('pipe',upstreamPipeHandler);
  }

  /**
  Implament of transform.
  @private
  */
  _transform(data,encoding,callback){
    this[fn](data,encoding,callback,this[pushS]);
  }

  /**
  Add `finish` event handler for this stream.
  @arg {function} f - A function require no argument.
  */
  finish(f){
    this.once('finish',f);
  }

  /**
  Transform upstream with function `f`.

  @arg {function} f - `f(data)=>anotherFormOfData`
  @arg {object} options
  @arg {boolean} options.speard - Wheather to speard the result if it is a array. The Default value is `false`.
  @arg {boolean} options.filterOutUndefined - Wheather filter out the
    `undefined` from upstream.
    The default is `false`.
  @return {ObjectStream}
  */
  static map( f,{speard=false,filterOutUndefined=false,}={} ){
    f = streamMaperMaker( f,  {speard,filterOutUndefined}) ;
    return new ObjectStream(f);
  }

  /**
  Reduce the upstream with function `f`.

  The return stream will read many time from upstream, but just write once to
  downstream.
  @arg {function} f - `(result,data)=>resultType`;
  @arg {object} initResult - The initialization result pass to reducer `f`.
  @return {ObjectStream}
  */
  static reduce(f,initResult){
    return new ObjectStream( streamReducerMaker(f,initResult),"reducer" );
  }

/**
  Process the items with conditions.

  If there are some conditions can not be handle,
  they are jest ignored, and not to flow to downstream.

  @arg {Array(object)} conds - The item of the array, is a object,
  like `{pred,mapper}`, the `precd` is `function(object)=>boolean`,
  and `mapper` is `function(object)=>annotherObject`.
  @return {ObjectStream}
  */
  static cond( conds ){
    function condHandler(data){
      for(let {pred:predicte,mapper} of conds){
        if(predicte(data)){
          return mapper(data);
        }
      }
      // If none predicte be true, `undefine` will be returned.
      // So `filterOutUndefined=true` are set to filter out them.
    }
    return ObjectStream.map(condHandler,{ filterOutUndefined:true, } );
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
  Filter out items from upstream.
  @arg {function} f - If `f(data) == true`, the `data` will filter out from upstream.
  @return {ObjectStream}
  */
  static filterOut(f){
    return ObjectStream.filter( t=>!f(t) );
  }

  /**
  Like tee in shell.

  Read items form upstream, wirit the items to downstream and
  to a file named by `fileName`.

  @arg {string} fileName - Which file record the items.
  @arg {function} serializationFn - A function map the item to
  a string or a buffer. The default is `JONS.stringify`.
  @return {ObjectStream}
  */
  static tee(fileName,serizalizationFn=JSON.stringify){
    return ObjectStream.map(function mapper(data){
      fs.appendFile(fileName,serizalizationFn(data));
      return data;
    });
  }

  /**
  If-then-else clause in stream.

  @arg {function} cond - `function(obj)=>boolean`.
  @arg {function} then - `function(obj)=>anotherObj`.
    The condition is satisfied, the function will be called.
  @arg {function} elseFun - `function(obj)=>anotherObje`.
    The condition is not satisfied this function will be called.

    This is option. If there is not `elseFn`, the item which don't satisfy
    the condition, will be ignored.
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
    if( !(upstream instanceof Readable) ){
      throw Error('upstream must be a readStream');
    }
    return upstream.pipe(
      ObjectStream.filter(where)
    );
  }

  /**
  Replace with
  ```js
  ObjectStream.from(fs.createReadStream(fileName))
    .pipe(ObjectStream.map(getChuckToLinesHandler(),{speard:true}))
  ```
  @deprecated since version 0.1.3
  */
  static lineStreamFrom(fileName){
    return ObjectStream.from(fs.createReadStream(fileName))
      .pipe(ObjectStream.map( getChuckToLinesHandler(),{speard:true}))
  }
}

/**
Alias of [filter](#module_@keepzen/object-stream..ObjectStream.filter).

*/
ObjectStream.filterIn = ObjectStream.filter;

/**
Alias of [map](#moddule_@keepzen/object-stream..ObjectStream.map).
*/
ObjectStream.transform = ObjectStream.map;
module.exports = ObjectStream;
module.exports.getChuckToLinesHandler = getChuckToLinesHandler;
