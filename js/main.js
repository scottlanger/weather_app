$(document).ready(function() {
 
  
  $.get('http://www.nytimes.com/timeswire', function(res) { //get the html source of this website
    $(res.responseText).find('.entry-title ').each(function() { //loop though all h3 in the snippets list
      var anchor = $(this).children('a:last'); //get the actual link with the text inside
        
      jQuery('<li/>', { //build a li element
        html: jQuery('<a/>', { //with a A element inside it
                href: anchor.attr('href'), //set the href for the link
                text: anchor.text() //and the text
              })
      }).appendTo($('#jquery_snippets')); //append it to a list
    });
      
    $('#jquery_snippets li:first').remove(); //remove this first li ("Loading...") when done

    $('#jquery_snippets li').slice(1).hide();
  });
});
