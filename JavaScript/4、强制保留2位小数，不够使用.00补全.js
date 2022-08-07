/**
 * parseFloat()
 * Math.round()
 * toString()
 * toFixed()
 * Number()
*/

//方式1
function reserveTwoDecimal(number){
    var floatNumber = parseFloat(number); 
    if(isNaN(floatNumber)){
        return 0;
    }
    var floatNumber = Math.round(number * 100) / 100;
    var stringNumber = floatNumber.toString();
    var positionDecimal = stringNumber.indexOf('.');
    if(positionDecimal < 0){
        positionDecimal = stringNumber.length;
        stringNumber += '.';
    }
    while(stringNumber.length <= positionDecimal + 2){
        stringNumber += '0';
    }
    return stringNumber;
}

let res = reserveTwoDecimal('12.8');
console.log(res);  //12.8




//方式2
console.log(Number(12.8).toFixed(2));
