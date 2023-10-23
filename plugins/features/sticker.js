neoxr.create(async (m, {
   client,
   text,
   prefix,
   command,
   Func
}) => {
   try {
      if (['sticker', 's', 'sk', 'sgif'].includes(command)) {
         let exif = global.db.setting
         if (text) {
            if (m.isGroup) return client.reply(m.chat, global.status.private, m)
            let json = await Api.sticker(text)
            if (!json.status) return client.reply(m.chat, global.status.fail, m)
            client.sendReact(m.chat, '🕒', m.key)
            if (text.match('getstickerpack.com')) {
               for (let i = 0; i < json.data.length; i++) {
                  client.sendSticker(m.chat, await Func.fetchBuffer(json.data[i].url), m, {
                     packname: exif.sk_pack,
                     author: exif.sk_author
                  })
                  await Func.delay(2000)
               }
               await client.reply(m.chat, Func.texted('bold', `✅ Done, all stickers converted successfully.`), m)
            } else {
               let rows = []
               json.data.map(async (v, i) => {
                  rows.push({
                     title: v.name,
                     rowId: `${prefix + command} ${v.url}`,
                     description: ``
                  })
               })
               client.sendList(m.chat, '', `Showing search results for : “${text}”, choose the sticker you want to convert. 🍟`, '', 'Tap!', [{
                  rows
               }], m)
            }
         } else {
            if (m.quoted ? m.quoted.message : m.msg.viewOnce) {
               let type = m.quoted ? Object.keys(m.quoted.message)[0] : m.mtype
               let q = m.quoted ? m.quoted.message[type] : m.msg
               let img = await client.downloadMediaMessage(q)
               if (/video/.test(type)) {
                  if (q.seconds > 10) return client.reply(m.chat, Func.texted('bold', `🚩 Maximum video duration is 10 seconds.`), m)
                  client.sendReact(m.chat, '🕒', m.key)
                  return await client.sendSticker(m.chat, img, m, {
                     packname: exif.sk_pack,
                     author: exif.sk_author
                  })
               } else if (/image/.test(type)) {
                  client.sendReact(m.chat, '🕒', m.key)
                  return await client.sendSticker(m.chat, img, m, {
                     packname: exif.sk_pack,
                     author: exif.sk_author
                  })
               }
            } else {
               let q = m.quoted ? m.quoted : m
               let mime = (q.msg || q).mimetype || ''
               if (/image\/(jpe?g|png)/.test(mime)) {
                  let img = await q.download()
                  if (!img) return client.reply(m.chat, global.status.wrong, m)
                  client.sendReact(m.chat, '🕒', m.key)
                  return await client.sendSticker(m.chat, img, m, {
                     packname: exif.sk_pack,
                     author: exif.sk_author
                  })
               } else if (/video/.test(mime)) {
                  if ((q.msg || q).seconds > 10) return client.reply(m.chat, Func.texted('bold', `🚩 Maximum video duration is 10 seconds.`), m)
                  let img = await q.download()
                  if (!img) return client.reply(m.chat, global.status.wrong, m)
                  client.sendReact(m.chat, '🕒', m.key)
                  return await client.sendSticker(m.chat, img, m, {
                     packname: exif.sk_pack,
                     author: exif.sk_author
                  })
               } else client.reply(m.chat, Func.texted('bold', `Stress ??`), m)
            }
         }
      } else if (command == 'swm') {
         let [packname, categories, ...author] = text.split`|`
         author = (author || []).join`|`
         if (m.quoted ? m.quoted.message : m.msg.viewOnce) {
            let type = m.quoted ? Object.keys(m.quoted.message)[0] : m.mtype
            let q = m.quoted ? m.quoted.message[type] : m.msg
            let img = await client.downloadMediaMessage(q)
            if (/video/.test(type)) {
               if (q.seconds > 10) return client.reply(m.chat, Func.texted('bold', `🚩 Maximum video duration is 10 seconds.`), m)
               return await client.sendSticker(m.chat, img, m, {
                  packname: packname || '',
                  author: author || '',
                  categories: categories || ''
               })
            } else if (/image/.test(type)) {
               return await client.sendSticker(m.chat, img, m, {
                  packname: packname || '',
                  author: author || '',
                  categories: categories || ''
               })
            }
         } else {
            let q = m.quoted ? m.quoted : m
            let mime = (q.msg || q).mimetype || ''
            if (/image\/(jpe?g|png)/.test(mime)) {
               let img = await q.download()
               if (!img) return client.reply(m.chat, global.status.wrong, m)
               return await client.sendSticker(m.chat, img, m, {
                  packname: packname || '',
                  author: author || '',
                  categories: categories || ''
               })
            } else if (/video/.test(mime)) {
               if ((q.msg || q).seconds > 10) return client.reply(m.chat, Func.texted('bold', `🚩 Maximum video duration is 10 seconds.`), m)
               let img = await q.download()
               if (!img) return client.reply(m.chat, global.status.wrong, m)
               return await client.sendSticker(m.chat, img, m, {
                  packname: packname || '',
                  author: author || '',
                  categories: categories || ''
               })
            } else client.reply(m.chat, `🚩 To create a watermark on sticker reply media photo or video and use this format *${prefix + command} packname | author*`, m)
         }
      }
   } catch (e) {
      console.log(e)
      return client.reply(m.chat, Func.jsonFormat(e), m)
   }
}, {
   usage: ['sticker', 'swm'],
   hidden: ['s', 'sk', 'sgif'],
   use: 'reply media',
   category: 'features',
   limit: true
}, __filename)