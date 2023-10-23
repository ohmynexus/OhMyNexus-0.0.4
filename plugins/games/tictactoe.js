const TicTacToe = require('lib/system/tictactoe')
neoxr.create(async (m, {
   client,
   text,
   prefix,
   command,
   users,
   Func
}) => {
   try {
      client.game = client.game ? client.game : {}
      if (/tttexit/i.test(command)) {
         delete client.game[Object.values(client.game).find(room => room.state === 'WAITING').id]
         return client.reply(m.chat, Func.texted('bold', `🚩 Successfully exit the game.`), m)
      } else {
         if (Object.values(client.game).find(room => room.id.startsWith('tictactoe') && [room.game.playerX, room.game.playerO].includes(m.sender))) return client.reply(m.chat, Func.texted('bold', `🚩 You are still in the game, send ${prefix}tttexit to leave.`), m)
         let room = Object.values(client.game).find(room => room.state === 'WAITING' && (text ? room.name === text : true))
         if (room) {
            // client.reply(m.chat, `Game started!`, m)
            room.o = m.chat
            room.game.playerO = m.sender
            room.state = 'PLAYING'
            let arr = room.game.render().map(v => {
               return {
                  X: '❌',
                  O: '⭕',
                  1: '1️⃣',
                  2: '2️⃣',
                  3: '3️⃣',
                  4: '4️⃣',
                  5: '5️⃣',
                  6: '6️⃣',
                  7: '7️⃣',
                  8: '8️⃣',
                  9: '9️⃣',
               } [v]
            })
            let str = `乂  *T I C T A C T O E*\n\n`
            str += `${arr.slice(0, 3).join('')}\n`
            str += `${arr.slice(3, 6).join('')}\n`
            str += `${arr.slice(6).join('')}\n\n`
            str += `Waiting @${room.game.currentTurn.split('@')[0]} to start!\n`
            str += `Send *surrender* to surrender.\n`
            str += `*Room ID* : ${room.id}`
            if (room.x !== room.o) await client.reply(room.x, str, m)
            await client.reply(room.o, str, m)
         } else {
            room = {
               id: 'tictactoe-' + (+new Date),
               x: m.chat,
               o: '',
               game: new TicTacToe(m.sender, 'o'),
               state: 'WAITING'
            }
            if (text) room.name = text
            client.reply(m.chat, '🚩 *Waiting partner*' + (text ? ' *send command ' + prefix + command + ' ' + text + '*' : ' *. . .*'), m)
            client.game[room.id] = room
         }
      }
   } catch (e) {
      client.reply(m.chat, Func.jsonFormat(e), m)
   }
}, {
   usage: ['tictactoe'],
   hidden: ['ttt', 'tttexit'],
   category: 'games',
   limit: true,
   game: true,
   group: true
}, __filename)