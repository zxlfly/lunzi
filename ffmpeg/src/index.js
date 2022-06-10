import fs from 'fs'
import path from 'path'
import axios from 'axios'
import https from 'https'
(async function () {
  const checkPath = async function (path) {
    try {
      await fs.promises.access(path)
    } catch {
      fs.mkdirSync(path)
    }
    return true
  }

  const basePath = './video/web全栈架构师/Web前端架构师实战特训班01期'
  await checkPath(basePath)


  const config = {
    headers:
    {
      Authorization: 'Bearer pc:7a7e7d1221fab91deb6c334d477d410a',
      cookie: 'kd_user_id=9a3cf297-91ef-4fdf-a517-ee9f7626e9d3; sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%222125277%22%2C%22first_id%22%3A%221800709e7edad7-05d2fb037101558-a58392a-2304000-1800709e7eeb98%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E7%9B%B4%E6%8E%A5%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC_%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%22%2C%22%24latest_referrer%22%3A%22%22%7D%2C%22%24device_id%22%3A%221800709e7edad7-05d2fb037101558-a58392a-2304000-1800709e7eeb98%22%2C%22identities%22%3A%22eyIkaWRlbnRpdHlfY29va2llX2lkIjoiMTgwMDhhYzgyZjVhNzYtMDVjYTdmZjcwMjk5M2ZjLWE1ODM5MmEtMjA3MzYwMC0xODAwOGFjODJmNjEwN2UiLCIkaWRlbnRpdHlfbG9naW5faWQiOiIyMTI1Mjc3In0%3D%22%2C%22history_login_id%22%3A%7B%22name%22%3A%22%24identity_login_id%22%2C%22value%22%3A%222125277%22%7D%7D; kd_5d6526d7-3c9f-460b-b6cf-ba75397ce1ac_log_id=c1aRW1HgrWZwqqNsbJO%3Ac3b48ec9-a8b8-434f-88a6-4e6f821472bf%3A49596e17-4ee5-403d-be13-24126d9dd1f1; deviceId=4e40ad17954cc014a35bda491b73fbb4; ssoToken=cfed75ff133479b24985fdb59614cc27; passportUid=2125277; access-edu_online=5b894d6daa2ad4385062586fbea52f61; kd_5d6526d7-3c9f-460b-b6cf-ba75397ce1ac_view_log_id=O3JmeD7PzkiFPVuTqOr; kd_5d6526d7-3c9f-460b-b6cf-ba75397ce1ac_kuickDeal_pageIndex=1; kd_5d6526d7-3c9f-460b-b6cf-ba75397ce1ac_kuickDeal_leaveTime=1654075010414; kkb_edu_session=eyJpdiI6IkNoOTRKbVwvWjhkSTFHQ3Vxcm5jQlJRPT0iLCJ2YWx1ZSI6IlZxa1dRVHBHRzNyMTRFMFNOV2dWUlhBV3dUZEg0NDNNdDRQZktyNzBqZnNpTkV5SjBpZ04zTzZzcmJxYW1lQ2IiLCJtYWMiOiJkYzNiOGI0NjM3NjBiY2Q3ODA4ZGExODI5Yzc5OTNiMmM2MDc5MDgzNDZlYTljMmE1ZmNlNjJiYjcyNTdjZjdhIn0%3D'
    }
  }

/*  const courseUrl = ''
  const chapterUrl = ''
  const mediaUrl = ''*/
  const course_id = '216475'
  const courseUrl = `https://weblearn.kaikeba.com/student/courseinfo?course_id=${course_id}&__timestamp=1653898285046`
  const chapterUrl = `https://weblearn.kaikeba.com/student/chapterinfo?course_id=${course_id}&chapter_id=`
  const mediaUrl =
      'https://api-vod.baoshiyun.com/vod/v1/platform/media/detail'

  const accessToken = 'dae8461afa0a446c97926b30ee4c9aa1' //0e6a88d9440641599ccccfb9e6ae74d7
  axios.defaults.timeout = 30000;
  axios.defaults.httpsAgent = new https.Agent({ keepAlive: true });
  const { data: { data: courseInfo } } = await axios.get(courseUrl, config)
  const chapterList = courseInfo.chapter_list
  console.log(chapterList);


  let allText = ''
  console.log(chapterList.length);
  for (let i = 0; i < chapterList.length; i++) {

    const chapterName = `${i + 1}、${chapterList[i].chapter_name}`
    const chapterPath = `${basePath}/${chapterName}`
    console.log(await checkPath(chapterPath))
    const url = chapterUrl + chapterList[i].chapter_id
    const { data: { data: chapterInfo } } = await axios.get(url, config)
    // console.log(chapterInfo);

    const sectionList = chapterInfo.section_list
    for (let j = 0; j < sectionList.length; j++) {

      // console.log(sectionList[0].group_list[0].content_list[0].content.length);
      const groupInfo = sectionList[j].group_list[0]
      let name = groupInfo.group_name.replace(/\//g, '-')
      const groupName = `${j + 1}、${name}`
      const groupPath = `${chapterPath}/${groupName}`
      console.log(await checkPath(groupPath))

      const contentList = groupInfo.content_list
      const fileName = groupPath + '/' + name + '.txt'
      for (let k = 0; k < contentList.length; k++) {
        // if(k) break
        const { content: contents, content_type, content_title } = contentList[k]

        if (content_type === 3 || content_type === 7) {
          // fs.rmSync(fileName)
          let contentText = ''
          for (let l = 0; l < contents.length; l++) {
            const { callback_key: mediaId } = contents[l]
            const params = { mediaId, accessToken }
            const { data: { data: videoInfo } } = await axios.get(mediaUrl, { ...config, params })
            const { playURL } = videoInfo.mediaMetaInfo.videoGroup[0]
            console.log(playURL);
            contentText += `ffmpeg -i ${playURL} -c copy -bsf:a aac_adtstoasc ./${content_title}--${l < 9 ? 0 : ''}${l + 1}.mp4\n`
            allText += `ffmpeg -i ${playURL} -c copy -bsf:a aac_adtstoasc "${path.resolve(groupPath)}/${content_title}--${l < 9 ? 0 : ''}${l + 1}.mp4"\n`
          }
          contentText += '\n'
          allText += '\n'
          fs.writeFileSync(fileName, contentText, { flag: 'a+' })
        }

        if (content_type === 6) {
          for (let l = 0; l < contents.length; l++) {
            const { name, url } = contents[l]
            const file = groupPath + '/' + name
            const writer = fs.createWriteStream(file)
            const response = await axios({ url, responseType: 'stream' })
            response.data.pipe(writer)
          }
        }
      }
    }
  }
  fs.writeFileSync('./video/allText.txt', allText)
})()
