# HTML & CSS Practices

## What is HTML & CSS?
HTML is the standard markup language used to **create web pages**. HTML elements are the *building blocks of web pages*, allowing developers to embed multimedia, create forms, and design the overall layout.

CSS stands for Cascading Style Sheets and it is used to **style web documents**. It controls the layout, colors, fonts, and overall look of a web page. CSS is also recommended by World Wide Web Consortium (W3C)[https://www.w3.org/].

The above information is from Geeks for Geeks. 

### Tips from Forums: 
*   Keep your style and your markup separate
*   Don’t use inline styles, and don’t use `<i>`or `<b>` tags for styling.
*   Group elements in `<div>` tags
*   Cheat sheets are great, but it would probably be best to reference the [official documentation](https://html.spec.whatwg.org/multipage/)
*   Code = easy to understand and efficient
*   Avoid IDs or complex selectors. If you can use classes only for everything, that’s easier to extend.
* For styling:
  *   Component Framework - Using something like Bootstrap, Foundation or Bulma and building on that.
  *   Utility Framework - Something like Tailwind CSS which focuses on writing as little CSS as possible, and moving styling to classes on HTML.
*   You should end up with a smaller css in the end, because you're not repeating rules for each component with similar-yet-different design.
*   Start with HTML first because CSS is used to interact with the HTML visually.
* Use notes. Seriously. In both CSS and HTML.
  *   ```
      <!--Here starts (section)-->

      <!--Here ends (section)-->

      //CSS for (section)

      //CSS for (section) mobile (0-768px)
      
      //CSS for (section) tablet (769-900px)
      ```


## Resources:
*   [FreeCodeCamp Forum](https://forum.freecodecamp.org/t/best-practices-in-html-css/37441)
*   [Reddit Forum](https://www.reddit.com/r/Frontend/comments/b0snvb/frontenders_of_reddit_whats_the_best_practice_of/)
*   [GeeksForGeeks: *Difference between HTML and CSS*](https://www.geeksforgeeks.org/css/difference-between-html-and-css/)
