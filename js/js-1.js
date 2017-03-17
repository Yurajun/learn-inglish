/* global jq */

let libConfig = {
	vocabulary: [],
	repeatWords: [],
	reverseFlag: '',
	arrRandomNumber: []
};

function getVocabulary(){
	const state = localStorage.getItem('learnEnglish');
	if (state) {
		libConfig = JSON.parse(state);
	}else {
		localStorage.setItem('learnEnglish', JSON.stringify(libConfig));
	}
}

getVocabulary();
//
let vocabulary = [];

let repeatWords = localStorage.getItem('repeatWords');
repeatWords = repeatWords.split(' ');
if (!repeatWords){
	console.log(repeatWords);
	repeatWords = [];
	localStorage.setItem('reverseFlag', repeatWords);
}

let reverseFlag = JSON.parse(localStorage.getItem('reverseFlag'));
if (!reverseFlag){
	console.log(reverseFlag);
	reverseFlag = false;
	localStorage.setItem('reverseFlag', reverseFlag);
}

function updateLocalStorage(arrayWords){
	// const obj = JSON.stringify(val);
	libConfig.vocabulary = arrayWords;
	localStorage.setItem('learnEnglish', JSON.stringify(libConfig));
	// localStorage.setItem('vocabulary', obj);
}

function mySort(val1, val2){
	return val1[2].length - val2[2].length;
}

function addItemArray(arr, item){
	let i = 0;
	for (i; i <= arr.length; i++){
		if (arr[i] === item){
			return;
		}
	}
	arr.push(item);
}

/* function getVocabulary(){
	const library = localStorage.getItem('vocabulary');
	if (library) {
		vocabulary = JSON.parse(library);
	}
}*/

const dictionary = localStorage.getItem('vocabulary');
if (dictionary) {
	vocabulary = JSON.parse(dictionary);
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
	let i = 0;
	let count = -1;
	if (vocabulary.length === 0){
		return;
	}
	for (i; i < vocabulary.length; i++){
		if (vocabulary[i][2] === 'Учу'){
			count += 1;
		}
	}
	return count;
}

function getRandomWord() {
	const random = getRandomInt(0, countWordsLearn());
	console.log('g: ', random);
	wordRus = vocabulary[random][0];
	wordIng = vocabulary[random][1];
	jq('#text-rus').text(wordRus);
}

const arrRandomNumber = [];

function getRandomWordReverse(){
	const random = getRandomInt(0, countWordsLearn());
	addItemArray(arrRandomNumber, random);
	console.log(countWordsLearn());
	console.log(arrRandomNumber.length);
	console.log(arrRandomNumber);
	console.log('r: ', arrRandomNumber[arrRandomNumber.length - 1]);
	wordRus = vocabulary[arrRandomNumber[arrRandomNumber.length - 1]][0];
	wordIng = vocabulary[arrRandomNumber[arrRandomNumber.length - 1]][1];
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
		if (reverseFlag){
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
	getVocabulary();
	const tbody = jq('#output');
	tbody.html(' ');

	function createRow(p) {
		return template.replace(/{{ID}}/ig, p.id)
									.replace(/{{RUS}}/ig, p.key)
									.replace(/{{ING}}/ig, p.val)
									.replace(/{{KNOW}}/ig, p.know);
	}

	let i = 0;
	for (i; i < vocabulary.length; i++){
		const params = {
			id: i,
			key: libConfig.vocabulary[i][0],
			val: libConfig.vocabulary[i][1],
			know: libConfig.vocabulary[i][2]
		};
		tbody.html(createRow(params));
	}
}

updateTable();

function checkWord(word){
	let i = 0;
	for (i; i < vocabulary.length; i++){
		if (vocabulary[i][0] === word ){
			return true;
		}
	}
}

function updateBlock(){
	vocabulary.sort(mySort);
	updateLocalStorage(vocabulary);
	updateTable();
	if (reverseFlag){
		getRandomWordReverse();
	}else {
		getRandomWord();
	}
}

function repeatWordsAddLearn(){
	// if ()
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
		vocabulary.push(arr);
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
			let i = 0;
			for (i; i < vocabulary.length; i++){
				if (vocabulary[i][0] === key){
					vocabulary.splice(i, 1);
				}
			}
			updateLocalStorage(vocabulary);
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
	const buttonReverse = jq('#reverse');
	buttonReverse.html(' ');
	if (!reverseFlag){
		buttonReverse.setCss('backgroundColor', 'silver');
		buttonReverse.html('Учу');
		jq('#know').html(' ');
		jq('#know').html('Я уже знаю слово');
		localStorage.setItem('reverseFlag', false);
	}else {
		buttonReverse.setCss('backgroundColor', 'green');
		buttonReverse.html('Повторяю выученные');
		jq('#know').html(' ');
		jq('#know').html('Отметить для повторения');
		localStorage.setItem('reverseFlag', true);
	}
	updateBlock();
}

function updateReverse(){
	if (arrRandomNumber.length === countWordsLearn()){
		jq('#reverse').toggleAction(jq('#reverse'));
	}else {
		jq('#reverse').toggleAction(jq('#reverse'));
	}
	// const buttonReverse = jq('#reverse');
	let i = 0;
	for (i; i < vocabulary.length; i++){
		if (vocabulary[i][2] === 'Знаю' && vocabulary[i][2] !== 'Знаю железно'){
			vocabulary[i][2] = 'Учу';
		}else if (vocabulary[i][2] === 'Учу'){
			vocabulary[i][2] = 'Знаю';
		}
	}
	if (!reverseFlag){
		localStorage.setItem('reverseFlag', true);
		reverseFlag = true;
		reverseLibrary();
	}else {
		localStorage.setItem('reverseFlag', false);
		reverseFlag = false;
		reverseLibrary();
	}
}

jq('#reverse').click(updateReverse);

if (reverseFlag){
	reverseLibrary();
}

function knowWord(key){
	let i = 0;
	for (i; i < vocabulary.length; i++){
		if (vocabulary[i][0] === key){
			if (vocabulary[i][2] === 'Знаю'){
				vocabulary[i][2] = 'Знаю железно';
			}else if (vocabulary[i][2] === 'Знаю железно'){
				vocabulary[i][2] = 'Учу';
			}else {
				vocabulary[i][2] = 'Знаю';
			}
		}
	}
	updateBlock();
}

jq('#know').click(function (){
	const txtRus = jq('#text-rus').text();
	if (reverseFlag){
		addItemArray(repeatWords, txtRus);
		console.log(repeatWords);
		localStorage.setItem('repeatWords', repeatWords);
	}else {
		knowWord(txtRus);
	}
});

jq('#hint').click(function showHelp(){
	const self = this;
	const txtRus = jq('#text-rus').text();
	const boxMessage = jq('.add-msg');
	jq(self).toggleAction(self);
	let i = 0;
	let inglWord;
	for (i; i < vocabulary.length; i++){
		if (vocabulary[i][0] === txtRus){
			inglWord = vocabulary[i][1];
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

jq('.table-box').hide();

let flag = true;

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


