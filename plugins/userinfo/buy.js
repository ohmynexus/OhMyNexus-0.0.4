neoxr.create(async (m, {
   client,
   args,
   prefix,
   command,
   users,
   Func
}) => {
   try {
      let maximum = 100,
         price = 50000
      if (command == 'buy') {
         if (users.limit >= maximum) return client.reply(m.chat, Func.texted('bold', `🚩 Sorry, you can't buy any more limits because you have reached maximum limit.`), m)
         if (users.point < price) return client.reply(m.chat, Func.texted('bold', `🚩 You don't have enough points to buy limit.`), m)
         let amount = (users.point / price).toFixed(0)
         if ((users.limit + parseInt(amount)) >= maximum) return client.reply(m.chat, Func.texted('bold', `🚩 Sorry, you can't buy any more limits because you have reached maximum limit.`), m)
         users.point -= price * parseInt(amount)
         users.limit += parseInt(amount)
         return client.reply(m.chat, `✅ You have purchased *${amount}* limit with *${Func.h2k(price * parseInt(amount))}* points.`, m)
      } else if (command == 'buylimit') {
         if (users.limit >= maximum) return client.reply(m.chat, Func.texted('bold', `🚩 Sorry, you can't buy any more limits because you have reached maximum limit.`), m)
         if (isNaN(args[0])) return client.reply(m.chat, Func.example(prefix, command, '1'), m)
         if (args[0] < 1) return client.reply(m.chat, Func.example(prefix, command, '1'), m)
         if (users.point >= price * parseInt(args[0])) {
            if ((users.limit + parseInt(args[0])) >= maximum) return client.reply(m.chat, Func.texted('bold', `🚩 Limit amount you buy exceeds maximum limit.`), m)
            users.point -= price * parseInt(args[0])
            users.limit += parseInt(args[0])
            return client.reply(m.chat, `✅ You have purchased *${args[0]}* limit with *${Func.h2k(price * args[0])}* points.`, m)
         } else {
            client.reply(m.chat, Func.texted('bold', `🚩 You don't have enough points to buy ${Func.formatNumber(args[0])} limit.`), m)
         }
      } else if (command == 'buyguard') {
     	if (users.guard >= maximum) return client.reply(m.chat, Func.texted('bold', `🚩 Sorry, you can't buy any more limits because you have reached maximum limit.`), m)
         if (isNaN(args[0])) return client.reply(m.chat, Func.example(prefix, command, '1'), m)
         if (args[0] < 1) return client.reply(m.chat, Func.example(prefix, command, '1'), m)
         if (users.point >= price * parseInt(args[0])) {
            if ((users.guard + parseInt(args[0])) >= maximum) return client.reply(m.chat, Func.texted('bold', `🚩 Guard amount you buy exceeds maximum limit.`), m)
            users.point -= price * parseInt(args[0])
            users.guard += parseInt(args[0])
            return client.reply(m.chat, `✅ You have purchased *${args[0]}* guard with *${Func.h2k(price * args[0])}* points.`, m)
         } else {
            client.reply(m.chat, Func.texted('bold', `🚩 You don't have enough points to buy ${Func.formatNumber(args[0])} guard`), m)
         }
      }
   } catch (e) {
      client.reply(m.chat, Func.jsonFormat(e), m)
   }
}, {
   usage: ['buy', 'buylimit', 'buyguard'],
   category: 'user info'
}, __filename)