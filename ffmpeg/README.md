# 朋友们先整体看下项目，原理很简单的！先爬目录结构，然后下载。

需要安装[ffmpeg](http://ffmpeg.org/download.html)   [教程示例](https://zhuanlan.zhihu.com/p/324472015)

1. 下载git项目

2. npm install

3. 打开 src/index.js文件并修改以下几个字段。***注 ：= 后面的内容皆为示例***

   `Authorization、cookie、courseUrl、chapterUrl、accessToken`

- **Authorization** = `Bearer pc:d3d3f4f4f4g4g4g4g4g4g4g`

  ​	**// 随便找个接口，去request header 里面找**  	

- **cookie** = `gr_user_id=d3d4f4f4f-feca-4f64-8b9b-a5765efedff0; grwng_uid=f4f4f4f4f-c6c0-4ec2-8f3d-3854f4f45ab9a6682; kd_user_id=f4f4f-57d4-4b01-8871-f4f4; 99f53b614ce96c83_gr_last_sent_cs1=20300464; sensorsdata2015jssdkcross={"distinct_id":"20300464","first_id":"17aa00b9540104-00f1f40f73889a88-39664006-1327104-17aa00b9541601","props":{"$latest_traffic_source_type":"删掉这个中文","$latest_search_keyword":"删掉这个中文","$latest_referrer":""},"$device_id":"17aa00b9540104-00f1f40f73889a88-39664006-1327104-17aa00b9541601","identities":"eyIkg4g4g4g5gh5h5hlX2lkIjoiMTdlMGI0NmE0NzQyN2YtMGM1OWI0OTFjZGRhN2YtNTdiMWEzMy0zNjg2NDAwLTE3ZTBiNDZhNDc1NjY3IiwiJGlkZW50aXR5X2xvZ2f4f5gMjAzMDA0NjQifQ==","history_login_id":{"name":"$d3f4f4f44f","value":"20300464"}}; figui=rZ4Vo64wjNAXA3A2; Hm_lvt_156e88c022bf4153d3f474d090ced7=1649248114; access-edu_online=f6843d3d3d3dbb2bbad86ccbba94153; kd_5d6526d7-3c9f-460b-b6cf-ba75397ce1ac_log_id=xcd3d33d3f3f:4004cd09-a0f3-4345-b682-bb5b0f5d6a39:0050509c-5535-47a4-b713-a3b3491e79ab; 99f53b614ce96c83_gr_session_id=2400f3a1-f4f4f4f4-4e61-91e0-8b8040f0e856; 99f53b614ce96c83_gr_last_sent_sid_with_cs1=f3f3ff3-b488-4e61-91e0-8b8040f0e856; 99f53b614ce96c83_gr_session_id_2400f3a1-b488-4e61-91e0-8b8040f0e856=true; g4g4g4h-3c9f-460b-b6cf-ba75397ce1ac_view_log_id=d3d3f44g; kd_5d6526d7-3c9f-460b-b6cf-ba75397ce1ac_kuickDeal_pageIndex=0; g4g4g4g-3c9f-460b-b6cf-ba75397ce1ac_kuickDeal_leaveTime=1656593344413; 99f53b614ce96c83_gr_cs1=20300464; kkb_edu_session=ef3f3f54g4g4g4gg4tVVWlmMUJaU3JmNlRqTlE9PSIsInZhbHVlIjoiNXZLdWllbnpUSnBaQWRNckhcL3hIdU1oZXQ4a1h2cUlLUmlzT2lZdjhwM1VoTHp4WW1Hc3VnZ3Y4OTVUZXI5UGgiLCJtYWMiOiJjMDdiYzJmZTE2ZTk2NGY1MzFiMGRhMWI2MzcyNDRkYTUxZTU3NjRlNDMzZWUyM2QyMjQ1OGY0NGViY2I2MDZlIn0=`

  ​	**// 随便一个接口去request header 里面找,   复制过来，把cookie里面的*中文字符*删除掉。注意单引号双引号**  

- courseUrl= `https://weblearn.kaikeba.com/student/courseinfo?course_id=123456789&__timestamp=1234356`  

  ​	**//点开一个课程的列表页面，从所有的接口列表中找到如示例结构一样的接口。 接口名称提示：courseinfo?course_id=**

- chapterUrl = `https://weblearn.kaikeba.com/student/chapterinfo?course_id=1234356&chapter_id=`  

  ​	**//点开一个课程的列表页面，从所有的接口列表中找到如示例结构一样的接口。 接口名称提示：chapterinfo?course_id=**

  ​	**//url不能全部用，需要做一些修改，删掉chapter_id=之后的内容**

- accessToken=`33c3c9140c414d3d3d3ddf0be7361706d1`

  ​	**//随便点进去一个视频 会有一个access_token接口，从它里面拿数据**





### 最后运行npm脚本：先运行 start，然后再运行download



注意：

1、[乱码解决方案示例](https://wenku.baidu.com/view/2f8686df971ea76e58fafab069dc5022aaea46f7.html)

