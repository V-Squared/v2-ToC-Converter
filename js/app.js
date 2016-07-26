$('#convert').click(function() {
  var mylist = [];

  var yml = "contents:";

  var result = $.parseHTML($('textarea').val());

  $(".list").empty();

  $(".list").append(result);

  console.log(result);

  $("div.list > ul > li > a").each(function() {

    if ($(this).next().is("ul")) {

      var subitem = [];
      var subitemYml = "\n    subitems:"
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
        "subitems": subitem
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

  $("#resultYml").empty();

  $("#resultYml").text(yml);

// for result only
  $("#result").empty();
  $("#result").html(JSON.stringify(mylist));
});
