# JavaScript Practices

## What is JavaScript?

JavaScript (JS) is a lightweight, interpreted programming language. It is the primary scripting language for web development, but it is also used in other non-browser environments, such as Node.js.

Alongside HTML and CSS, JavaScript is considered one of the **three core technologies of the web**. HTML defines the document structure and CSS controls its appearance while JavaScript handles the actual behavior: clickable buttons, live updates, etc. It is standardized through the ECMAScript standard.

---

### Common JavaScript Frameworks & Libraries

The JavaScript ecosystem is fairly fragmented, with many many libraries and frameworks in use across the internet. Some of the most popular ones are React, Angular, Vue.js, and Svelte.

---

### Tips from Forums & Developers

*   **Use `let` and `const` — never `var`.** `const` for constants and `let` for changeable variables.
    > Source: [JetBrains WebStorm Blog](https://blog.jetbrains.com/webstorm/2024/10/javascript-best-practices-2024/)

*   **Always use strict equality (`===`).** Unless you specifically need this behavior, using loose equality (`==`) performs type coersions that are almost always unnecessary and potentially harmfil.
    > Source: [JetBrains WebStorm Blog](https://blog.jetbrains.com/webstorm/2024/10/javascript-best-practices-2024/)

*   **Use a linter and formatter.** Tools like **ESLint** catch errors and enforce consistent style rules. Tools **Prettier** handle code formatting for readability.
    > Source: [Stack Overflow Blog](https://stackoverflow.blog/2019/09/12/practical-ways-to-write-better-javascript/)

*   **Write tests.** Writing tests is a great way to catch issues automatically and before production.
    > Source: [Stack Overflow Blog](https://stackoverflow.blog/2019/09/12/practical-ways-to-write-better-javascript/)

*   **Write good comments.** Good comments explain *why* code does something (or javadoc style comments that describe how to use it), not just what it does. If you can't tell what the code does without a comment it is likely bad code that shouldn't exist.
    > Source: [MDN – What is JavaScript?](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/What_is_JavaScript)

---

## Resources

*   [MDN Web Docs - JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
*   [Stack Overflow Developer Survey 2025](https://survey.stackoverflow.co/2025)
*   [JetBrains WebStorm Blog - JavaScript Best Practices 2024](https://blog.jetbrains.com/webstorm/2024/10/javascript-best-practices-2024/)
*   [Stack Overflow Blog - Practical Ways to Write Better JavaScript](https://stackoverflow.blog/2019/09/12/practical-ways-to-write-better-javascript/)
*   [Contentful - Best JavaScript Frameworks in 2025](https://www.contentful.com/blog/best-javascript-frameworks/)
*   [Strapi - Best JavaScript Frameworks for 2026](https://strapi.io/blog/best-javascript-frameworks)