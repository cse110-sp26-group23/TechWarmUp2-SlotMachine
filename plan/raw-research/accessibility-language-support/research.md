# Accessibility & Language Support

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
