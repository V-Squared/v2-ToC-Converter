var mylist = [];

var yml = "contents:";

$("div.list > ul > li > a").each(function() {

  if ($(this).next().is("ul")) {

    var subitem = [];
    var subitemYml = "\n    subitem:"
    $($(this).next().children("li").children("a")).each(function() {
      var href = $(this).attr("href").replace("#",'');

      subitemYml += "\n      - name: " + $(this).text() + "\n        url: " + href;

      subitem.push({
        "name": $(this).text(),
        "url": href
      })
    });

    var href = $(this).attr("href").replace("#",'');

    yml += "\n  - name: " + $(this).text() + "\n    url: " + href + subitemYml;

    mylist.push({
      "name": $(this).text(),
      "url": href,
      "subitem": subitem
    });

  } else {
    var href = $(this).attr("href").replace("#",'');

    yml += "\n  - name: " + $(this).text() + "\n    url: " + href;

    console.log(yml);

    mylist.push({
      "name": $(this).text(),
      "url": href
    });
  }

});

$("#resultYml").text(yml);

// for result only
$("#result").html(JSON.stringify(mylist))
