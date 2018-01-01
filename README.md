## 使用场景
在前端开发中，前后端完全分离，服务有字段定义但接口为开发完成时，需要前端自己mock数据，
mock-serve就是一个极简的mock服务，为解决以上情景问题
>

### 规范
- 项目使用`yarn`作为包管理, 请不要和npm混用
```
  yarn mock
```
### 

### 使用
```
  {
    "method": "get",
    "url": "/api/mock/get/test",
    "status": 200,
    "delay": 2000,
    "response": {
      "id|10": "1",
      "name|5": "sa",
      "age": 29,
      "baby|1": false,   
      "array|6": [1, 2, 3],
      "wife": {
        "a|1-6": "aa",
        "b|3-5": "bb"
      },
      "ip1|ip": "",
      "email1|email": "",
      "province1|province": "",
      "city1|city": "",
      "time|datetime":""
    }
  }
```
特殊参数: url, email, ip, province, city, county, id, date, time, datetime


