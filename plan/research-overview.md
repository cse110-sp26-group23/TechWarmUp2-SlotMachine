# Research Overview

## Purpose

Before starting AI-assisted development, our team spent time gathering research on both the slot machine domain and the software engineering practices that would help us build a better version of the game. The purpose of this phase was to avoid jumping straight into prompting and instead give ourselves a stronger foundation for planning, implementation, and evaluation. Since this warm-up is focused on whether AI can be used as an engineering tool, this research helps us define what kind of software we want, what quality standards matter, and what user needs we should keep in mind. 

Overall, the team’s research covered visual design, sound design, slot machine math and randomness, gambling regulations, frontend best practices, JavaScript quality standards, responsive design, testing, documentation, accessibility, language support, and user feedback. These topics give us a broader picture of both the product side and the engineering side of the project.

## Summary of Research

### Slot Machine Visuals
### Slot Machine Visuals
Research on slot machine visuals focused on the layout, symbols, buttons, animations, and overall theme of the interface. A major takeaway was that the visual design strongly affects first impressions, readability, and how polished the game feels. Important elements include symbols, paytables, and always-visible credit and payout information. The research also suggested that our team should choose a clear style direction, such as classic casino, arcade, minimal, or retro. This gives us better material for prompting AI to generate a UI that is more intentional and less generic.

### Slot Machine Sound Effects
Research on sound effects showed that audio plays a large role in making a slot machine feel engaging, responsive, and rewarding. Important sound categories include reel spinning sounds, reel stop ticks, win sounds, button clicks, and background audio. The main design takeaways were that sound should provide immediate feedback, stay balanced in volume, and always give the user the ability to mute or lower it. For our project, this means sound can help improve the feeling of the game, but it should not become overwhelming or annoying. 

### Slot Machine Math / RNG
The research on slot machine math and RNG focused on how outcomes should actually be generated. A major takeaway was that the spin result should be decided by code-based randomness first, while the animation should only reveal a result that has already been chosen. The research also highlighted important terms such as RTP, house edge, hit frequency, and volatility. These ideas are useful because they help us think more carefully about payout balance, fairness, and how the game should feel rather than treating outcomes as purely visual effects. The section also suggested separating RNG logic from the UI and testing the game with large spin simulations later. 

### Slot Machine Regulations
The regulation research looked at how real slot or gambling systems handle compliance, fairness, and user protection. It covered topics like age verification, geofencing, anti-spoofing measures, certified RNG, minimum spin times, payout transparency, and audit-ready logs. It also helps us think about which real-world design choices we may want to imitate and which ones are out of scope for a class project. 

### HTML/CSS Best Practices
Some of the main takeaways were to separate HTML from CSS, avoid inline styling, prefer classes over IDs when possible, write readable code, and document sections clearly with comments. The section also reviewed frontend framework options such as React, Tailwind CSS, and Angular, though for a small project the main value is likely in adopting clean structural habits rather than choosing a large framework. For our team, this research helps us keep the frontend more organized and easier to update. 

### JavaScript Best Practices
The JavaScript research focused on writing safer and more maintainable code. It emphasized using `let` and `const` instead of `var`, using strict equality with `===`, using linters and formatters like ESLint and Prettier, writing tests, and making comments meaningful. This aligns directly with the assignment’s focus on software engineering quality, because it guides us that the code should be readable, consistent, and easier to maintain as AI-generated code accumulates. 

### Responsive Web Design and Screen Resizing
The responsive design research focused on making the game usable across multiple devices and screen sizes. The main project takeaway is that the slot machine interface should remain readable and usable on smaller screens instead of only looking correct on a laptop-sized display. This section is especially relevant if our final project ends up with many interface elements such as buttons, paytables, counters, or side panels. 

### Testing
The testing research covered both unit testing and broader end-to-end testing, especially through Playwright. The main takeaway is that testing should be layered: basic logic should be covered by fast, isolated unit tests, while user interaction and browser behavior can be checked through end-to-end testing. For our project, this supports the assignment’s requirement that testing be part of the engineering process rather than something added only at the very end. 

### Code Documentation
The documentation research focused on making the codebase readable and maintainable for the team. It identified several forms of documentation, including inline comments, configuration files, documentation strings, API documentation, and the README. It also set a standard of using JSDoc for JavaScript files, including tags like `@param`, `@returns`, and `@type`. A major idea from this section is that documentation should explain **why** something is being done, while the code itself should make the **what** easier to understand. This is especially useful in a project where AI may generate code in inconsistent styles unless we define our standards clearly. 

### Accessibility and Language Support
This research focused on making the project usable by a wider range of users. The accessibility portion discussed semantic HTML, alt text, keyboard-friendly interaction, and the importance of considering users with visual, hearing, mobility, or cognitive disabilities. The language support portion introduced ideas like internationalization, localization, locale differences, text expansion, right-to-left layout concerns, and using the `lang` attribute correctly. For our project, this means accessibility and language support should be considered early instead of added later. 

### User Feedback
The user feedback research looked at what people often notice or complain about in slot-style experiences. Positive elements included graphics, win effects, sound, and free entry rewards. Common frustrations included aggressive monetization, too many ads, perceived unfairness, and crashing. The project takeaways are to preserve satisfying win feedback and rewards, while avoiding deposit-style pressure. This section is useful because it grounds our design choices in likely user reactions rather than only technical ideas. 

## Overall Takeaways

Across all sections, a few common themes appeared. First, the project should balance fun presentation with clean engineering. Visuals, sound, and reward feedback matter for engagement, but fairness, clear logic, testing, and maintainability are just as important. Second, the user experience should stay central. Responsive design, accessibility, readable interfaces, clear reward systems, and transparent outcomes all affect whether the final product feels polished or frustrating. Third, instead of asking for a vague slot machine implementation, we can now ask for features and code that reflect clearer standards around RNG logic, testing, documentation, UI feedback, and user-centered design.

This research phase also supports the larger goal of the assignment: using AI more tatically rather than relying on luck. Therefore, as a team, we now can understand a good output should look like and what software engineering practices we want to hold the project to. 

## Team Research Contributions

- **Nick Doan** — Slot Machine Visuals (`slot-machine-visuals`) 
- **Mohammed A** — Slot Machine Sound Effects (`slot-machine-sounds`)
- **Nick Doan** — Slot Machine Math / RNG (`slot-machine-math`)
- **Brendan Barber** — Slot Machine Regulations (`slot-machine-regulations`)
- **Sharana Sabesan** — HTML/CSS Best Practices (`html-css-practices`)
- **Timothy** — JavaScript Best Practices (`js-practices`)
- **Crystal Nguyen** — Responsive Web Design and Screen Resizing (`responsive-web-design`)
- **Neil Yang** — Testing (`testing`)
- **Asaki** — Code Documentation (`code-documentation`)
- **Beckham Yeoh** — Accessibility and Language Support (`accessibility-language-support`)
- **Jeremy** — User Feedback (`user-feedback`)

## How This Will Be Used

This research will guide the next phase of the project in several ways. It will help shape personas and user stories, strengthen the `ai-plan.md`, and give the team more specific language for prompting Claude Code. It also gives us a set of standards for reviewing AI-generated code, especially in areas like documentation, layout, testing, accessibility, and game logic. 