# Code Documentation
Code documentation is an integral part of software development because it serves as a guide for people interacting with the codebase. Effective documentation ensures software is readable, professional and navigable. In this project, proper documentation will allow our team to maintain source code and ensure that the AI’s generated code is consistent with our team’s engineering standards.

## Types of Code Documentation
* Code comments: inline annotations within the code that explain logic, clarify complex sections, or provide context
* Configuration Files: store a software project’s settings, preferences, or other configuration data
* Documentation Strings: special code comments embedded within code to document classes, functions, or modules
* Class/Module API documentation: describes classes or modules in codebase: purpose, functionality, attributes, methods, etc.
* Method/Function API documentation: individual methods or functions with classes or modules.
* README.md file: in the root directory detailing the project’s purpose, installation instructions, usage examples. It is usually written in Markdown format for easy formatting and readability

## Primary Goal
Our primary goal is to produce self-documenting code. This will be shown through clear variable names and functions so that the code's purpose is obvious.
- Purpose/Why?: Documentation should explain **why** it is doing something, the **what** can be ascertained by looking at the code itself.
- Consistency: Strict documentation rules will ensure that AI generates a consistent and uniform JSDoc style

## Technical Standards
We will use JSDoc for all JavaScript files.

### JSDoc specifications
- @param {type} name — To describe inputs.
- @returns {type} — To describe what the function outputs.
- @type {type} — To label variables or class properties.

**Standard Function Template**
```
/**
 * Brief description of the function's purpose.
 * @param {type} name - Description of the parameter.
 * @returns {type} Description of what is returned.
 * @throws {ErrorType} Description of when this error occurs (if applicable).
 */
```
**Standard File Template**
```
/**
 * @fileoverview (Brief description of file contents)
 * @author (Name of the student)
 * @part-of CSE 110 Tech Warm-Up 2
 */
```

## Effective Code Documentation Checklist
- [ ] Descriptive naming: Variables and functions must use names that are easy to read and representative of their function.
- [ ] JSDoc completeness: Every function must have a JSDoc block including @param, @returns, @type annotations
- [ ] File Headers: Every file must start with a @fileoverview that explains its specific purpose in the slot machine system.
- [ ] Inline Explanation: Uses inline comments to explain the **why** behind more complex logic.

### AI-Use Log Entry Check
To satisfy the 20-entry minimum, each entry in ai-use-log.md must include:
- [ ] Goal: What were we trying to build?
- [ ] Prompt: The exact instruction given to the AI.
- [ ] Reflection: Did it work? Did we have to "hand-edit"? 
- [ ] Commit Hash: A reference to the GitHub commit for that change.

## Sources
- [What is code documentation?](https://www.ibm.com/think/topics/code-documentation)
- [How to Write Good Documentation: Home](https://guides.lib.berkeley.edu/how-to-write-good-documentation)
- [@use JSDoc](https://jsdoc.app/about-getting-started)
- [Code Documentation Best Practices and Standards: A Complete Guide](https://blog.codacy.com/code-documentation)