# [emoji-joiner](https://github.com/mohwa/emoji-joiner)


## 설치하기

```
npm i emoji-joiner
```

## JS 가져오기

CommonJS 모듈 로더 방식으로 가져오기

```
const EmojiJoiner = require('emoji-joiner');
```


\<script\> 엘리먼트로 가져오기

```html
<script type="text/javascript" src="path/to/emoji-joiner.min.js"></script>
```

## API 목록

|Func|Params|Types|Return|Description|
|:--:|:--:|:--:|:-----:|:----------|
|`getObjectTypes`|||`{Array}`|이모지 객체 타입을 반환한다.|
|`getObjects`|`objectCode`|`{String}`|`{Array}`|이모지 객체 집합을 반환한다.|
|`getObject`|`objectCode`, `skinCode`|`{String}`, `{String}`|`{Object}`|이모지 객체를 반환한다.|
|`getSkinCode`|`codePoints`|`{Array}`|`{String}`|스킨 코드를 반환한다.|

___

## 사용 예제

`getObjectTypes` 메서드
```

const EmojiJoiner = require('emoji-joiner');

const objectTypes = EmojiJoiner.getObjectTypes();

console.log(objectTypes);

/*

이모지 객체 타입 집합

[{
	codePoints: Array(4),
	objectCode: "2695",
	objectCodeName: "health worker",
	objectFullName: "man health worker",
	skinCode: "" ...
} ...]
*/

```

`getObjects` 메서드

```
const EmojiJoiner = require('emoji-joiner');

const objectTypes = EmojiJoiner.getObjectTypes();
const emojis = EmojiJoiner.getObjects(objectTypes[0].objectCode);

console.log(emojis);

/*

전달받은 객체 타입을 가진, 이모지 집합

[{
	codePoints: Array(4),
	objectCode: "2695",
	objectCodeName: "health worker",
	objectFullName: "man health worker",
	skinCode: "" ...
} ...]

*/

```

`getObject` 메서드

```
const EmojiJoiner = require('emoji-joiner');

const objectTypes = EmojiJoiner.getObjectTypes();
const emojis = EmojiJoiner.getObjects(objectTypes[0].objectCode);
const emoji = EmojiJoiner.getObject(emojis[0].objectCode, '1F3FC');

console.log(emoji);

/*

전달받은 객체 타입 및 스킨 코드를 가진, 이모지

[{
	codePoints: Array(4),
	objectCode: "2695",
	objectCodeName: "health worker",
	objectFullName: "man health worker",
	skinCode: "1F3FC" ...
} ...]

*/

```

`getSkinCode` 메서드

```
const EmojiJoiner = require('emoji-joiner');

const objectTypes = EmojiJoiner.getObjectTypes();
const skinCode = EmojiJoiner.getSkinCode(emojis[1].codePoints);

// 전달받은 codePoints 를 통해, 스킨 코드를 반환한다.
console.log(skinCode); // 1F3FB

```


## 데모 페이지

https://mohwa.github.io/emoji-joiner/

