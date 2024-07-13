export const generatePromptForQuestion = (topic) => `
Generate 5 short questions based on the topic ${topic}. Remove any greetings and other formality, just the content with no other text.
For each question, provide four options (A, B, C, D) and indicate the correct option. 
Format the response as three vectors: 
1. The first vector contains the questions. 
2. The second vector contains the options for each question (four options per question). 
3. The third vector contains the correct option for each question.
For example if the question topic was sun then return the response in this format:
## Questions:

1. What is the Sun primarily composed of?
2. What is the process that powers the Sun?
3. What is the outermost layer of the Sun's atmosphere called?
4. What is the name of the Sun's surface?
5. What is the Sun's closest star?

## Options:

1. A) Oxygen and Carbon Dioxide  B) Hydrogen and Helium  C) Nitrogen and Oxygen  D) Iron and Nickel
2. A) Nuclear Fission  B) Chemical Reactions  C) Nuclear Fusion  D) Combustion
3. A) Photosphere  B) Chromosphere  C) Corona  D) Convection Zone
4. A) Chromosphere  B) Corona  C) Photosphere  D) Core
5. A) Alpha Centauri  B) Sirius  C) Proxima Centauri  D) Betelgeuse

## Correct Options:

1. B)
2. C)
3. C)
4. C)
5. C)
`;

export const generatePromptForFact = () =>
  `"Give me one fun fact, remove any greetings and other formality, just the content with no other text."`;
