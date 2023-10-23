const axios = require('axios')
neoxr.create(async (m, {
   client,
   text,
   prefix,
   command,
   Func,
   Scraper
}) => {
   try {
      if (!text) return client.reply(m.chat, Func.example(prefix, command, 'lathi'), m)
      client.sendReact(m.chat, '🕒', m.key).then(() => client.reply(m.chat, 'note : mohon tunggu ✋️', m))
      const json = await Api.play(text)
      if (!json.status || !json.data.url) return client.reply(m.chat, Func.jsonFormat(json), m)
      let caption = `乂  *Y T - P L A Y*\n\n`
      caption += `	◦  *Title* : ${json.title}\n`
      caption += `	◦  *Size* : ${json.data.size}\n`
      caption += `	◦  *Duration* : ${json.duration}\n`
      caption += `	◦  *Bitrate* : ${json.data.quality}\n\n`
      caption += global.footer
      let chSize = Func.sizeLimit(json.data.size, global.max_upload)
      if (chSize.oversize) return client.reply(m.chat, `💀 File size (${json.data.size}) exceeds the maximum limit, download it by yourself via this link : ${await (await Scraper.shorten(json.data.url)).data.url}`, m)
      client.sendMessageModify(m.chat, caption, m, {
         largeThumb: true,
         thumbnail: await Func.fetchBuffer(json.thumbnail)
      }).then(async () => {
         const result = await Func.getFile(await (await axios.get(json.data.url, {
            responseType: 'arraybuffer',
            headers: {
               referer: 'https://y2mate.com'
            }
         })).data)
         client.sendFile(m.chat, './' + result.file, json.data.filename, '', m, {
            document: true,
            APIC: await Func.fetchBuffer(json.thumbnail)
         })
      })
   } catch (e) {
      console.log(e)
      return client.reply(m.chat, Func.texted('bold', e.message), m)
   }
}, {
   usage: ['play'],
   hidden: ['lagu', 'song', 'music'],
   use: 'query',
   category: 'features',
   limit: true
}, __filename)