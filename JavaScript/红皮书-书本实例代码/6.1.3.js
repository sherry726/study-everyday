var book = {};
    Object.defineProperties(book, {
        _year: {
            value: 2004,
        },
        edition: {
            value: 1
        },
        year: {
            get: function () {
                return this._year;
            },
            set: function (newValue) {
                if (newValue > 2004) {
                    this._year = newValue;
                    this.edition += newValue - 2004;
                }
            }
        }
    });
    var descriptor = Object.getOwnPropertyDescriptor(book, "_year");
    //{configurable: false,enumerable:false,writable:false,value:2004}
    //console.log(descriptor);    
    console.log(descriptor.value);   //2004
    console.log(descriptor.configurable);  //false
    console.log(typeof descriptor.get);   //undefined
    var descriptor = Object.getOwnPropertyDescriptor(book, "year");
    //{enumerable: false, configurable: false, get: ƒ, set: ƒ}
    //console.log(descriptor); 
    console.log(descriptor.value);   //undefined
    console.log(descriptor.enumerable);  //false
    console.log(typeof descriptor.get);   //function