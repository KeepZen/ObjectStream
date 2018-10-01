const {ObjectStream, getChuckToLinesHandler}= require('./index.js');
const fs = require('fs');

test(
  "ObjectStream.from(upstream)",
  (done)=>{
    let fn = jest.fn();
    let upstream = fs.createReadStream('./data.txt');
    let s=ObjectStream.from(upstream,fn);
    expect(s.upstream).toBe(upstream);
    s.on(
      'finish',
      ()=>{
         expect(fn.mock.calls.length).toBeGreaterThan(0);
         done();
      }
    );
  }
)

test(
  "ObjectStream.create()",
  ()=>{
    let s = ObjectStream.create();
    expect(s instanceof ObjectStream).toBe(true);
    expect(s.upstream).toBeUndefined();
  }
)

test(
  "stream.source()",
  ()=>{
    let s = ObjectStream.create();
    expect(s.source()).toBe(s);
    let source = fs.createReadStream("./data.txt");
    source.pipe(s);
    expect(s.source()).toBe(source);
  }
)

test(
  "stream.finish(f)",
  (done)=>{
    let fn = jest.fn();
    s=ObjectStream.from(fs.createReadStream("./data.txt"));
    s.finish(fn);
    s.on(
      'finish',
      ()=>{
        expect(fn.mock.calls.length).toBeGreaterThan(0);
        done();
      }
    )
  }
)

test(
  "stream.map(f)",
  (done)=>{
    let fn = jest.fn();
    let t=ObjectStream.from(fs.createReadStream("./data.txt"))
    .map( getChuckToLinesHandler(), {spread:true} )
    .map(fn)
    .finish(()=>{
      expect(fn.mock.calls.length).toBe(6);
      done();
    })
  }
)


test(
  "stream.reduce(f,initResult)",
  (done)=>{
    let t = (initData,data)=>{
      let {sum,count}=initData;
      sum += data.hello;
      count ++;
      return {sum,count};
    };
    let fn = jest.fn();

    ObjectStream.from(fs.createReadStream("./data.txt"))
    .map(getChuckToLinesHandler(),{spread:true})
    .map(JSON.parse)
    .reduce(t,{sum:0,count:0})
    .map(fn)
    .finish(
      ()=>{
        expect(fn.mock.calls.length).toBe(1);
        expect(fn.mock.calls[0][0]).toMatchObject({count:6});
        done();
      }
    );
  }
)

test(
  "objectStream.cond()",
  (done)=>{
    let addOne = jest.fn( (d)=>{d.hello+=1;return d});
    let addTow = jest.fn( (d)=>{d.hello+=2;return d} );
    let t2 = jest.fn();
    let ss = ObjectStream.from(fs.createReadStream("./data.txt"))
    .map(getChuckToLinesHandler(),{spread:true})
    .map(JSON.parse)
    .cond(
      [
        {
          pred: ( ({hello})=>hello == 1 ),
          mapper: addTow
        },
        {
          pred:( ({hello}) =>hello == 2 ),
          mapper: addOne
        },
      ]
    )
    .map(t2)
    .finish(
      ()=>{
        expect( addOne.mock.calls.length ).toBe(1);
        expect( addTow.mock.calls.length ).toBe(1);
        expect( t2.mock.calls.length ).toBe(2);
        done();
      }
    );
  }
)

test(
  "stream.filter(f)",
  (done)=>{
    let t = jest.fn(t=>t.hello>1);
    ObjectStream.from(fs.createReadStream("./data.txt"))
    .map(getChuckToLinesHandler(),{spread:true})
    .map(JSON.parse)
    .filter(t)
    .finish(
      ()=>{
        expect(t.mock.calls.length).toBe(6);
        expect(t.mock.results[0].value).toBe(false)
        done();
      }
    );
  }
)

test(
  "objectStream.filterOut(predictedFn)",
  (done)=>{
    let fn = jest.fn();
    ObjectStream.from(fs.createReadStream('./data.txt'))
    .map(getChuckToLinesHandler(),{spread:true})
    .map(JSON.parse)
    .filterOut( ({hello}) => hello>3 )
    .map(fn)
    .finish(
      ()=>{
        expect(fn.mock.calls.length).toBe(3)
        done();
      }
    );
  }
)

test(
  "objectStream.if(condition,then)",
  (done)=>{
    let addOne = jest.fn( (d)=>{d.hello+=1;return d});
    ObjectStream.from(fs.createReadStream("./data.txt"))
    .map(getChuckToLinesHandler(),{spread:true})
    .map(JSON.parse)
    .if(({hello})=>hello>2, addOne,)
    .finish(
      ()=>{
        expect(addOne.mock.calls.length).toBe(4);
        done();
      }
    );
  }
)

test(
  "objectStream.if(condition,then,else)",
  (done)=>{
    let addOne = jest.fn( (d)=>{d.hello+=1;return d});
    let addTow = jest.fn( (d)=>{d.hello+=2;return d} );
    let t2 = jest.fn();
    ObjectStream.from(fs.createReadStream("./data.txt"))
    .map(getChuckToLinesHandler(),{spread:true})
    .map(JSON.parse)
    .if( ({hello})=>hello<=3, addOne, addTow, )
    .map(t2)
    .finish(
      ()=>{
        expect(addOne.mock.calls.length).toBe(3)
        expect(addTow.mock.calls.length).toBe(3)
        expect(t2.mock.calls.length).toBe(6);
        done();
      }
    );
  }
)

test(
  "objectStream.observer(f)",
  (done)=>{
    let fn = jest.fn();
    let fn2 = jest.fn();
    ObjectStream.from(fs.createReadStream("./data.txt"))
    .map(getChuckToLinesHandler(),{spread:true})
    .map(JSON.parse)
    .observer( fn )
    .map(fn2)
    .finish(
      ()=>{
        expect(fn.mock.calls.length).toBeGreaterThan(0)
        expect(fn.mock.calls).toMatchObject(fn2.mock.calls);
        done();
      }
    );
  }
)
test(
  `objectStream.write(data)`,
  ()=>{
     let f = jest.fn();
     let s = ObjectStream.create();
     s.write("hello");
     s.end("world");
     s.map(f)
     .finish(()=>{
       expect(f.mock.calls.length).toBe(2);
       expect(f.mock.calls[0][0]).toBe("hello");
     })
  }
)
