const axios = require('axios')
const decode = require('html-entities').decode
neoxr.create(async (m, {
   client,
   body,
   users,
   prefixes,
   setting,
   Scraper,
   Func
}) => {
   try {
      const regex1 = /^(?:https?:\/\/)?(?:www\.)?(?:instagram\.com\/)(?:tv\/|p\/|reel\/)(?:\S+)?$/;
      const regex2 = /^(?:https?:\/\/)?(?:www\.)?(?:instagram\.com\/)(?:stories\/)(?:\S+)?$/;
      const regex3 = /^(?:https?:\/\/)?(?:www\.)?(?:instagram\.com\/)(?:s\/)(?:\S+)?$/;
      const regex4 = /^(?:https?:\/\/)?(?:www\.|vt\.|vm\.|t\.)?(?:tiktok\.com\/)(?:\S+)?$/;
      const regex5 = /^(?:https?:\/\/)?(?:www\.)?(?:mediafire\.com\/)(?:\S+)?$/;
      const regex6 = /pin(?:terest)?(?:\.it|\.com)/;
      const regex7 = /http(?:s)?:\/\/(?:www\.|mobile\.)?twitter\.com\/([a-zA-Z0-9_]+)/;
      const regex8 = /^(?:https?:\/\/(web\.|www\.|m\.)?(facebook|fb)\.(com|watch)\S+)?$/;
      const regex9 = /^(?:https?:\/\/)?(?:www\.|m\.|music\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/;
      const regex10 = /^(?:https?:\/\/)?(?:podcasts\.)?(?:google\.com\/)(?:feed\/)(?:\S+)?$/;
      const extract = body ? Func.generateLink(body) : null
      if (!extract) return
      if (body && !m.isGroup && users && !users.banned && !users.verified && setting.verify) return client.reply(m.chat, `🚩 Your number has not been verified, verify by sending *${prefixes[0]}reg <email>*`, m)
      const links1 = extract.filter(v => Func.igFixed(v).match(regex1))
      const links2 = extract.filter(v => v.match(regex2))
      const links3 = extract.filter(v => v.match(regex3))
      const links4 = extract.filter(v => Func.ttFixed(v).match(regex4))
      const links5 = extract.filter(v => v.match(regex5))
      const links6 = extract.filter(v => v.match(regex6))
      const links7 = extract.filter(v => v.match(regex7))
      const links8 = extract.filter(v => v.match(regex8))
      const links9 = extract.filter(v => v.match(regex9))
      const links10 = extract.filter(v => v.match(regex10))
      if (!Func.generateLink(body).some(v => Func.socmed(v))) return
      if (users.limit > 0) {
         let limit = 1
         if (users.limit >= limit) {
            users.limit -= limit
            // m.reply(`🪫 Remaining Limits : *[ ${users.limit} / ${users.premium ? 1000 : global.limit} ]*`)
         } else return client.reply(m.chat, Func.texted('bold', `🚩 Your limit is not enough to use this feature.`), m)
      }
      client.sendReact(m.chat, '🕒', m.key)

      // Instagram Post
      if (links1.length != 0) {
         let old = new Date()
         Func.hitstat('ig', m.sender)
         links1.map(async link => {
            let json = await Api.ig(Func.igFixed(link))
            if (!json.status) return client.reply(m.chat, Func.jsonFormat(json), m)
            for (let v of json.data) {
               client.sendFile(m.chat, v.url, v.type == 'mp4' ? Func.filename('mp4') : Func.filename('jpg'), `🍟 *Fetching* : ${((new Date - old) * 1)} ms`, m)
               await Func.delay(1500)
            }
         })
      }

      // Instagram Story
      if (links2.length != 0) {
         let old = new Date()
         Func.hitstat('igs', m.sender)
         links2.map(async link => {
            let json = await Api.igs(link)
            if (!json.status) return client.reply(m.chat, global.status.fail, m)
            for (let v of json.data) client.sendFile(m.chat, v.url, ``, `🍟 *Fetching* : ${((new Date - old) * 1)} ms`, m)
         })
      }

      // Tiktok
      if (links4.length != 0) {
         let old = new Date()
         Func.hitstat('tiktok', m.sender)
         links4.map(async link => {
            let json = await Api.tiktok(Func.ttFixed(link))
            if (!json.status) return client.reply(m.chat, Func.jsonFormat(json), m)
            let caption = `乂  *T I K T O K*\n\n`
            caption += `	◦  *Author* : ${json.data.author.nickname} (@${json.data.author.username})\n`
            caption += `	◦  *Views* : ${Func.formatter(json.data.stats.play_count)}\n`
            caption += `	◦  *Likes* : ${Func.formatter(json.data.stats.digg_count)}\n`
            caption += `	◦  *Shares* : ${Func.formatter(json.data.stats.share_count)}\n`
            caption += `	◦  *Comments* : ${Func.formatter(json.data.stats.comment_count)}\n`
            caption += `	◦  *Duration* : ${Func.toTime(json.data.duration)}\n`
            caption += `	◦  *Sound* : ${json.data.music.title} - ${json.data.music.author}\n`
            caption += `	◦  *Caption* : ${json.data.caption || '-'}\n`
            caption += `	◦  *Fetching* : ${((new Date - old) * 1)} ms\n\n`
            caption += global.footer
            client.sendFile(m.chat, json.data.video, 'video.mp4', caption, m)
         })
      }

      // Mediafire
      if (links5.length != 0) {
         let old = new Date()
         Func.hitstat('mediafire', m.sender)
         links5.map(async link => {
            let json = await Api.mediafire(link)
            if (!json.status) return client.reply(m.chat, Func.jsonFormat(json), m)
            let text = `乂  *M E D I A F I R E*\n\n`
            text += '	◦  *Name* : ' + unescape(decode(json.data.filename)) + '\n'
            text += '	◦  *Size* : ' + json.data.size + '\n'
            text += '	◦  *Extension* : ' + json.data.extension + '\n'
            text += '	◦  *Mime* : ' + json.data.mime + '\n'
            text += '	◦  *Uploaded* : ' + json.data.uploaded + '\n\n'
            text += global.footer
            let chSize = Func.sizeLimit(json.data.size, global.max_upload)
            if (chSize.oversize) return client.reply(m.chat, `💀 File size (${json.data.size}) exceeds the maximum limit, download it by yourself via this link : ${await (await Scraper.shorten(json.data.link)).data.url}`, m)
            client.sendMessageModify(m.chat, text, m, {
               largeThumb: true,
               thumbnail: await Func.fetchBuffer('https://telegra.ph/file/fcf56d646aa059af84126.jpg')
            }).then(async () => {
               client.sendFile(m.chat, json.data.link, unescape(decode(json.data.filename)), '', m)
            })
         })
      }

      // Pinterest
      if (links6.length != 0) {
         let old = new Date()
         Func.hitstat('pin', m.sender)
         links6.map(async link => {
            let json = await Api.pin(link)
            if (!json.status) return client.reply(m.chat, Func.jsonFormat(json), m)
            if (/jpg|mp4/.test(json.data.type)) return client.sendFile(m.chat, json.data.url, '', `🍟 *Fetching* : ${((new Date - old) * 1)} ms`, m)
            if (json.data.type == 'gif') return client.sendFile(m.chat, json.data.url, '', `🍟 *Fetching* : ${((new Date - old) * 1)} ms`, m, {
               gif: true
            })
         })
      }

      // Twitter
      if (links7.length != 0) {
         let old = new Date()
         Func.hitstat('twitter', m.sender)
         links7.map(async link => {
            let json = await Api.twitter(link)
            if (!json.status) return client.reply(m.chat, Func.jsonFormat(json), m)
            for (let v of json.data) {
               client.sendFile(m.chat, v.url, Func.filename(v.type), `◦ *Type* : ${v.title}`, m)
               await Func.delay(1500)
            }
         })
      }

      // Facebook
      if (links8.length != 0) {
         let old = new Date()
         Func.hitstat('fb', m.sender)
         links8.map(async link => {
            let json = await Api.fb(link)
            if (!json.status) return client.reply(m.chat, Func.jsonFormat(json), m)
            let result = json.data.find(v => v.quality == 'HD' && v.response == 200)
            if (result) {
               client.sendFile(m.chat, result.url, Func.filename('mp4'), `◦ *Quality* : HD`, m)
            } else {
               let result = json.data.find(v => v.quality == 'SD' && v.response == 200)
               if (!result) return client.reply(m.chat, global.status.fail, m)
               client.sendFile(m.chat, result.url, Func.filename('mp4'), `◦ *Quality* : SD`, m)
            }
         })
      }

      // Youtube
      if (links9.length != 0) {
         let old = new Date()
         Func.hitstat('yt', m.sender)
         links9.map(async link => {
            var json = await Func.fetchJson('https://neoxr.cyclic.app/api/fetch?url=' + link + '&type=video&quality=480p')
            if (!json.status) {
               var json = await Func.fetchJson('https://neoxr.cyclic.app/api/fetch?url=' + link + '&type=video&quality=360p')
            }
            if (!json.status || !json.data.url) return client.reply(m.chat, Func.jsonFormat(json), m)
            let caption = `乂  *Y T - M P 4*\n\n`
            caption += `	◦  *Title* : ${json.title}\n`
            caption += `	◦  *Size* : ${json.data.size}\n`
            caption += `	◦  *Duration* : ${json.duration}\n`
            caption += `	◦  *Quality* : ${json.data.quality}\n\n`
            caption += global.footer
            let chSize = Func.sizeLimit(json.data.size, global.max_upload)
            if (chSize.oversize) return client.reply(m.chat, `💀 File size (${json.data.size}) exceeds the maximum limit, download it by yourself via this link : ${await (await Scraper.shorten(json.data.url)).data.url}`, m)
            const result = await Func.getFile(await (await axios.get(json.data.url, {
               responseType: 'arraybuffer',
               headers: {
                  referer: 'https://y2mate.com'
               }
            })).data)
            let isSize = (json.data.size).replace(/MB/g, '').trim()
            if (isSize > 99) return client.sendMessageModify(m.chat, caption, m, {
               largeThumb: true,
               thumbnail: await Func.fetchBuffer(json.thumbnail)
            }).then(async () => await client.sendFile(m.chat, './' + result.file, json.data.filename, '', m, {
               document: true
            }))
            client.sendFile(m.chat, './' + result.file, json.data.filename, caption, m)
         })
      }

      // Podcast
      if (links10.length != 0) {
         client.sendReact(m.chat, '🕒', m.key)
         Func.hitstat('podcast', m.sender)
         links10.map(async link => {
            let json = await Api.podcast(link)
            if (!json.status) return client.reply(m.chat, Func.jsonFormat(json), m)
            let teks = `乂  *P O D C A S T*\n\n`
            teks += `	◦  *Title* : ${json.data.title}\n`
            teks += `	◦  *Author* : ${json.data.author}\n`
            teks += `	◦  *Duration* : ${json.data.duration}\n\n`
            teks += global.footer
            client.sendMessageModify(m.chat, teks, m, {
               ads: false,
               largeThumb: true,
               thumbnail: await Func.fetchBuffer('https://telegra.ph/file/92be727e349c3cf78c98a.jpg')
            }).then(() => {
               client.sendFile(m.chat, json.data.audio, json.data.title + '.' + (/m4a/.test(json.data.audio) ? 'm4a' : 'mp3'), '', m, {
                  document: true
               })
            })
         })
      }
   } catch (e) {
      console.log(e)
      return client.reply(m.chat, Func.texted('bold', e.message), m)
   }
}, {
   limit: true,
   download: true
}, __filename)