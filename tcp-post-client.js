/**
 * Create by Jin on 2020.9.6 1044
 */


let net = require('net');//传 输 层模块：不能处理http协议
const ReadState = {
    UNSENT : 0,
    OPENED : 1,
    HEADERS_RECEIVED : 2,
    LOADING : 3,
    DONE : 4
}
class XMLHttpRequest{
    constructor(){
        this.readyState = ReadState.UNSENT;//默认是初始化的，未调用open方法
        this.headers = {'Connection':'keep-alive'};//请求头，可以设置
    }
    open(method, url){//1.方法名 2.地址
        this.method = method||'POST';
        this.url = url;
        //下面参数举例：http://127.0.0.1:8080/get.html => hostname = 127.0.0.1 ,port = 8080 ,path = /get
        let {hostname,port,path} = require('url').parse(url);
        this.hostname = hostname;
        this.port = port;
        this.path = path;
        this.headers['Host'] = `${hostname}:${port}`;//注意那不是引号，$是要拼接的意思
        //通过传输层的net模块发起请求
        const socket = this.sockect = net.createConnection({hostname,port
        },()=>{//连接成功之后可以监听服务器的数据,data是向服务器发的相应数据
            socket.on('data', (data) => {
                data = data.toString();
                console.log('data', data);
                //处理响应了
                let [response, bodyRows] = data.split('\r\n\r\n');
                let [statusLine, ...headerRows] = response.split('\r\n');
                let [, status, statusText] = statusLine.split(' ');
                this.status = status;
                this.statusText = statusText;
                this.responseHeaders = headerRows.reduce((memo, row)=>{//row:当前数组值
                    let [key, value] = row.split(': ');
                    memo[key] = value;//memo[key],去掉了key的引号
                    return memo;
                },{});
                this.readyState = ReadState.HEADERS_RECEIVED;
                this.onreadystatechange && this.onreadystatechange();
                let [, body, ] = bodyRows.split('\r\n');
                this.readyState = ReadState.LOADING;
                this.onreadystatechange && this.onreadystatechange();
                this.response = this.responseText = body;
                this.readyState = ReadState.DONE;
                this.onreadystatechange && this.onreadystatechange();
                this.onload && this.onload();
            });
        });
        this.readyState = ReadState.OPENED;
        this.onreadystatechange && this.onreadystatechange();
    }
    //
    setRequestHeader(header, value){
        this.headers[header] = value;
    }
    //将上面拼写的信息，处理然后发出去
    send(body){
        let rows = [];
        rows.push(`${this.method} ${this.url} HTTP/1.1`);
        //写法一
        // Object.key(this.headers).map(key=>`${key} ${this.headers[key]}`).join('\r\n');
        this.headers['Content-Length'] = Buffer.byteLength(body);
        rows.push(...Object.keys(this.headers).map(key=>`${key}: ${this.headers[key]}`));
        let request = rows.join('\r\n') + '\r\n\r\n' + body;
        console.log('request', request);
        this.sockect.write(request);
    }
    getAllResponseHeaders(){
        let result = '';
        for(let key in this.responseHeaders){
            result += `${key}: ${this.responseHeaders[key]}\r\n`;
        }
        return result;
    }
    getResponseHeader(key){
        return this.responseHeaders[key];
    }
}

let xhr = new XMLHttpRequest();
xhr.onreadystatechange = function(){
    console.log('onreadystatechang', xhr.readyState);
}
xhr.open('POST','http://127.0.0.1:8080/post');
xhr.responType = 'text';
xhr.setRequestHeader('Content-Type', 'application/json');
xhr.onload = function(){
    console.log('readyState', xhr.readyState);
    console.log('status', xhr.status);
    console.log('statusText', xhr.statusText);
    console.log('getAllResponseHeaders', xhr.getAllResponseHeaders());
    console.log('response', xhr.response);
}
xhr.send(JSON.stringify({name: 'Jin', age: 29}));
// xhr.send('{"name":"Jin","age":11}');