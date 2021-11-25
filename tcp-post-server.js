let net = require('net');//tcp是协议名，net是实现tcp的node模块
let Parser = require('./Parser');
// const { Socket } = require('dgram');
/**
 * Create by Jin on 2020.9.6 1140
 * 创建一个tcp服务器，每当有客户端来链接了，就会为他创建一个socket
 * tcp是协议名，net是实现tcp的node模块
 * http是协议名，http是实现http的模块
 */

const server = net.createServer(socket=>{
    //解析请求
    socket.on('data',(data)=>{
        // let request = data.toString();
        let parser = new Parser();
        let {method, url, headers, body} = parser.parse(data);
        debugger
        // //请求行 请求头行
        // let [requestLine,...headerRows] = request.split('\r\n');
        // let [method, path] = requestLine.split(' ');
        // this.method = method;//方法
        // this.path = path;    //路径
        // //请求头
        // let headers = headerRows.slice(0, -2).reduce((memo,row)=>{
        //     let [key, value] = row.split(': ');
        //     memo[key] = value;
        //     return memo;
        // },{});
        console.log('method: ', method);
        console.log('url: ', url);
        console.log('headers: ', headers);

        //构建响应
        let rows = [];
        rows.push(`HTTP/1.1 200 OK`);
        rows.push(`Content-Type: text/plain`);
        rows.push(`Date: ${new Date().toGMTString()}`);
        rows.push(`Connection: keep-alive`);
        rows.push(`Transfer-Encoding: chunked`);
        rows.push(`Content-Length: ${Buffer.byteLength(body)}`);//返回返回这个字符串的字符长度 body.length
        rows.push(`\r\n${Buffer.byteLength(body).toString(16)}\r\n${body}\r\n0`);
        let response = rows.join('\r\n');
        console.log('response: ', response);
        socket.end(response);        
    });


});
server.listen(8080);

/**响应体（注意其中的空格）
 HTTP/1.1 200 OK
Content-Type: text/plain
Date: Sat, 05 Sep 2020 06:21:13 GMT
Connection: keep-alive
Keep-Alive: timeout=5
Transfer-Encoding: chunked


 */
// statuscode -280;res.setHeader(“context-type”、“文字保持朴实的风格”);Res. 写入 （Json. 字符串化 （...字段. 阿凡达： 文件路径）;）;1res.end ();