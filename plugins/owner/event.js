const moment = require('moment-timezone')
moment.tz.setDefault('Asia/Jakarta').locale('id')
neoxr.create(async (m, {
   client,
   text,
   prefix,
   command,
   Func,
   Scraper
}) => {
   try {
      let q = m.quoted ? m.quoted : m
      let mime = (q.msg || q).mimetype || ''
      let chatJid = global.db.chats.filter(v => v.jid && v.jid.endsWith('.net')).map(v => v.jid)
      let groupList = async () => Object.entries(await client.groupFetchAllParticipating()).slice(0).map(entry => entry[1])
      let groupJid = await (await groupList()).map(v => v.id)
      const id = command == 'eventpc' ? chatJid : groupJid
      if (id.length == 0) return client.reply(m.chat, Func.texted('bold', `🚩 Error, ID does not exist.`), m)
      if (!text) return m.reply(explain(prefix, command))
      let [question, answer, slot, rKey, rVal] = text.split`|`
      const rewardKey = Object.freeze({
         1: 'PREMIUM',
         2: 'POINT',
         3: 'LIMIT',
         4: 'RANDOM_POINT',
         5: 'RANDOM_LIMIT'
      })
      const _id = Func.makeId(15)
      if (/video|image\/(jpe?g|png)/.test(mime)) {
         if (!question) return m.reply(Func.texted('bold', `🚩 Event should have questions.`))
         if (!answer) return m.reply(Func.texted('bold', `🚩 Event should have an answer.`))
         if (!slot) return m.reply(Func.texted('bold', `🚩 Give the number of respondents.`))
         if (slot && isNaN(slot)) return m.reply(Func.texted('bold', `🚩 The number of respondents must be in numeric form.`))
         client.sendReact(m.chat, '🕒', m.key)
         global.db.setting.quizset.push({
            _id: _id,
            status: true,
            question: question.trim(),
            answer: answer.trim().toLowerCase(),
            reward_key: Number(rKey || 4),
            reward_value: Number(rVal || 0),
            slot: Number(slot),
            correct: [],
            respondents: [],
            created_at: new Date * 1,
            timeout: global.timer,
            url: await (await Scraper.uploadImageV2(await q.download())).data.url
         })
         let caption = `乂  *EVENT GIFT🎁*\n\n`
         caption += `Event gift edisi ${moment(new Date * 1).format('DD/MM/YYYY (HH:mm)')} WIB\n`
         caption += ` ${question.trim()}\n\n`
         caption += `slot : [ ${slot.trim()} ]\n`
         caption += `expired : [ *${((global.timer / 1000) / 60)} menit* ]\n`
         caption += `reply pesan broadcast ini dan ketikan *CODE GIF* dengan benar .\n\n`
         caption += `#ID-${_id}`
         for (let jid of id) {
            await Func.delay(1500)
            let media = await q.download()
            await client.sendFile(jid, media, '', caption, null, null,
               command == 'Eventgc' ? {
                  contextInfo: {
                     mentionedJid: await (await client.groupMetadata(jid)).participants.map(v => v.id)
                  }
               } : {})
         }
         client.reply(m.chat, Func.texted('bold', `🚩 Successfully send broadcast message to ${id.length} ${command == 'bc' ? 'chats' : 'groups'}`), m)
      } else client.reply(m.chat, Func.texted('bold', `🚩 Media not found or media is not supported.`), m)
   } catch (e) {
     //client.reply(m.chat, Func.jsonFormat(e), m)
   }
}, {
   usage: ['eventgc', 'eventpc'],
   use: 'text or reply media',
   category: 'owner',
   owner: true
}, __filename)

const explain = (prefix, command) => {
   return `乂  *R K E Y*

1: 'PREMIUM'
2: 'POINT'
3: 'LIMIT'    
4: 'RANDOM_POINT'
5: 'RANDOM_LIMIT'

Format : ${prefix+command} question | answer | slot | rKey | rValue`
}