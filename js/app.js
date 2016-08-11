// Select Plugin

$.fn.clickSelect = function(element) {
  return $(this).on('click',function() {
    var doc = document,
      text = doc.getElementById(element),
      range,
      selection;
    if (doc.body.createTextRange) {
      range = document.body.createTextRange();
      range.moveToElementText(text);
      range.select();
    } else if (window.getSelection) {
      selection = window.getSelection();
      range = document.createRange();
      range.selectNodeContents(text);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  })
};

$('#convert').click(function() {
  var mylist = [];

  var yml = "contents:";

  var markdown = "";

  var result = $.parseHTML($('textarea').val());

  $(".list").empty();

  $(".list").append(result);

  console.log(result);

  $("div.list > ul > li > a").each(function() {

    if ($(this).next().is("ul")) {

      var subitem = [];
      var subitemYml = "\n    subitems:";
      var subitemMarkdown = "";
      $($(this).next().children("li").children("a")).each(function() {
        var href = $(this).attr("href").replace("#",'');

        subitemYml += "\n      - name: " + $(this).text() + "\n        url: " + href;

        subitemMarkdown += "  - [" + $(this).text() + "](#" + href + ")\n";

        subitem.push({
          "name": $(this).text(),
          "url": href
        })
      });

      var href = $(this).attr("href").replace("#",'');

      yml += "\n  - name: " + $(this).text() + "\n    url: " + href + subitemYml;

      markdown += "- [" + $(this).text() + "](#" + href + ")\n" + subitemMarkdown;

      mylist.push({
        "name": $(this).text(),
        "url": href,
        "subitems": subitem
      });

    } else {
      var href = $(this).attr("href").replace("#",'');

      yml += "\n  - name: " + $(this).text() + "\n    url: " + href;

      markdown += "- [" + $(this).text() + "](#" + href + ")\n";

      console.log(markdown);

      mylist.push({
        "name": $(this).text(),
        "url": href
      });
    }

  });

  $("#resultYml").empty();

  $("#resultYml").text(yml);

  $("#resultMarkdown").text(markdown);

// for result only
  $("#result").empty();
  $("#result").html(JSON.stringify(mylist));
});
$("#reset").click(function() {
  $(".list").empty();
  $("#input").val("Insert your ToC as HTML ul list");
  $("#result").text("JSON ToC will show here");
  $("#resultYml").text("YAML ToC will show here");
  $("#resultMarkdown").text("Markdown Toc will show here");
});
$("#select").clickSelect("input");