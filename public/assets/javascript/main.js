$(".notButton").click((e) => {
  e.preventDefault();
  leavenote();
});

function leavenote() {
  $("#notesdiv").css("display", "block");
}

$(".cancelbtn").click((e) => {
  e.preventDefault();
  $("#notesdiv").css("display", "none");
});

let notSavedColor = true;

$(".favButton").on("click", function(e) {
  e.preventDefault();

    notSavedColor = !notSavedColor;

  if (notSavedColor) {
    //$(this).css('background-color', '#00cc00');
    $(this).removeClass('unsavedColor').addClass('savedColor');
    $(this).text('Unsave');
  } else {
    //$(this).css('background-color', 'rgb(228, 159, 8)');
    $(this).removeClass('savedColor').addClass('unsavedColor');;
    $(this).text('Save');
  }



  let thisId = $(this).val();

  $.ajax({
    method: "PUT",
    url: "/save/" + thisId
  })
  // .then(data => {
  //     location.reload();
  //   });
});

$(".notButton").on("click", function(e) {
  e.preventDefault();

  // let thisId = $(this).val();
  console.log(thisId);

  $.ajax({
    method: "GET",
    url: "/articles/:id",
    data: {
      _id: $(this).val()
    }
  });
});

$(".addNoteButton").on("click", function(e) {
  e.preventDefault();
  let thisId = $(".addNoteButton").data("id");
  console.log("The note id is " + thisId);

  $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        name: $(".username").val(),
        note: $(".comment").val(),
        thisId: thisId
      }
    });

    $(".username").val("");
    $(".comment").val("");
});

$(document).ready(function(){

  $.ajax({ 
    method: "GET",
    url: "/notes"
   })
    .done(function(data){
      console.log("This is the data :" + data);
    })
 
});















































$(document).on("click", "p", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
    // With that done, add the note information to the page
    .done(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

$(".addNoteButton").on("click", function() {


});


$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
    // With that done
    .done(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
