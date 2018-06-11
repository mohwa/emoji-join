
const fse = require('fs-extra');
const path = require('path');
const request = require('request');
const yargs = require('yargs');
const LineByLineReader = require('line-by-line');

const argv = yargs.argv;

// 유니코드 버전
let unicodeVersion = argv.v || '11';
unicodeVersion = Number(unicodeVersion).toFixed(1);

const host = 'https://unicode.org';
const uriPath = `Public/emoji/${unicodeVersion}`;
const zwjFileName = 'emoji-zwj-sequences.txt';

// 유니코드 파일 url
const url = `${host}/${uriPath}/${zwjFileName}`;

// 남자
const manCodePoint = '1F468';
// 여자
const womanCodePoint = '1F469';
// https://codepoints.net/U+FE0F
const selector16CodePoint = 'FE0F';

const emojiData = {data: {}, types: {}};

const tmpFilePath = path.join(__dirname, zwjFileName);
const destFilePath = path.join(__dirname, `../src/${zwjFileName.replace('.txt', '.json')}`);

// 기존 데이터를 삭제한다.
fse.removeSync(destFilePath);

request.get(url).pipe(fse.createWriteStream(tmpFilePath).on('finish', () => {

    // 빈줄은 skip 한다.
    const lr = new LineByLineReader(tmpFilePath, {"skipEmptyLines": true});

    lr.on('line', line => {

        if (line[0] === '#') return;

        const data = line.split(';');

        // 코드 포인트 집합
        const codePoint = data[0].trim();
        const codePoints = codePoint.split(/\s/);

        // 객체 타입(외형, 직업 등)
        let objectType = codePoints[0];
        // 키 이름
        let objectTypeKey = '';

        // "성별" 코드 포인트가 `1F468(남자)`, `1F469(여자)`일 경우(이전 코드 포인트를 사용할 경우)
        if (objectType === manCodePoint || objectType === womanCodePoint){

            objectType = codePoints[(codePoints.length - 1)];

            if (objectType === selector16CodePoint){
                objectType = codePoints[(codePoints.length - 2)];
            }
        }

        const seqType = data[1].trim();
        const infos = data[2].split('#');

        const objectTypeNameAndSkin = infos[0].split(':');
        const versionAndContent = infos[1].split(/\[\d\]/);

        // 객체 타입 이름
        let objectTypeName = objectTypeNameAndSkin[0];
        objectTypeName = objectTypeName.trim();

        // skin
        let skin = objectTypeNameAndSkin[1] || '';
        skin = skin.indexOf('skin') > -1 ? skin.trim() : '';

        const version = versionAndContent[0].trim();
        let content = versionAndContent[1].trim();
        content = content.replace(/(^\(|\)$)/g, '');

        if (
        objectTypeName.indexOf('couple') > -1 ||
        objectTypeName === 'kiss' ||
        objectTypeName === 'family'
        ){
            objectType = objectTypeName;
            objectTypeKey = `${objectType}`;
        }
        else{

            let sex = objectTypeName.indexOf('woman') > -1 ? 'woman' : 'man';
            objectTypeName = objectTypeName.replace(/(,|man|woman)/g, '').trim();

            objectTypeKey = `${objectType}_${sex}`;
        }


        emojiData.types[objectType] = {
            objectType: objectType,
            name: objectTypeName
        };

        emojiData.data[objectTypeKey] = emojiData.data[objectTypeKey] || [];

        emojiData.data[objectTypeKey].push({
            "codePoints": codePoints,
            "seqType": seqType,
            "objectTypeName": objectTypeName,
            "skin": skin,
            "version": version,
            "content": content
        });
    });

    lr.on('end', () => {

        // All lines are read, file is closed now.
        fse.writeFileSync(destFilePath, JSON.stringify(emojiData, null, 2));

        fse.removeSync(tmpFilePath);

        console.log('Create emoji data file');
    });


    lr.on('error', err => {
        console.log(err);
    });

}));

