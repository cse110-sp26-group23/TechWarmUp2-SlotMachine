# Accessibility & Language Support

![image of accessibility stuff](https://teaching.pitt.edu/wp-content/uploads/2024/03/accessibility-header.jpg)
##### Some icons may not be relevant in this topic

## Accessibility

Accessibility ensures that websites are usable by as many people as possible, regardless of their physical or cognitive abilities, and what device they are using. Accessibility benefits:
* Users on small screens.
* People with slow internet connections.
* People with disabilities.

### Why is it Important?
* **Human Rights:** Access to information and communications technologies, including the Web, is defined as a basic human right in the United Nations Convention on the Rights of Persons with Disabilities.
* **Legal Requirements:** Many countries have laws that mandate digital accessibility
* **Better for Everyone:** Web accessibility is required by law in many situations.

### Disabilities to Consider
* **Visual:** Blindness, low vision, and color blindness. Users may rely on screen readers or high-contrast modes.
* **Hearing:** Deafness. Users require captions or transcripts for audio/video.
* **Mobility:** Difficulty using a mouse or having limited fine motor control. Users may rely on keyboards to navigate the screen.
* **Cognitive:** Learning disabilities or memory issues. Users benefit from simple, consistent layouts and plain language.

### Implementation Strategy
The article [What is Accessibility?](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Accessibility/What_is_accessibility) emphasizes that accessibility should be considered from the start of a project rather than added as an afterthought so that the cost of making most content would be fairly minimal. 
* **Use Semantic HTML:** Use the "right tool for the right job" (e.g., use `<button>` for buttons, not `<div>`).
* **Provide Alternatives:** Include `alt` text for images and transcripts for multimedia.
* **Keyboard Friendly:** Ensure all interactive elements can be reached and triggered using only the `Tab` and `Enter` keys.
* **Test Early and Often:** Use automated auditing tools (like Lighthouse) and manual testing with screen readers.


## Language Support

Language support lets your app reach users across different languages and regions. Platforms like Lokalise, Crowdin, and Phrase help manage translations.

### Why is it Important?
* **Global Reach:** Supporting multiple languages expands your user base beyond English speakers.
* **User Experience:** People engage more with content in their native language.
* **Accessibility Overlap:** Proper language attributes help screen readers pronounce content correctly.
* **Legal Requirements:** Some countries (e.g. Canada, Belgium) require services in multiple official languages.

### Key Concepts
* **Internationalization (i18n):** Designing an app so it can be adapted to other languages.
* **Localization (l10n):** Actually adapting the app for a specific locale by translating text and formatting dates, numbers, and currencies.
* **Locale:** A combination of language and region (e.g. `en-US` vs. `en-GB`).

### Considerations
* **Text Expansion:** Translated text is often longer than the original, so layouts must be flexible.
* **Right-to-Left Languages:** Arabic and Hebrew require mirrored layouts.
* **Date and Number Formats:** `04/05/2026` means April 5 in the US but May 4 in Europe.
* **Character Encoding:** Always use UTF-8 to support all languages and emoji.

### Implementation Strategy
* **Set the `lang` Attribute:** Use `<html lang="en">` so browsers and screen readers handle content correctly.
* **Externalize Strings:** Store translations in separate files rather than hard-coding text.
* **Use an i18n Library:** Tools like `i18next` or `react-intl` handle lookup, pluralization, and formatting.
* **Use `Intl` APIs:** `Intl.DateTimeFormat` and `Intl.NumberFormat` format dates and numbers per locale.
* **Let Users Choose:** Provide a visible language switcher and remember the user's choice.
