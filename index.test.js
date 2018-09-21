const ObjectStream = require('./index.js');
const fs = require('fs');
test(
  "lineStreamFrom('data.text')",
  (done)=>{
    let t = jest.fn();
    let s = new ObjectStream(t);
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
  "ObjectStream.reduce(f)",
  (done)=>{
    let t = (data,initData={sum:0,count:0})=>{
      let {sum,count}=initData;
      sum += data.hello;
      count ++;
      return {sum,count};
    };
    let fn = jest.fn();
    let s = ObjectStream.map(fn);
    ObjectStream.lineStreamFrom("./data.txt").
    pipe(ObjectStream.map(JSON.parse)).
    pipe(ObjectStream.reduce(t)).
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
