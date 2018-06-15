
// 이모지 데이터
const emojiData = require('./emoji-data.json');

// 스킨 코드
const skinCodes = [
    '1F3FB',
    '1F3FC',
    '1F3FD',
    '1F3FE',
    '1F3FF'
];

/**
 * EmojiJoin 클래스
 */
class EmojiJoin{

    constructor({
    } = {}){
    }

    /**
     *
     * 이모지 객체 타입을 반환한다.
     *
     * @returns {{}}
     */
    static getObjectTypes(){

        let ret = {};

        for (let k in emojiData){

            const v = emojiData[k];
            const objectCode = v.objectCode;

            if (!ret[objectCode]) ret[objectCode] = v;
        }

        let t = ret;

        ret = [];

        for (let k in t){
            ret.push(t[k]);
        }

        return ret;
    }

    /**
     *
     * 이모지 객체 집합을 반환한다.
     *
     * @param objectCode
     * @returns {Array}
     */
    static getObjects(objectCode = ''){

        const ret = [];

        for (let k in emojiData){

            const v = emojiData[k];

            const _objectCode = v.objectCode;

            if (objectCode === _objectCode){
                ret.push(v);
            }
        }

        return ret;
    }

    /**
     *
     * 이모지 객체를 반환한다.
     *
     * @param objectCode
     * @param skinCode
     * @returns {{}}
     */
    static getObject(objectCode = '', skinCode = ''){

        let ret = {};

        for (let k in emojiData){

            const v = emojiData[k];

            const _objectCode = v.objectCode;
            const codePoints = v.codePoints;

            if (objectCode === _objectCode &&
            codePoints.indexOf(skinCode) > -1){
                ret = v;
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
     */
    static getSkinCode(codePoints = []){

        let ret = '';

        const length = skinCodes.length;

        for (let i = 0; i < length; i++){

            const v = skinCodes[i];

            if (codePoints.indexOf(v) > -1){
                ret = v;
                break;
            }
        }

        return ret;
    }
}


module.exports = EmojiJoin;

  
