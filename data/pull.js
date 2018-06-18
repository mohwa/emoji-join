
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

// 이모지 시퀀스 데이터
const seqFileName = 'emoji-sequences.txt';
// 이모지 ZWJ 시퀀스 데이터
const zwjFileName = 'emoji-zwj-sequences.txt';

// 생성될 데이터 파일명
const destFileName = 'emoji-data.json';

// 성별로 분리된 코드 집합
const sexSignCodes = {
    "1F476": "baby",
    "1F47C": "baby angel",
    "1F466": "boy",
    "1F467": "girl",
    "1F474": "old man",
    "1F475": "old woman",
    "1F934": "prince",
    "1F478": "princess",
    "1F57A": "man dancing",
    "1F483": "woman dancing"
};

// 스킨 코드 집합
const skinCodes = ['1F3FB', '1F3FC', '1F3FD', '1F3FE', '1F3FF'];

// 성별을 나타내는 코드 집합
const sexCodes = ['2640', '2642', '1F468', '1F469'];

const selector16Code = 'FE0F';

// 시퀀스 파일 집합
const fileNames = [seqFileName, zwjFileName];

// 생성할 데이터 집합
const emojiData = {};

// 목적지 파일 경로
const destFilePath = path.join(__dirname, `../src/${destFileName}`);

// 기존 데이터 파일을 삭제한다.
fse.removeSync(destFilePath);

fileNames.forEach((v, idx) => {

    const tmpFilePath = path.join(__dirname, v);

    // 유니코드 데이터 파일을 가져올 URL
    const url = `${host}/${uriPath}/${v}`;

    request.get(url).pipe(fse.createWriteStream(tmpFilePath).on('finish', () => {

        // 빈줄은 skip 한다.
        const lr = new LineByLineReader(tmpFilePath, {"skipEmptyLines": true});

        lr.on('line', line => {

            if (line[0] === '#') return;

            const data = line.split(';');

            // 객체 코드 집합
            const codePoint = data[0].trim();
            const codePoints = codePoint.split(/\s/);
            //
            //// 객체 코드
            let objectCode = codePoints[0];

            // 코드 포인트가 `1F468`(남자), `1F469`(여자)일 경우(성별 코드가 sign으로 나눠지기전 데이터)
            if (objectCode === '1F468' || objectCode === '1F469'){

                objectCode = codePoints[(codePoints.length - 1)];

                if (objectCode === selector16Code){
                    objectCode = codePoints[(codePoints.length - 2)];
                }
            }

            const objectCodeNameAndSkin = data[2].split('#')[0].split(':');

            // 객체 코드
            let objectFullName = objectCodeNameAndSkin[0].trim();
            let objectCodeName = getObjectCodeName(objectFullName);

            // 스킨
            let skinCode = getSkinCode(codePoints);
            let skinCodeName = objectCodeNameAndSkin[1] || '';
            skinCodeName = skinCodeName.trim();


            const entities = getEntities(codePoints);

            // emoji-sequences.txt 파일일 경우
            if (v === seqFileName){

                if (sexSignCodes[objectCode]){

                    emojiData[codePoint] = {
                        codePoints,
                        objectCode,
                        objectCodeName,
                        objectFullName,
                        skinCode,
                        skinCodeName,
                        entities
                    };
                }
            }
            else{

                // 성별로 나눠진 객체 타입일 경우
                if (hasSexCode(codePoints, objectCodeName)){

                    emojiData[codePoint] = {
                        codePoints,
                        objectCode,
                        objectCodeName,
                        objectFullName,
                        skinCode,
                        skinCodeName,
                        entities
                    };
                }
            }

        });

        lr.on('end', () => {

            fse.removeSync(tmpFilePath);

            if (idx === (fileNames.length - 1)){

                // 파일을 생성한다.
                fse.writeFileSync(destFilePath, JSON.stringify(emojiData, null, 2));

                console.log('Create `emoji-data` file.');
            }
        });


        lr.on('error', err => {
            console.log(err);
        });

    }));
});

/**
 *
 * 객체 코드 이름을 반환한다.
 *
 * @param objectCodeName
 * @returns {string}
 */
function getObjectCodeName(objectFullName = ''){

    return objectFullName.replace(/(,|^man|man$|^woman|woman$)/g, '');
}

/**
 *
 * 전달받은 코드 포인트 집합에, `성별` 코드가 포함되었는지 유/무를 반환한다.
 *
 * @param codePoints
 * @param objectCodeName
 * @returns {boolean}
 */
function hasSexCode(codePoints = [], objectCodeName = ''){

    let ret = false;

    const length = sexCodes.length;

    for (let i = 0; i < length; i++){

        const v = sexCodes[i];

        // 필터될 객체 타입이 아니면서, 성별 코드 포인트를 포함할 경우
        if ((objectCodeName.indexOf('couple') === -1 &&
            objectCodeName !== 'kiss' &&
            objectCodeName !== 'family') &&

            codePoints.indexOf(v) > -1){

            ret = true;
            break;
        }
    }

    return ret;
}

/**
 *
 * 스킨 코드를 반환한다.
 *
 * @param codePoints
 * @returns {string}
 */
function getSkinCode(codePoints = []){

    let ret = '';

    const length = skinCodes.length;

    for (let i = 0; i < length; i++){

        const v = skinCodes[i];

        if (codePoints.indexOf(v) > -1){
            ret = v;
            break
        }
    }

    return ret;
}

/**
 *
 * 전체 HTML 엔트리를 반환한다.
 *
 * @param codePoints
 * @returns {string}
 */
function getEntities(codePoints = []){

    let ret = '';

    codePoints.forEach(v => {
        ret += `&#x${v};`;
    });

    return ret;
}


