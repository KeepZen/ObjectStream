const ObjectStream = require('./index.js');
const getChuckToLinesHandler= ObjectStream.getChuckToLinesHandler;
const fs = require('fs');
test(
  "lineStreamFrom('data.text')",
  (done)=>{
    let t = jest.fn();
    let s = ObjectStream.map(t);
    ObjectStream.lineStreamFrom('./data.txt')
    .pipe(s);
    s.on('finish',()=>{
      expect(t.mock.calls.length).toBe(6);
      done();
    })
  }
)

test(
  "ObjectStream.map(f)",
  (done)=>{
    let t = jest.fn(JSON.parse);
    let s = ObjectStream.map(t);
    ObjectStream.lineStreamFrom("./data.txt").
    pipe(s);
    s.on(
      'finish',
      ()=>{
        expect(t.mock.calls.length).toBe(6);
        expect(t.mock.results[0].value).toMatchObject({hello:1})
        done();
      }
    )
  }
)

test(
  "ObjectStream.filter(f)",
  (done)=>{
    let t = jest.fn(t=>t.hello>1);
    let s = ObjectStream.filter(t);
    ObjectStream.lineStreamFrom("./data.txt").
    pipe(ObjectStream.map(JSON.parse)).
    pipe(s);
    s.on(
      'finish',
      ()=>{
        expect(t.mock.calls.length).toBe(6);
        expect(t.mock.results[0].value).toBe(false)
        done();
      }
    );
  }
)

test(
  "ObjectStream.filterOut(predictedFn)",
  (done)=>{
    let fn = jest.fn();
    ObjectStream.from(fs.createReadStream('./data.txt'))
    .pipe(ObjectStream.map(getChuckToLinesHandler(),{speard:true}))
    .pipe(ObjectStream.map(JSON.parse))
    .pipe(ObjectStream.filterOut( ({hello}) => hello>3 ))
    .pipe(ObjectStream.map(fn))
    .on(
      'finish',
      ()=>{
        console.log(fn.mock.calls)
        expect(fn.mock.calls.length).toBe(3)
        done();
      }
    )
  }
)

test(
  "ObjectStream.reduce(f,initResult)",
  (done)=>{
    let t = (initData,data)=>{
      let {sum,count}=initData;
      sum += data.hello;
      count ++;
      return {sum,count};
    };
    let fn = jest.fn();
    let s = ObjectStream.map(fn);
    ObjectStream.lineStreamFrom("./data.txt").
    pipe(ObjectStream.map(JSON.parse)).
    pipe(ObjectStream.reduce(t,{sum:0,count:0})).
    pipe(s);

    s.on(
      'finish',
      ()=>{
        expect(fn.mock.calls.length).toBe(1);
        expect(fn.mock.calls[0][0]).toMatchObject({count:6});
        done();
      }
    );
  }
)

test(
  "ObjectStream.tee()",
  (done)=>{
    let t = ObjectStream.tee("./tee.log");
    ObjectStream.lineStreamFrom('./data.txt')
    .pipe( ObjectStream.map(JSON.parse) )
    .pipe( t );
    t.on(
      'finish',
      ()=>{
        const fs = require('fs');
        fs.access(
          './tee.log',
          fs.constants.F_OK,
          (err)=>{
            expect(err).toBe(null);
            const exec = require('child_process').execSync;
            exec('rm ./tee.log');
            done();
          }
        )
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
    let ss = ObjectStream.lineStreamFrom('./data.txt')
    .pipe( ObjectStream.map(JSON.parse) )
    .pipe(
      ObjectStream.cond([
        {
          pred: ( ({hello})=>hello == 1 ),
          mapper: addTow
        },
        {
          pred:( ({hello}) =>hello == 2 ),
          mapper: addOne
        },
      ])
    ).pipe( ObjectStream.map(t2) )

    ss.on(
      'finish',
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
  "ObjectStream.if(condition,then)",
  (done)=>{
    let addOne = jest.fn( (d)=>{d.hello+=1;return d});
    ObjectStream.lineStreamFrom('./data.txt')
    .pipe( ObjectStream.map(JSON.parse) )
    .pipe(
      ObjectStream.if(
        ({hello})=>hello>2,
        addOne,
      )
    )
    .on(
      'finish',
      ()=>{
        expect(addOne.mock.calls.length).toBe(4);
        done();
      }
    );
  }
)

test(
  "ObjectStream.if(condition,then,else)",
  (done)=>{
    let addOne = jest.fn( (d)=>{d.hello+=1;return d});
    let addTow = jest.fn( (d)=>{d.hello+=2;return d} );
    let t2 = jest.fn();
    let ss = ObjectStream.lineStreamFrom('./data.txt')
    .pipe( ObjectStream.map(JSON.parse) )
    .pipe(
      ObjectStream.if(
        ({hello})=>hello<=3,
        addOne,
        addTow,
      )
    )
    .pipe( ObjectStream.map(t2) )
    .on(
      'finish',
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
  "ObjectStream.from(upStream)",
  (done)=>{
    let fn = jest.fn();
    ObjectStream.from(fs.createReadStream('./data.txt'))
    .pipe(ObjectStream.map(fn))
    .on(
      'finish',
      ()=>{
         // console.log(fn.mock.calls)
         expect(fn.mock.calls.length).toBeGreaterThan(0);
         done();
      }
    )
  }
)
