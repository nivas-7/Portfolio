/**
 * Typing effect controller for the hero section.
 * Cycles through an array of phrases, typing and deleting
 * each one character at a time.
 */
const TypingEffect = (() => {
  let phrases = [];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let timeoutId = null;

  const TYPING_SPEED = 90; // ms per character while typing
  const DELETING_SPEED = 45; // ms per character while deleting
  const PAUSE_AFTER_TYPED = 1800; // ms to pause once a phrase is fully typed
  const PAUSE_AFTER_DELETED = 400; // ms to pause once a phrase is fully deleted

  const tick = (targetEl) => {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      charIndex -= 1;
    } else {
      charIndex += 1;
    }

    targetEl.textContent = currentPhrase.substring(0, charIndex);

    let delay = isDeleting ? DELETING_SPEED : TYPING_SPEED;

    if (!isDeleting && charIndex === currentPhrase.length) {
      // Finished typing this phrase — pause, then start deleting
      delay = PAUSE_AFTER_TYPED;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      // Finished deleting — move to next phrase, pause briefly, then type
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = PAUSE_AFTER_DELETED;
    }

    timeoutId = setTimeout(() => tick(targetEl), delay);
  };

  /**
   * Starts the typing effect on the given element.
   * @param {HTMLElement} targetEl - element to type text into
   * @param {string[]} phraseList - array of phrases to cycle through
   */
  const start = (targetEl, phraseList) => {
    if (!targetEl || !Array.isArray(phraseList) || phraseList.length === 0) return;

    // Reset state in case start() is called more than once
    stop();
    phrases = phraseList;
    phraseIndex = 0;
    charIndex = 0;
    isDeleting = false;

    tick(targetEl);
  };

  /**
   * Stops the typing effect and clears any pending timeout.
   */
  const stop = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return { start, stop };
})();