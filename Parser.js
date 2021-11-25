/**
 * Create by Jin on 2020.9.6 1156
 * 使用状态机来解析，获取到请求行 请求头 请求体
 * 
 */
let LF = 10,//换行 Line Feed
    CR = 13,//回车 Carriage Return
    SPACE = 32,//空格
    COLON = 58;//冒号

let INIT = 0, //未解析
    START = 1,//开始解析
    REQUEST_LINE = 2,//遇到请求行
    HEADER_FIELD_START = 3,//遇到请求头
    HEADER_FIELD = 4,
    HEADER_VALUE_START = 5,//
    HEADER_VALUE = 6,
    BODY = 7;

class Parser{
    constructor(){
        this.state = INIT;
    }

    parse(buffer){
        let self = this,
            requestLine = '',//POST /post HTTP/1.1
            headers = {},    //{Host: 127.0.0.1:8080}
            body = '',       //{"name":"Jin","age":29}
            i = 0,
            char,//当前字符
            headerField = '',//当前请求头字段名字
            headerValue = '';//当前请求头字段值
        let state = START;
        
        for(i = 0; i < buffer.length; i++){
            char = buffer[i];
            switch(state){
                case START:
                    state = REQUEST_LINE;
                    self['requestLineMark'] = i;//记录一下请求行起始索引
                case REQUEST_LINE:
                    if(char === CR){
                        requestLine = buffer.toString('utf8', self['requestLineMark'],i);
                    }else if(char === LF){
                        state = HEADER_FIELD_START;
                    }
                    break;
                case HEADER_FIELD_START:
                    if(char === CR){ //如果在遇到回车，就到请求体啦
                        state = BODY;
                        self['bodyMark'] = i+2;
                    }
                    else{
                        state = HEADER_FIELD;
                        self['requestFieldMark'] = i;
                    }
                    break;
                case HEADER_FIELD:
                    if(char === COLON){//遇到冒号
                        headerField = buffer.toString('utf8', self['requestFieldMark'],i);
                    }else if(char === SPACE){
                        state = HEADER_VALUE_START;
                    }
                    break;
                case HEADER_VALUE_START:
                    if(char === SPACE){
                        break;
                    }
                    state = HEADER_VALUE;
                    self['requestValueMark'] = i;
                case HEADER_VALUE:
                    if(char === CR){
                        headerValue = buffer.toString('utf8', self['requestValueMark'],i);
                        headers[headerField] = headerValue;
                        headerField = headerValue = '';
                    }else if(char === LF){
                        state = HEADER_FIELD_START;
                    }
                    break;
                // case BODY:
                    // if

            }
        }
        let [method, url] = requestLine.split(' ');
        body = buffer.toString('utf8', self['bodyMark'],i);
        return {method, url, headers, body}
    }
}
module.exports = Parser;
/**
POST /post HTTP/1.1
Host: 127.0.0.1:8080
Connection: keep-alive
Content-Length: 23

{"name":"Jin","age":29}
 */