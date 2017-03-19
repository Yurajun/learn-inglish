/* eslint no-labels: ["error", { "allowLoop": true }]*/
/* global jq */

let libConfig = {
	vocabulary: [],
	repeatWords: [],
	reverseFlag: 'false'
};

/**
 * [getVocabulary получает базу данных из localStorage]
 * @return {[type]} [no-return]
 */
function getVocabulary(){
	const state = localStorage.getItem('learnEnglish');
	if (state) {
		libConfig = JSON.parse(state);
		console.log(libConfig.repeatWords);
		console.log(libConfig.reverseFlag);
	}else {
		localStorage.setItem('learnEnglish', JSON.stringify(libConfig));
	}
}

getVocabulary();

function repeatWordsAddLearn(){
	if (libConfig.repeatWords.length === 0){
		return;
	}
	let num = 0;
	metka:
	for (let i = 0; i < libConfig.vocabulary.length; i++){
		const str = libConfig.vocabulary[i][0];
		for (let j = 0; j < libConfig.repeatWords.length; j++){
			if (str === libConfig.repeatWords[j]){
				libConfig.vocabulary[i][2] = 'Учу';
				if (++num === libConfig.repeatWords.length){
					break metka;
				}
				break;
			}
		}
	}
	console.log(libConfig.repeatWords);
	libConfig.repeatWords.length = 0;
}

function mySort(val1, val2){
	return val1[2].length - val2[2].length;
}

function addItemArray(arr, item){
	let i = 0;
	for (i; i <= arr.length; i++){
		if (arr[i] === item){
			return false;
		}
	}
	arr.push(item);
	return true;
}

let textRus;
let textIng;
const template = jq('#my-template').html();

function getRandomInt(min, max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

let wordRus;
let wordIng;

function countWordsLearn(){
	let count = 0;
	if (libConfig.vocabulary.length === 0){
		return 0;
	}
	for (let i = 0; i < libConfig.vocabulary.length; i++){
		if (libConfig.vocabulary[i][2] === 'Учу'){
			count++;
		}
	}
	return count;
}

function getRandomWord() {
	const random = getRandomInt(0, countWordsLearn() - 1);
	console.log('g: ', random);
	wordRus = libConfig.vocabulary[random][0];
	wordIng = libConfig.vocabulary[random][1];
	jq('#text-rus').text(wordRus);
}

const arrRandomNumber = [];

function getRandomWordReverse(){
	const random = getRandomInt(0, countWordsLearn() - 1);
	if (!addItemArray(arrRandomNumber, random)){
		if (arrRandomNumber.length === countWordsLearn()){
			updateReverse();
			return;
		}
		getRandomWordReverse();
		return;
	}
	wordRus = libConfig.vocabulary[arrRandomNumber[arrRandomNumber.length - 1]][0];
	wordIng = libConfig.vocabulary[arrRandomNumber[arrRandomNumber.length - 1]][1];
	jq('#text-rus').text(wordRus);
}

getRandomWord();

function checkResult(){
	const inputTextIng = document.querySelector('#text-ingl');
	textIng = jq('#text-ingl').text();
	const boxMessage = jq('.add-msg');
	if (textIng === wordIng){
		boxMessage.html(' ');
		boxMessage.html('Все верно!!!!!!!').setCss('color', 'green');
		jq('#text-ingl').text(' ');
		if (libConfig.reverseFlag){
			getRandomWordReverse();
		}else {
			getRandomWord();
		}
	}else {
		boxMessage.html(' ');
		boxMessage.html('Ответ не верен (').setCss('color', 'red');
	}
	inputTextIng.focus();
}

jq('#text-ingl').keyDown(function (e){
	if (e.keyCode === 13){
		checkResult();
	}
});

jq('#check').click(function (){
	checkResult();
});

function updateTable(){
	const tbody = jq('#output');
	tbody.html(' ');

	function createRow(p) {
		return template.replace(/{{ID}}/ig, p.id)
									.replace(/{{RUS}}/ig, p.key)
									.replace(/{{ING}}/ig, p.val)
									.replace(/{{KNOW}}/ig, p.know);
	}

	let numberId = 1;
	let str = '';
	for (let i = 0; i < libConfig.vocabulary.length; i++){
		const params = {
			id: numberId++,
			key: libConfig.vocabulary[i][0],
			val: libConfig.vocabulary[i][1],
			know: libConfig.vocabulary[i][2]
		};
		str += createRow(params);
	}
	tbody.html(str);
}

updateTable();

function checkWord(word){
	let i = 0;
	for (i; i < libConfig.vocabulary.length; i++){
		if (libConfig.vocabulary[i][0] === word ){
			return true;
		}
	}
}

function updateLocalStorage(arrayWords){
	libConfig.vocabulary = arrayWords;
	localStorage.setItem('learnEnglish', JSON.stringify(libConfig));
}

function updateBlock(){
	libConfig.vocabulary.sort(mySort);
	// updateLocalStorage(libConfig.vocabulary);
	localStorage.setItem('learnEnglish', JSON.stringify(libConfig));
	updateTable();
	if (libConfig.reverseFlag){
		getRandomWordReverse();
	}else {
		getRandomWord();
	}
}

jq('#add-word').click(function (){
	const arr = new Array(3);
	const boxMessage = jq('.add-msg');
	textRus = jq('#text-rus').text();
	textIng = jq('#text-ingl').text();
	if (textRus !== '' && textIng !== ''){
		if (checkWord(textRus)){
			boxMessage.html(' ');
			boxMessage.html('Такое слово уже есть в словаре').setCss('color', 'silver');
			return false;
		}
		boxMessage.html(' ');
		arr[0] = textRus;
		arr[1] = textIng;
		arr[2] = 'Учу';
		libConfig.vocabulary.push(arr);
		updateBlock();
		jq('#text-ingl').text(' ');
		getRandomWord();
	}else {
		boxMessage.html(' ');
		boxMessage.html('Заполни все поля').setCss('color', 'lightgreen');
	}
});

function deletWord(key){
	const templatePopap = jq('#my-template__popap').html();
	const windowPopap = jq('.window-popap');
	const body = jq('body');
	function createWord(word) {
		return templatePopap.replace(/{{WORD}}/ig, word);
	}
	body.setCss('overflow', 'hidden');
	windowPopap.html(' ');
	windowPopap.html(createWord(key)).fadeIn(300, function (){
		jq('.yes-delete').click(function yesDelete(){
			const self = this;
			jq(self).toggleAction(self);
			windowPopap.fadeOut(300, function (){
				windowPopap.hide();
				jq(self).toggleAction(self, yesDelete);
				body.setCss('overflow', 'auto');
			});

			for (let i = 0; i < libConfig.vocabulary.length; i++){
				if (libConfig.vocabulary[i][0] === key){
					libConfig.vocabulary.splice(i, 1);
				}
			}
			updateLocalStorage(libConfig.vocabulary);
			updateBlock();
		});
		jq('.no-delete').click(function noDelete(){
			const self = this;
			jq(self).toggleAction(self);
			windowPopap.fadeOut(300, function (){
				windowPopap.hide();
				jq(self).toggleAction(self, noDelete);
				body.setCss('overflow', 'auto');
			});
		});
	});
}

function reverseLibrary(){
	arrRandomNumber.length = 0;
	const buttonReverse = jq('#reverse');
	buttonReverse.html(' ');
	jq('#know').html(' ');
	if (libConfig.reverseFlag){
		buttonReverse.setCss('backgroundColor', 'green');
		buttonReverse.html('Повторяю выученные');
		jq('#know').html('Отметить для повторения');
	}else {
		buttonReverse.setCss('backgroundColor', 'silver');
		buttonReverse.html('Учу');
		jq('#know').html('Я уже знаю слово');
	}
	updateBlock();
}

const buttonLibrary = document.querySelector('#words');
const tableBox = document.querySelector('.table-box');
let flag = true;

const buttonWords = jq('#words');

function updateReverse(){
	for (let i = 0; i < libConfig.vocabulary.length; i++){
		if (libConfig.vocabulary[i][2] === 'Знаю' && libConfig.vocabulary[i][2] !== 'Знаю железно'){
			libConfig.vocabulary[i][2] = 'Учу';
		}else if (libConfig.vocabulary[i][2] === 'Учу'){
			libConfig.vocabulary[i][2] = 'Знаю';
		}
	}
	buttonWords.html(' ');
	if (libConfig.reverseFlag){
		libConfig.reverseFlag = false;
		buttonLibrary.disabled = false;
		flag = true;
		repeatWordsAddLearn();
		buttonWords.html('Показать словарь');
	}else {
		libConfig.reverseFlag = true;
		buttonLibrary.disabled = true;
		flag = false;
		jq('.table-box').fadeOut(600, function (){
			jq('.table-box').hide();
		});
		buttonWords.html('Заблокировано');
	}
	console.log(libConfig.reverseFlag);
	reverseLibrary();
}

jq('#reverse').click(updateReverse);

if (libConfig.reverseFlag){
	reverseLibrary();
	buttonLibrary.disabled = true;
	flag = false;
	tableBox.style.display = 'none';
	buttonWords.html(' ');
	buttonWords.html('Заблокировано');
}

jq('#words').click(function libr(){
	const self = this;
	jq(self).toggleAction(self);
	jq(this).html(' ');
	if (flag){
		jq(this).html('Скрыть словарь');
		jq('.table-box').fadeIn(600, function (){
			jq(self).toggleAction(self, libr);
		});
		flag = false;
	}else {
		jq(this).html('Показать словарь');
		jq('.table-box').fadeOut(600, function (){
			jq('.table-box').hide();
			jq(self).toggleAction(self, libr);
			flag = true;
		});
	}
});








function knowWord(key){
	for (let i = 0; i < libConfig.vocabulary.length; i++){
		if (libConfig.vocabulary[i][0] === key){
			if (libConfig.vocabulary[i][2] === 'Знаю'){
				libConfig.vocabulary[i][2] = 'Знаю железно';
			}else if (libConfig.vocabulary[i][2] === 'Знаю железно'){
				libConfig.vocabulary[i][2] = 'Учу';
			}else {
				libConfig.vocabulary[i][2] = 'Знаю';
			}
		}
	}
	updateBlock();
}


// let wordRus;
// let wordIng;
jq('#know').click(function (){
	// const txtRus = jq('#text-rus').text();
	if (libConfig.reverseFlag){
		addItemArray(libConfig.repeatWords, wordRus);
		console.log(libConfig.repeatWords);
		localStorage.setItem('learnEnglish', JSON.stringify(libConfig));
	}else {
		knowWord(wordRus);
	}
});
















jq('#hint').click(function showHelp(){
	const self = this;
	// const wordRus = jq('#text-rus').text();
	const boxMessage = jq('.add-msg');
	jq(self).toggleAction(self);

	if (libConfig.reverseFlag){
		addItemArray(libConfig.repeatWords, wordRus);
		localStorage.setItem('learnEnglish', JSON.stringify(libConfig));
	}
	console.log(libConfig.repeatWords);
	let inglWord;
	for (let i = 0; i < libConfig.vocabulary.length; i++){
		if (libConfig.vocabulary[i][0] === wordRus){
			inglWord = libConfig.vocabulary[i][1];
		}
	}
	boxMessage.html(' ');
	boxMessage.html(inglWord).setCss('color', 'orange').fadeIn(500, function (){
		boxMessage.fadeOut(500, function (){
			boxMessage.html(' ').setCss('display', 'block').setCss('opacity', 1);
			jq(self).toggleAction(self, showHelp);
		});
	});
});


function redactWord(){
	
}
