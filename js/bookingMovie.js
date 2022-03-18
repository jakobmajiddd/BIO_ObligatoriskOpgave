const container = document.querySelector('.container');
const seats = document.querySelectorAll('.row .seat:not(occupied)');
const count = document.getElementById('count');
const total = document.getElementById('total');
const movieSelect = document.getElementById('movie');

populateUI();
let ticketPrice = +movieSelect.value; //+ gør det til et number i stedet for string, value henter value fra option i html

//save selected movie index and the price
function setMovieData(movieIndex, moviePrice) {
  localStorage.setItem('selectedMovieIndex', movieIndex);
  localStorage.setItem('selectedMoviePrice', moviePrice);
}

//update totalt price and count
function updateSelectedCount() {
  const selectedSeats = document.querySelectorAll('.row .seat.selected'); //alle selected seats der bliver trykket på (de bliver sat i et array)

  //gemmer seatets index
  const seatsIndex = [...selectedSeats].map(function (seat) {
    return [...seats].indexOf(seat);
  });
//local storage så selvom man refresher gemmer browseren det man har trykket på
  localStorage.setItem('selectedSeats', JSON.stringify(seatsIndex)); //da seatsIndex er et array skal vi bruge json.stringify

  const selectedSeatsCount = selectedSeats.length; //et tal på hvor mange selected seats der er trykket på

  count.innerText = selectedSeatsCount;
  total.innerText = selectedSeatsCount * ticketPrice;
}

//get data from localStorage and populate the ui
function populateUI() {
  const selectedSeats = JSON.parse(localStorage.getItem('selectedSeats')); //tilbage fra string til array igen

  if (selectedSeats !== null && selectedSeats.length > 0) {
    seats.forEach((seat, index) => {
      if (selectedSeats.indexOf(index) > -1){
        seat.classList.add('selected');
      }
    });
  }

  const selectedMovieIndex = localStorage.getItem('selectedMovieIndex');

  if (selectedMovieIndex != null) {
    movieSelect.selectedIndex = selectedMovieIndex;
  }
}

//movie select event, denne funktion gør at den regner ny pris når man skifter film, og ikke sidder fast på første pris
movieSelect.addEventListener('change', event => {
  ticketPrice = +event.target.value; //+ gør det til et number i stedet for string
  setMovieData(event.target.selectedIndex, event.target.value);
  updateSelectedCount(); //her går vi igen igennem alle de selected seats der er valgt, og regner prisen ud
  }
)

container.addEventListener('click', (event) => {
  if (event.target.classList.contains('seat') && !event.target.classList.contains('occupied')) { //kun 'seats' og ikke 'occupied'
    event.target.classList.toggle('selected'); //gemmer den seat man trykker på som 'selected' seat
  }

  updateSelectedCount();
});

updateSelectedCount();




