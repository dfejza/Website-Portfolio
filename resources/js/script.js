var langaugeCookie = readCookie('language');
var selectedLanguage;
var currentPage = "page0";
var gitRepouri = 'https://api.github.com/users/dfejza';
var bitbucketRepouri = "https://api.bitbucket.org/2.0/users/dfejza";
var bitbucketRepouriRepo = "https://api.bitbucket.org/2.0/repositories/dfejza";
var json;
language = {
  ENGLISH : 0,
  JAPANESE : 1
}

// Startup function
$(document).ready(function(){

  $.getJSON("/resources/data/data.json", function(result){
    json = result;
  })
  .done( function() {
      //Load the cookies, remembering the last user seetting
      if(langaugeCookie== 'english')
      {
        $('#langSelect').val('english');
        selectedLanguage = language.ENGLISH;
        loadPage(currentPage);
      }
      else if(langaugeCookie== 'japanese')
      {
        $('#langSelect').val('japanese');
        selectedLanguage = language.JAPANESE;
        loadPage(currentPage);
      }
      else
      {
        selectedLanguage = language.ENGLISH;
        loadPage(currentPage)
      }
    });



  // Change text of the language select based off user lanuage
  $('#langSelect').on('change', function() {

    //on change set cookie and...
    setCookie('language', this.value, 365);

    var sel = $('#langSelect').val();

    if (sel == 'english') {
      selectedLanguage = language.ENGLISH;
      // Change the JS object pointer to english
      loadPage(currentPage);

    } else if (sel == 'japanese') {
      selectedLanguage = language.JAPANESE;
      // Change the JS object pointer to japanese
      loadPage(currentPage);

    }
  });

  // Click listener for the page selection
  $('ul').on('click', 'li.fake-link', function(){
    loadPage(this.id);
  });

});

// No matter the page, the header should remain the same
function formatPageHeader() {
  // Cycle through the navigation bar and change the language
  $('.navigationPages li').each(function(i,e){
    $(e).text(json.navigation[i][selectedLanguage]);
  });

}

// Make everything dynamic.
// Parse the json file and enumerate the page based off it's specs
function loadPage(pageNum){
  // remove the selected class
  $('#'+ currentPage).removeClass('active');
  // Show which page is selected by adding the css to the pageselection
  $('#'+ pageNum).last().addClass('active');
  
  // Global var keeping track of the page we are on
  currentPage = pageNum;

  // Set the language
  formatPageHeader();



  // Check which page. Goto specified formatting function
  if(currentPage=='page0'){
    formatPageHome();
  }
  if(currentPage=='page1'){
    formatPagePortfoilio();
  }
  if(currentPage=='page2'){
    formatAboutMe();
  }
}

function formatPageHome(){
  // Lets load the specified page into body
  $("#main").load(json.page0.contentRaw[selectedLanguage], function(){
  });
}

// Override to format the portfolio page
// Exercises GET
function formatPagePortfoilio(){

  $("#main").load("portfolio.html", function(){
    // Create a template using mustache
    var template = $("#projTemplate").html();    // Template for git proj

    // Format the HTML according to the JSON's Git User
    $('.portfolioHeader1 #username').append(json.page3.git.username);
    $('.portfolioHeader1 #username').attr('href', json.page3.git.usernameLink);
    $('.portfolioHeader1 #imgLink1').attr('href', json.page3.git.usernameLink);
    $('.portfolioHeader1 #repoCount').append(json.page1.repoCount[selectedLanguage] + " : " + json.page3.git.repoCount);
    $('.portfolioHeader1 #followers').append(json.page1.followers[selectedLanguage] + " : " + json.page3.git.followers);
    $('.portfolioHeader1 #following').append(json.page1.following[selectedLanguage] + " : " + json.page3.git.following);

    // Format the HTML according to the JSON's Bit Bucket User
    $('.portfolioHeader2 #username').append(json.page3.bitB.username);
    $('.portfolioHeader2 #username').attr('href', json.page3.bitB.usernameLink);
    $('.portfolioHeader2 #imgLink1').attr('href', json.page3.bitB.usernameLink);
    $('.portfolioHeader2 #repoCount').append(json.page1.repoCount[selectedLanguage] + " : " + json.page3.bitB.repoCount);
    $('.portfolioHeader2 #followers').append(json.page1.followers[selectedLanguage] + " : " + json.page3.bitB.followers);
    $('.portfolioHeader2 #following').append(json.page1.following[selectedLanguage] + " : " + json.page3.bitB.following);

    // Fetch each project GITHUB
    // Format the HTML according to the JSON's Git's repos
    $.each(json.page3.git.repos, function(key, data){
      // Fill in template
      var view = { name:        data.name,
       link:        data.link,
       image:       "",
       fullname:    data.name,
       description: data.description};

      // Create specialized object
      var rendered = Mustache.render(template, view);

      // Add the object
      $("#projects").append(rendered);
    });


    // Fetch each project BITBUCKET
    // Iterate through the array returned
    $.each(json.page3.bitB.repos, function(key, data){
      // Fill in template
      var view = { name:        data.name,
       link:        "",
       image:       "",
       fullname:    data.name,
       description: data.description};

      // Create specialized object
      var rendered = Mustache.render(template, view);

      // Add the object
      $("#projects").append(rendered);
    });

  });
}

function formatAboutMe(){
  // Lets load the specified page into body
  $("#main").load("aboutme.html", function(){

  });
}


// Remember the previous language selection and store in cookies
function saveLanguage(cookieValue) {
  var sel = document.getElementById('langSelect');
  setCookie('language', cookieValue, 365);
}

function setCookie(cookieName, cookieValue, nDays) {
  var today = new Date();
  var expire = new Date();

  if (nDays == null || nDays == 0)
    nDays = 1;

  expire.setTime(today.getTime() + 3600000 * 24 * nDays);
  document.cookie = cookieName + "=" + escape(cookieValue) + ";expires=" + expire.toGMTString();
}

function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}
