// $(".header").append(
//   '<div class="col-12"><div class="row headerDiv"><div class="col-lg-3 col-md-3 col-sm-4"><img src="<%=getOption("metaLogoURL")%>" class="img-fluid center-home" alt="Logo" /><div class="logoText-home"><%=getOption("metaLogoURLText")%></div></div><div class="col-lg-5 col-md-5 col-sm-4"></div><div class="col-lg-4 col-md-4 col-sm-4"><input class="menu-btn" type="checkbox" id="menu-btn" /><label class="menu-icon" for="menu-btn"><span class="navicon"></span></label><a href="#" id="mobileNotification" class="notification"><img src="<%=getOption("metaResourceDirectoryDefault")%>icon-notifications-alert-grey-20.png" width="28" style="width: 28px;" /><span class="badge">3</span></a><ul class="menu"><a id="desktopNotification" href="#" class="notification"><img src="<%=getOption("metaResourceDirectoryDefault")%>icon-notifications-alert-grey-20.png" width="28" style="width: 28px;" /><span class="badge">3</span></a><li><span class="bar"></span><a href="#about"><img class="userIcon"                src="<%=getOption("metaResourceDirectoryDefault")%>icon-account-grey-20.png"/>&nbsp;&nbsp;yash@merkleinc.com</a><span class="bar"></span></li><li><a href="#careers">Logout</a></li></ul></div></div></div>'
// );
function popover(id, trigger, placement, content, template) {
  console.log($("#" + id));
  console.log(trigger);
  console.log(placement);
  console.log(content);
  console.log(template);
  $("#" + id).popover({
    trigger: trigger,
    placement: placement,
    content: content,
    template: template,
  });
  return $("#" + id).popover("show");
}
function loader(id) {
  $("#" + id).empty();
  $("#" + id).append(
    "<img class='loaderImg' src='http://zeus2embhapp90.embhdb.com/res/EMBH_Dev/Loader.gif' alt='Loader Image' width='70px' height='70px'/>"
  );
}
/* MultiStep Form Jquery Start */
function errorMessage(message) {
  $("#myModal").empty();
  $("#myModal").append(
    "<div class='modal-content'><span class='close'><img src='http://zeus2embhapp90.embhdb.com/res/EMBH_Dev/icon-close-yellow-15.png' class='closeImg' /></span><p><center>" +
      message +
      "</center></p></div>"
  );
  $("#myModal").css("display", "block");
  $(".close").on("click", function (e) {
    e.preventDefault();
    $("#myModal").css("display", "none");
  });
  $("body").on("click", function (e) {
    e.preventDefault();
    $("#myModal").css("display", "none");
  });
} //jQuery time
/* MultiStep Form Jquery End */ /* Error Message Modal Pop for 300 Start */ var current_fs,
  next_fs,
  previous_fs; //fieldsets
var left, opacity, scale; //fieldset properties which we will animate
var animating; //flag to prevent quick multi-click glitches

$(".next").click(function () {
  if (animating) return false;
  animating = true;

  current_fs = $(this).parent();
  next_fs = $(this).parent().next();
  //Highlight Previous indicator removed
  $("#progressbar li")
    .eq($("fieldset").index(current_fs))
    .removeClass("active");
  //activate next step on progressbar using the index of next_fs
  $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

  //show the next fieldset
  next_fs.show();
  //hide the current fieldset with style
  current_fs.animate(
    { opacity: 0 },
    {
      step: function (now, mx) {
        //as the opacity of current_fs reduces to 0 - stored in "now"
        //1. scale current_fs down to 80%
        scale = 1 - (1 - now) * 0.2;
        //2. bring next_fs from the right(50%)
        left = now * 50 + "%";
        //3. increase opacity of next_fs to 1 as it moves in
        opacity = 1 - now;
        current_fs.css({
          transform: "scale(" + scale + ")",
          position: "absolute",
        });
        next_fs.css({ left: left, opacity: opacity });
      },
      duration: 800,
      complete: function () {
        current_fs.hide();
        animating = false;
      },
      //this comes from the custom easing plugin
      easing: "easeInOutBack",
    }
  );
});

$(".previous").click(function () {
  if (animating) return false;
  animating = true;

  current_fs = $(this).parent();
  previous_fs = $(this).parent().prev();

  //de-activate current step on progressbar
  $("#progressbar li")
    .eq($("fieldset").index(current_fs))
    .removeClass("active");
  //Highlight Previous indicator removed
  $("#progressbar li").eq($("fieldset").index(previous_fs)).addClass("active");
  //show the previous fieldset
  previous_fs.show();
  //hide the current fieldset with style
  current_fs.animate(
    { opacity: 0 },
    {
      step: function (now, mx) {
        //as the opacity of current_fs reduces to 0 - stored in "now"
        //1. scale previous_fs from 80% to 100%
        scale = 0.8 + (1 - now) * 0.2;
        //2. take current_fs to the right(50%) - from 0%
        left = (1 - now) * 50 + "%";
        //3. increase opacity of previous_fs to 1 as it moves in
        opacity = 1 - now;
        current_fs.css({ left: left });
        previous_fs.css({
          transform: "scale(" + scale + ")",
          opacity: opacity,
        });
      },
      duration: 800,
      complete: function () {
        current_fs.hide();
        animating = false;
      },
      //this comes from the custom easing plugin
      easing: "easeInOutBack",
    }
  );
});

$(".submit").click(function () {
  return false;
});
/* MultiStep Form Jquery End */
