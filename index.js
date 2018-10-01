const {Transform,Readable}  = require('stream');
const fs = require('fs');
const fn = Symbol('fn');
const reduceRet = Symbol('reduceRet');
const pushS = Symbol('push');
/**
You can find the source at [GitHub](https://github.com/KeepZen/ObjectStream).

Now do not need to write the tedious of `.pipe(ObjectStream.someMethod(f))`s.
`map(f)`, `reduce(f)` and other methods have piped this stream into the new one.
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
@arg {boolean} options.spread - If the result is an array whether spread it.
@arg {boolean} options.filterOutUndefined - Whether filter out `undefined`.
@return {function} - `f(any,string,functionNoArg,functionWithOneArg)`
@package
*/
function streamMaperMaker(f, { spread=false,filterOutUndefined=true}={},) {
  return function maper(data,encoding,wantMoreData,push){
    let ret = f(data);
    if(spread === true && ret instanceof Array) {
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
  constructor(f,type){
    super(
      {
        readableObjectMode: true,
        writableObjectMode: true,
      }
    );
    this[fn]=f;
    if(type == 'reducer'){
      this[pushS] =(data)=>{
        this[reduceRet] = data;
      };
    }else{
      this[pushS]=this.push.bind(this);
    }
    let upstreamPipeHandler=(src)=>{
      this.upstream=src;
      if( type == 'reducer' ){
        this.upstream.on('finish', ()=>{this.push(this[reduceRet]);}, );
      }
    }
    this.on('pipe',upstreamPipeHandler);
    /**
    Alias of [map](#module_@keepzen/object-stream..ObjectStream+map) method.
    @arg {functtion} f
    @return {ObjectStream}
    */
    this.transform = this.map;
    /**
    Alias of[filter](#module_@keepzen/object-stream..ObjectStream+filter)
    method.

    @arg {function} f,
    @return {ObjectStream}
    */
    this.filterIn = this.filter;
  }

  /**
  Create a ObjectStream instance.

  You can use `.map(f)`, `.filter(f)` or other methods to get a new stream object,
  but the function `f`  will never be called, until some data be write to this
  stream or one readable stream pipe to this object.
  @return {ObjectStream}.
  */
  static create(){
    return new ObjectStream(d=>d);
  }

  /**
  Create a new stream from a upstream.
  @arg {ReadableStream} upstream
  @arg {Function} where - A Function return boolean. Default is function always return true.
  @return {ObjectStream}
  */
  static from(upstream,where=()=>true){
    if( !(upstream instanceof Readable) ){
      throw Error('upstream must be a readStream');
    }
    function fromMapper(data){
      return where(data)? data:undefined;
    }
    return upstream.pipe(
      new ObjectStream(streamMaperMaker(fromMapper,{filterOutUndefined:true}))
    );
  }
  /**
  Implament of transform.
  @private
  */
  _transform(data,encoding,callback){
    this[fn](data,encoding,callback,this[pushS]);
  }

  /**
  Get the source of this stream.
  @return {ReadableStream|ObjectStream}
  */
  source(){
    if(!this.upstream){
      return this;
    }
    if( !(this.upstream instanceof ObjectStream) ) {
      return this.upstream;
    }
    return this.upstream.source();
  }

  /**
  Add `finish` event handler for this stream.
  @arg {function} f - A function require no argument.
  */
  finish(f){
    this.on('finish',f);
    return this;
  }

  /**
  Transform upstream with function `f`.

  @arg {function} f - `f(data)=>anotherFormOfData`
  @arg {object} options
  @arg {boolean} options.spread - Whether to spread the result if it is a array. The Default value is `false`.
  @arg {boolean} options.filterOutUndefined - Whether filter out the
    `undefined` from upstream.
    The default is `false`.
  @return {ObjectStream}
  */
  map( f,{spread=false,filterOutUndefined=false,}={} ){
    f = streamMaperMaker( f,  {spread,filterOutUndefined}) ;
    return this.pipe(new ObjectStream(f));
  }

  /**
  Reduce the upstream with function `f`.

  The return stream will read many time from upstream, but just write once to
  downstream.
  @arg {function} f - `(result,data)=>resultType`;
  @arg {object} initResult - The initialization result pass to reducer `f`.
  @return {ObjectStream}
  */
  reduce(f,initResult){
    let fn = streamReducerMaker(f,initResult);
    return this.pipe(new ObjectStream(fn ,"reducer") );
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
  cond( conds ){
    function condHandler(data){
      for(let {pred:predicte,mapper} of conds){
        if(predicte(data)){
          return mapper(data);
        }
      }
      // If none predicte be true, `undefine` will be returned.
      // So `filterOutUndefined=true` are set to filter out them.
    }
    return this.map(condHandler,{ filterOutUndefined:true, } );
  }

  /**
  Filter the stream.

  Iff the `f(obj) == true`,
  the `obj` will flow to downstream.
  @arg {function} f - (obj)=>boolean .
  @return {ObjectStream}
  */
  filter (f){
    return this.cond( [ {pred:f,mapper:v=>v} ] );
  }

  /**
  Filter out items from upstream.
  @arg {function} f - If `f(data) == true`, the `data` will filter out from upstream.
  @return {ObjectStream}
  */
  filterOut(f){
    return this.filter( t=>!f(t) );
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
  if(cond,then,elseFn=Function.prototype){
    return this.cond([{pred:cond,mapper:then},{pred:()=>true,mapper:elseFn}]);
  }

  /**
  Just observe the stream items with function `f`, not change them.
  @arg {function} f - The function use to observer stream item.
  @return {ObjectStream}
  */
  observer(f){
    return this.filter(data=>{f(data);return true;});
  }
}

module.exports = {
  ObjectStream,
  getChuckToLinesHandler,
}
