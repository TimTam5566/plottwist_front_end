/**
 * ============================================================
 * PLEDGEPROMPTS.JS - Writing Prompts for Pledges
 * ============================================================
 * 
 * Provides random writing prompts to inspire contributors.
 * 
 * USED BY: PledgeForm.jsx
 */

// Generic prompts for fallback
const genericPrompts = [
    "Introduce a new character with a secret.",
    "Describe a setting that feels slightly off.",
    "Add a line that changes the mood completely.",
    "Reveal something the main character doesn't know yet.",
    "Include a detail that hints at a past event.",
    "Write a moment of unexpected connection.",
    "Introduce a conflict without resolving it.",
    "Add a sensory detail that deepens the atmosphere.",
    "Include a metaphor that reshapes the reader's understanding.",
    "Let something go missing — and someone notice.",
    "Write a line that could be interpreted two ways.",
    "Introduce a question that no one wants to answer.",
    "Add a moment of silence that says everything.",
    "Reveal a character's fear through their actions.",
    "Include a symbol that might mean more later.",
    "Write a line that feels like a turning point.",
    "Let a character overhear something they shouldn't.",
    "Describe a change in the weather that mirrors emotion.",
    "Add a line that feels like foreshadowing.",
    "Introduce a recurring image or phrase.",
    "Let a character make a choice they'll regret.",
    "Include a moment of joy in an unexpected place.",
    "Write a line that could be the story's title.",
    "Add a contradiction that makes the reader pause.",
    "Reveal a truth through something mundane.",
    "Introduce a character who doesn't speak.",
    "Write a moment that feels like déjà vu.",
    "Include a line that could be a prophecy or warning.",
    "Let something break — physically or emotionally.",
    "End with a line that invites the next twist."
];

export const getWritingPrompt = (project, amount, contentType) => {
    const promptText = genericPrompts[Math.floor(Math.random() * genericPrompts.length)];
    return {
        promptText,
        pledgeText: `I pledge ${amount} ${amount === 1 ? contentType : contentType + 's'}`
    };
};
