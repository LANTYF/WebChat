var arr = [1,2,3,5,3,4,5,6,6,"test","test",true];
var person = [
  {
    name:"孙悟空",
    weapon:"如意金箍棒",
    experience:"大闹天宫、西天取经",
    post:"斗战胜佛、齐天大圣"
  },
  {
    name:"孙悟空",
    weapon:"如意金箍棒",
    experience:"大闹天宫、西天取经",
    post:"斗战胜佛、齐天大圣"
  },
  {
    name:"孙悟空",
    weapon:"如意金箍棒",
    experience:"大闹天宫、西天取经",
    post:"斗战胜佛、齐天大圣"
  },
  {
    name:"孙悟空",
    weapon:"如意金箍棒",
    experience:"大闹天宫、西天取经",
    post:"斗战胜佛、齐天大圣"
  },
  {
    name:"孙悟空",
    weapon:"如意金箍棒",
    experience:"大闹天宫、西天取经",
    post:"斗战胜佛、齐天大圣"
  }
];

//Es6 + ES5去重办法
function Es6duplicate(arr,type){
  if(arr.length == 0){
    return arr;
  }else{
    if(type){
      var obj = {}
      var newArr = arr.reduce((cur,next) => {
        obj[next.name] ? "" : obj[next.name] = true && cur.push(next);
        return cur;
      },[])
      return newArr;
    }else{
      return Array.from(new Set(arr));
    }
  }
}
console.log('ES6去重',Es6duplicate(arr));
console.log('ES6去重',Es6duplicate(person,"name"));