# 朋友们先整体看下项目，原理很简单的！先爬目录结构，然后下载。(一定要先看，不要上来就@我，出现了解决不了的问题再问我！)
需要安装[ffmpeg](http://ffmpeg.org/download.html)  

// 点开一个课程的列表页面，从url复制过来。  
export const course_id = xxxxx  

// 课程的名称  
export const basePath = './xxxxx'  

// 点击一个视频，进入播放状态，在控制台network 找 detail接口，里面有accessToken  
export const accessToken = 'xxxxxxxx'  

// 列表接口 list 里面去request header 里面找  
export const Authorization = 'Bearer pc:xxxxxxxxxx'  

// 随便一个接口 复制过来，把cookie里面的中文字符删除掉  
export const cookie = `gr_user_id=xxxxxxx-0019-4c78-93bf-be4b0d6e73e6; kd_user_id=xxxxxx-5705-4a07-83c8-f6d5ca6fc72d; figui=934ZKUKN87jj8J12; sensorsdata2015jssdkcross={"distinct_id":"21878439","first_id":"17bbada81f3283-06d5a63df21805-1f3e6757-3686400-17bbada81f4bcc","props":{"$latest_traffic_source_type":"","$latest_search_keyword":"","$latest_referrer":""},"$device_id":"17bbada81f3283-06d5a63df21805-1f3e6757-3686400-17bbada81f4bcc","identities":"eyIkaWRlbnRpdHlfY29va2llX2lkIjoiMTdlNDIzMDU2NTMzOGUtMDY4ZDg5OTYzYTkzMTE4LTM2NjU3NDA3LTM2ODY0MDAtMTdlNDIzMDU2NTQyZTkiLCIkaWRlbnRpdHlfbG9naW5faWQiOiIyMTg3ODQzOSJ9","history_login_id":{"name":"$identity_login_id","value":"21878439"}}; access-edu_online=6118e9f36229bf7fdeb92d9a88f146f0; 99f53b614ce96c83_gr_last_sent_cs1=21878439; Hm_lvt_156e88c022bf41570bf96e74d090ced7=1653833479,1653914382,1653924848,1653936233; Hm_lpvt_156e88c022bf41570bf96e74d090ced7=1653990938; kd_5d6526d7-3c9f-460b-b6cf-ba75397ce1ac_log_id=SJbLe0NrKcg2zGLRVJX:9c66a3bf-86c2-4276-90e1-cce4c4c144d0:f1642bdc-797a-421f-8ec7-5da770c68f1a; 99f53b614ce96c83_gr_session_id=7e7046f7-259d-4813-836a-00bbff4673d7; 99f53b614ce96c83_gr_last_sent_sid_with_cs1=7e7046f7-259d-4813-836a-00bbff4673d7; 99f53b614ce96c83_gr_session_id_7e7046f7-259d-4813-836a-00bbff4673d7=true; kd_5d6526d7-3c9f-460b-b6cf-ba75397ce1ac_view_log_id=UEn1soqJCoXtJtNG6mE; kd_5d6526d7-3c9f-460b-b6cf-ba75397ce1ac_kuickDeal_pageIndex=1; kd_5d6526d7-3c9f-460b-b6cf-ba75397ce1ac_kuickDeal_leaveTime=1653990987910; 99f53b614ce96c83_gr_cs1=21878439; kkb_edu_session=eyJpdiI6ImM4ZENJUEQ1bW40dnNCSUZjanBsdFE9PSIsInZhbHVlIjoiNkdiTTkwZTBTaEtaYkFManVPMUJ1ZGhPMlBIVHVnWjNcL1d4ODA4S1FQZEtZMUpcLzZoWEdvTjhlMGc0QkxJd1ZNIiwibWFjIjoiNDFiNWQ3NzdhODkyMDJkMDFjZTk4ZWUzMmIxMjk3ZjQwN2RkMDZkZDQ2NmMwYjUwMmUwZDA4YzU0ZDEwZTg5NSJ9`

// 固定  
export const courseUrl = `https://weblearn.kaikeba.com/student/courseinfo?course_id=${course_id}&__timestamp=1653898285046`  
export const chapterUrl = `https://weblearn.kaikeba.com/student/chapterinfo?course_id=${course_id}&chapter_id=`  
export const mediaUrl ='https://api-vod.baoshiyun.com/vod/v1/platform/media/detail'
