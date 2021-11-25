
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

let server = http.createServer(function(req, res){
    let {pathname} = url.parse(req.url);
    if(['/get.html', 'post.html'].includes(pathname)){//看前面的数组有没有后面的pathname
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        let content = fs.readFileSyns(path.join(__dirname, 'static', pathname.slice(1)));
        res.write(content);
        res.end();
    }else if(pathname === "/get"){
        console.log(req.method);
        console.log(req.url);
        console.log(req.headers);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text.plain');
        res.write('get');
        res.end();
    }else if(pathname === "/post"){
        let buffer = [];
        req.on('data',(data)=>{
            buffer.push(data);
        });

        req.on('end',(data)=>{
            console.log(req.method);
            console.log(req.url);
            console.log(req.headers);
            res.statusCode = 200;
            let body = Buffer.concat(buffer);
            console.log('body', body);
            res.setHeader('Content-Type', 'text/plain');
            res.write(body);
            res.end();
        });

        
    }else{
        res.statusCode = 400;
        res.end();
    }

});
server.listen(8080);


var a= 10,b=30;
function swap(a, b){
    var temp = a;
    a = b;
    b = temp;
    return [a,b]
}
[a, b] = swap(a,b);
console.log(a,b);


var arr = [298,113,138,96,78,203,56,11,298,113,138,96,78,203,56,11,298,113,138,96,78,203,56,11];

//交换函数
function swap(a, b){
    var temp = a;
    a = b;
    b = temp;
    return [a,b]
}

function insertionSort(arr,l,r){
    for(var i = l+1; i <= r; i++){
        let temp = arr[i];
        let j;
        for(j = i; j > l && arr[j-1] > temp; j--){
            arr[j] = arr[j-1];
        }
        arr[j] = temp;
    }   
    // console.log("insert: " + arr);
}

function partition(arr, l, r){

    var randomNum = Math.round(Math.random()*(r-l)+l);
    [arr[randomNum],arr[l]] = swap(arr[randomNum], arr[l]);
    // var tempz = arr[l];
    // arr[l] = arr[randomNum];
    // arr[randomNum] = tempz;

    var p = arr[l];
    var i = l + 1,j = r;
    while(true){
        while(i <= r && arr[i] < p) i++;
        while(j >= l + 1 && arr[j] > p) j--;
        if( i > j) break;
        [arr[i], arr[j]] = swap(arr[i], arr[j]);
        i ++;
        j --;
    }

    [arr[l], arr[j]] = swap(arr[l], arr[j]);
    return j;
}

//为内部函数
function quickSortX(arr, l, r){   
    // if(l >= r) return;
    if(r-l <= 15){
        insertionSort(arr, l, r);
        return;
    }
   
    var p = partition(arr, l, r);
    quickSortX(arr, l, p-1);
    quickSortX(arr, p+1, r);

    
}

//快速排序
function quickSort(arr){
    var n = arr.length;
    quickSortX(arr, 0, n-1);
    
return arr;
}

console.log(quickSort(arr));