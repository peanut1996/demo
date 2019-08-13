var Person = function() {
  function Person(name, age) {
    // 检测函数  判断类调用是否有关键字new,如果没有new,this指向window,会报错
    _classCallCheck(this, Person)
    this.name = name
    this.age = age
  }
  /*
  调用_createClass方法,参数(目标函数,公有方法,私有方法)
    1.将共有方法写在property原型对象上
    2.私有方法直接写在类上,只有通过类才可以调用,实例化对象无法调用
  */
  _createClass(
    Person,
    [
      {
        //共有方法
        key: 'car',
        value: function car() {
          console.log('玛莎拉蒂')
        }
      }
    ],
    [
      {
        //私有方法
        key: 'fn',
        value: function fn() {
          console.log('i am class function')
        }
      }
    ]
  )
  return Person
}

var zs = new Person('zs', 16)
