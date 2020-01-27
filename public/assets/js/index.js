var $noteTitle = $(".note-title");
var $noteText = $(".note-textarea");
var $saveNoteBtn = $(".save-note");
var $newNoteBtn = $(".new-note");
var $noteList = $(".list-container .list-group");
var $storeTitleId = $('.titleId');

// activeNote is used to keep track of the note in the textarea
var activeNote = {};

// A function for getting all notes from the db
$("document").ready(function () {
  var getNotes = function () {
    return $.ajax({
      url: "/api/notes",
      method: "GET"
    });
  };
  
  // A function for saving a note to the db
  var saveNote = function (data) {
    return $.ajax({
      url: "/api/notes",
      data: data,
      method: "POST"    
    })
  };

  // A function for deleting a note from the db
  var deleteNote = function (id) {
    return $.ajax({
      url: "/api/notes/" + id,
      method: "DELETE",
      success: window.location.reload(true)
    });
  };

  // DISPLAY: If there is an activeNote, display it, otherwise render empty inputs
  var renderActiveNote = function () {
    $saveNoteBtn.hide();
    if (activeNote.id) {
      $noteTitle.attr("readonly", true);
      $noteText.attr("readonly", true);
      $noteTitle.val(activeNote.title);
      $noteText.val(activeNote.text);
    } else {
      $noteTitle.attr("readonly", false);
      $noteText.attr("readonly", false);
      $noteTitle.val("");
      $noteText.val("");
    }
  };

  // Get the note data from the inputs, save it to the db and update the view
  var handleNoteSave = function () {
    var newNote = {
      id: $storeTitleId.val(),
      title: $noteTitle.val(),
      text: $noteText.val()
    };
    saveNote(newNote).then(function () {
      // console.log(data);
      getAndRenderNotes();
      renderActiveNote();
    });
  };

  // DELETE the clicked note
  var handleNoteDelete = function(event) {
    // prevents the click listener for the list from being called when the button inside of it is clicked
    event.stopPropagation();
    var note = $(this)
      .parent(".list-group-item")
      .data();
    if (activeNote.id === note.id) {
      activeNote = {};
    }
    // console.log($(this));
    deleteNote(note.id).then(function() {
      getAndRenderNotes();
      renderActiveNote();
    });
  };

  // Sets the activeNote and displays it
  var handleNoteView = function () {
    activeNote = $(this).data();
    renderActiveNote();
  };

  // Sets the activeNote to and empty object and allows the user to enter a new note
  var handleNewNoteView = function () {
    activeNote = {};
    renderActiveNote();
  };

  // If a note's title or text are empty, hide the save button or else show it
  var handleRenderSaveBtn = function () {
    if (!$noteTitle.val().trim() || !$noteText.val().trim()) {
      $saveNoteBtn.hide();
    } else {
      $saveNoteBtn.show();
    }
  };
    
  // RENDER the list of note titles
  var renderNoteList = function (notes) {
    $noteList.empty();
    const noteListItems = [];
    // console.log(notes.length);

    for (var i = 0; i < notes.length; i++) {
      const note = notes[i];
      const $li = $("<li class='list-group-item'>").data(note);
      const $span = $("<span class='titleId'>").text(note.title);
      const $delBtn = $(
        "<i class='fas fa-trash-alt float-right text-danger delete-note'>"
      );
      $li.append($span, $delBtn);
      noteListItems.push($li);
    }
    $noteList.append(noteListItems);
  };

  // Gets notes from the db and renders them to the sidebar
  var getAndRenderNotes = function () {
    return getNotes().then(function (data) {
      // console.log(data);
      renderNoteList(data);
    });
  };

  $saveNoteBtn.on("click", handleNoteSave);
  $noteList.on("click", ".list-group-item", handleNoteView);
  $newNoteBtn.on("click", handleNewNoteView);
  $noteList.on("click", ".delete-note", handleNoteDelete);
  $noteTitle.on("keyup", handleRenderSaveBtn);
  $noteText.on("keyup", handleRenderSaveBtn);
  getAndRenderNotes();
})






