const axios = require("axios");
const cheerio = require("cheerio");
const qs = require("qs");

function getFileType(url) {
    if (url.includes('.mp4')) {
        return 'mp4';
    } else if (url.includes('.jpg') || url.includes('.jpeg') || url.includes('.png')) {
        return 'jpg';
    } else if (url.includes('.gif')) {
        return 'gif';
    } else if (url.includes('.mp3') || url.includes('.wav') || url.includes('.aac') || url.includes('.flac')) {
        return 'audio';
    } else {
        return 'unknown';
    }
}

function twitterdl(link){
    return new Promise((resolve, reject) => {
        let config = {
            'URL': link
        };
        axios.post('https://twdown.net/download.php', qs.stringify(config), {
            headers: {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "sec-ch-ua": '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                "cookie": "_ga=GA1.2.1388798541.1625064838; _gid=GA1.2.1351476739.1625064838; __gads=ID=7a60905ab10b2596-229566750eca0064:T=1625064837:RT=1625064837:S=ALNI_Mbg3GGC2b3oBVCUJt9UImup-j20Iw; _gat=1"
            }
        })
        .then(({ data }) => {
            const $ = cheerio.load(data);
            const hasil = [];
            
            const thumbUrl = $('div:nth-child(1) > img').attr('src');
            const hdUrl = $('tbody > tr:nth-child(1) > td:nth-child(4) > a').attr('href');
            const sdUrl = $('tr:nth-child(2) > td:nth-child(4) > a').attr('href');
            const audioUrl = 'https://twdown.net/' + $('tr:nth-child(4) > td:nth-child(4) > a').attr('href');
            
            hasil.push({
                desc: $('div:nth-child(1) > div:nth-child(2) > p').text().trim(),
                thumbUrl,
                HD: {
                    url: hdUrl,
                    type: getFileType(hdUrl)
                },
                SD: {
                    url: sdUrl,
                    type: getFileType(sdUrl)
                },
                audioUrl
            });
            resolve(hasil);
        })
        .catch(reject);
    });
}

module.exports = twitterdl;