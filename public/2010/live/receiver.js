$(document).ready(function() {
  WebSocket.__swfLocation = "WebSocketMain.swf";

  var capacity  = 20;
  var icon_size = 48;

  function format(text) {
    return text;
  }

  function cutoff() {
    if ($("#stream div").size() >= capacity) {
      $("#stream div:last").slideDown(100, function() {
        $(this).remove();
      });
    }
  }

  function prepend(element) {
    element.hide().prependTo($("#stream")).slideDown("fast");
    cutoff();
  }

  var stream = new Pusher("103f2d7ba59163142c42", "stream");
  var notice = new Pusher("103f2d7ba59163142c42", "notice");

  stream.bind("twitter", function(message) {
    var data = message.data;
    var user = data.user;

    if (user) {
      var id                = data.id;
      var text              = data.text;
      var screen_name       = user.screen_name;
      var profile_image_url = user.profile_image_url;
      var d                 = new Date(data.created_at);
      var created_at_text   = d.getFullYear() + "/" + d.getMonth() + "/" + d.getDate()
                            + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();

      var div = $("<div/>")
                .addClass("tweet")
                .append($("<p/>")
                        .append($("<img/>")
                                .addClass("icon")
                                .attr({ src: profile_image_url, alt: screen_name, width: icon_size, height: icon_size }))
                        .append($("<span/>")
                                .addClass("screen_name")
                                .append($("<a/>")
                                        .attr({ href: "http://twitter.com/" + screen_name + "/status/" + id, target: "_blank" })
                                        .text(screen_name)))
                        .append(format(text)));

      prepend(div);
    }
  });

  notice.bind("text", function(message) {
    var data       = message.data;
    var body       = data.body;
    var updated_at = data.updated_at;

    var div = $("#notice");

    div.contents().remove();

    div.append($("<span/>").hide()
               .addClass("message")
               .text(body).fadeIn(2000));
  });

  for (var i = 0; i < channels.length; i++) {
    var channel = channels[i];

    stream.bind("irc-" + channel, function(message) {
      var data       = message.body;
      var nick       = data.nick;
      var text       = data.text;
      var created_at = data.created_at;

      var div = $("<div/>")
        .addClass("irc")
        .append($("<p/>")
                .append($("<span/>")
                        .addClass("screen_name")
                        .text(nick))
                .append($('<span/>').text(format(text))));

      prepend(div);
    });
  }
});
