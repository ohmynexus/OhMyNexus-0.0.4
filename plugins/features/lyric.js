neoxr.create(async (m, {
   client,
   text,
   prefix,
   command,
   Func
}) => {
   try {
      global.lyric = global.lyric ? global.lyric : []
      if (!text) return client.reply(m.chat, Func.example(prefix, command, 'lathi'), m)
      const check = global.lyric.find(v => v.jid == m.sender)
      if (!check && !isNaN(text)) return m.reply(Func.texted('bold', `🚩 Your session has expired / does not exist, do another search using the keywords you want.`))
      if (check && !isNaN(text)) {
         if (Number(text) > check.results.length) return m.reply(Func.texted('bold', `🚩 Exceed amount of data.`))
         client.sendReact(m.chat, '🕒', m.key)
         const json = await Api.lyric(check.results[Number(text) - 1])
         if (!json.status) return client.reply(m.chat, Func.jsonFormat(json), m)
         let p = `${json.data.title.toUpperCase()}\n\n`
         p += json.data.lyric
         p += '\n\n' + global.footer
         client.reply(m.chat, p, m)
      } else {
         client.sendReact(m.chat, '🕒', m.key)
         const json = await Api.lyric(text)
         if (!json.status) return client.reply(m.chat, Func.jsonFormat(json), m)
         if (!check) {
            global.lyric.push({
               jid: m.sender,
               results: json.data.map(v => v.url),
               created_at: new Date * 1
            })
         } else check.results = json.data.map(v => v.url)
         let p = `To showing lyrics use this command *${prefix + command} number*\n`
         p += `*Example* : ${prefix + command} 1\n\n`
         json.data.map((v, i) => {
            p += `*${i+1}*. ${v.title}\n`
            p += `◦ *Link* : ${v.url}\n\n`
         }).join('\n\n')
         p += global.footer
         client.reply(m.chat, p, m)
      }
      setInterval(async () => {
         const session = global.lyric.find(v => v.jid == m.sender)
         if (session && new Date - session.created_at > global.timer) {
            Func.removeItem(global.lyric, session)
         }
      }, 60_000)
   } catch (e) {
      client.reply(m.chat, Func.jsonFormat(e), m)
   }
}, {
   usage: ['lyric'],
   hidden: ['lirik'],
   use: 'query',
   category: 'features',
   limit: true
}, __filename)