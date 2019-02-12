$(document).ready(function () {
  $("#confirmBox").hide();
  $("#Scrap").on("click", function () {

    console.log("Hello there:");
    $.get("/Scrap", function (data) {

      if (data) {
        for (var i = 0; i < data.length; i++) {
          // Display the apropos information on the page
          var site = "https://www.nytimes.com"
          var articlediv = $("<div>");
          var save = $("<button>");
          save.addClass("btn btn-success");
          save.attr("padding", "20px");
          save.text("SAVE ARTICLE");
          save.css("margin", "20px");
          articlediv.attr("id", i);
          $("#" + i).addClass("articles");
          articlediv.css("background-color", "beige");
          articlediv.css("margin", "10px");
          articlediv.css("padding", "10px");
          // save.css("float","right");
          $(".background-image").append(articlediv);
          articlediv.html('<a href =' + site + data[i].link + '><h4>' + data[i].title + data[i].summary + '</h4></a>');
          articlediv.append(save);
          articlediv.css("color", "black");
          save.attr("id", data[i]._id);
        }
      } else {
        var text = "No new articles to scrap.Check Saved articles";
        var articleh2 = $("<h2>");
        articleh2.text(text);
        $(".background-image").append(articleh2);
      }


    });


  });

  //Handle the Save Article button
  $(document).on("click", ".btn.btn-success", function () {
    var id = this.id;
    $.ajax({
      url: "/api/Save/" + id,
      type: 'PUT',
    }).then(function (data) {
      if (data) {
        $("#" + id).parent().hide();
      }
      // window.location()
    });
  });

  //Handle the Clear Articles Button
  $("#Clear").on("click", function () {
    $.ajax({
      url: "/api/Clear/",
      type: 'DELETE',
    }).then(function (data) {
      if (data) {
        window.location = "/";
      }
    });
  });




  // Handle the Save Articles list
  $("#Saved").on("click", function () {
    $.ajax({
      url: "/api/SavedArticles/",
      type: 'GET',
    }).then(function (data) {
      $("articlediv").remove();
      if (data) {
        console.log("Entered clear articles loop");
        console.log("Successfully removed articles div");
        for (var i = 0; i < data.length; i++) {
          // Display the apropos information on the page
          console.log("Displaying saved article" + i);
          var site = "https://www.nytimes.com"
          var articleSavediv = $("<div>");
          var Delete = $("<button>");
          var addNote = $("<buton>");
          Delete.addClass("btn btn-danger Delete");
          addNote.addClass("btn btn-primary Notes");
          Delete.attr("padding", "10px");
          addNote.attr("padding", "10px");
          Delete.text("DELETE ARTICLE");
          addNote.text("Add Notes");
          Delete.css("margin", "20px");
          addNote.css("margin", "20px");
          articleSavediv.attr("id", i);
          $("#" + i).addClass("Savedarticles");
          articleSavediv.css("background-color", "beige");
          articleSavediv.css("margin", "10px");
          articleSavediv.css("padding", "10px");
          // save.css("float","right");
          $(".background-image").append(articleSavediv);
          articleSavediv.html('<a href =' + site + data[i].link + '><h4>' + data[i].title + data[i].summary + '</h4></a>');
          articleSavediv.append(Delete);
          articleSavediv.append(addNote);
          articleSavediv.css("color", "black");
          Delete.attr("id", data[i]._id);
          addNote.attr("id", data[i]._id);

        }

      } else {
        var text = "No Saved articles.Scrap new articles";
        var articleh2 = $("<h2>");
        articleh2.text(text);
        $(".background-image").append(articleh2);
      }

    });
  });
  //Handle the Delete Articles Button
  $(document).on("click", ".btn.btn-danger.Delete", function () {
    var id = this.id;
    console.log("The id of article to delete is" + id);
    $.ajax({
      url: "/api/DeleteArticle/" + id,
      type: 'DELETE',
    }).then(function (data) {
      if (data) {
        $("#" + id).parent().hide();
      }
      // window.location()
    });
  });


  //Route to handle Add Note button
  $(document).on("click", ".btn.btn-primary.Notes", function () {
    console.log("Entered add Note route:");
    var id = this.id;
    console.log("The id of the article to add note is" + id);
    $("#confirmBox").show();
    $("h2").text("The id of the article to add note is" + id);
   /* $.ajax({
      url: "/api/SavedNotes/" + id,
      type: 'GET',
    }).then(function (data) {*/
     submitNotes(id) ;

    });
    
    
   
  });
function submitNotes(id)
{
  var passId = id;
  var clientTitle = "Note for article with id" + passId;
  $(document).on("click", ".btn.btn-primary.Notes", function () {
  var clientBody = $("#NoteText").text().trim();
  console.log("The title of he note is "+ clientTitle);
  console.log("The body of the note is " + clientBody );
  Note:
   {
    title: clientTitle;
    body : clientBody;
    articleId: passId
  };
  console.log(Notes);
});

}
/* Whenever someone clicks a p tag
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
    .then(function(data) {
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

// When you click the savenote button
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
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });*/
