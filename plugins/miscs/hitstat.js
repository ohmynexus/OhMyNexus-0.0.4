const moment = require('moment-timezone')
moment.tz.setDefault('Asia/Jakarta').locale('id')
neoxr.create(async (m, {
   client,
   prefix,
   command,
   Func
}) => {
   try {
      const types = command == 'hitstat' ? global.db.statistic : Object.fromEntries(Object.entries(global.db.statistic).filter(([_, prop]) => moment(prop.lasthit).format('DDMMYY') == moment(new Date).format('DDMMYY')))
      let stat = Object.keys(types)
      if (stat.length == 0) return client.reply(true, Func.texted('bold', `🚩 No command used.`), m)
      class Hit extends Array {
         total(key) {
            return this.reduce((a, b) => a + (b[key] || 0), 0)
         }
      }
      let sum = new Hit(...Object.values(types))
      let sorted = command == 'hitstat' ? Object.entries(types).sort((a, b) => b[1].hitstat - a[1].hitstat) : Object.entries(types).sort((a, b) => b[1].today - a[1].today)
      let prepare = sorted.map(v => v[0])
      let show = Math.min(10, prepare.length)
      let teks = `乂  *H I T S T A T*\n\n`
      teks += Func.texted('bold', `“Total command hit statistics ${command == 'hitstat' ? 'are currently' : 'for today'} ${Func.formatter(command == 'hitstat' ? sum.total('hitstat') : sum.total('today'))} hits.”`) + '\n\n'
      teks += sorted.slice(0, show).map(([cmd, prop], i) => (i + 1) + '. ' + Func.texted('bold', 'Command') + ' :  ' + Func.texted('monospace', prefix + cmd) + '\n    ' + Func.texted('bold', 'Hit') + ' : ' + Func.formatter(command == 'hitstat' ? prop.hitstat : prop.today) + 'x\n    ' + Func.texted('bold', 'Last Hit') + ' : ' + moment(prop.lasthit).format('DD/MM/YY HH:mm:ss')).join`\n`
      teks += `\n\n${global.footer}`
      client.sendMessageModify(m.chat, teks, m, {
         ads: false,
         largeThumb: true
      })
   } catch (e) {
      client.reply(m.chat, Func.jsonFormat(e), m)
   }
}, {
   usage: ['hitstat', 'hitdaily'],
   category: 'miscs'
}, __filename)