/*
 * v2-ToC-Converter v0.3 (https://github.com/V-Squared/v2-ToC-Converter)
 * Dependencies: jQuery
 * Demo: https://v-squared.github.io/v2-ToC-Converter/
 * Issues: https://github.com/V-Squared/v2-ToC-Converter/issues
 * Docs: https://github.com/V-Squared/V-Squared.github.io/issues/130
 * Author: Lukas Chen (https://github.com/LukasChen)
 * Licensed under MIT (https://github.com/V-Squared/v2-ToC-Converter/blob/gh-pages/LICENSE)
 */

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

// ------------------
// events
// ------------------

$('#convert').click(convert);
$("#reset").click(reset);

// Copy
$("#selectJson").clickSelect("resultJson");
$("#selectYAML").clickSelect("resultYml");
$("#selectMarkdown").clickSelect("resultMarkdown");



// --------------
// Click callback
// --------------

function convert () {

  // output var
  var jsonOutput = [],
      ymlOutput = "contents:\n",
      markdownOutput = "";

  // parseHTML
  var inputHTML = $.parseHTML($("#input").val());

  // if there is any children <li>
  if($(inputHTML).children("li").length) {
    $(inputHTML).children("li").each(function() {
      // assign to variable to convert to string instead of [object,object]
      var json = loopList($(this)).json,
          yml = loopList($(this)).yml,
          markdown = loopList($(this)).markdown;

      // add item to output
      jsonOutput.push(json);
      ymlOutput += yml;
      markdownOutput += markdown;
    });
  } else {
    console.error("There need to be a <li> in the list!! or there is no <ul> at all!!");
  }

  //--------------
  //Render List
  //--------------

  var $list = $(".list");

  // reset list
  $list.empty();

  // append list
  $list.append(inputHTML);

  //---------------
  //Render Output
  //---------------

  console.log(markdownOutput);

  
  $("#resultJson").html(JSON.stringify(jsonOutput));
  $("#resultYml").html(ymlOutput);
  $("#resultMarkdown").html(markdownOutput);

}

function reset () {
  $(".list").empty();
  $("#input").val("Insert your ToC as HTML ul list");
  $("#resultJson").text("JSON ToC will show here");
  $("#resultYml").text("YAML ToC will show here");
  $("#resultMarkdown").text("Markdown Toc will show here");
}

function loopList (node) {
  var aNode = node.children("a:first");

  var parentLength = node.parents("ul").length;

  parentLength -= 1;

  var ymlSpaces = convertToSpace(parentLength,"    ");
  var markdownSpaces = convertToSpace(parentLength,"  ");

  var retVal = {
    json: {
      "url": aNode.attr("href").replace("#",""),
      "name": aNode.text()
    },
    yml: "  " + ymlSpaces + "- name: " + aNode.text() + "\n" +  "  " + ymlSpaces + "  url: " + aNode.attr("href").replace("#","") + "\n",
    markdown: markdownSpaces + "- [" + aNode.text() + "](" + aNode.attr("href") + ")\n"
  };

  node.find("> ul > li").each(function() {
    if (!retVal.json.hasOwnProperty("subitems")) {
      retVal.json.subitems = [];
      retVal.yml += "  " + ymlSpaces + "  subitems:\n"
    }
    retVal.json.subitems.push(loopList($(this)).json);
    retVal.yml += loopList($(this)).yml;
    retVal.markdown += loopList($(this)).markdown;
  });

  return retVal;
}

function convertToSpace(spaces,spaceNumber) {
  var string = "";
  var spaceNumber = spaceNumber || "  ";
  for (var i = 0; i < spaces; i++) {
    // Plus 4 space for yml and markdown output output
    string += spaceNumber;
  }
  return string;
}