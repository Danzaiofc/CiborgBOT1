/*
* Thanks For 𝗠𝗵𝗮𝗻𝗸𝗕𝗮𝗿𝗕𝗮𝗿
*/

const
{
   WAConnection,
   MessageType,
   Presence,
   MessageOptions,
   Mimetype,
   WALocationMessage,
   WA_MESSAGE_STUB_TYPES,
   ReconnectMode,
   ProxyAgent,
   GroupSettingChange,
   waChatKey,
   mentionedJid,
   processTime,
} = require("@adiwajshing/baileys")
const qrcode = require("qrcode-terminal") //ANAK ASU
const moment = require("moment-timezone") //TOBAT SU
const fs = require("fs") //SU
const { color, bgcolor } = require('./lib/color')
const { help } = require('./lib/help')
const kagApi = require('@kagchi/kag-api')
const { donasi } = require('./lib/donasi')
const { fetchJson } = require('./lib/fetcher')
const { recognize } = require('./lib/ocr')
const { wait, simih, getBuffer, h2k, generateMessageID, getGroupAdmins, getRandom, banner, start, info, success, close } = require('./lib/functions')
const tiktod = require('tiktok-scraper')
const ffmpeg = require('fluent-ffmpeg')
const { removeBackgroundFromImageFile } = require('remove.bg')
const welkom = JSON.parse(fs.readFileSync('./src/welkom.json'))
const nsfw = JSON.parse(fs.readFileSync('./src/nsfw.json'))
const samih = JSON.parse(fs.readFileSync('./src/simi.json'))
const vcard = 'BEGIN:VCARD\n' // ANAK ANJING MAU NGAPAIN?
            + 'VERSION:3.0\n' // NGAPAIN LAGI KALO GA MAU NUMPANG NAMA DOANG XIXIXIXI
            + 'FN:Indra🖤\n' // MENDING LU TOBAT SU!
            + 'ORG:Creator PUDIDIXBOT;\n' // KASIH CREDITS GUA SU!!!
            + 'TEL;type=CELL;type=VOICE;waid=6285277844044:+62 852-7784-4044\n' // JANGAN KEK BABI SU
            + 'END:VCARD' // ARIS187 ID
prefix = '-'
blocked = []            
const time = moment().tz('Asia/Jakarta').format("HH:mm:ss")
const arrayBulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

const bulan = arrayBulan[moment().format('MM') - 1]

const config = {
    A187: '🔹𝗣𝗨𝗗𝗜𝗗𝗜𝗫𝗕𝗢𝗧🔹', // TOBAT SU ASU
    instagram: 'https://instagram.com/vec.m_', // INFO JANGAN DI UBAH
    nomer: 'wa.me/6285277844044', // INFO SU JNGAN DI UBAH
    youtube: 'https://youtube.com/channel/UCV9_aVlaGMoedyEn7YMnImQ', // KINTIL
    whatsapp: 'https://chat.whatsapp.com/DSSHmG2KjKJLoFp9B9mkVs', // BABI
    tanggal: `TANGGAL: ${moment().format('DD')} ${bulan} ${moment().format('YYYY')}`,
    waktu: time
}

function kyun(seconds){
  function pad(s){
    return (s < 10 ? '0' : '') + s;
  }
  var hours = Math.floor(seconds / (60*60));
  var minutes = Math.floor(seconds % (60*60) / 60);
  var seconds = Math.floor(seconds % 60);

  //return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds)
  return `${pad(hours)} Jam ${pad(minutes)} Menit ${pad(seconds)} Detik`
}


const { tanggal, waktu, instagram, whatsapp, youtube, nomer, ontime } = config



const { exec } = require("child_process")

const client = new WAConnection()

client.on('qr', qr => {
   qrcode.generate(qr, { small: true })
   console.log(`[ ${time} ] QR code is ready, subscribe Vectors Moe`)
})

client.on('credentials-updated', () => {
   const authInfo = client.base64EncodedAuthInfo()
   console.log(`credentials updated!`)

   fs.writeFileSync('./session.json', JSON.stringify(authInfo, null, '\t'))
})

fs.existsSync('./session.json') && client.loadAuthInfo('./session.json')

client.connect();

// client.on('user-presence-update', json => console.log(json.id + ' presence is => ' + json.type)) || console.log(`${time}: Bot by Armantod`)

client.on('group-participants-update', async (anu) => {
		if (!welkom.includes(anu.jid)) return
		try {
			const mdata = await client.groupMetadata(anu.jid)
			console.log(anu)
			if (anu.action == 'add') {
				num = anu.participants[0]
				try {
					ppimg = await client.getProfilePicture(`${anu.participants[0].split('@')[0]}@c.us`)
				} catch {
					ppimg = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
				}
				teks = `Hallo @${num.split('@')[0]}\nSelamat Datang Di Group _*${mdata.subject}*_ Semoga Betah:3`
				let buff = await getBuffer(ppimg)
				client.sendMessage(mdata.id, buff, MessageType.image, {caption: teks, contextInfo: {"mentionedJid": [num]}})
			} else if (anu.action == 'remove') {
				num = anu.participants[0]
				try {
					ppimg = await client.getProfilePicture(`${num.split('@')[0]}@c.us`)
				} catch {
					ppimg = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
				}
				teks = `*Say goodbye to* @${num.split('@')[0]}\n *Sekalian titip kopi gausah di aduk gan!*`
				let buff = await getBuffer(ppimg)
				client.sendMessage(mdata.id, buff, MessageType.image, {caption: teks, contextInfo: {"mentionedJid": [num]}})
			}
		} catch (e) {
			console.log('Error : %s', color(e, 'red'))
		}
	})
	client.on('CB:Blocklist', json => {
		if (blocked.length > 2) return
	    for (let i of json[1].blocklist) {
	    	blocked.push(i.replace('c.us','s.whatsapp.net'))
	    }
	})

	client.on('message-new', async (mek) => {
		try {
			if (!mek.message) return
			if (mek.key && mek.key.remoteJid == 'status@broadcast') return
			if (mek.key.fromMe) return
			global.prefix
			global.blocked
			const content = JSON.stringify(mek.message)
			const from = mek.key.remoteJid
			const type = Object.keys(mek.message)[0]
			
			const { text, extendedText, contact, location, liveLocation, image, video, sticker, document, audio, product } = MessageType
			const time = moment.tz('Asia/Jakarta').format('DD/MM HH:mm:ss')
			body = (type === 'conversation' && mek.message.conversation.startsWith(prefix)) ? mek.message.conversation : (type == 'imageMessage') && mek.message.imageMessage.caption.startsWith(prefix) ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption.startsWith(prefix) ? mek.message.videoMessage.caption : (type == 'extendedTextMessage') && mek.message.extendedTextMessage.text.startsWith(prefix) ? mek.message.extendedTextMessage.text : ''
			budy = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : ''
			const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
			const args = body.trim().split(/ +/).slice(1)
			const isCmd = body.startsWith(prefix)

			mess = {
				wait: '*[❗]* 𝙒𝘼𝙄𝙏 𝙋𝙍𝙊𝘾𝙀𝙎𝙎𝙄𝙉𝙂',
				success: '️*[ ✅ ]* 𝙎𝙐𝙆𝙎𝙀𝙎 *!* 𝙆𝘼𝙆🖤',
				error: {
					stick: '𝐘𝐞𝐚𝐡 𝐠𝐚𝐠𝐚𝐥 ;( , 𝐜𝐨𝐛𝐚 𝐥𝐚𝐠𝐢 𝐤𝐚𝐤  ><',
					Iv: '𝗠𝗮𝗮𝗳 𝗹𝗶𝗻𝗸 𝘁𝗶𝗱𝗮𝗸 𝘃𝗮𝗹𝗶𝗱.'
				},
				only: {
					group: '𝐌𝐚𝐚𝐟 𝐩𝐞𝐫𝐢𝐧𝐭𝐚𝐡 𝐢𝐧𝐢 𝐡𝐚𝐧𝐲𝐚 𝐛𝐢𝐬𝐚 𝐝𝐢 𝐠𝐮𝐧𝐚𝐤𝐚𝐧 𝐝𝐚𝐥𝐚𝐦 𝐠𝐫𝐨𝐮𝐩',
					ownerG: '𝐌𝐚𝐚𝐟 𝐩𝐞𝐫𝐢𝐧𝐭𝐚𝐡 𝐢𝐧𝐢 𝐡𝐚𝐧𝐲𝐚 𝐛𝐢𝐬𝐚 𝐝𝐢 𝐠𝐮𝐧𝐚𝐤𝐚𝐧 𝐨𝐥𝐞𝐡 𝐨𝐰𝐧𝐞𝐫 𝐠𝐫𝐨𝐮𝐩',
					ownerB: '𝐌𝐚𝐚𝐟 𝐩𝐞𝐫𝐢𝐧𝐭𝐚𝐡 𝐢𝐧𝐢 𝐡𝐚𝐧𝐲𝐚 𝐛𝐢𝐬𝐚 𝐝𝐢 𝐠𝐮𝐧𝐚𝐤𝐚𝐧 𝐨𝐥𝐞𝐡 𝐨𝐰𝐧𝐞𝐫 𝐛𝐨𝐭',
					admin: '𝐌𝐚𝐚𝐟 𝐩𝐞𝐫𝐢𝐧𝐭𝐚𝐡 𝐢𝐧𝐢 𝐡𝐚𝐧𝐲𝐚 𝐛𝐢𝐬𝐚 𝐝𝐢 𝐠𝐮𝐧𝐚𝐤𝐚𝐧 𝐨𝐥𝐞𝐡 𝐚𝐝𝐦𝐢𝐧 𝐠𝐫𝐨𝐮𝐩',
					Badmin: '𝐌𝐚𝐚𝐟 𝐩𝐞𝐫𝐢𝐧𝐭𝐚𝐡 𝐢𝐧𝐢 𝐡𝐚𝐧𝐲𝐚 𝐛𝐢𝐬𝐚 𝐝𝐢 𝐠𝐮𝐧𝐚𝐤𝐚𝐧 𝐣𝐢𝐤𝐚 𝐛𝐨𝐭 𝐦𝐞𝐧𝐣𝐚𝐝𝐢 𝐚𝐝𝐦𝐢𝐧'
				}
			}

			const botNumber = client.user.jid
			const ownerNumber = ["6285807107404@s.whatsapp.net","6281910263857@s.whatsapp.net"] // ganti nomer lu
			const isGroup = from.endsWith('@g.us')
			const sender = isGroup ? mek.participant : mek.key.remoteJid
			const groupMetadata = isGroup ? await client.groupMetadata(from) : ''
			const groupName = isGroup ? groupMetadata.subject : ''
			const groupId = isGroup ? groupMetadata.jid : ''
			const groupMembers = isGroup ? groupMetadata.participants : ''
			const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
			const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
			const isGroupAdmins = groupAdmins.includes(sender) || false
			const isWelkom = isGroup ? welkom.includes(from) : false
			const isNsfw = isGroup ? nsfw.includes(from) : false
			const isSimi = isGroup ? samih.includes(from) : false
			const isOwner = ownerNumber.includes(sender)
			const isUrl = (url) => {
			    return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
			}
			const reply = (teks) => {
				client.sendMessage(from, teks, text, {quoted:mek})
			}
			const sendMess = (hehe, teks) => {
				client.sendMessage(hehe, teks, text)
			}
			const mentions = (teks, memberr, id) => {
				(id == null || id == undefined || id == false) ? client.sendMessage(from, teks.trim(), extendedText, {contextInfo: {"mentionedJid": memberr}}) : client.sendMessage(from, teks.trim(), extendedText, {quoted: mek, contextInfo: {"mentionedJid": memberr}})
			}

			colors = ['red','white','black','blue','yellow','green']
			const isMedia = (type === 'imageMessage' || type === 'videoMessage')
			const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
			const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
			const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
			if (!isGroup && isCmd) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(command), 'from', color(sender.split('@')[0]), 'args :', color(args.length))
			if (!isGroup && !isCmd) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;31mRECV\x1b[1;37m]', time, color('Message'), 'from', color(sender.split('@')[0]), 'args :', color(args.length))
			if (isCmd && isGroup) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(command), 'from', color(sender.split('@')[0]), 'in', color(groupName), 'args :', color(args.length))
			if (!isCmd && isGroup) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;31mRECV\x1b[1;37m]', time, color('Message'), 'from', color(sender.split('@')[0]), 'in', color(groupName), 'args :', color(args.length))
			switch(command) {
				case 'help': 
				case 'menu':
					client.sendMessage(from, help(prefix), text)
					break
				case 'donasi':
				case 'donate':
					client.sendMessage(from, donasi(prefix), text)
					break				
            
				case 'info':
					me = client.user
					uptime = process.uptime()
					teks = `𝗡𝗮𝗺𝗮 𝗕𝗼𝘁 : ${me.name}\n𝗡𝗼𝗺𝗼𝗿 𝗕𝗼𝘁 : @${me.jid.split('@')[0]}\n𝗜𝗻𝘀𝘁𝗮𝗴𝗿𝗮𝗺 : 'https://www.instagram.com/vec.m_'\n 𝗣𝗿𝗲𝗳𝗶𝘅 : ${prefix}\n𝗧𝗼𝘁𝗮𝗹 𝗕𝗹𝗼𝗰𝗸 : ${blocked.length}\n𝗔𝗸𝘁𝗶𝗳 𝗦𝗲𝗷𝗮𝗸 : ${kyun(uptime)}\n*𝕋𝕙𝕒𝕟𝕜𝕤 𝔽𝕠𝕣 𝕄𝕙𝕒𝕟𝕜𝔹𝕒𝕣𝔹𝕒𝕣*`
					buffer = await getBuffer(me.imgUrl)
					client.sendMessage(from, buffer, image, {caption: teks, contextInfo:{mentionedJid: [me.jid]}})
					break
				case 'blocklist': 
					teks = '𝐁𝐋𝐎𝐂𝐊 𝐋𝐈𝐒𝐓 :\n'
					for (let block of blocked) {
						teks += `┣➢ @${block.split('@')[0]}\n`
					}
					teks += `𝐓𝐨𝐭𝐚𝐥 : ${blocked.length}`
					client.sendMessage(from, teks.trim(), extendedText, {quoted: mek, contextInfo: {"mentionedJid": blocked}})
					break
				case 'ocr': 
					if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						reply(mess.wait)
						await recognize(media, {lang: 'eng+ind', oem: 1, psm: 3})
							.then(teks => {
								reply(teks.trim())
								fs.unlinkSync(media)
							})
							.catch(err => {
								reply(err.message)
								fs.unlinkSync(media)
							})
					} else {
						reply(`𝐊𝐢𝐫𝐢𝐦 𝐟𝐨𝐭𝐨 𝐚𝐭𝐚𝐮 𝐭𝐚𝐠  𝐟𝐨𝐭𝐨 𝐲𝐚𝐧𝐠 𝐬𝐮𝐝𝐚𝐡 𝐭𝐞𝐫𝐤𝐢𝐫𝐢𝐦 ${prefix}𝗼𝗰𝗿`)
					}
					break
				case 'stiker': 
				case 'sticker':
				case 's':
					if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						ran = getRandom('.webp')
						await ffmpeg(`./${media}`)
							.input(media)
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync(media)
								reply(mess.error.stick)
							})
							.on('end', function () {
								console.log('Finish')
								buff = fs.readFileSync(ran)
								client.sendMessage(from, buff, sticker, {quoted: mek})
								fs.unlinkSync(media)
								fs.unlinkSync(ran)
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(ran)
					} else if ((isMedia && mek.message.videoMessage.seconds < 11 || isQuotedVideo && mek.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.seconds < 11) && args.length == 0) {
						const encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						ran = getRandom('.webp')
						reply(mess.wait)
						await ffmpeg(`./${media}`)
							.inputFormat(media.split('.')[1])
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync(media)
								tipe = media.endsWith('.mp4') ? 'video' : 'gif'
								reply(`𝐘𝐞𝐚𝐡 𝐠𝐚𝐠𝐚𝐥 ;( , 𝐜𝐨𝐛𝐚 𝐥𝐚𝐠𝐢 𝐤𝐚𝐤  ><`)
							})
							.on('end', function () {
								console.log('Finish')
								buff = fs.readFileSync(ran)
								client.sendMessage(from, buff, sticker, {quoted: mek})
								fs.unlinkSync(media)
								fs.unlinkSync(ran)
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(ran)
					} else if ((isMedia || isQuotedImage) && args[0] == 'nobg') {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						ranw = getRandom('.webp')
						ranp = getRandom('.png')
						reply(mess.wait)
						keyrmbg = 'Your-ApiKey'
						await removeBackgroundFromImageFile({path: media, apiKey: keyrmbg.result, size: 'auto', type: 'auto', ranp}).then(res => {
							fs.unlinkSync(media)
							let buffer = Buffer.from(res.base64img, 'base64')
							fs.writeFileSync(ranp, buffer, (err) => {
								if (err) return reply('𝐘𝐞𝐚𝐡 𝐠𝐚𝐠𝐚𝐥 ;( , 𝐜𝐨𝐛𝐚 𝐥𝐚𝐠𝐢 𝐤𝐚𝐤  ><')
							})
							exec(`ffmpeg -i ${ranp} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${ranw}`, (err) => {
								fs.unlinkSync(ranp)
								if (err) return reply(mess.error.stick)
								buff = fs.readFileSync(ranw)
								client.sendMessage(from, buff, sticker, {quoted: mek})
							})
						})					
					} else {
						reply(`𝗸𝗶𝗿𝗶𝗺 𝗴𝗮𝗺𝗯𝗮𝗿 𝗱𝗲𝗻𝗴𝗮𝗻 𝗰𝗮𝗽𝘁𝗶𝗼𝗻 ${prefix}𝘀𝘁𝗶𝗰𝗸𝗲𝗿 𝗮𝘁𝗮𝘂 𝗿𝗲𝗽𝗹𝘆/𝘁𝗮𝗴 𝗴𝗮𝗺𝗯𝗮𝗿`)
					}
					break
				case 'getses':
            	if (!isOwner) return reply(mess.only.ownerB)
            const sesPic = await client.getSnapshot()
            client.sendFile(from, sesPic, 'session.png', '𝘁𝗼𝗱 ^_^...', id)
            break	
				case 'gtts':	
				case 'tts':
					if (args.length < 1) return client.sendMessage(from, '𝗱𝗶𝗽𝗲𝗿𝗹𝘂𝗸𝗮𝗻 𝗸𝗼𝗱𝗲 𝗯𝗮𝗵𝗮𝘀𝗮 𝘁𝗼𝗱!', text, {quoted: mek})
					const gtts = require('./lib/gtts')(args[0])
					if (args.length < 2) return client.sendMessage(from, '𝗧𝗲𝗸𝘀 𝘆𝗮𝗻𝗴 𝗺𝗮𝘂 𝗱𝗶𝗷𝗮𝗱𝗶𝗶𝗻 𝘀𝘂𝗮𝗿𝗮 𝗺𝗮𝗻𝗮 𝘁𝗼𝗱?', text, {quoted: mek})
					dtt = body.slice(9)
					ranm = getRandom('.mp3')
					rano = getRandom('.ogg')
					dtt.length > 300
					? reply('𝘁𝗲𝗸𝘀𝗻𝘆𝗮 𝗷??𝗻𝗴𝗮𝗻 𝗸𝗲𝗽𝗮𝗻𝗷𝗮𝗻𝗴𝗮𝗻🗿')
					: gtts.save(ranm, dtt, function() {
						exec(`ffmpeg -i ${ranm} -ar 48000 -vn -c:a libopus ${rano}`, (err) => {
							fs.unlinkSync(ranm)
							buff = fs.readFileSync(rano)
							if (err) return reply('𝐘𝐞𝐚𝐡 𝐠𝐚𝐠𝐚𝐥 ;( , 𝐜𝐨𝐛𝐚 𝐥𝐚𝐠𝐢 𝐤𝐚𝐤  ><')
							client.sendMessage(from, buff, audio, {quoted: mek, ptt:true})
							fs.unlinkSync(rano)
						})
					})
					break
				case 'setprefix':
					if (args.length < 1) return
					if (!isOwner) return reply(mess.only.ownerB)
					prefix = args[0]
					reply(`𝗣𝗿𝗲𝗳𝗶𝘅 𝗯𝗲𝗿𝗵𝗮𝘀𝗶𝗹 𝗱𝗶 𝘂𝗯𝗮𝗵 𝗺𝗲𝗻𝗷𝗮𝗱𝗶 : ${prefix}`)
					break 	
				case 'meme': 
					meme = await kagApi.memes()
					buffer = await getBuffer(`https://imgur.com/${meme.hash}.jpg`)
					client.sendMessage(from, buffer, image, {quoted: mek, caption: '.......'})
					break
				case 'memeindo': 
					memein = await kagApi.memeindo()
					buffer = await getBuffer(`https://imgur.com/${memein.hash}.jpg`)
					client.sendMessage(from, buffer, image, {quoted: mek, caption: '.......'})
					break
				
			case 'loli': 
				    try {
						res = await fetchJson(`https://api.lolis.life/random`, {method: 'get'})
						buffer = await getBuffer(res.url)
						client.sendMessage(from, buffer, image, {quoted: mek, caption: 'Ingat! Cintai Lolimu'})
					} catch (e) {
						console.log(`Error :`, color(e,'red'))
						reply('𝐄𝐑𝐑𝐎𝐑')
					}
					break
				case 'nsfwloli': 
				    try {
						if (!isNsfw) return reply('𝐌𝐚𝐚𝐟 𝐟𝐢𝐭𝐮𝐫 𝐢𝐧𝐢 𝐛𝐞𝐥𝐮𝐦 𝐝𝐢 𝐚𝐤𝐭𝐢𝐟𝐤𝐚𝐧')
						res = await fetchJson(`https://api.lolis.life/random?nsfw=true`, {method: 'get'})
						buffer = await getBuffer(res.url)
						client.sendMessage(from, buffer, image, {quoted: mek, caption: 'Jangan jadiin bahan buat comli om'})
					} catch (e) {
						console.log(`Error :`, color(e,'red'))
						reply('𝐄𝐑𝐑𝐎𝐑')
					}
					break
				case 'hilih': 
					if (args.length < 1) return reply('𝐭𝐞𝐤𝐬 𝐤𝐚𝐤!')
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/api/hilih?teks=${body.slice(7)}`, {method: 'get'})
					reply(anu.result)
					break
				case 'yt': 
					if (args.length < 1) return reply('𝐮𝐫𝐥𝐧𝐲𝐚  𝐦𝐚𝐧𝐚 𝐤𝐚𝐤?')
					if(!isUrl(args[0]) && !args[0].includes('youtu')) return reply(mess.error.Iv)
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/api/yta?url=${args[0]}&apiKey=${apiKey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					teks = `*Title* : ${anu.title}\n*Filesize* : ${anu.filesize}`
					thumb = await getBuffer(anu.thumb)
					client.sendMessage(from, thumb, image, {quoted: mek, caption: teks})
					buffer = await getBuffer(anu.result)
					client.sendMessage(from, buffer, audio, {mimetype: 'audio/mp4', filename: `${anu.title}.mp3`, quoted: mek})
					break
				case 'ytsearch': 
					if (args.length < 1) return reply('𝘆𝗮𝗻𝗴 𝗺𝗮𝘂 𝗱𝗶𝗰𝗮𝗿𝗶 𝗮𝗽𝗮 𝘁𝗼𝗱 *?*')
					anu = await fetchJson(`https://arugaytdl.herokuapp.com/search?q=${args[0]}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					teks = '=================\n'
					for (let i of anu.result) {
						teks += `*Title* : ${i.title}\n*Id* : ${i.id}\n*Published* : ${i.publishTime}\n*Duration* : ${i.duration}\n*Views* : ${h2k(i.views)}\n=================\n`
					}
					reply(teks.trim())
					break
					case 'play':
				    if(!isUrl(args[0]) && !args[0].includes('youtu')) return reply(mess.error.Iv)
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/api/yta?url=${args[0]}&apiKey=${apiKey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					teks = `*Title* : ${anu.title}\n*Filesize* : ${anu.filesize}`
					thumb = await getBuffer(anu.thumb)
					buffer = await getBuffer(anu.result)
					client.sendMessage(from, buffer, audio, {mimetype: 'audio/mp3', filename: `${anu.title}.mp3`, quoted: mek})
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/api/ytsearch?q=${body.slice(10)}&apiKey=${apiKey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					teks = '=================\n'
					for (let i of anu.result) {
						teks += `*Title* : ${i.title}\n*Id* : ${i.id}\n*Published* : ${i.publishTime}\n*Duration* : ${i.duration}\n*Views* : ${h2k(i.views)}\n=================\n`
					}
					client.sendMessage(from, thumb, image, {quoted: mek, caption: teks})
					reply(teks.trim())
					break
				case 'tiktok': 
					if (args.length < 1) return reply('𝐮𝐫𝐥𝐧𝐲𝐚  𝐦𝐚𝐧𝐚 𝐤𝐚𝐤?')
					if (!isUrl(args[0]) && !args[0].includes('tiktok.com')) return reply(mess.error.Iv)
					reply(mess.wait)
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/api/tiktok?url=${args[0]}&apiKey=${apiKey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					buffer = await getBuffer(anu.result)
					client.sendMessage(from, buffer, video, {quoted: mek})
					break
				case 'tiktokstalk':
					try {
						if (args.length < 1) return client.sendMessage(from, '𝐔𝐬𝐞𝐫𝐧𝐚𝐦𝐞 𝐧𝐲𝐚 𝐦𝐚𝐧𝐚 𝐤𝐚𝐤? ', text, {quoted: mek})
						let { user, stats } = await tiktod.getUserProfileInfo(args[0])
						reply(mess.wait)
						teks = `*ID* : ${user.id}\n*Username* : ${user.uniqueId}\n*Nickname* : ${user.nickname}\n*Followers* : ${stats.followerCount}\n*Followings* : ${stats.followingCount}\n*Posts* : ${stats.videoCount}\n*Luv* : ${stats.heart}\n`
						buffer = await getBuffer(user.avatarLarger)
						client.sendMessage(from, buffer, image, {quoted: mek, caption: teks})
					} catch (e) {
						console.log(`Error :`, color(e,'red'))
						reply('𝐮𝐬𝐞𝐫𝐧𝐚𝐦𝐞 𝐭𝐢𝐝𝐚𝐤 𝐯𝐚𝐥𝐢𝐝')
					}
					break
				case 'nulis': 
				case 'tulis':
					if (args.length < 1) return reply('𝐚𝐤𝐮 𝐬𝐮𝐫𝐮𝐡 𝐧𝐮𝐥𝐢𝐬 𝐚𝐩𝐚 𝐤𝐚𝐤? 𝐓𝐲𝐭𝐝 𝐤𝐚𝐡!')
					teks = body.slice(7)
					reply(mess.wait)
					anu = await fetchJson(`https://dt-04.herokuapp.com/nulis?text=${teks}&apiKey=${apiKey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					buff = await getBuffer(anu.result)
					client.sendMessage(from, buff, image, {quoted: mek, caption: mess.success})
					break
			   case 'ttp':
					if (args.length < 1) return reply('𝐭𝐞𝐤𝐬𝐧𝐲𝐚 𝐤𝐚𝐤')
					tels = body.slice(5)
					reply(mess.wait)
					anu = await fetchJson(`https://tobz-api.herokuapp.com/api/ttp?text=${tels}`, {method: 'get'})
					buffer = await getBuffer(anu.base64)
					client.sendMessage(from, buffer, image, {quoted: mek})
					break
				case 'ljoker':
					if (args.length < 1) return reply('𝐭𝐞𝐤𝐬𝐧𝐲𝐚 𝐤𝐚𝐤')
					tels = body.slice(8)
					reply(mess.wait)
					anu = await fetchJson(`https://tobz-api.herokuapp.com/api/textpro?theme=jokerlogo&text=${tels}`, {method: 'get'})
					buffer = await getBuffer(anu.result)
					client.sendMessage(from, buffer, image, {quoted: mek})
					break	
				case 'lwolf1':
					if (args.length < 1) return reply('𝐭𝐞𝐤𝐬𝐧𝐲𝐚 𝐤𝐚𝐤')
					tels = body.slice(8)
					reply(mess.wait)
					anu = await fetchJson(`https://tobz-api.herokuapp.com/api/textpro?theme=wolflogo1&text1=A187&text2=${tels}`, {method: 'get'})
					buffer = await getBuffer(anu.result)
					client.sendMessage(from, buffer, image, {quoted: mek})
					break		
				case 'lwolf2':
					if (args.length < 1) return reply('𝐭𝐞𝐤𝐬𝐧𝐲𝐚 𝐤𝐚𝐤')
					tels = body.slice(8)
					reply(mess.wait)
					anu = await fetchJson(`https://tobz-api.herokuapp.com/api/textpro?theme=wolflogo2&text1=A187&text2=${tels}`, {method: 'get'})
					buffer = await getBuffer(anu.result)
					client.sendMessage(from, buffer, image, {quoted: mek})
					break		
				case 'cerpen':
					gatauda = body.slice(1)
					
					anu = await fetchJson(`https://arugaz.herokuapp.com/api/cerpen`, {method: 'get'})
					reply(anu.result)
					break
				case 'bucin':
					gatauda = body.slice(7)
					
					anu = await fetchJson(`https://arugaz.herokuapp.com/api/howbucins`, {method: 'get'})
					reply(anu.desc)
					break	
				case 'quotes':
					gatauda = body.slice(8)
					
					anu = await fetchJson(`https://arugaz.herokuapp.com/api/randomquotes`, {method: 'get'})
					reply(anu.quotes)
					break		
				case 'chord':
					if (args.length < 1) return reply('𝐣𝐮𝐝𝐮𝐥 𝐥𝐚𝐠𝐮 𝐤𝐚𝐤')
					tels = body.slice(7)
					
					anu = await fetchJson(`https://arugaz.herokuapp.com/api/chord?q=${tels}`, {method: 'get'})
					reply(anu.result)
					break		
				case 'lirik':
					if (args.length < 1) return reply('𝐣𝐮𝐝𝐮𝐥 𝐥𝐚𝐠𝐮 𝐤𝐚𝐤')
					tels = body.slice(7)
					
					anu = await fetchJson(`https://arugaz.herokuapp.com/api/lirik?judul=${tels}`, {method: 'get'})
					reply(anu.result)
					break		
				case 'wiki':
					if (args.length < 1) return reply('𝐦𝐚𝐬𝐮𝐤𝐤𝐚𝐧 𝐤𝐚𝐭𝐚 𝐤𝐮𝐧𝐜𝐢')
					tels = body.slice(6)
					
					anu = await fetchJson(`https://tobz-api.herokuapp.com/api/wiki?q=${tels}`, {method: 'get'})
					reply(anu.result)
					break	
				case 'wikien':
					if (args.length < 1) return reply('𝐦𝐚𝐬𝐮𝐤𝐤𝐚𝐧 𝐤𝐚𝐭𝐚 𝐤𝐮𝐧𝐜𝐢')
					tels = body.slice(8)
					
					anu = await fetchJson(`https://arugaz.herokuapp.com/api/wikien?q=${tels}`, {method: 'get'})
					reply(anu.result)
					break				
				case 'dbatch': 
					if (args.length < 1) return reply('𝐦𝐚𝐬𝐮𝐤𝐤𝐚𝐧 𝐤𝐚𝐭𝐚 𝐤𝐮𝐧𝐜𝐢')
					tels = body.slice(8)
					
					anu = await fetchJson(`https://arugaz.herokuapp.com/api/dewabatch?q=${tels}`, {method: 'get'})
					reply(anu.result)
					break			
					case 'corona':
					if (args.length < 1) return reply('𝐦𝐚𝐬𝐮𝐤𝐤𝐚𝐧 𝐧𝐞𝐠𝐚𝐫𝐚')
					tels = body.slice(9)
					
					anu = await fetchJson(`https://arugaz.herokuapp.com/api/corona?country=${tels}`, {method: 'get'})
					reply(anu.result)
					break		
				case 'gay':
					gatauda = body.slice(5)
					
					anu = await fetchJson(`https://arugaz.herokuapp.com/api/howgay`, {method: 'get'})
					reply(anu.desc,persen)
					break			
				case 'kbbi': 
					if (args.length < 1) return reply('𝐭𝐞𝐤𝐬𝐧𝐲𝐚 𝐤𝐚𝐤')
					tels = body.slice(6)
					
					anu = await fetchJson(`https://tobz-api.herokuapp.com/api/kbbi?kata=${tels}`, {method: 'get'})
					reply(anu.result)
					break		
				case 'ytmp4':
					if (args.length < 1) return reply('𝐭𝐞𝐤𝐬𝐧𝐲𝐚 𝐤𝐚𝐤')
					tels = body.slice(7)
					anu = await fetchJson(`https://st4rz.herokuapp.com/api/yta2?url=${tels}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					teks = `*Title* : ${anu.title}\n*Filesize* : ${anu.filesize} *Link* : ${anu.result} `
					thumb = await getBuffer(anu.thumb)
					client.sendMessage(from, thumb, image, {quoted: mek, caption: teks})
					buffer = await getBuffer(anu.result).then
					client.sendMessage(from, buffer, audio, {mimetype: 'audio/mp4', filename: `${anu.title}.mp3`, quoted: mek})
					break
					case 'ytmp3': 
					if (args.length < 1) return reply('𝐭𝐞𝐤𝐬𝐧𝐲𝐚 𝐤𝐚𝐤')
					tels = body.slice(7)
					anu = await fetchJson(`https://st4rz.herokuapp.com/api/yta2?url=${tels}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					teks = `*Title* : ${anu.title}\n*Filesize* : ${anu.filesize} *Link* : ${anu.result} `
					thumb = await getBuffer(anu.thumb)
					client.sendMessage(from, thumb, image, {quoted: mek, caption: teks})
					buffer = await getBuffer(anu.result).then
					client.sendMessage(from, buffer, audio, {mimetype: 'audio/mp4', filename: `${anu.title}.mp3`, quoted: mek})
					break
				case 'alay':
					if (args.length < 1) return reply('𝐭𝐞𝐤𝐬𝐧𝐲𝐚 𝐤𝐚𝐤')
					tels = body.slice(6)
					
					anu = await fetchJson(`https://arugaz.herokuapp.com/api/bapakfont?kata=${tels}`, {method: 'get'})
					reply(anu.result)
					break			
				case 'spsms':
					if (args.length < 1) return reply('𝐍𝐨𝐦𝐞𝐫 𝐭𝐚𝐫𝐠𝐞𝐭')
					tels = body.slice(7)
					reply(mess.wait)
					anu = await fetchJson(`https://arugaz.herokuapp.com/api/spamsms?no=${tels}&jum=10`, {method: 'get'})
					reply(anu.logs)
					break	
				case 'spgmail':
					if (args.length < 1) return reply('𝐠𝐦𝐚𝐢𝐥 𝐭𝐚𝐫𝐠𝐞𝐭')
					tels = body.slice(9)
					reply(mess.wait)
					anu = await fetchJson(`https://arugaz.herokuapp.com/api/spamgmail?target=${tels}&jum=10`, {method: 'get'})
					reply(anu.logs)
					break	
				case 'spcall':
					if (args.length < 1) return reply('𝐍𝐨𝐦𝐞𝐫 𝐭𝐚𝐫𝐠𝐞𝐭')
					tels = body.slice(8)
					reply(mess.wait)
					anu = await fetchJson(`https://arugaz.herokuapp.com/api/spamcall?no=${tels}`, {method: 'get'})
					reply(anu.logs)
					break			
				case 'ranime':
					gatauda = body.slice(8)
					reply(mess.wait)
					anu = await fetchJson(`https://tobz-api.herokuapp.com/api/randomanime`, {method: 'get'})
					buffer = await getBuffer(anu.result)
					client.sendMessage(from, buffer, image, {quoted: mek})
					break
				case 'zodiak':
					if (args.length < 1) return reply('𝐭𝐚𝐧𝐠𝐠𝐚𝐥 𝐥𝐚𝐡𝐢𝐫')
					tels = body.slice(8)
					reply(mess.wait)
					anu = await fetchJson(`https://arugaz.herokuapp.com/api/getzodiak?nama=aruga&tgl-bln-thn=${tels}`, {method: 'get'})
					reply(anu.lahir,ultah,usia,zodiak)
					break			
				case 'waifu':
					gatauda = body.slice(7)
					reply(mess.wait)
					anu = await fetchJson(`https://arugaz.herokuapp.com/api/nekonime`, {method: 'get'})
					buffer = await getBuffer(anu.result)
					client.sendMessage(from, buffer, image, {quoted: mek})
					break			
				case 'hentai':
				if (!isNsfw) return reply('𝐌𝐚𝐚𝐟 𝐟𝐢𝐭𝐮𝐫 𝐢𝐧𝐢 𝐛𝐞𝐥𝐮𝐦 𝐝𝐢 𝐚𝐤𝐭𝐢𝐟𝐤𝐚𝐧')
					gatauda = body.slice(8)
					reply(mess.wait)
					anu = await fetchJson(`https://tobz-api.herokuapp.com/api/hentai`, {method: 'get'})
					buffer = await getBuffer(anu.result)
					client.sendMessage(from, buffer, image, {quoted: mek})	
					break
				case 'nsfwnek':
				if (!isNsfw) return reply('𝐌𝐚𝐚𝐟 𝐟𝐢𝐭𝐮𝐫 𝐢𝐧𝐢 𝐛𝐞𝐥𝐮𝐦 𝐝𝐢 𝐚𝐤𝐭𝐢𝐟𝐤𝐚𝐧')
					gatauda = body.slice(9)
					reply(mess.wait)
					anu = await fetchJson(`https://tobz-api.herokuapp.com/api/nsfwneko`, {method: 'get'})
					buffer = await getBuffer(anu.result)
					client.sendMessage(from, buffer, image, {quoted: mek})	
					break	
				case 'nsfwtrp': 
				if (!isNsfw) return reply('𝐌𝐚𝐚𝐟 𝐟𝐢𝐭𝐮𝐫 𝐢𝐧𝐢 𝐛𝐞𝐥𝐮𝐦 𝐝𝐢 𝐚𝐤𝐭𝐢𝐟𝐤𝐚𝐧')
					gatauda = body.slice(9)
					reply(mess.wait)
					anu = await fetchJson(`https://tobz-api.herokuapp.com/api/nsfwtrap`, {method: 'get'})
					buffer = await getBuffer(anu.result)
					client.sendMessage(from, buffer, image, {quoted: mek})	
					break		
				case 'neko':
					gatauda = body.slice(6)
					reply(mess.wait)
					anu = await fetchJson(`https://arugaz.herokuapp.com/api/nekonime`, {method: 'get'})
					buffer = await getBuffer(anu.result)
					client.sendMessage(from, buffer, image, {quoted: mek})
					break	
				case 'lneon':
					if (args.length < 1) return reply('𝐭𝐞𝐤𝐬𝐧𝐲𝐚 𝐤𝐚𝐤')
					tels = body.slice(7)
					reply(mess.wait)
					anu = await fetchJson(`https://tobz-api.herokuapp.com/api/textpro?theme=neon_light&text1=A187&text2=${tels}`, {method: 'get'})
					buffer = await getBuffer(anu.result)
					client.sendMessage(from, buffer, image, {quoted: mek})
					break	
				case 'lion':
					if (args.length < 1) return reply('𝐭𝐞𝐤𝐬𝐧𝐲𝐚 𝐤𝐚𝐤')
					tels = body.slice(6)
					reply(mess.wait)
					anu = await fetchJson(`https://tobz-api.herokuapp.com/api/textpro?theme=lionlogo&text1=${tels}&text2=Ganz`, {method: 'get'})
					buffer = await getBuffer(anu.result)
					client.sendMessage(from, buffer, image, {quoted: mek})
					break				
				case 'glitch':
					if (args.length < 1) return reply('𝐭𝐞𝐤𝐬𝐧𝐲𝐚 𝐤𝐚𝐤')
					tels = body.slice(8)
					tels2 = body.slice(8)
					reply(mess.wait)
					anu = await fetchJson(`https://tobz-api.herokuapp.com/api/textpro?theme=glitch&text1=${tels}&text2=${tels2}`, {method: 'get'})
					buffer = await getBuffer(anu.result)
					client.sendMessage(from, buffer, image, {quoted: mek})
					break			
				case 'lninja':
					if (args.length < 1) return reply('𝐭𝐞𝐤𝐬𝐧𝐲𝐚 𝐤𝐚𝐤')
					tels = body.slice(8)
					reply(mess.wait)
					anu = await fetchJson(`https://tobz-api.herokuapp.com/api/textpro?theme=ninjalogo&text1=A187&text2=${tels}`, {method: 'get'})
					buffer = await getBuffer(anu.result)
					client.sendMessage(from, buffer, image, {quoted: mek})
					break							
				case 'nama':
					tels = body.slice(6)					
					anu = await fetchJson(`https://mnazria.herokuapp.com/api/arti?nama=${tels}`, {method: 'get'})
					reply(anu.result)
					break
				case 'url':
					tels = body.slice(5)
					
					anu = await fetchJson(`https://tobz-api.herokuapp.com/api/shorturl?url=${tels}`, {method: 'get'})
					reply(anu.result)
					break									
				case 'tagme':
					var nom = mek.participant
					const tag = {
					text: `@${nom.split("@s.whatsapp.net")[0]} 𝐓𝐮𝐡 𝐝𝐚𝐡 𝐚𝐤𝐮 𝐭𝐚𝐠!`,
					contextInfo: { mentionedJid: [nom] }
					}
					client.sendMessage(from, tag, text, {quoted: mek})
					break
					
				case 'url2img': 
					tipelist = ['desktop','tablet','mobile']
					if (args.length < 1) return reply('𝐏𝐢𝐥𝐢𝐡 𝐭𝐢𝐩𝐞 𝐧𝐲𝐚 𝐤𝐚𝐤?')
					if (!tipelist.includes(args[0])) return reply('𝐓𝐢𝐩𝐞 𝐚𝐩𝐚 𝐝𝐞𝐤𝐬𝐭𝐨𝐩|𝐭𝐚𝐛𝐥𝐞𝐭|𝐦𝐨𝐛𝐢𝐥𝐞')
					if (args.length < 2) return reply('𝐮𝐫𝐥𝐧𝐲𝐚  𝐦𝐚𝐧𝐚 𝐤𝐚𝐤?')
					if (!isUrl(args[1])) return reply(mess.error.Iv)
					reply(mess.wait)
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/api/url2image?tipe=${args[0]}&url=${args[1]}&apiKey=${apiKey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					buff = await getBuffer(anu.result)
					client.sendMessage(from, buff, image, {quoted: mek})
					break
				case 'tstiker':
				case 'tsticker': 
					if (args.length < 1) return reply('𝐭𝐞𝐤𝐬 𝐧𝐲𝐚 𝐤𝐚𝐤!!')
					ranp = getRandom('.png')
					rano = getRandom('.webp')
					teks = body.slice(9).trim()
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/api/text2image?text=${teks}&apiKey=${apiKey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					exec(`wget ${anu.result} -O ${ranp} && ffmpeg -i ${ranp} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${rano}`, (err) => {
						fs.unlinkSync(ranp)
						if (err) return reply(mess.error.stick)
						buffer = fs.readFileSync(rano)
						client.sendMessage(from, buffer, sticker, {quoted: mek})
						fs.unlinkSync(rano)
					})
					break
				case 'fitnah':	
				case 'fake':          
if (!isGroup) return reply(mess.only.group)
arg = body.substring(body.indexOf(' ') + 1)
				isi = arg.split(' |')[0] 
				pesan = arg.split('|')[1] 
				pesan2 = arg.split('|')[2] 
costum(pesan, isi, pesan2)
break
                 
                  case 'tagall':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					members_id = []
					teks = (args.length > 1) ? body.slice(8).trim() : ''
					teks += '\n\n'
					for (let mem of groupMembers) {
						teks += `*>* @${mem.jid.split('@')[0]}\n`
						members_id.push(mem.jid)
					}
					mentions(teks, members_id, true)
					break				
				case 'clearall':
					if (!isOwner) return reply(mess.only.ownerB)
					anu = await client.chats.all()
					client.setMaxListeners(25)
					for (let _ of anu) {
						client.deleteChat(_.jid)
					}
					reply('𝐂𝐥𝐞𝐚𝐫 𝐀𝐥𝐥 𝐒𝐮𝐜𝐜𝐞𝐬𝐬 :)')
					break			       
                    case 'unban':
					if (!isGroup) return reply(mess.only.group)
					if (!isOwner) return reply(mess.only.ownerB)
				    client.banUser (`${body.slice(7)}@c.us`, "remove")
					client.sendMessage(from, `𝐏𝐞𝐫𝐢𝐧𝐭𝐚𝐡 𝐝𝐢𝐭𝐞𝐫𝐢𝐦𝐚, 𝐦𝐞𝐦𝐛𝐮𝐤𝐚 𝐛𝐚𝐧 ${body.slice(7)}@c.us`, text)
				break				
                 case 'ban':
					if (!isGroup) return reply(mess.only.group)
					if (!isOwner) return reply(mess.only.ownerB)
					client.banUser (`${body.slice(5)}@c.us`, "add")
					client.sendMessage(from, `𝐏𝐞𝐫𝐢𝐧𝐭𝐚𝐡 𝐝𝐢𝐭𝐞𝐫𝐢𝐦𝐚, ${body.slice(5)}@c.us\n 𝐭𝐞𝐫𝐤𝐞𝐧𝐚 𝐛𝐚𝐧𝐧𝐞𝐝 `, text)
					break
					                    
				case 'bc': 
					if (!isOwner) return reply(mess.only.ownerB)
					if (args.length < 1) return reply('.......')
					anu = await client.chats.all()
					if (isMedia && !mek.message.videoMessage || isQuotedImage) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						buff = await client.downloadMediaMessage(encmedia)
						for (let _ of anu) {
							client.sendMessage(_.jid, buff, image, {caption: `❮ 𝙋𝙪𝙙𝙞𝙙𝙞𝙓 *-* 𝘽𝙧𝙤𝙖𝙙𝙘𝙖𝙨𝙩 ❯\n\n${body.slice(4)}`})
						}
						reply('𝐬𝐮𝐜𝐜𝐬𝐬 𝐛𝐫𝐨𝐚𝐝𝐜𝐚𝐬𝐭')
					} else {
						for (let _ of anu) {
							sendMess(_.jid, `❮ 𝙋𝙪𝙙𝙞𝙙𝙞𝙓 *-* 𝘽𝙧𝙤𝙖𝙙𝙘𝙖𝙨𝙩 ❯\n\n${body.slice(4)}`)
						}
						reply('𝐬𝐮𝐜𝐜𝐬𝐬 𝐛𝐫𝐨𝐚𝐝𝐜𝐚𝐬𝐭')
					}
					break
			       	case 'setpp': 
                        if (!isGroup) return reply(mess.only.group)
                       if (!isGroupAdmins) return reply(mess.only.admin)
                        if (!isBotGroupAdmins) return reply(mess.only.Badmin)
                       media = await client.downloadAndSaveMediaMessage(mek)
                         await client.updateProfilePicture (from, media)
                        reply('𝐢𝐜𝐨𝐧 𝐠𝐫𝐨𝐮𝐩 𝐛𝐞𝐫𝐡𝐚𝐬𝐢𝐥 𝐝𝐢𝐮𝐛𝐚𝐡 ')
                                        break						
				case 'add':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (args.length < 1) return reply('𝐌𝐚𝐮 𝐦𝐞𝐧𝐚𝐦𝐛𝐚𝐡𝐤𝐚𝐧 𝐚𝐧𝐚𝐤 𝐩𝐮𝐧𝐠𝐮𝐭 𝐤𝐚𝐡 𝐤𝐚𝐤?')
					if (args[0].startsWith('08')) return reply('𝐠𝐮𝐧𝐚𝐤𝐚𝐧 𝐤𝐨𝐝𝐞 𝐧𝐞𝐠𝐚𝐫𝐚 𝐤𝐚𝐤')
					try {
						num = `${args[0].replace(/ /g, '')}@s.whatsapp.net`
						client.groupAdd(from, [num])
					} catch (e) {
						console.log('Error :', e)
						reply('𝐆𝐚𝐠𝐚𝐥 𝐦𝐞𝐧𝐚𝐦𝐛𝐚𝐡𝐤𝐚𝐧 𝐭𝐚𝐫𝐠𝐞𝐭, 𝐦𝐮𝐧𝐠𝐤𝐢𝐧 𝐤𝐚𝐫𝐞𝐧𝐚 𝐝𝐢 𝐩𝐫𝐢𝐯𝐚𝐭𝐞')
					}
					break
					case 'grup':
					case 'gc':
					case 'group':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (args[0] === 'buka') {
					    reply(`𝐏𝐞𝐫𝐢𝐧𝐭𝐚𝐡 𝐝𝐢𝐭𝐞𝐫𝐢𝐦𝐚, 𝐛𝐞𝐫𝐡𝐚𝐬𝐢𝐥 𝐦𝐞𝐧𝐠𝐮𝐛𝐚𝐡 𝐠𝐫𝐨𝐮𝐩 𝐬𝐞𝐦𝐮𝐚 𝐨𝐫𝐚𝐧𝐠 𝐛𝐢𝐬𝐚 𝐦𝐞𝐧𝐠𝐢𝐫𝐢𝐦 𝐩𝐞𝐬𝐚𝐧`)
						client.groupSettingChange(from, GroupSettingChange.messageSend, false)
					} else if (args[0] === 'tutup') {
						reply(`𝐏𝐞𝐫𝐢𝐧𝐭𝐚𝐡 𝐝𝐢𝐭𝐞𝐫𝐢𝐦𝐚, 𝐛𝐞𝐫𝐡𝐚𝐬𝐢𝐥 𝐦𝐞𝐧𝐠𝐮𝐛𝐚𝐡 𝐠𝐫𝐨𝐮𝐩 𝐡𝐚𝐧𝐲𝐚 𝐚𝐝𝐦𝐢𝐧 𝐲𝐚𝐧𝐠 𝐛𝐢𝐬𝐚 𝐦𝐞𝐧𝐠𝐢𝐫𝐢𝐦 𝐩𝐞𝐬𝐚𝐧`)
						client.groupSettingChange(from, GroupSettingChange.messageSend, true)
					}
					break
		   		 case 'linkgc':
		   		 case 'link':
            if (!isGroup) return client.sendMessage(from, 'khusus gc bang', text, { quoted: mek })
if (!isBotGroupAdmins) return reply(mess.only.Badmin)
            var link = await client.groupInviteCode(from)
            var isLinkGC = `Link 👉🏻: *https://chat.whatsapp.com/${link}*\n`
            client.sendMessage(from, `*Link Group: ${groupMetadata.subject}*\n\n${isLinkGC.repeat(3)}`, text)
            break
            case 'adminbot':
            case 'owner':
            case 'creator':
                  client.sendMessage(from, {displayname: "Jeff", vcard: vcard}, MessageType.contact, { quoted: mek})
       client.sendMessage(from, '𝐍𝐢𝐞𝐡 𝐧𝐨𝐦𝐞𝐫 𝐂𝐎 𝐤𝐮 𝐤𝐚𝐤, 𝐣𝐢𝐤𝐚 𝐦𝐚𝐮 𝐦𝐚𝐬𝐮𝐤𝐚𝐧 aku 𝐤𝐞 𝐠𝐫𝐨𝐮𝐩 𝐤𝐚𝐥𝐢𝐚𝐧 𝐜𝐡𝐚𝐭 𝐝𝐢𝐚 𝐲𝐚𝐡 kak',MessageType.text, { quoted: mek} )
           break  
             case 'out':
           case 'leave':
					if (!isGroup) return reply(mess.only.group)
					if (!isOwner) return reply(mess.only.ownerB)
					if (!isGroupAdmins) return reply(mess.only.admin)
					client.sendMessage(from, '𝐀𝐧𝐣𝐢𝐫 𝐥𝐚𝐡 𝐠𝐮𝐚 𝐝𝐢𝐮𝐬𝐢𝐫, 𝐭𝐚𝐩𝐢 𝐠𝐚𝐩𝐚𝐩𝐚𝐥𝐚𝐡, 𝐦𝐚𝐤𝐚𝐬𝐢𝐡 𝐮𝐝𝐚𝐡 𝐩𝐚𝐤𝐞 𝐚𝐤𝐮 𝐲𝐚𝐤:)', text, {quoted: mek})
					client.groupLeave (from)
					break
				case 'cerpen':
					gatauda = body.slice(1)
					anu = await fetchJson(`https://arugaz.herokuapp.com/api/cerpen`, {method: 'get'})
					reply(anu.result)
					break	
				case 'qrcode':
					const tex = encodeURIComponent(body.slice(8))
					if (!tex) return client.sendMessage(from, '𝐌𝐚𝐬𝐮𝐤𝐚𝐧 𝐓𝐞𝐤𝐬/𝐔𝐫𝐥 𝐘𝐚𝐧𝐠 𝐈𝐧𝐠𝐢𝐧 𝐃𝐢 𝐁𝐮𝐚𝐭 𝐐𝐑', text, {quoted: mek})
					const buff = await getBuffer(`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${tex}`)
					client.sendMessage(from, buff, image, {quoted: mek})
					break
				case 'map':
					if (args.length < 1) return reply('𝐋𝐨𝐤𝐚𝐬𝐢 𝐲𝐚𝐧𝐠 𝐦𝐚𝐮 𝐝𝐢𝐜𝐚𝐫𝐢 𝐝𝐢𝐦𝐚𝐧𝐚 𝐤𝐚𝐤?')
					tels = body.slice(5)
					reply(mess.wait)
					anu = await fetchJson(`https://mnazria.herokuapp.com/api/maps?search=${tels}`, {method: 'get'})
					buffer = await getBuffer(anu.gambar)
					client.sendMessage(from, buffer, image, {quoted: mek})
					break
           case 'demote':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('𝐓𝐚𝐠 𝐭𝐚𝐫𝐠𝐞𝐭 𝐲𝐚𝐧𝐠 𝐦𝐚𝐮 𝐝𝐢 𝐭𝐮𝐫𝐮𝐧𝐤𝐚𝐧 𝐚𝐝𝐦𝐢𝐧')
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
					if (mentioned.length > 1) {
						teks = ''
						for (let _ of mentioned) {
							teks += `𝐏𝐞𝐫𝐢𝐧𝐭𝐚𝐡 𝐝𝐢𝐭𝐞𝐫𝐢𝐦𝐚, 𝐦𝐞𝐧𝐮𝐫𝐮𝐧𝐤𝐚𝐧 𝐣𝐚𝐝𝐢 𝐚𝐝𝐦𝐢𝐧 𝐠𝐫𝐨𝐮𝐩 :\n`
							teks += `@_.split('@')[0]`
						}
						mentions(teks, mentioned, true)
						client.groupDemoteAdmin(from, mentioned)
					} else {
						mentions(`𝐏𝐞𝐫𝐢𝐧𝐭𝐚𝐡 𝐝𝐢𝐭𝐞𝐫𝐢𝐦𝐚, 𝐦𝐞𝐧𝐮𝐫𝐮𝐧𝐤𝐚𝐧 @${mentioned[0].split('@')[0]}\n 𝐣𝐚𝐝𝐢 𝐚𝐝𝐦𝐢𝐧 𝐠𝐫𝐨𝐮𝐩 _*${groupMetadata.subject}*_`, mentioned, true)
						client.groupDemoteAdmin(from, mentioned)
					}
					break
				case 'promote':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('𝐓𝐚𝐠 𝐭𝐚𝐫𝐠𝐞𝐭 𝐲𝐚𝐧𝐠 𝐦𝐚𝐮 𝐝𝐢 𝐣𝐚𝐝𝐢𝐤𝐚𝐧 𝐚𝐝𝐦𝐢𝐧!')
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
					if (mentioned.length > 1) {
						teks = ''
						for (let _ of mentioned) {
							teks += `𝐏𝐞𝐫𝐢𝐧𝐭𝐚𝐡 𝐝𝐢𝐭𝐞𝐫𝐢𝐦𝐚, 𝐦𝐞𝐧𝐚𝐦𝐛𝐚𝐡𝐤𝐚𝐧 𝐣𝐚𝐝𝐢 𝐚𝐝𝐦𝐢𝐧 𝐠𝐫𝐨𝐮𝐩:\n`
							teks += `@_.split('@')[0]`
						}
						mentions(teks, mentioned, true)
						client.groupMakeAdmin(from, mentioned)
					} else {
						mentions(`𝐏𝐞𝐫𝐢𝐧𝐭𝐚𝐡 𝐝𝐢𝐭𝐞𝐫𝐢𝐦𝐚, 𝐦𝐞𝐧𝐚𝐦𝐛𝐚𝐡𝐤𝐚𝐧 @${mentioned[0].split('@')[0]}\n 𝐣𝐚𝐝𝐢 𝐚𝐝𝐦𝐢𝐧 𝐠𝐫𝐨𝐮𝐩 _*${groupMetadata.subject}*_ `, mentioned, true)
						client.groupMakeAdmin(from, mentioned)
					}
					break	
			     	case 'kick':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('𝐓𝐚𝐠 𝐭𝐚𝐫𝐠𝐞𝐭 𝐲𝐚𝐧𝐠 𝐦𝐚𝐮 𝐝𝐢 𝐤𝐢𝐜𝐤!')
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
					if (mentioned.length > 1) {
						teks = ''
						for (let _ of mentioned) {
							teks += `𝐏𝐞𝐫𝐢𝐧𝐭𝐚𝐡 𝐝𝐢𝐭𝐞𝐫𝐢𝐦𝐚, 𝐦𝐚𝐚𝐟 𝐤𝐚𝐦𝐮 𝐝𝐢 𝐤𝐢𝐜𝐤 𝐝𝐚𝐫𝐢 𝐠𝐫𝐨𝐮𝐩 𝐢𝐧𝐢 :\n`
							teks += `@_.split('@')[0]`
						}
						mentions(teks, mentioned, true)
						client.groupRemove(from, mentioned)
					} else {
						mentions(`𝐏𝐞𝐫𝐢𝐧𝐭𝐚𝐡 𝐝𝐢𝐭𝐞𝐫𝐢𝐦𝐚, 𝐦𝐚𝐚𝐟 @${mentioned[0].split('@')[0]}\n𝐤𝐚𝐦𝐮 𝐝𝐢 𝐤𝐢𝐜𝐤 𝐝𝐚𝐫𝐢 𝐠𝐫𝐨𝐮𝐩 _*${groupMetadata.subject}*_ `, mentioned, true)
						client.groupRemove(from, mentioned)
					}
					break
				case 'listadmin':
					if (!isGroup) return reply(mess.only.group)
					teks = `𝐋𝐢𝐬𝐭 𝐚𝐝𝐦𝐢𝐧 𝐠𝐫𝐨𝐮𝐩 _*${groupMetadata.subject}*_\n𝐓𝐨𝐭𝐚𝐥 : _${groupAdmins.length}_\n\n`
					no = 0
					for (let admon of groupAdmins) {
						no += 1
						teks += `┣➥ @${admon.split('@')[0]}\n`
					}
					mentions(teks, groupAdmins, true)
					break
				case 'toimg':
					if (!isQuotedSticker) return reply('𝐫𝐞𝐩𝐥𝐲 𝐬𝐭𝐢𝐜𝐤𝐞𝐫 𝐤𝐚𝐤')
					reply(mess.wait)
					encmedia = JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo
					media = await client.downloadAndSaveMediaMessage(encmedia)
					ran = getRandom('.png')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) return reply('𝐘𝐞𝐚𝐡 𝐠𝐚𝐠𝐚𝐥 ;( , 𝐜𝐨𝐛𝐚 𝐥𝐚𝐠𝐢 𝐤𝐚𝐤 ><')
						buffer = fs.readFileSync(ran)
						client.sendMessage(from, buffer, image, {quoted: mek, caption: '𝗱𝗮𝗵 𝗷𝗮𝗱𝗶 𝘁𝗼𝗱'})
						fs.unlinkSync(ran)
					})
					break
					
				case 'simi':
					if (args.length < 1) return reply('𝐤𝐚𝐬𝐢𝐡 𝐭𝐞𝐤𝐬 𝐧𝐲𝐚 𝐤𝐚𝐤 :)')
					teks = body.slice(5)
					anu = await simih(teks) //fetchJson(`https://mhankbarbars.herokuapp.com/api/samisami?text=${teks}`, {method: 'get'})
					//if (anu.error) return reply('Simi ga tau kak')
					reply(anu)
					break
				case 'simih':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (args.length < 1) return reply('𝐤𝐞𝐭𝐢𝐤 𝟏 𝐮𝐧𝐭𝐮𝐤 𝐦𝐞𝐧𝐠𝐚𝐤𝐭𝐢𝐟𝐤𝐚𝐧')
					if (Number(args[0]) === 1) {
						if (isSimi) return reply('𝐟𝐢𝐭𝐮𝐫 𝐬𝐮𝐝𝐚𝐡 𝐚𝐤𝐭𝐢𝐯')
						samih.push(from)
						fs.writeFileSync('./src/simi.json', JSON.stringify(samih))
						reply('❬ 𝐒𝐔𝐂𝐂𝐒𝐄𝐒𝐒 ❭ 𝐦𝐞𝐧𝐠𝐚𝐤𝐭𝐢𝐟𝐤𝐚𝐧 𝐟𝐢𝐭𝐮𝐫 𝐬𝐢𝐦𝐢𝐡 𝐩𝐚𝐝𝐚 𝐠𝐫𝐨𝐮𝐩 𝐢𝐧𝐢️')
					} else if (Number(args[0]) === 0) {
						samih.splice(from, 1)
						fs.writeFileSync('./src/simi.json', JSON.stringify(samih))
						reply('❬ 𝐒𝐔𝐂𝐂𝐒𝐄𝐒𝐒 ❭ 𝐦𝐞𝐧𝐨𝐧𝐚𝐤𝐭𝐢𝐟𝐤𝐚𝐧 𝐟𝐢𝐭𝐮𝐫 𝐬𝐢𝐦𝐢𝐡 𝐩𝐚𝐝𝐚 𝐠𝐫𝐨𝐮𝐩 𝐢𝐧𝐢️️')
					} else {
						reply('𝐤𝐞𝐭𝐢𝐤 𝟏 𝐮𝐧𝐭𝐮𝐤 𝐦𝐞𝐧𝐠𝐚𝐤𝐭𝐢𝐟𝐤𝐚𝐧, 𝟎 𝐮𝐧𝐭𝐮𝐤 𝐦𝐞𝐧𝐨𝐧𝐚𝐤𝐭𝐢𝐟𝐤𝐚𝐧 𝐟𝐢𝐭𝐮𝐫')
					}
					break 
				case 'nsfw':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (args.length < 1) return reply('𝐤𝐞𝐭𝐢𝐤 𝟏 𝐮𝐧𝐭𝐮𝐤 𝐦𝐞𝐧𝐠𝐚𝐤𝐭𝐢𝐟𝐤𝐚𝐧')
					if (Number(args[0]) === 1) {
						if (isNsfw) return reply('𝐟𝐢𝐭𝐮𝐫 𝐬𝐮𝐝𝐚𝐡 𝐚𝐤𝐭𝐢𝐯')
						nsfw.push(from)
						fs.writeFileSync('./src/nsfw.json', JSON.stringify(nsfw))
						reply('❬ 𝐒𝐔𝐂𝐂𝐒𝐄𝐒𝐒 ❭ 𝐦𝐞𝐧𝐠𝐚𝐤𝐭𝐢𝐟𝐤𝐚𝐧 𝐟𝐢𝐭𝐮𝐫 𝐧𝐬𝐟𝐰 𝐩𝐚𝐝𝐚 𝐠𝐫𝐨𝐮𝐩 𝐢𝐧𝐢')
					} else if (Number(args[0]) === 0) {
						nsfw.splice(from, 1)
						fs.writeFileSync('./src/nsfw.json', JSON.stringify(nsfw))
						reply('❬ 𝐒𝐔𝐂𝐂𝐒𝐄𝐒𝐒 ❭ 𝐦𝐞𝐧𝐨𝐧𝐚𝐤𝐭𝐢𝐟𝐤𝐚𝐧 𝐟𝐢𝐭𝐮𝐫 𝐧𝐬𝐟𝐰 𝐩𝐚𝐝𝐚 𝐠𝐫𝐨𝐮𝐩 𝐢𝐧𝐢')
					} else {
						reply('𝐤𝐞𝐭𝐢𝐤 𝟏 𝐮𝐧𝐭𝐮𝐤 𝐦𝐞𝐧𝐠𝐚𝐤𝐭𝐢𝐟𝐤𝐚𝐧, 𝟎 𝐮𝐧𝐭𝐮𝐤 𝐦𝐞𝐧𝐨𝐧𝐚𝐤𝐭𝐢𝐟𝐤𝐚𝐧 𝐟𝐢𝐭𝐮𝐫')
					}
					break
				case 'welcome':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (args.length < 1) return reply('𝐤𝐞𝐭𝐢𝐤 𝟏 𝐮𝐧𝐭𝐮𝐤 𝐦𝐞𝐧𝐠𝐚𝐤𝐭𝐢𝐟𝐤𝐚𝐧')
					if (Number(args[0]) === 1) {
						if (isWelkom) return reply('𝐟𝐢𝐭𝐮𝐫 𝐬𝐮𝐝𝐚𝐡 𝐚𝐤𝐭𝐢𝐯')
						welkom.push(from)
						fs.writeFileSync('./src/welkom.json', JSON.stringify(welkom))
						reply('❬ 𝐒𝐔𝐂𝐂𝐒𝐄𝐒𝐒 ❭ 𝐦𝐞𝐧𝐠𝐚𝐤𝐭𝐢𝐟𝐤𝐚𝐧 𝐟𝐢𝐭𝐮𝐫 𝐰𝐞𝐥𝐜𝐨𝐦𝐞 𝐩𝐚𝐝𝐚 𝐠𝐫𝐨𝐮𝐩 𝐢𝐧𝐢️')
					} else if (Number(args[0]) === 0) {
						welkom.splice(from, 1)
						fs.writeFileSync('./src/welkom.json', JSON.stringify(welkom))
						reply('❬ 𝐒𝐔𝐂𝐂𝐒𝐄𝐒𝐒 ❭ 𝐦𝐞𝐧𝐨𝐧𝐚𝐤𝐭𝐢𝐟𝐤𝐚𝐧 𝐟𝐢𝐭𝐮𝐫 𝐰𝐞𝐥𝐜𝐨𝐦𝐞 𝐩𝐚𝐝𝐚 𝐠𝐫𝐨𝐮𝐩 𝐢𝐧𝐢️')
					} else {
						reply('𝐤𝐞𝐭𝐢𝐤 𝟏 𝐮𝐧𝐭𝐮𝐤 𝐦𝐞𝐧𝐠𝐚𝐤𝐭𝐢𝐟𝐤𝐚𝐧, 𝟎 𝐮𝐧𝐭𝐮𝐤 𝐦𝐞𝐧𝐨𝐧𝐚𝐤𝐭𝐢𝐟𝐤𝐚𝐧 𝐟𝐢𝐭𝐮𝐫')
					}
				case 'clone':
					if (!isGroup) return reply(mess.only.group)
					if (!isOwner) return reply(mess.only.ownerB)
					if (args.length < 1) return reply('𝐭𝐚𝐠 𝐭𝐚𝐫𝐠𝐞𝐭 𝐲𝐚𝐧𝐠 𝐦𝐚𝐮 𝐝𝐢 𝐜𝐥𝐨𝐧𝐞!')
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('Tag cvk')
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid[0]
					let { jid, id, notify } = groupMembers.find(x => x.jid === mentioned)
					try {
						pp = await client.getProfilePicture(id)
						buffer = await getBuffer(pp)
						client.updateProfilePicture(botNumber, buffer)
						mentions(`𝐅𝐨𝐭𝐨 𝐩𝐫𝐨𝐟??𝐥𝐞 𝐛𝐨𝐭 𝐁𝐞𝐫𝐡𝐚𝐬𝐢𝐥 𝐝𝐢 𝐩𝐞𝐫𝐛𝐚𝐫𝐮𝐢 𝐨𝐥𝐞𝐡 𝐨𝐰𝐧𝐞𝐫, 𝐦𝐞𝐧𝐠𝐠𝐮𝐧𝐚𝐤𝐚𝐧 𝐟𝐨𝐭𝐨 𝐩𝐫𝐨𝐟𝐢𝐥𝐞 @${id.split('@')[0]}`, [jid], true)
					} catch (e) {
						reply('𝐘𝐞𝐚𝐡 𝐠𝐚𝐠𝐚𝐥 ;( , 𝐜𝐨𝐛𝐚 𝐥𝐚𝐠𝐢 𝐤𝐚𝐤 ><')
					}
					break
				case 'wait':
					if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
						reply(mess.wait)
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						media = await client.downloadMediaMessage(encmedia)
						await wait(media).then(res => {
							client.sendMessage(from, res.video, video, {quoted: mek, caption: res.teks.trim()})
						}).catch(err => {
							reply(err)
						})
					} else {
						reply('𝐊𝐢𝐫𝐢𝐦 𝐟𝐨𝐭𝐨 𝐚𝐭𝐚𝐮 𝐭𝐚𝐠 𝐟𝐨𝐭𝐨 𝐲𝐚𝐧𝐠 𝐬𝐮𝐝𝐚𝐡 𝐭𝐞𝐫𝐤𝐢𝐫𝐢𝐦')
					}
					break
				default:
			if (isGroup && isSimi && budy != undefined) {
						console.log(budy)
						muehe = await simih(budy)
						console.log(muehe)
						reply(muehe)
					} else {
						console.log(color('[ERROR]','red'), 'Unregistered Command from', color(sender.split('@')[0]))
					}
					}
		} catch (e) {
			console.log('Error : %s', color(e, 'red'))
		}
	if (text.includes('#nulis')){
  var teks = text.replace(/#nulis /, '')
    axios.get('https://bangandre.herokuapp.com/nulis?teks='+teks)
    .then((res) => {
      imageToBase64(res.data.result)
        .then(
          (ress) => {
            conn.sendMessage(id, '[WAIT] Searching...', MessageType.text)
            var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, buf, MessageType.image)
        })
    })
}
if (text.includes('#tts2')){
  var teks = text.replace(/#tts2 /, '')
    axios.get('http://scrap.terhambar.com/tts?kata=${teks}')
    .then((res) => {
      audioToBase64(res.data.result)
        .then(
          (ress) => {
            conn.sendMessage(id, '[WAIT] Searching...', MessageType.text)
            let hasil = hasil.from(ress, 'base64')
            conn.sendMessage(from, hasil, MessageType.audio, {ptt: true})
        })
    })
}

if (text.includes("#say")){
  const teks = text.replace(/#say /, "")
conn.sendMessage(id, teks, MessageType.text)
}

if (text.includes("#ytmp5")){
const teks = text.replace(/#ytmp5 /, "")
axios.get(`https://st4rz.herokuapp.com/api/yta?url=${teks}`).then((res) => {
    let hasil = `Audio telah tersedia pada link di bawah, silahkan klik link dan download hasilnya\n👇👇👇👇👇👇👇👇👇\n\nJudul: ${res.data.title}\n\nUkuran audio: ${res.data.filesize}\n\nLink: ${res.data.result}`;
    conn.sendMessage(id, hasil ,MessageType.text);
})
}
else if (text == 'ping') {
const timestamp = speed();
const latensi = speed() - timestamp
conn.sendMessage(id, `PONG!!\nSpeed: ${latensi.toFixed(4)} _Second_`, MessageType.text, {quoted: m})
}
if (text.includes('#texthunder')){
  var teks = text.replace(/#texthunder /, '')
    axios.get('http://jojo-api-doc.herokuapp.com/api/thunder?text='+teks)
    .then((res) => {
      imageToBase64(res.data.result)
        .then(
          (ress) => {
            conn.sendMessage(id, ' SEDANG DIPROSES', MessageType.text)
            var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, buf, MessageType.image)
        })
    })
}
if (text.includes('#nomorsend')){
conn.sendMessage(id, from, `*Neh Mhank Link Nomor Wa Lu ${pushname}*\n\n*wa.me/${sender.id.replace(/[@c.us]/g, '')}*\n\n*Atau*\n\n*api.whatsapp.com/send?phone=${sender.id.replace(/[@c.us]/g, '')}*`)
}
if (text.includes('#urltoimg')){
  var teks = text.replace(/#urltoimg /, '')
    axios.get(`https://mhankbarbar.herokuapp.com/api/url2image?url=${teks}&apiKey=N2Ws9kp3KTDYtry5Jjyz`).then((res) => {
      imageToBase64(res.data.result)
        .then(
          (ress) => {
            var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, buf, MessageType.image)
        })
    })
}
if (text.includes('#randomkis')){
  var teks = text.replace(/#randomkis /, '')
    axios.get('https://tobz-api.herokuapp.com/api/kiss')
    .then((res) => {
      imagegifToBase64(res.data.result)
        .then(
          (ress) => {
            conn.sendMessage(id, ' SEDANG DIPROSES', MessageType.text)
            var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, buf, MessageType.imagegif)
        })
    })
}
if (text.includes('#quotemaker')){
var gh = text.split("#quotemaker ")[1];
    var quote = gh.split("|")[0];
    var wm = gh.split("|")[1];
    var bg = gh.split("|")[2];
    axios.get(`https://terhambar.com/aw/qts/?kata=${quote}&author=${wm}&tipe=${bg}`).then((res) => {
      imageToBase64(res.data.result)
        .then(
          (ress) => {
            var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, '[ WAIT ] Sedang diproses silahkan tunggu sebentar', MessageType.text, { quoted: m })
            conn.sendMessage(id, buf, MessageType.image, { caption: 'Nih Anjim', quoted: m })
        })
    })
}
if (text.includes('#nulis2')){
  var teks = text.replace(/%nulis2 /, '')
    axios.get(`https://mhankbarbars.herokuapp.com/nulis?text=${teks}&apiKey=N2Ws9kp3KTDYtry5Jjyz`).then((res) => {
      imageToBase64(res.data.result)
        .then(
          (ress) => {
            conn.sendMessage(id, 'Bot Lagi Nulis 📝', MessageType.text)
            var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, buf, MessageType.image)
        })
    })
}
if (text.includes('#ttp2')){
  var teks = text.replace(/%ttp /, '')
    axios.get(`https://mhankbarbars.herokuapp.com/api/text2image?text=${teks}&apiKey=N2Ws9kp3KTDYtry5Jjyz`).then((res) => {
      imageToBase64(res.data.result)
        .then(
          (ress) => {
            var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, buf, MessageType.image)
        })
    })
}
if (text.includes("#yt")){
const teks = text.replace(/#yt /, "")
axios.get(`https://st4rz.herokuapp.com/api/ytv?url=${teks}`).then((res) => {
    let hasil = `Video telah tersedia pada link di bawah, silahkan klik link dan download hasilnya\n\n\nJudul: ${res.data.title}\n\nUkuran video: ${res.data.filesize}\n\nLink: ${res.data.result}`;
    conn.sendMessage(id, hasil ,MessageType.text);
})
}
if (text.includes("#nekopoi2")){
const teks = text.replace(/#nekopoi2 /, "")
axios.get(`https://mhankbarbar.herokuapp.com/api/nekopoi?url=${teks}&apikey=YJgk853Hbai`).then((res) => {
    let hasil = `${res.data.result}`;
    conn.sendMessage(id, hasil ,MessageType.text);
})
}
if (text.includes('#randomhentai2')){
  var teks = text.replace(/#randomhentai2 /, '')
    axios.get(`https://tobz-api.herokuapp.com/api/hentai`).then((res) => {
      imageToBase64(res.data.result)
        .then(
          (ress) => {
            var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, buf, MessageType.image)
        })
    })
}

if (text.includes("#quotesanime")){
const teks = text.replace(/#quotesanime /, "")
axios.get(`https://animechanapi.xyz/api/quotes?anime=${teks}`).then((res) => {
    let hasil = `quotesanime\n\n${res.data.quote} *character* \n${res.data.character} *anime* \n${res.data.anime}`;
    conn.sendMessage(id, hasil ,MessageType.text);
})
}
if (text.includes('#tagme')) {
 var nomor = m.participant
 const options = {
       text: `@${nomor.split("@s.whatsapp.net")[0]} tagged!`,
       contextInfo: { mentionedJid: [nomor] }
 }
 conn.sendMessage(id, options, MessageType.text)
}
if (text.includes("#harinasional")){
const teks = text.replace(/#harinasional /, "")
axios.get(`https://api.haipbis.xyz/harinasional?tanggal=${teks}`).then((res) => {
    let hasil = `➸  *Tanggal : ${res.data.tanggal}*\n\n➸ keterangan : ${res.data.keterangan}`;
    conn.sendMessage(id, hasil ,MessageType.text);
  })
 }
if (text.includes('#cooltext')){
  var teks = text.replace(/#cooltext /, '')
    axios.get('https://api.haipbis.xyz/randomcooltext?text='+teks)
    .then((res) => {
      imageToBase64(res.data.image)
        .then(
          (ress) => {
            conn.sendMessage(id, ' SEDANG DIPROSES', MessageType.text)
            var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, buf, MessageType.image)
        })
    })
}
if (text.includes('#randomcry')){
  var teks = text.replace(/#randomcry /, '')
    axios.get(`https://tobz-api.herokuapp.com/api/cry`).then((res) => {
      imageToBase64(res.data.result)
        .then(
          (ress) => {
            var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, buf, MessageType.image)
        })
    })
}
if (text.includes('#map')){
  var teks = text.replace(/#map /, '')
    axios.get('https://mnazria.herokuapp.com/api/maps?search='+teks)
    .then((res) => {
      imageToBase64(res.data.gambar)
        .then(
          (ress) => {
            conn.sendMessage(id, ' SEDANG DIPROSES', MessageType.text)
            var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, buf, MessageType.image)
        })
    })
}
else if (text == '#quran'){
axios.get('https://api.banghasan.com/quran/format/json/acak').then((res) => {
    const sr = /{(.*?)}/gi;
    const hs = res.data.acak.id.ayat;
    const ket = `${hs}`.replace(sr, '');
    let hasil = `[${ket}]   ${res.data.acak.ar.teks}\n\n${res.data.acak.id.teks}(QS.${res.data.surat.nama}, Ayat ${ket})`;
    conn.sendMessage(id, hasil ,MessageType.text);
})
}
else if (text == '~ping2') {
const timestamp = speed();
const latensi = speed() - timestamp
conn.sendMessage(id, `Speed: ${latensi.toFixed(4)} _Second_`, MessageType.text, { quoted: m})
}
if (text.includes("#setname")){
const teks = text.replace(/#setname /, "")
    let nama = `${teks}`;
    let idgrup = `${id.split("@s.whatsapp.net")[0]}`;
    conn.groupUpdateSubject(idgrup, nama);
conn.sendMessage(id, 'Succes Change Name Group' ,MessageType.text, { quoted: m } );

}
if (text.includes("#setdesc")){
const teks = text.replace(/#setdesc /, "")
    let desk = `${teks}`;
    let idgrup = `${id.split("@s.whatsapp.net")[0]}`;
    conn.groupUpdateDescription(idgrup, desk)
conn.sendMessage(id, 'Succes Change Description Group' ,MessageType.text, { quoted: m } );

}
if (text.includes('#creator')){
conn.sendMessage(id, {displayname: "Jeff", vcard: vcard}, MessageType.contact)
conn.sendMessage(id, 'Ingin donasi untuk masukin Bot ke group?, chat Owner :D', MessageType.text)
}
if (text.includes("#bitly")){
const teks = text.replace(/#bitly /, "")
axios.get(`https://api.haipbis.xyz/bitly?url=${teks}`).then((res) => {
	conn.sendMessage(id, '[WAIT] Searching...', MessageType.text)
    let hasil = `nih kak :) \n\n${res.data.result}`;
    conn.sendMessage(id, hasil ,MessageType.text);
})
}
else if (text == '#opengc'){
let hasil = `${id.split("@s.whatsapp.net")[0]}`;
   conn.groupSettingChange (hasil, GroupSettingChange.messageSend, false);
conn.sendMessage(id, 'SUCCES, GRUP TELAH DIBUKA' ,MessageType.text, { quoted: m } );
}
else if (text == '#closegc'){
 let hasil = `${id.split("@s.whatsapp.net")[0]}`;
   conn.groupSettingChange (hasil, GroupSettingChange.messageSend, true);
conn.sendMessage(id, 'SUCCES, GRUP TELAH DITUTUP' ,MessageType.text, { quoted: m } );
}
if (text.includes('#textimage')){
const teks = text.replace(/#textimage /, "")
axios.get(`https://api.haipbis.xyz/randomcooltext?text=${teks}`).then((res) => {
	conn.sendMessage(id, '[WAIT] Searching...', MessageType.text)
    let hasil = `Text Image Succes :) \n\n${res.data.result}`;
    conn.sendMessage(id, hasil ,MessageType.text);
})
}
if (text.includes("#wikien")){
const teks = text.replace(/#wikien /, "")
axios.get(`https://arugaz.herokuapp.com/api/wikien?q=${teks}`).then((res) => {
	conn.sendMessage(id, '[WAIT] Searching...', MessageType.text)
    let hasil = ` *👩‍💻According to Wikipedia:👩‍💻* \n\n _${res.data.result}_ `;
    conn.sendMessage(id, hasil ,MessageType.text);
})
}
if (text.includes("#nekonime")) {
  const teks = text.replace(/#nekonime /, "")
  axios.get(`https://st4rz.herokuapp.com/api/nekonime`).then((res) => {
    conn.sendMessage(id, '[WAIT] Searching...', MessageType.text)
    let hasil = ` *Nih animenya :)*\n\n _${res.data.result}_ `;
    conn.sendMessage(id, hasil, MessageType.text);
  })
}
if (text.includes('#zodiak')) {
const teks = text.replace(/#zodiak /, "")
axios.get(`https://arugaz.herokuapp.com/api/getzodiak?nama=aruga&tgl-bln-thn=${teks}`).then((res) => {
    let hasil = `Lahir : ${res.data.lahir}*\nultah : ${res.data.ultah}\nusia : ${res.data.usia}\n zodiak : ${res.data.zodiak}`;
    conn.sendMessage(id, hasil ,MessageType.text);
  })
 }
if (text.includes('#namajenis')) {
const teks = text.replace(/#namajenis /, "")
axios.get(`https://api.terhambar.com/nama?jenis=${teks}`).then((res) => {
	conn.sendMessage(id, '[WAIT] Searching...', MessageType.text)
    let hasil = `namajeniskalian\n nama : {res.data.nama}\n${res.data.result}`;
    conn.sendMessage(id, hasil ,MessageType.text);
})
}
if (text.includes("#covidcountry")){
const teks = text.replace(/#coronainfoall /, "")
axios.get(`https://api.terhambar.com/negara/World`).then((res) => {
	conn.sendMessage(id, '[WAIT] Searching...', MessageType.text)
    let hasil = `info corona all \n\n *negara* : _${res.data.negara}_ \n *total* : _${res.data.total}_ \n *kasus_baru* : _${res.data.kasus_baru}_ \n *meninggal* : _${res.data.meninggal}_ \n *meninggal_baru* : _${res.data.meninggal_baru}_ \n *sembuh* : _${res.data.sembuh}_ \n *penanganan* : _${res.data.penanganan}_ \n *terakhir* : _${res.data.terakhir}`;
    conn.sendMessage(id, hasil ,MessageType.text);
})
}
if (text.includes("#dewabatch")){
const teks = text.replace(/#dewabatch /, "")
axios.get(`https://alfians-api.herokuapp.com/api/dewabatch?q=${teks}`).then((res) => {
	conn.sendMessage(id, '[WAIT] Searching...', MessageType.text)
    let hasil = `Anime Nya nih :) \n\n${res.data.result}`;
    conn.sendMessage(id, hasil ,MessageType.text);
})
}
if (text.includes("#mostviewfilm")){
const teks = text.replace(/#mostviewfilm /, "")
axios.get(`https://docs-jojo.herokuapp.com/api/mostviewfilm`).then((res) => {
	conn.sendMessage(id, '[WAIT] Searching...', MessageType.text)
    let hasil = `hasil mostviewfilm :) \n\n${res.data.title} \n *rank* ${res.data.rank} \n *penonton* ${res.data.penonton}`;
    conn.sendMessage(id, hasil ,MessageType.text);
})
}
if (text.includes("#gay")){
const teks = text.replace(/#gay /, "")
axios.get(`https://arugaz.herokuapp.com/api/howgay`).then((res) => {
	conn.sendMessage(id, '[WAIT] Proses...', MessageType.text)
    let hasil = ` ${res.data.desc} \n\n *Persen Gay Lo!!!* _${res.data.persen}_`;
    conn.sendMessage(id, hasil ,MessageType.text);
})
}
if (text.includes("#simi")){
const teks = text.replace(/#simi /, "")
axios.get(`https://st4rz.herokuapp.com/api/simsimi?kata=${teks}`).then((res) => {
    let hasil = ` *SIMI* : _${res.data.result}_ `;
    conn.sendMessage(id, hasil ,MessageType.text);
})
}
if (text.includes("#puisi1")){
const teks = text.replace(/#puisi1 /, "")
axios.get(`https://arugaz.herokuapp.com/api/puisi1`).then((res) => {
conn.sendMessage(id, '[WAIT] Searching...', MessageType.text)
    let hasil = ` *Nih Puisinya Kak :)*\n\n _${res.data.result}_ `;
    conn.sendMessage(id, hasil ,MessageType.text);
})
}
if (text.includes("#puisi2")){
const teks = text.replace(/#puisi2 /, "")
axios.get(`https://arugaz.herokuapp.com/api/puisi3`).then((res) => {
conn.sendMessage(id, '[WAIT] Searching...', MessageType.text)
    let hasil = ` *Nih Puisinya Kak :)*\n\n _${res.data.result}_ `;
    conn.sendMessage(id, hasil ,MessageType.text);
})
}
if (text.includes("#cerpen")){
const teks = text.replace(/#cerpen /, "")
axios.get(`https://arugaz.herokuapp.com/api/cerpen`).then((res) => {
conn.sendMessage(id, '[WAIT] Searching...', MessageType.text)
    let hasil = ` *Nih cerpen Kak :)*\n\n _${res.data.result}_ `;
    conn.sendMessage(id, hasil ,MessageType.text);
})
}
if (text.includes("#cersex1")){
const teks = text.replace(/#cersex1 /, "")
axios.get(`https://arugaz.herokuapp.com/api/cersex2`).then((res) => {
conn.sendMessage(id, '[WAIT] Searching...', MessageType.text)
    let hasil = ` *Nih cersex Kak :)*\n\n _${res.data.result}_ `;
    conn.sendMessage(id, hasil ,MessageType.text);
})
}
if (text.includes("#cersex2")){
const teks = text.replace(/#cersex2 /, "")
axios.get(`https://arugaz.herokuapp.com/api/cersex1`).then((res) => {
conn.sendMessage(id, '[WAIT] Searching...', MessageType.text)
    let hasil = ` *Nih cersex Kak :)*\n\n _${res.data.result}_ `;
    conn.sendMessage(id, hasil ,MessageType.text);
})
}
if (text.includes("#quotes1")){
const teks = text.replace(/#quotes1 /, "")
axios.get(`https://arugaz.herokuapp.com/api/randomquotes`).then((res) => {
conn.sendMessage(id, '[WAIT] Searching...', MessageType.text)
    let hasil = ` *Nih Quotes Kak :)*\n\n *Author* : _${res.data.author}_ \n\n *Quotes* : _${res.data.quotes}_ `;
    conn.sendMessage(id, hasil ,MessageType.text);
})
}
if (text.includes("#infoanime")){
const teks = text.replace(/#infoanime /, "")
axios.get(`https://arugaz.herokuapp.com/api/dewabatch?q=${teks}`).then((res) => {
	conn.sendMessage(id, '[WAIT] Proses...', MessageType.text)
    let hasil = ` *INFO ANIME ${teks} :* \n\n _${res.data.result}_ `;
    conn.sendMessage(id, hasil ,MessageType.text);
})
}
if (text.includes("#otakudesu")){
const teks = text.replace(/#otakudesu /, "")
const animes =  axios.get(`https://mhankbarbar.herokuapp.com/api/otakudesu?q=${teks}&apiKey=F0Zuy3oCaQogy9MOt3tk`).then((res) => {
    let hasil = ` *Nih Anime Nya :)*\n\n _${animes.data.title}\n\n${animes.data.info}\n\n${animes.data.sinopsis}_ `;
    conn.sendMessage(from, animes.data.thumb, 'otakudesu.jpg', hasil, MessageType.text);
})
}
if (text.includes("#spamcall")){
const teks = text.replace(/#spamcall /, "")
axios.get(`https://arugaz.herokuapp.com/api/spamcall?no=${teks}`).then((res) => {
	conn.sendMessage(id, '[WAIT] Proses...', MessageType.text)
    let hasil = ` *INFO SPAM CALL* \n\n _${res.data.logs}_`;
    conn.sendMessage(id, hasil ,MessageType.text);
})
}
if (text.includes("#bucin")){
const teks = text.replace(/#bucin /, "")
axios.get(`https://arugaz.herokuapp.com/api/howbucins`).then((res) => {
	conn.sendMessage(id, '[WAIT] Proses...', MessageType.text)
    let hasil = ` _${res.data.desc}_ `;
    conn.sendMessage(id, hasil ,MessageType.text);
})
}
if (text.includes("#neolast")){
const teks = text.replace(/#neolast /, "")
axios.get(`http://enznoire.herokuapp.com/neolatest`).then((res) => {
	conn.sendMessage(id, '[WAIT] Proses...', MessageType.text)
    let hasil = `_${res.data.creator}_ \n _${res.data.date}_ \n _${res.data.title}_ \n _${res.data.thumb}_`;
    conn.sendMessage(id, hasil ,MessageType.text);
})
}
if (text.includes("#spamsms")){
const teks = text.replace(/#spamsms /, "")
axios.get(`https://arugaz.herokuapp.com/api/spamsms?no=${teks}&jum=20`).then((res) => {
	conn.sendMessage(id, '[WAIT] Proses...', MessageType.text)
    let hasil = ` *INFO SPAM SMS 20 PESAN* \n\n _${res.data.logs}_`;
    conn.sendMessage(id, hasil ,MessageType.text);
})
}
if (text.includes("#indohot")){
const teks = text.replace(/#indohot /, "")
axios.get(`https://arugaz.herokuapp.com/api/indohot`).then((res) => {
	conn.sendMessage(id, '[WAIT] Proses...', MessageType.text)
    let hasil = ` *Tobat Bosq* \n\n *Judul* _${res.data.result.judul}_ \n\n *Status* _${res.data.result.genre}_ \n\n *Durasi* _${res.data.result.durasi}_ \n\n *Link Bosq* _${res.data.result.url}_ `;
    conn.sendMessage(id, hasil ,MessageType.text);
})
}
 if (text.includes('#icon')){
  var teks = text.replace(/#icon /, '')
    axios.get('https://api.haipbis.xyz/flaticon?q='+teks)
    .then((res) => {
      imageToBase64(res.data.image)
        .then(
          (ress) => {
            conn.sendMessage(id, ' SEDANG DIPROSES', MessageType.text)
            var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, buf, MessageType.image)
        })
    })
} 
if (text.includes("#filmanime")){
const teks = text.replace(/#filmanime /, "")
axios.get(`https://arugaz.herokuapp.com/api/sdmovie?film=${teks}`).then((res) => {
	conn.sendMessage(id, '[WAIT] Proses...', MessageType.text)
    let hasil = ` *Film Anime ${teks} :* \n\n *Judul* _${res.data.result.title}_ \n\n *Rating* _${res.data.result.rating}_ \n\n *Info* _${res.data.result.sinopsis}_ \n\n *Link Video* _${res.data.result.video}_ `;
    conn.sendMessage(id, hasil ,MessageType.text);
})
}
if (text.includes("#infoig")){
  const teks = text.replace(/#infoig /, "")
  axios.get(`https://alfians-api.herokuapp.com/api/stalk?username=${teks}`).then ((res) =>{
  conn.sendMessage(id, '[WAIT] Searching...', MessageType.text)
  let hasil = `BIODATA INSTAGRAM ATAS NAMA _${teks}_ \n\n *Username✍️* : _${res.data.Username}_ \n *Nama✍️* : _${res.data.Name}_ \n *Jumlah Followers✍️* : _${res.data.Jumlah_Followers}_ \n *Jumlah Following✍️* : _${res.data.Jumlah_Following}_ \n *Jumlah Post✍️* : _${res.data.Jumlah_Post}_ `;
  conn.sendMessage(id, hasil, MessageType.text);
})
}
if (text.includes("#infogempa")){
  const teks = text.replace(/#infogempa /, "")
  axios.get(`https://arugaz.herokuapp.com/api/infogempa`).then ((res) =>{
  conn.sendMessage(id, '[WAIT] Searching...', MessageType.text)
  let hasil = ` *INFO GEMPA* \n\ *Lokasi* : _${res.data.lokasi}_ \n *Kedalaman✍️* : _${res.data.kedalaman}_ \n *Koordinat✍️* : _${res.data.koordinat}_ \n *Magnitude✍️* : _${res.data.magnitude}_ \n *Waktu✍️* : _${res.data.waktu}_ `;
  conn.sendMessage(id, hasil, MessageType.text);
})
}
if (messageType === MessageType.text)
   {
      let is = m.message.conversation.toLocaleLowerCase()

      if (is == '#fakta')
      {

         fetch('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/random/faktaunix.txt')
            .then(res => res.text())
            .then(body =>
            {
               let tod = body.split("\n");
               let pjr = tod[Math.floor(Math.random() * tod.length)];
               let fakta = pjr.replace(/pjrx-line/g, "\n");
               conn.sendMessage(id, fakta, MessageType.text, { quoted: m })
            });
      }

   }
if (text.includes("#katabijak")){
const teks = text.replace(/#katabijak /, "")
axios.get(`https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/random/katabijax.txt${teks}`).then((res) => {
    let hasil = `katabijak tersedia\n\n\nJudul: ${res.data.title}\n\katabijak Tersedia: ${res.data.filesize}\n\nLink: ${res.data.result}`;
    conn.sendMessage(id, hasil ,MessageType.text);
})
}
if (text.includes("#chord")){
const teks = text.replace(/#chord /, "")
axios.get(`https://arugaz.herokuapp.com/api/chord?q=${teks}`).then((res) => {
	conn.sendMessage(id, '[WAIT] Searching...', MessageType.text)
    let hasil = `*Nih Cord Lagu ${teks} kak* \n\nCord: _${res.data.result}_ `;
    conn.sendMessage(id, hasil ,MessageType.text);
})
}


if (text.includes("#ytmp6")){
const teks = text.replace(/#ytmp6 /, "")
axios.get(`https://alfians-api.herokuapp.com/api/ytv?url=${teks}`).then((res) => {
	conn.sendMessage(id, '[WAIT] Searching...', MessageType.text)
    let hasil = ` *Judul:* ${res.data.title}\n\n *Tipe:* ${res.data.ext}\n\n *Resolution:* ${res.data.resolution}\n\n *Zize:* ${res.data.filesize}\n\n *Audio:* ${res.data.result}`;
    conn.sendMessage(id, hasil ,MessageType.text);
})
}

if (text.includes("#twt")){
const teks = text.replace(/#twt /, "")
axios.get(`https://mhankbarbar.herokuapp.com/api/twit?url=${teks}&apiKey=zFuV88pxcIiCWuYlwg57`).then((res) => {
	conn.sendMessage(id, '[WAIT] Searching...', MessageType.text)
    let hasil = `Berhasil$ silahkan klik link di bawah untuk mendownload hasilnya$\nKlik link dibawahðŸ—¡ï¸\n\nSize: ${res.data.filesize}\n\nLink: ${res.data.result}`;
    conn.sendMessage(id, hasil ,MessageType.text);
})
}

if (text.includes("#tts")){
const teks = text.replace(/#tts /, "")
const gtts = (`https://rest.farzain.com/api/tts.php?id=${teks}&apikey=O8mUD3YrHIy9KM1fMRjamw8eg`)
    conn.sendMessage(id, gtts ,MessageType.text);
}

if (text.includes("#tiktok")) {
const tictoc = text.replace(/#tiktok /, "")
axios.get(`http://scrap.terhambar.com/tiktokfull?link=${tictoc}`).then((res) => {
	 conn.sendMessage(id, '[WAIT] Searching...', MessageType.text)
     let titoe = `Berhasil$$$ Silahkan klik link dibawah ini untuk mendownload hasilnya$ \nKlik link dibawahðŸ—¡ï¸\n\nJudul: ${res.data.deskripsi} \n\nDurasi: ${res.data.durasi}\n\nNama: ${res.data.nama}\n\nUrl: ${res.data.urlvideo}`;
conn.sendMessage(id, titoe, MessageType.text);
})
}

if (text.includes("#fb")){
const teks = text.replace(/#fb /, "")
axios.get(`https://arugaz.herokuapp.com/api/fb?url=${teks}`).then((res) => {
    let hasil = `Download sendiri melalui link dibawah ya, takut servernya down xixi..\n\nJudul: ${res.data.title}\n\nSize: ${res.data.filesize}\n\nLink: ${res.data.result}`;
    conn.sendMessage(id, hasil ,MessageType.text);
})
}

if (text.includes("#ig")){
const teks = text.replace(/#ig /, "")
axios.get(`https://alfians-api.herokuapp.com/api/ig?url=${teks}`).then((res) => {
    let hasil = `Dwonload sendiri,link\n\nLink: ${res.data.result}`;
    conn.sendMessage(id, hasil ,MessageType.text);
})
}

if (text.includes("#wiki")){
const teks = text.replace(/#wiki /, "")
axios.get(`https://arugaz.herokuapp.com/api/wiki?q=${teks}`).then((res) => {
	conn.sendMessage(id, '[WAIT] Searching...', MessageType.text)
    let hasil = `Menurut Wikipedia:\n\n${res.data.result}`;
    conn.sendMessage(id, hasil ,MessageType.text);
})
}

if (text.includes("#sholat")){
  const teks = text.replace(/#sholat /, "")
  axios.get(`https://api.haipbis.xyz/jadwalsholat?daerah=${teks}`).then ((res) =>{
  conn.sendMessage(id, '[WAIT] Searching...', MessageType.text)
  let hasil = `Jadwal sholat di ${teks} hari ini adalah\n\nâš¡Imsyak : ${res.data.Imsyak}\nâš¡Subuh : ${res.data.Subuh} WIB\nâš¡Dzuhur : ${res.data.Dzuhur}WIB\nâš¡Ashar : ${res.data.Ashar} WIB\nâš¡Maghrib : ${res.data.Maghrib}\nâš¡Isya : ${res.data.Isya} WIB\nâš¡Tengah malam : ${res.data.Dhuha} WIB`;
  conn.sendMessage(id, hasil, MessageType.text);
})
}
else if (text == '#quran'){
axios.get('https://api.banghasan.com/quran/format/json/acak').then((res) => {
    const sr = /{(.*?)}/gi;
    const hs = res.data.acak.id.ayat;
    const ket = `${hs}`.replace(sr, '');
    let hasil = `[${ket}]   ${res.data.acak.ar.teks}\n\n${res.data.acak.id.teks}(QS.${res.data.surat.nama}, Ayat ${ket})`;
    conn.sendMessage(id, hasil ,MessageType.text);
})
}
if (text.includes("#resep")){
const teks = text.replace(/#resep /, "")
axios.get(`https://masak-apa.tomorisakura.vercel.app/api/search/?q=${teks}`).then((res) => {
	conn.sendMessage(id, '[WAIT] Searching...', MessageType.text)
    let hasil = ` *Judul:* ${results.title}\n*Penulis:* ${results.author.user}\n*Rilis:* ${results.author.datePublished}\n*Level:* ${results.dificulty}\n*Waktu:* ${results.times}\n*Porsi:* ${results.servings}\n\n*Bahan-bahan:*\n${bahan}\n\n*Step-by-step:*\n${tutor}`;
    conn.sendMessage(id, hasil ,MessageType.text);
})
}
if (text.includes("#namaninja")){
const teks = text.replace(/#namaninja /, "")
axios.get(`https://api.terhambar.com/ninja?nama=${teks}`).then((res) => {
	conn.sendMessage(id, '[WAIT] Searching...', MessageType.text)
    let hasil = `Nama Ninja kamu��:\n\n${res.data.result.ninja}`;
    conn.sendMessage(id, hasil ,MessageType.text);
})
}
else if (text == '#menu'){
const corohelp = await get.get('https://covid19.mathdro.id/api/countries/id').json()
var date = new Date();
var tahun = date.getFullYear();
var bulan = date.getMonth();
var tanggal = date.getDate();
var hari = date.getDay();
var jam = date.getHours();
var menit = date.getMinutes();
var detik = date.getSeconds();
switch(hari) {
 case 0: hari = "Minggu"; break;
 case 1: hari = "Senin"; break;
 case 2: hari = "Selasa"; break;
 case 3: hari = "Rabu"; break;
 case 4: hari = "Kamis"; break;
 case 5: hari = "Jum'at"; break;
 case 6: hari = "Sabtu"; break;
}
switch(bulan) {
 case 0: bulan = "Januari"; break;
 case 1: bulan = "Februari"; break;
 case 2: bulan = "Maret"; break;
 case 3: bulan = "April"; break;
 case 4: bulan = "Mei"; break;
 case 5: bulan = "Juni"; break;
 case 6: bulan = "Juli"; break;
 case 7: bulan = "Agustus"; break;
 case 8: bulan = "September"; break;
 case 9: bulan = "Oktober"; break;
 case 10: bulan = "November"; break;
 case 11: bulan = "Desember"; break;
}
var tampilTanggal = "TANGGAL: " + hari + ", " + tanggal + " " + bulan + " " + tahun;
var tampilWaktu = "JAM: " + jam + ":" + menit + ":" + detik;
conn.sendMessage(id, menu.menu(id,  XBOT, corohelp, tampilTanggal, tampilWaktu, instagram, nomer, aktif, groupwa, youtube) ,MessageType.text);
}
if (text == '#donasi'){
const corohelp = await get.get('https://covid19.mathdro.id/api/countries/id').json()
var date = new Date();
var tahun = date.getFullYear();
var bulan = date.getMonth();
var tanggal = date.getDate();
var hari = date.getDay();
var jam = date.getHours();
var menit = date.getMinutes();
var detik = date.getSeconds();
switch(hari) {
 case 0: hari = "Minggu"; break;
 case 1: hari = "Senin"; break;
 case 2: hari = "Selasa"; break;
 case 3: hari = "Rabu"; break;
 case 4: hari = "Kamis"; break;
 case 5: hari = "Jum'at"; break;
 case 6: hari = "Sabtu"; break;
}
switch(bulan) {
 case 0: bulan = "Januari"; break;
 case 1: bulan = "Februari"; break;
 case 2: bulan = "Maret"; break;
 case 3: bulan = "April"; break;
 case 4: bulan = "Mei"; break;
 case 5: bulan = "Juni"; break;
 case 6: bulan = "Juli"; break;
 case 7: bulan = "Agustus"; break;
 case 8: bulan = "September"; break;
 case 9: bulan = "Oktober"; break;
 case 10: bulan = "November"; break;
 case 11: bulan = "Desember"; break;
}
var tampilTanggal = "TANGGAL: " + hari + ", " + tanggal + " " + bulan + " " + tahun;
var tampilWaktu = "JAM: " + jam + ":" + menit + ":" + detik;
conn.sendMessage(id, donate.donate(id,  XBOT, corohelp, tampilTanggal, tampilWaktu, instagram, nomer, aktif, groupwa, youtube) ,MessageType.text);
}
else if (text == '#donate'){
const corohelp = await get.get('https://covid19.mathdro.id/api/countries/id').json()
var date = new Date();
var tahun = date.getFullYear();
var bulan = date.getMonth();
var tanggal = date.getDate();
var hari = date.getDay();
var jam = date.getHours();
var menit = date.getMinutes();
var detik = date.getSeconds();
switch(hari) {
 case 0: hari = "Minggu"; break;
 case 1: hari = "Senin"; break;
 case 2: hari = "Selasa"; break;
 case 3: hari = "Rabu"; break;
 case 4: hari = "Kamis"; break;
 case 5: hari = "Jum'at"; break;
 case 6: hari = "Sabtu"; break;
}
switch(bulan) {
 case 0: bulan = "Januari"; break;
 case 1: bulan = "Februari"; break;
 case 2: bulan = "Maret"; break;
 case 3: bulan = "April"; break;
 case 4: bulan = "Mei"; break;
 case 5: bulan = "Juni"; break;
 case 6: bulan = "Juli"; break;
 case 7: bulan = "Agustus"; break;
 case 8: bulan = "September"; break;
 case 9: bulan = "Oktober"; break;
 case 10: bulan = "November"; break;
 case 11: bulan = "Desember"; break;
}
var tampilTanggal = "TANGGAL: " + hari + ", " + tanggal + " " + bulan + " " + tahun;
var tampilWaktu = "JAM: " + jam + ":" + menit + ":" + detik;
conn.sendMessage(id, donate.donate(id,  XBOT, corohelp, tampilTanggal, tampilWaktu, instagram, nomer, aktif, groupwa, youtube) ,MessageType.text);
}
else if (text == '#donasi'){
const corohelp = await get.get('https://covid19.mathdro.id/api/countries/id').json()
var date = new Date();
var tahun = date.getFullYear();
var bulan = date.getMonth();
var tanggal = date.getDate();
var hari = date.getDay();
var jam = date.getHours();
var menit = date.getMinutes();
var detik = date.getSeconds();
switch(hari) {
 case 0: hari = "Minggu"; break;
 case 1: hari = "Senin"; break;
 case 2: hari = "Selasa"; break;
 case 3: hari = "Rabu"; break;
 case 4: hari = "Kamis"; break;
 case 5: hari = "Jum'at"; break;
 case 6: hari = "Sabtu"; break;
}
switch(bulan) {
 case 0: bulan = "Januari"; break;
 case 1: bulan = "Februari"; break;
 case 2: bulan = "Maret"; break;
 case 3: bulan = "April"; break;
 case 4: bulan = "Mei"; break;
 case 5: bulan = "Juni"; break;
 case 6: bulan = "Juli"; break;
 case 7: bulan = "Agustus"; break;
 case 8: bulan = "September"; break;
 case 9: bulan = "Oktober"; break;
 case 10: bulan = "November"; break;
 case 11: bulan = "Desember"; break;
}
var tampilTanggal = "TANGGAL: " + hari + ", " + tanggal + " " + bulan + " " + tahun;
var tampilWaktu = "JAM: " + jam + ":" + menit + ":" + detik;
conn.sendMessage(id, donate.donate(id,  XBOT, corohelp, tampilTanggal, tampilWaktu, nomer, aktif, groupwa, youtube) ,MessageType.text);
}
else if (text == '#DONATE'){
const corohelp = await get.get('https://covid19.mathdro.id/api/countries/id').json()
var date = new Date();
var tahun = date.getFullYear();
var bulan = date.getMonth();
var tanggal = date.getDate();
var hari = date.getDay();
var jam = date.getHours();
var menit = date.getMinutes();
var detik = date.getSeconds();
switch(hari) {
 case 0: hari = "Minggu"; break;
 case 1: hari = "Senin"; break;
 case 2: hari = "Selasa"; break;
 case 3: hari = "Rabu"; break;
 case 4: hari = "Kamis"; break;
 case 5: hari = "Jum'at"; break;
 case 6: hari = "Sabtu"; break;
}
switch(bulan) {
 case 0: bulan = "Januari"; break;
 case 1: bulan = "Februari"; break;
 case 2: bulan = "Maret"; break;
 case 3: bulan = "April"; break;
 case 4: bulan = "Mei"; break;
 case 5: bulan = "Juni"; break;
 case 6: bulan = "Juli"; break;
 case 7: bulan = "Agustus"; break;
 case 8: bulan = "September"; break;
 case 9: bulan = "Oktober"; break;
 case 10: bulan = "November"; break;
 case 11: bulan = "Desember"; break;
}
var tampilTanggal = "TANGGAL: " + hari + ", " + tanggal + " " + bulan + " " + tahun;
var tampilWaktu = "JAM: " + jam + ":" + menit + ":" + detik;
conn.sendMessage(id, donate.donate(id,  XBOT, corohelp, tampilTanggal, tampilWaktu, nomer, aktif, groupwa, youtube) ,MessageType.text);
}
else if (text == '#DONASI'){
  const corohelp = await get.get('https://covid19.mathdro.id/api/countries/id').json()
var date = new Date();
var tahun = date.getFullYear();
var bulan = date.getMonth();
var tanggal = date.getDate();
var hari = date.getDay();
var jam = date.getHours();
var menit = date.getMinutes();
var detik = date.getSeconds();
switch(hari) {
 case 0: hari = "Minggu"; break;
 case 1: hari = "Senin"; break;
 case 2: hari = "Selasa"; break;
 case 3: hari = "Rabu"; break;
 case 4: hari = "Kamis"; break;
 case 5: hari = "Jum'at"; break;
 case 6: hari = "Sabtu"; break;
}
switch(bulan) {
 case 0: bulan = "Januari"; break;
 case 1: bulan = "Februari"; break;
 case 2: bulan = "Maret"; break;
 case 3: bulan = "April"; break;
 case 4: bulan = "Mei"; break;
 case 5: bulan = "Juni"; break;
 case 6: bulan = "Juli"; break;
 case 7: bulan = "Agustus"; break;
 case 8: bulan = "September"; break;
 case 9: bulan = "Oktober"; break;
 case 10: bulan = "November"; break;
 case 11: bulan = "Desember"; break;
}
var tampilTanggal = "TANGGAL: " + hari + ", " + tanggal + " " + bulan + " " + tahun;
var tampilWaktu = "JAM: " + jam + ":" + menit + ":" + detik;
conn.sendMessage(id, donate.donate(id,  XBOT, corohelp, tampilTanggal, tampilWaktu, nomer, aktif, groupwa, youtube) ,MessageType.text);
}
else if (text == '#info'){
  const corohelp = await get.get('https://covid19.mathdro.id/api/countries/id').json()
var date = new Date();
var tahun = date.getFullYear();
var bulan = date.getMonth();
var tanggal = date.getDate();
var hari = date.getDay();
var jam = date.getHours();
var menit = date.getMinutes();
var detik = date.getSeconds();
switch(hari) {
 case 0: hari = "Minggu"; break;
 case 1: hari = "Senin"; break;
 case 2: hari = "Selasa"; break;
 case 3: hari = "Rabu"; break;
 case 4: hari = "Kamis"; break;
 case 5: hari = "Jum'at"; break;
 case 6: hari = "Sabtu"; break;
}
switch(bulan) {
 case 0: bulan = "Januari"; break;
 case 1: bulan = "Februari"; break;
 case 2: bulan = "Maret"; break;
 case 3: bulan = "April"; break;
 case 4: bulan = "Mei"; break;
 case 5: bulan = "Juni"; break;
 case 6: bulan = "Juli"; break;
 case 7: bulan = "Agustus"; break;
 case 8: bulan = "September"; break;
 case 9: bulan = "Oktober"; break;
 case 10: bulan = "November"; break;
 case 11: bulan = "Desember"; break;
}
var tampilTanggal = "TANGGAL: " + hari + ", " + tanggal + " " + bulan + " " + tahun;
var tampilWaktu = "JAM: " + jam + ":" + menit + ":" + detik;
conn.sendMessage(id, info.info(id,  XBOT, corohelp, tampilTanggal, tampilWaktu, instagram, nomer, aktif, groupwa, youtube) ,MessageType.text);
}
else if (text == '#foto'){
conn.sendMessage(id, 'kirim .foto cewek/cowok\n\nContoh: .foto cewek' ,MessageType.text);
}
else if (text == '#menu'){
conn.sendMessage(id, ' Thanks Telah Menggunakan BOT *XBOT* , Follow Instagram Mimin Yah� : https://instagram.com/@affis_saputro123' ,MessageType.text);
}
else if (text == '#info'){
conn.sendMessage(id, ' Thanks Telah Menggunakan BOT *XBOT* , Follow Instagram Mimin Yah� : https://instagram.com/@affis_saputro123' ,MessageType.text);
}
if (messageType == 'imageMessage')
   {
      let caption = imageMessage.caption.toLocaleLowerCase()
      const buffer = await conn.downloadMediaMessage(m) // to decrypt & use as a buffer
      if (caption == '#sticker')
      {
         const stiker = await conn.downloadAndSaveMediaMessage(m) // to decrypt & save to file

         const
         {
            exec
         } = require("child_process");
         exec('cwebp -q 50 ' + stiker + ' -o temp/' + jam + '#webp', (error, stdout, stderr) =>
         {
            let stik = fs.readFileSync('temp/' + jam + '#webp')
            conn.sendMessage(id, stik, MessageType.sticker, { quoted: m })
         });
      }
   }

   if (messageType === MessageType.text)
   {
      let is = m.message.conversation.toLocaleLowerCase()

      if (is == '#pantun')
      {

         fetch('https://raw.githubusercontent.com/pajaar/grabbed-results/master/pajaar-2020-pantun-pakboy.txt')
            .then(res => res.text())
            .then(body =>
            {
               let tod = body.split("\n");
               let pjr = tod[Math.floor(Math.random() * tod.length)];
               let pantun = pjr.replace(/pjrx-line/g, "\n");
               conn.sendMessage(id, pantun, MessageType.text)
            });
      }
   }
   if (text.includes("#covid"))
   {
const get = require('got')
    const body = await get.post('https://api.kawalcorona.com/indonesia', {

    }).json();
    var positif = (body[0]['positif']);
    var sembuh  = (body[0]['sembuh']);
    var meninggal = (body[0]['meninggal']);
    var dirawat = (body[0]['dirawat']);
    console.log(body[0]['name'])
    conn.sendMessage(id,`🔎DATA WABAH COVID-19 TERBARU DI INDONESIA🔍\n\n📈Positif ==> ${positif} \n📉Sembuh ==> ${sembuh} \n📋Meninggal ==> ${meninggal}\n🗒️Dirawat ==> ${dirawat}`, MessageType.text);
}
   if (text.includes("#quotes"))
   {
      var url = 'https://jagokata.com/kata-bijak/acak.html'
      axios.get(url)
         .then((result) =>
         {
            let $ = cheerio.load(result.data);
            var author = $('a[class="auteurfbnaam"]').contents().first().text();
            var kata = $('q[class="fbquote"]').contents().first().text();

            conn.sendMessage(
               id,
               `
_${kata}_
        
    
	*~${author}*
         `, MessageType.text
            );

         });
   }
   
   if (text.includes("#hentai"))
   {
    var items = ["nsfwneko","anime hentai"];
    var anim = items[Math.floor(Math.random() * items.length)];
    var url = "https://api.computerfreaker.cf/v1/";
    
    axios.get(url)
      .then((result) => {
        var b = JSON.parse(JSON.stringify(result.data));
        var anim =  b[Math.floor(Math.random() * b.length)];
        imageToBase64(anim) // Path to the image
        .then(
            (response) => {
	var buf = Buffer.from(response, 'base64'); // Ta-da	
              conn.sendMessage(
            id,
              buf,MessageType.image)
       
            }
        )
        .catch(
            (error) => {
                console.log(error); // Logs an error if there was one
            }
        )
    
    });
    }


   
   if (text.includes("#loli"))
   {
    var items = ["anime loli","anime loli sange","anime loli fackgirll","anime loli i love you"];
    var nime = items[Math.floor(Math.random() * items.length)];
    var url = "https://api.fdci.se/rep.php?gambar=" + nime;
    
    axios.get(url)
      .then((result) => {
        var n = JSON.parse(JSON.stringify(result.data));
        var nimek =  n[Math.floor(Math.random() * n.length)];
        imageToBase64(nimek) 
        .then(
            (response) => {
	var buf = Buffer.from(response, 'base64'); 
              conn.sendMessage(
            id,
              buf,MessageType.image)
       
            }
        )
        .catch(
            (error) => {
                console.log(error);
            }
        )
    
    });
    }
    
   if (text.includes("#shota"))
   {
    var items = ['shota anime', 'anime shota'];
    var nime = items[Math.floor(Math.random() * items.length)];
    var url = "https://api.fdci.se/rep.php?gambar=" + nime;

    axios.get(url)
      .then((result) => {
        var n = JSON.parse(JSON.stringify(result.data));
        var nimek = n[Math.floor(Math.random() * n.length)];
        imageToBase64(nimek)
        .then(
            (response) => {
	var buf = Buffer.from(response, 'base64'); 
              conn.sendMessage(
            id,
              buf,MessageType.image)
       
            }
        )
        .catch(
            (error) => {
                console.log(error);
            }
        )
    
    });
    }
    
if (text.includes("#pokemon"))
   {
    var items = ["anime pokemon"];
    var nime = items[Math.floor(Math.random() * items.length)];
    var url = "https://api.fdci.se/rep.php?gambar=" + nime;
    
    axios.get(url)
      .then((result) => {
        var n = JSON.parse(JSON.stringify(result.data));
        var nimek =  n[Math.floor(Math.random() * n.length)];
        imageToBase64(nimek) 
        .then(
            (response) => {
	var buf = Buffer.from(response, 'base64'); 
              conn.sendMessage(
            id,
              buf,MessageType.image)
       
            }
        )
        .catch(
            (error) => {
                console.log(error);
            }
        )
    
    });
    }
   
   else if (text.includes("#nama")) 
  {
    const cheerio = require('cheerio');
    const request = require('request');
    var nama = text.split("!nama ")[1];
    var req = nama.replace(/ /g,"+");
    request.get({
        headers: {'content-type' : 'application/x-www-form-urlencoded'},
        url:     'http://www.primbon.com/arti_nama.php?nama1='+ req +'&proses=+Submit%21+',
      },function(error, response, body){
          let $ = cheerio.load(body);
          var y = $.html().split('arti:')[1];
          var t = y.split('method="get">')[1];
          var f = y.replace(t ," ");
          var x = f.replace(/<br\s*[\/]?>/gi, "\n");
          var h  = x.replace(/<[^>]*>?/gm, '');
      console.log(""+ h);
      conn.sendMessage(id,
            `
      Arti dari nama *${nama}* adalah



         Nama _*${nama}*_ _${h}_
         


`,
 MessageType.text);
  });
  }
  else if (text.includes("#pasangan ")) {
    const request = require('request');
    var gh = text.split("#pasangan ")[1];
    var namamu = gh.split("&")[0];
    var pasangan = gh.split("&")[1];
    request.get({
        headers: {'content-type' : 'application/x-www-form-urlencoded'},
        url:     'http://www.primbon.com/kecocokan_nama_pasangan.php?nama1='+ namamu +'&nama2='+ pasangan +'&proses=+Submit%21+',

    },function(error, response, body){
        let $ = cheerio.load(body);
      var y = $.html().split('<b>KECOCOKAN JODOH BERDASARKAN NAMA PASANGAN</b><br><br>')[1];
        var t = y.split('#<br><br>')[1];
        var f = y.replace(t ," ");
        var x = f.replace(/<br\s*[\/]?>/gi, "\n");
        var h  = x.replace(/<[^>]*>?/gm, '');
        var d = h.replace("&amp;", '&')
      console.log(""+ d);
      conn.sendMessage(id, `



 *Kecocokan berdasarkan nama*


 _${d}_



    `, MessageType.text);
  });
  }
   if (text.includes("#foto cewek"))
   {
    var items = ["ullzang girl", "cewe cantik", "hijab cantik", "korean girl", "remaja cantik", "cewek korea", "cewek jepang"];
    var cewe = items[Math.floor(Math.random() * items.length)];
    var url = "https://api.fdci.se/rep.php?gambar=" + cewe;
    
    axios.get(url)
      .then((result) => {
        var b = JSON.parse(JSON.stringify(result.data));
        var cewek =  b[Math.floor(Math.random() * b.length)];
        imageToBase64(cewek) // Path to the image
        .then(
            (response) => {
    conn.sendMessage(id, '[WAIT] Searching...', MessageType.text)
	var buf = Buffer.from(response, 'base64'); // Ta-da	
              conn.sendMessage(
            id,
              buf,MessageType.image)
       
            }
        )
        .catch(
            (error) => {
                console.log(error); // Logs an error if there was one
            }
        )
    
    });
    }

   if (text.includes("#foto cowok"))
   {
    var items = ["cowo ganteng", "cogan", "korean boy", "chinese boy", "japan boy", "cowok indo ganteng", "cowok korea"];
    var cowo = items[Math.floor(Math.random() * items.length)];
    var url = "https://api.fdci.se/rep.php?gambar=" + cowo;
    
    axios.get(url)
      .then((result) => {
        var z = JSON.parse(JSON.stringify(result.data));
        var cowok =  z[Math.floor(Math.random() * z.length)];
        imageToBase64(cowok) 
        .then(
            (response) => {
  conn.sendMessage(id, '[WAIT] Searching...', MessageType.text)
  var buf = Buffer.from(response, 'base64'); 
              conn.sendMessage(
            id,
              buf,MessageType.image)
       
            }
        )
        .catch(
            (error) => {
                console.log(error);
            }
        )
    
    });
    }

if (text.includes("#fotoanime"))
   {
    var items = ["anime girl", "anime cantik", "anime", "anime aesthetic", "anime hd", "gambar anime hd"];
    var nime = items[Math.floor(Math.random() * items.length)];
    var url = "https://api.fdci.se/rep.php?gambar=" + nime;
    
    axios.get(url)
      .then((result) => {
        var n = JSON.parse(JSON.stringify(result.data));
        var nimek =  n[Math.floor(Math.random() * n.length)];
        imageToBase64(nimek) 
        .then(
            (response) => {
    conn.sendMessage(id, '[WAIT] Searching...', MessageType.text)
	var buf = Buffer.from(response, 'base64'); 
              conn.sendMessage(
            id,
              buf,MessageType.image)
       
            }
        )
        .catch(
            (error) => {
                console.log(error);
            }
        )
    
    });
    }
 
if (text.includes("#lirik")){
	const teks = text.split("#lirik")[1]
	axios.get(`http://scrap.terhambar.com/lirik?word=${teks}`).then ((res) => {
	     conn.sendMessage(id, '[WAIT] Searching...', MessageType.text)
	 	let hasil = `lirik lagu ${teks} \n\n\n ${res.data.result.lirik}`
	conn.sendMessage(id, hasil, MessageType.text)
	})
}
if (text.includes("#randomhentai"))
   {
    var items = ["nsfwhentai", "anime hentai", "hentai", "nsfwneko"];
    var cewe = items[Math.floor(Math.random() * items.length)];
    var url = "https://api.fdci.se/rep.php?gambar=" + cewe;
    
    axios.get(url)
      .then((result) => {
        var b = JSON.parse(JSON.stringify(result.data));
        var cewek =  b[Math.floor(Math.random() * b.length)];
        imageToBase64(cewek) // Path to the image
        .then(
            (response) => {
	var buf = Buffer.from(response, 'base64'); // Ta-da	
              conn.sendMessage(
            id,
              buf,MessageType.image)
       
            }
        )
        .catch(
            (error) => {
                console.log(error); // Logs an error if there was one
            }
        )
    
    });
    }
if (text.includes("#meme"))
   {
    var items = ["funny meme", "meme", "meme 2020"];
    var cewe = items[Math.floor(Math.random() * items.length)];
    var url = "https://api.fdci.se/rep.php?gambar=" + cewe;
    
    axios.get(url)
      .then((result) => {
        var b = JSON.parse(JSON.stringify(result.data));
        var cewek =  b[Math.floor(Math.random() * b.length)];
        imageToBase64(cewek) // Path to the image
        .then(
            (response) => {
	var buf = Buffer.from(response, 'base64'); // Ta-da	
              conn.sendMessage(
            id,
              buf,MessageType.image)
       
            }
        )
        .catch(
            (error) => {
                console.log(error); // Logs an error if there was one
            }
        )
    
    });
    }
      if (text.includes("#chord2")){
const teks = text.replace(/#chord2 /, "")
axios.get(`https://st4rz.herokuapp.com/api/chord?q=${teks}`).then((res) => {
    let hasil = `${res.data.result}`;
    conn.sendMessage(id, hasil ,MessageType.text);
  })
 }
else if (text == '#pesankosong'){
conn.sendMessage(id, '͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏ ͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏ ͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏ ͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏ ͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏ ͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏ ͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏ ͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏ ͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏ ͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏ ͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏ ͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏ ͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏ ͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏ ͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏ ͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏ ͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏ ͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏ ͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏ ͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏ ͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏ ͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏ ͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏ ͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏' ,MessageType.text);
}
  if (text.includes("#hostsearch")){
const teks = text.replace(/#hostsearch /, "")
axios.get(`https://api.banghasan.com/domain/hostsearch/${teks}`).then((res) => {
    let hasil = `*query : ${res.data.query}*\n\nhasil : ${res.data.hasil}`;
    conn.sendMessage(id, hasil ,MessageType.text);
  })
 }
if (text.includes('#text3d')){
  var teks = text.replace(/#text3d /, '')
    axios.get('http://jojo-api-doc.herokuapp.com/api/text3d?text={teks}')
    .then((res) => {
      imageToBase64(res.data.result)
        .then(
          (ress) => {
            conn.sendMessage(id, ' SEDANG DIPROSES', MessageType.text)
            var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, buf, MessageType.image)
        })
    })
}
if (text.includes('#waifu2')){
  var teks = text.replace(/#waifu2 /, '')
    axios.get(`https://docs-jojo.herokuapp.com/api/waifu2`).then((res) => {
      imageToBase64(res.data.img)
        .then(
          (ress) => {
            var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, buf, MessageType.image)
        })
    })
}
if (text.includes("#cuaca")){
const teks = text.replace(/#cuaca /, "")
axios.get(`https://mhankbarbars.herokuapp.com/api/cuaca?q=${teks}&apiKey=N2Ws9kp3KTDYtry5Jjyz`).then((res) => {
    let hasil = `Tempat : ${res.data.result.tempat}\nCuaca : ${res.data.result.cuaca}\nAngin : ${res.data.result.angin}\nSuhu : ${res.data.result.suhu}\nKelembapan : ${res.data.result.kelembapan}`;
    conn.sendMessage(id, hasil ,MessageType.text);
})
}
if (text.includes('#loli2')){
  var teks = text.replace(/#loli2 /, '')
    axios.get(`https://alfians-api.herokuapp.com/api/randomloli`).then((res) => {
      imageToBase64(res.data.result)
        .then(
          (ress) => {
            var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, buf, MessageType.image)
        })
    })
}
if (text.includes("#renungan")){
const teks = text.replace(/#renungan /, "")
axios.get(`https://docs-jojo.herokuapp.com/api/renungan`).then((res) => {
    let hasil = `Isi : ${res.data.Isi} \njudul : ${res.data.judul} \npesan : ${res.data.pesan}`;
    conn.sendMessage(id, hasil ,MessageType.text);
})
}
if (text.includes("#joox")){
const teks = text.replace(/#joox /, "")
axios.get(`https://tobz-api.herokuapp.com/api/joox?q=${teks}`).then((res) => {
    let hasil = `\n*judul* : ${res.data.judul} \n*mp3* :${res.data.mp3}`;
    conn.sendMessage(id, hasil ,MessageType.text);
})
}
if (text.includes('#gltext')){
var gh = text.split("#gltext ")[1];
    var teks1 = gh.split("|")[0];
    var teks2 = gh.split("|")[1];
    axios.get(`http://inyourdream.herokuapp.com/glitch?kata1=${teks1}&kata2=${teks2}`).then((res) => {
      imageToBase64(res.data.status)
        .then(
          (ress) => {
            var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, '[ WAIT ] Sedang diproses silahkan tunggu sebentar', MessageType.text, { quoted: m })
            conn.sendMessage(id, buf, MessageType.image, { quoted: m });
        })
    })
}
if (text.includes('#pornhub')){
var porn = text.split("#pornhub ")[1];
    var text1 = porn.split("|")[0];
    var text2 = porn.split("|")[1];
    axios.get(`https://mhankbarbars.herokuapp.com/api/textpro?theme=pornhub&text1=${text1}&text2=${text2}`).then((res) => {
      imageToBase64(res.data.result)
        .then(
          (ress) => {
            var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, '[ WAIT ] Sedang diproses silahkan tunggu sebentar', MessageType.text, { quoted: m })
            conn.sendMessage(id, buf, MessageType.image, { quoted: m });
        })
    })
}
if (text.includes('#logogaming')){
  var teks = text.replace(/#logogaming /, '')
    axios.get(`https://docs-jojo.herokuapp.com/api/gaming?text=${teks}`).then((res) => {
      imageToBase64(res.data.result)
        .then(
          (ress) => {
            var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, buf, MessageType.image)
        })
    })
}
if (text.includes("#animesearch")){
const teks = text.replace(/#animesearch /, "")
axios.get(`https://docs-jojo.herokuapp.com/api/samehadaku?q=${teks}`).then((res) => {
    let hasil = `title : ${res.data.title} \n *thumb* : ${res.data.result.thumb} \n *link* : ${res.data.result.link}`;
    conn.sendMessage(id, hasil ,MessageType.text);
})
}
if (text.includes("#jadwaltvnow")){
const teks = text.replace(/#jadwalTV /, "")
axios.get(`https://api.haipbis.xyz/jadwaltvnow`).then((res) => {
    let hasil = `Jam : ${res.data.jam}\n\n${res.data.jadwalTV}`;
    conn.sendMessage(id, hasil ,MessageType.text);
  })
 }
if (text.includes("#ytmp4"))
   {
      const url = text.replace(/#ytmp4 /, "");
      const exec = require('child_process').exec;

      var videoid = url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);

      const ytdl = require("ytdl-core")
      if (videoid != null)
      {
         console.log("video id = ", videoid[1]);
      }
      else
      {
         conn.sendMessage(id, "maaf, link yang anda kirim tidak valid", MessageType.text)
      }
      ytdl.getInfo(videoid[1]).then(info =>
      {
         if (info.length_seconds > 1000)
         {
            conn.sendMessage(id, " videonya kepanjangan", MessageType.text)
         }
         else
         {

            console.log(info.length_seconds)

            function os_func()
            {
               this.execCommand = function (cmd)
               {
                  return new Promise((resolve, reject) =>
                  {
                     exec(cmd, (error, stdout, stderr) =>
                     {
                        if (error)
                        {
                           reject(error);
                           return;
                        }
                        resolve(stdout)
                     });
                  })
               }
            }
            var os = new os_func();

            os.execCommand('ytdl ' + url + ' -q highest -o mp4/' + videoid[1] + '#mp4').then(res =>
            {
		const buffer = fs.readFileSync("mp4/"+ videoid[1] +"#mp4")
               conn.sendMessage(id, buffer, MessageType.video)
            }).catch(err =>
            {
               console.log("os >>>", err);
            })

         }
      });

   }






   
         
  


if (text.includes('#profileig')){
  var teks = text.replace(/%profileig /, '')
    axios.get('https://arugaz.herokuapp.com/api/stalk?username='+teks)
    .then((res) => {
      imageToBase64(res.data.Profile_pic)
        .then(
          (ress) => {
            var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, buf, MessageType.image)
        })
    })
}
if (text.includes('#ssweb')){
  var teks = text.replace(/#ssweb /, '')
    axios.get('https://api.haipbis.xyz/ssweb?url='+teks)
    .then((res) => {
      imageToBase64(res.data.result)
        .then(
          (ress) => {
            conn.sendMessage(id, ' SEDANG DIPROSES', MessageType.text)
            var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, buf, MessageType.image)
        })
    })
}
  if (text.includes('#waifu')){
  var teks = text.replace(/#waifu /, '')
    axios.get('https://st4rz.herokuapp.com/api/waifu')
    .then((res) => {
      imageToBase64(res.data.image)
        .then(
          (ress) => {
            conn.sendMessage(id, ' SEDANG DIPROSES', MessageType.text)
            var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, buf, MessageType.image)
        })
    })
}  
if (text.includes('#ytmp3')){
  var teks = text.replace(/#ytmp3 /, '')
    axios.get('https://st4rz.herokuapp.com/api/yta2?url='+teks)
    .then((res) => {
      imageToBase64(res.data.thumb)
        .then(
          (ress) => {
            conn.sendMessage(id, ' SEDANG DIPROSES', MessageType.text)
            var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, buf, MessageType.image)
        })
    })
}
if (text.includes('/igstalk')){
  var teks = text.replace(/#igstalk /, '')
    axios.get('https://arugaz.herokuapp.com/api/stalk?username='+teks)
    .then((res) => {
      imageToBase64(res.data.Profile_pic)
        .then(
          (ress) => {
           let hasil = `User Ditemukan!!\n\n*➸ Nama :* ${res.data.Name}\n*➸ Username :* ${res.data.Username}\n*➸ Followers :* ${res.data.Jumlah_Followers}\n*➸ Mengikuti :* ${res.data.Jumlah_Following}\n*➸ Jumlah Post :* ${res.data.Jumlah_Post}\n*➸ Bio :* ${res.data.Biodata}`;
            var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, buf, MessageType.image, { caption: hasil, quoted: m })
        })
    })
}
if (text.includes('#infogempa')){
    axios.get(`https://st4rz.herokuapp.com/api/infogempa`).then((res) => {
      imageToBase64(res.data.map)
        .then(
          (ress) => {
          let hasil = `*INFO GEMPA TERBARU DI INDONESIA*\n\n*➸ Pusat Gempa :* ${res.data.lokasi}\n*➸ Koordinat :* ${res.data.koordinat}\n*➸ Waktu :* ${res.data.waktu}\n*➸ Magnitudo :* ${res.data.magnitude}\n*➸ Kedalaman :* ${res.data.kedalaman}\n*➸ Potensi :* ${res.data.potensi}`;
            var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, '[ WAIT ] Sedang diproses silahkan tunggu sebentar', MessageType.text, { quoted: m })
            conn.sendMessage(id, buf, MessageType.image, { caption: hasil, quoted: m })
        })
    })
}
if (text.includes("#ytmp3")){
const teks = text.replace(/#ytmp3 /, "")
axios.get(`https://st4rz.herokuapp.com/api/yta2?url=${teks}`).then((res) => {
    let hasil = `Audio telah tersedia pada link di bawah, silahkan klik link dan download hasilnya\n👇👇👇👇👇👇👇👇👇\n\nJudul : ${res.data.title}\n\nLink: ${res.data.result}`;
    conn.sendMessage(id, hasil ,MessageType.text);
})
}
if (text.includes('#samehadaku')){
  var teks = text.replace(/#samehadaku /, '')
    axios.get(`https://docs-jojo.herokuapp.com/api/samehadaku?q=${teks}`).then((res) => {
      imageToBase64(res.data.thumb)
        .then(
          (ress) => {
            var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, buf, MessageType.image)
        })
    })
}
if (text.includes('#blackpink')){
  var teks = text.replace(/#blackpink /, '')
    axios.get(`https://docs-jojo.herokuapp.com/api/blackpink?text=${teks}`).then((res) => {
      imageToBase64(res.data.result)
        .then(
          (ress) => {
            var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, buf, MessageType.image)
        })
    })
}
if (text.includes("#nekopoi")){
const teks = text.replace(/#nekopoi /, "") 
axios.get(`https://mhankbarbar.herokuapp.com/api/nekopoi?url=${teks}&apiKey=N2Ws9kp3KTDYtry5Jjyz`).then((res) =>{ 
    let hasil = `➸ *nekopoi link tersedia* : ${res.data.judul}\n*result* : ${res.data.result} \n*dilihat* : ${res.data.dilihat}\n*tumbnail* : ${res.data.tumbnail}` 
    conn.sendMessage(id, hasil, MessageType.text); 
})
}
if (text.includes('#memecreate')){
  var teks = text.replace(/#memecreate /, '')
    axios.get(`https://mnazria.herokuapp.com/api/create-meme?text-atas=${teks}`).then((res) => {
      imageToBase64(res.data.result)
        .then(
          (ress) => {
            var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, buf, MessageType.image)
        })
    })
}
if (text.includes("#ytmp4")){
const teks = text.replace(/#ytmp4 /, "")
axios.get(`https://st4rz.herokuapp.com/api/ytv2?url=${teks}`).then((res) => {
    let hasil = `Audio telah tersedia pada link di bawah, silahkan klik link dan download hasilnya\n👇👇👇👇👇👇👇👇👇\n\nJudul : ${res.data.title}\n\nLink: ${res.data.result}`;
    conn.sendMessage(id, hasil ,MessageType.text);
})
}
     if (messageType == 'imageMessage')
   {
       let caption = imageMessage.caption.toLocaleLowerCase()
       if (caption == '#ocr')
       {
           const img = await conn.downloadAndSaveMediaMessage(m)
           readTextInImage(img)
               .then(data => {
                   console.log(data)
                   conn.sendMessage(id, ' SEDANG DIPROSES', MessageType.text)
                   conn.sendMessage(id, `${data}\n*NI ANJIM🗿*`, MessageType.text);
               })
               .catch(err => {
                   console.log(err)
               })
       }
   }
if (text.includes("#ping")){
const teks = text.replace(/#ping /, "")
axios.get(`https://api.banghasan.com/domain/nping/${teks}`).then((res) => {
    let hasil = `*query : ${res.data.query}*\n\nhasil : ${res.data.hasil}`;
    conn.sendMessage(id, hasil ,MessageType.text);
  })
 }
if (text.includes('#ttp')){
  var teks = text.replace(/#ttp /, '')
    axios.get(`https://mhankbarbars.herokuapp.com/api/text2image?text=${teks}&apiKey=N2Ws9kp3KTDYtry5Jjyz`).then((res) => {
      imageToBase64(res.data.result)
        .then(
          (ress) => {
            var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, buf, MessageType.image)
        })
    })
}
else if (text == '#hello1'){
let hasil = fs.readFileSync('mp3/' + 'PTT' + '#wav')
 conn.sendMessage(id, hasil, MessageType.audio, { quoted: m } )
}
if (text.includes("test")){
let err = fs.readFileSync('mp3/' + 'test' + '#mav')
 conn.sendMessage(id, err, MessageType.audio, { quoted: m })
}
if (text.includes("salam")){
let err = fs.readFileSync('mp3/' + 'salam' + '#mp3')
 conn.sendMessage(id, err, MessageType.audio, { ptt: true })
}
if (text.includes("tariksis")){
let err = fs.readFileSync('mp3/' + 'tariksis' + '#wav')
 conn.sendMessage(id, err, MessageType.audio, { ptt: true, quoted: m })
}
if (text.includes('bot')) {
 var nomor = m.participant
 const options = {
       text: `apa manggil manggil tinggal ketik #menu @${nomor.split("@s.whatsapp.net")[0]}, Ketik #menu untuk menampilkan perintah yaa`,
       contextInfo: { mentionedJid: [nomor] }
 }
 conn.sendMessage(id, options, MessageType.text, { quoted: m })
}
if (text.includes("desah")){
let err = fs.readFileSync('mp3/' + 'desah' + '#wav')
 conn.sendMessage(id, err, MessageType.audio, { ptt: true, quoted: m })
}
if (text.includes("iri")){
let err = fs.readFileSync('mp3/' + 'iri' + '#mp3')
 conn.sendMessage(id, err, MessageType.audio, { ptt: true, quoted: m })
}
else if (text == 'baka'){
let hasil = fs.readFileSync('mp3/' + 'baka' + '#wav')
 conn.sendMessage(id, hasil, MessageType.audio, { quoted: m } )
}
else if (text == 'pttt'){
let hasil = fs.readFileSync('mp3/' + 'pttt' + '#pttt')
 conn.sendMessage(id, hasil, MessageType.audio, { quoted: m } )
}
else if (text == 'goblok'){
let hasil = fs.readFileSync('mp3/' + 'goblok' + '#wav')
 conn.sendMessage(id, hasil, MessageType.audio, { quoted: m } )
}
if (text.includes("#alay")){
	const alay = text.split("#alay")[1]
	axios.get(`https://api.terhambar.com/bpk?kata=${alay}`).then ((res) =>
		{ let hasil = `${res.data.text}`
		conn.sendMessage(id, hasil, MessageType.text)
	})
}



})


