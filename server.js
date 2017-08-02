const fs = require('fs');
var mongoose = require("mongoose");
const translate = require("google-translate-api");

//mongoose.connect("mongodb://localhost/translate")
mongoose.connect("mongodb://locahost/iconbase");

var translateSchema = new mongoose.Schema ({
	initialText:String,
	count:Number,
	language:String,
	translatedText:String
})

var Translated = mongoose.model("translatedWords2", translateSchema);

// 1: read an input file with phrases
var fileText = fs.readFileSync('sample.txt');
var stopText = fs.readFileSync("stopwords.txt");
console.log("text: " + fileText); 
console.log('after calling readFile');
console.log("stopText: "+stopText);
// 2: split the file text into lines
console.log("line Array: ")
var lineArray = fileText.toString().split("\n");
var stopWords = stopText.toString().split("\n");
console.log(stopWords);
/*
//rename arrays
for (line in lineArray) {
	console.log(lineArray[line]);
}
*/
//find out why in does not work in arrays
console.log("word Array: ")
var i, j, w, line, words = [];
var wordCount = {};

for (i = 0; i < lineArray.length; ++i) {
	line = lineArray[i].trim();
	words = line.split(" ");
	for (j = 0; j < words.length; ++j) {
		w = words[j].trim();
		if (w in wordCount) {
			wordCount[w] = wordCount[w] + 1; // if word exists increment word count by one
		} else if (stopWords.indexOf(w)==-1) {
			wordCount[w] = 1; // else, initialize count as 1
		}

	}
	//wordArray = wordArray.concat(lineArray[line].split(" "));
}

var tuples = [];

for (var key in wordCount) tuples.push([key, wordCount[key]]);

tuples.sort(function(a, b) {
    a = a[1];
    b = b[1];

    return a < b ? -1 : (a > b ? 1 : 0);
});

for (word in wordCount) {
	console.log("word: " + word + " count: " + wordCount[word]);
}

for (var i = tuples.length-1; i >0; --i) {
	console.log("tuple: "+tuples[i]);
}

var sortedWordCount = {};
for (var i = tuples.length-1; i > tuples.length-501; --i) {
	sortedWordCount[tuples[i][0]] = tuples[i][1];
}
var i=0;
var count = 0;
for (word in sortedWordCount) {
	console.log("sorted word: "+ word);
	count++;
	i++;
}

/*
var translatedWords=[];
console.log("Translated words: ")
for (word in sortedWordCount) {
	translate(word, {to: 'es'}).then(res => {
	    var newText = res.text.toString();
	    translatedWords.push(newText);
	    console.log(newText);
	    //=> I speak English 
	    //=> nl 
	}).catch(err => {
		console.error(err);
	});

}
*/
/*function translateWord(text, lang) {
	translate(text, {to: lang}).then(res => {
	    var newText = res.text.toString();
	    console.log(newText);
	    return newText;
	    //=> I speak English 
	    //=> nl 

	}).catch(err => {
		console.error(err);
	});
}


*/

/*
console.log("test translate: " + translateWord("hello", "es"))*/

var getTranslation = function(key, lang) {
	translate(key, {to: lang}).then(res => {
	    var newText = res.text.toString();
	    //console.log("translated: "+newText);
	    /*console.log("key: " + key);
		console.log("lang: " + lang);
		console.log("new text: "+ newText);*/
	    completed.push([key, sortedWordCount[key], lang, newText]);
	    //=> I speak English 
	    //=> nl 
	    if (completed.length == languages.length * count) {
	    	for (key in completed) {
	    		console.log("completed: "+completed[key]);
	    	}

	    	for (var i = 0; i<completed.length; i++) {
				var completedWord = new Translated ({
					initialText : completed[i][0],
					count : completed[i][1],
					language : completed[i][2],
					translatedText : completed[i][3]
				})
				completedWord.save(function (err, word) {
					if (err) return console.error(err);
					//console.log(completedWord);
				})
				
			}
	    }
	}).catch(err => {
		console.error(err);
	});
}


var translatedWords = {};
var languages = ["en","es", "fr", "ta"];
var completed = []; 
for (var key in sortedWordCount) {
	for (i = 0; i < languages.length; ++i) {
		getTranslation(key, languages[i]);
	}
}





/*
function bySortedValue(obj, callback, context) {
    var tuples = [];

    for (var key in obj) tuples.push([key, obj[key]]);

    tuples.sort(function(a, b) { return a[1] < b[1] ? 1 : a[1] > b[1] ? -1 : 0 });

    var length = tuples.length;
    while (length--) callback.call(context, tuples[length][0], tuples[length][1]);
}

bySortedValue({
    foo: 1,
    bar: 7,
    baz: 3
}, function(key, value) {
    alert(key + ": " + value);
});

bySortedValue(someObj, this.method, this);
*/
// toDo: sort the map in decreasing order of count



/*
create a 
second text file called stopWords.txt 
include words like in, the, is, etc.
read that file into a map, the value beni

/*

console.log("unique words");

var uniqueWords = [];
for (word in wordArray) {
	if (uniqueWords.indexOf(wordArray[word])==-1) {
		uniqueWords.push(wordArray[word]);
	}
	
}


for (word in uniqueWords) {
	console.log(uniqueWords[word]);
}
*/


