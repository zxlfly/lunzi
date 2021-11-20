- 图片识别：``usercenter``
- 断点续传、切片、秒传：``upload``
  - 切片
  - 使用``spark-md5``增量计算
  - 使用worker的问题
    - 需要将``spark-md5``复制一份放到``static``静态资源下
    - 不在npm包里面，但是处理大文件性能更好
    - 也可以使用requestIdleCallback
      - 因为是在主线程工作，性能会弱一点

### ``uploadbase``基础的使用上面两种方式实现切片（全量）
### ``uploadsampling``抽样hash
2m为单位，头部取2m，中间的取前中后2个字节，余下的尾部的全要  
抽样hash值不变的情况下不一定没有发生改变，变了就一定改变了。  
### ``uploadslice``切片上传
前面已经实现了文件切片，只需要将对应的切片内容转换成formdate（``let form = new FormData() form.append("name", chunk.name)......``）即可。上传之后后台接受完成，前端需要调到合并接口。
### ``uploadsp``秒传/断点续传
- 算完hash，切片之后询问后端是否上传过，或者上传了一部分
  - 服务器存在对应文件
    - 则提示秒传成功
  - 只存在一部分切片
    - 返回列表，上传是将对应的进度改为100%
    - 上传余下部分
### ``uploadplus``并发数控制，报错重试+次数限制
根据chunks得到对应的要上传的axios的promise，控制数量，失败了重试，同一个任务失败n次后终止整个上传任务。  
此时的chunks的内容格式为``{ form, i: chunk.i ,error:0}``
### @todo关于根据网速。调整每次上传的内容大小
目前想到比较好的方式是，切片的时候将切片控制的小一些，根据网络情况决定每个上传任务上传的切片数量。这种方式只需要算一次切片。
@todo（不重要...）
使用husky限制在commit时跑lint和test；使用commitizen规范提交信息

## 文本编辑器
- marked
- highlightjs

## 富文本编辑器
@todo