let openCards = [];
let movesCounter = 0;
let starRating = $('i');
cardsList = pullCards();
let interval;
let endGame =  false;
let timer = document.querySelector(".timer");
timer.innerHTML = "0 mins : 0 secs";

let shuffledArray = shuffle(cardsList);
displayCards();
let click = 0;

//add click listner to cards
$('.card').on ('click',function(){
	click++;
	if(click == 1){ startTimer(); }
	cardsSelector(this);
});


// Create a cards array to pull all cards from HTML DOM
function pullCards(){
	let cards=[];
	cards = document.getElementsByClassName("card");
	return transformer(cards);
};


// convert returned object into array 
function transformer(obj){
	let transformedArray =[];
	for(let key in obj){
		if(obj.hasOwnProperty(key)){
			transformedArray.push(obj[key].innerHTML);
		}
	}
	return transformedArray;
}

// display cards in HTML DOM
function displayCards(){
	let list = cardsFactory();
	replacer (list);
};

function replacer(list){
	document.getElementsByClassName("deck")[0].innerHTML= list.innerHTML;
};


// create cards to shuflle them 
function cardsFactory(){
	let list = document.createElement("ul");
	for(let x=0; x < shuffledArray.length ; x++){
		let li = document.createElement("li");
		li.innerHTML=shuffledArray[x];
		li.classList.add("card");
		list.appendChild(li);
	}
	return list;
};


 // Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

// function to handle clicked cards
function cardsSelector(card){
	if(isClicked(card)){
		return;
	}
	displayIcons(card);
	markedOpen(card);
}; 


// function to check that clicked cards have show & open classes
 function isClicked(card)
 {
 	if( $(card).hasClass("show") || $(card).hasClass("open")){
 		return true;
 	}
 	return false;
 }

 // function to display icons   
function displayIcons(card){
	$(card).addClass("show open");
}; 


function markedOpen(card){
	if(openCards.length > 0){
		countMoves(card);
		//displayIcons(card);
		openCards.push(card);
		if(isMatch(openCards)){
			matched(openCards);
			openCards = [];
		}else {
			unmatched(openCards);
			openCards = [];
		}
	}else {
		openCards.push(card);
		countMoves(card);
	}
	checkMatchedAll();
};


 // moves count when user clicked cards 
function countMoves(card){
	if(endGame || $(card).hasClass("match") || $(card).is($(openCards[0])) ){
		return false;
	}
	movesCounter ++;
	Rating(movesCounter);
	$('.moves').text(movesCounter);
};


 // function to check two cards are matched or not 
function isMatch(openCards){
	let condition1 = openCards[0].innerHTML != openCards[1].innerHTML; 
	let condition2 = $(openCards[0]) .is($(openCards[1]));
	if(condition1 || condition2){
		return false;
	}else{
		return true;
	}
};


// function to matched cards 
function matched(openCards){
	closeopenCards(openCards);
	markAsMatched(openCards);
	openedCards = [];
};

function markAsMatched(openCards){
	for(let i= openCards.length -1; i>= 0;i--){
		$(openCards[i]).addClass("match");
	}
}

// function to unmatched cards 
function unmatched(openCards){
	let currentCards = openCards;
	markedAsUnmatche(currentCards);
	setTimeout(function(){
		hideIcons(currentCards);
	},1000);
	 openedCards = [];
};

function markedAsUnmatche(openedCards){
	for (let i = openedCards.length - 1; i >= 0; i--) {
		$(openedCards[i]).addClass("unmatched");
	} 
}


//  hide icons 
function hideIcons(openCards){
	for (let i = openCards.length - 1; i >= 0; i--) {
		$(openCards[i]).removeClass("open show unmatched");
	}
}; 


// close cards
function closeopenCards(openedCards){
	for (let i = openedCards.length - 1; i >= 0; i--) {
		$(openedCards[i]).removeClass( "open" );
	}
}


// function to check all cards are matched
function checkMatchedAll(){
	let all = true;
	$('.card').each(function(){
		return all =  $(this).hasClass( "match"); 
	});
	if(all){
		statistics();
		endGame = true;
	}
}


// calculate playing time

function getTimer(){
	return $('#timer').text();
};

let second = 0, minute = 0; hour = 0;
function startTimer(){
    interval = setInterval(function(){
        timer.innerHTML = minute+" mins "+" : "+second+" secs";
        second++;
        if(second == 60){
            minute++;
            second=0;
        }
        if(minute == 60){
            hour++;
            minute = 0;
        }
    },1000);
}


// Rating and scores
function Rating(moves){
  let score = 3;
  if(moves <= 10) {
    starRating.eq(3).removeClass('fa-star').addClass('fa-star-o');
    score = 3;
  } else if (moves > 10 && moves <= 20) {
    starRating.eq(2).removeClass('fa-star').addClass('fa-star-o');
    score = 2;
  } else if (moves > 20) {
    starRating.eq(1).removeClass('fa-star').addClass('fa-star-o');
    score = 1;
  }
  return score;
}


function statistics() {
	let score = Rating(movesCounter);
	clearInterval(interval);
	let time  = getTimer();
	sweetAlert('Congratulations! You Won!',  ' with ' + movesCounter + ' Moves '+ ' , Scoring ' + score + ' Star!' + '  in ' + time , 'success', 'Play again', 'Stay Here');
};


/*sweetAlert function (Modal)*/

function sweetAlert(titleMessage, textMessage ,typeMessage, confirmbtnText = null, cancelbtnText = null , confirmStyle = null){
    swal({
      title: titleMessage,
      text: textMessage,
      type: typeMessage,
      showCancelButton: cancelbtnText ? true : false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: confirmbtnText,
      cancelButtonText: cancelbtnText,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      buttonsStyling: false,
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        swal({
          title: 'Reloading' ,
          text:  'HAVE FUN!',
          type : 'success',
          timer : 2500
        })

        setTimeout(function(){
            window.location.reload();
        }, 2000);

      } else if (result.dismiss === 'cancel') {
        swal({
          title: 'Cancelled',
          text: 'Refresh the page to play again',
          type: 'info',
          animation: false,
          customClass: 'markedAsUnmatched tada',
          timer: 2000
        })
      }
    })

}
