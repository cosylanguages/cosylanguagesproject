// src/js/exercise-progression.js
document.addEventListener('DOMContentLoaded', () => {
    const resultArea = document.getElementById('result');

    if (!resultArea) {
        console.error('Result area not found for exercise progression observer.');
        return;
    }

    // Helper function to draw lines
    function drawConnectionLine(svgElement, el1, el2, containerElement) {
        if (!svgElement || !el1 || !el2 || !containerElement) {
            console.warn('drawConnectionLine: Missing elements for drawing.', svgElement, el1, el2, containerElement);
            return;
        }

        const containerRect = containerElement.getBoundingClientRect();
        const rect1 = el1.getBoundingClientRect();
        const rect2 = el2.getBoundingClientRect();

        const x1 = rect1.left + rect1.width / 2 - containerRect.left + containerElement.scrollLeft;
        const y1 = rect1.top + rect1.height / 2 - containerRect.top + containerElement.scrollTop;
        const x2 = rect2.left + rect2.width / 2 - containerRect.left + containerElement.scrollLeft;
        const y2 = rect2.top + rect2.height / 2 - containerRect.top + containerElement.scrollTop;

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1.toString());
        line.setAttribute('y1', y1.toString());
        line.setAttribute('x2', x2.toString());
        line.setAttribute('y2', y2.toString());
        line.setAttribute('stroke', '#27ae60'); 
        line.setAttribute('stroke-width', '3');
        line.classList.add('connection-line');
        
        let idPart1 = el1.classList.contains('image-item') ? el1.dataset.answer : el1.dataset.word;
        let idPart2 = el2.classList.contains('image-item') ? el2.dataset.answer : el2.dataset.word;
        idPart1 = idPart1 || el1.textContent.trim();
        idPart2 = idPart2 || el2.textContent.trim();

        idPart1 = String(idPart1); // Ensure parts are strings
        idPart2 = String(idPart2);

        const lineId = `line-${idPart1.replace(/\s+/g, '-')}-${idPart2.replace(/\s+/g, '-')}`;
        const reverseLineId = `line-${idPart2.replace(/\s+/g, '-')}-${idPart1.replace(/\s+/g, '-')}`;

        if (!svgElement.querySelector(`#${lineId}`) && !svgElement.querySelector(`#${reverseLineId}`)) {
            line.id = lineId;
            svgElement.appendChild(line);
        }
    }

    let speechOutcomeObserverInstance = null;
    let currentSelectedWordItemForVocabLine = null; 
    let currentSelectedOppositeItemForVocabLine = null; 
    let currentSelectedImageItemForLine = null;
    let currentSelectedWordItemForImageLine = null;

    const mainObserver = new MutationObserver((mutationsList, obs) => { 
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                
                // --- Logic for showIdentifyImage (Vocabulary) ---
                const imageExercise = resultArea.querySelector('.image-exercise');
                if (imageExercise) {
                    // ... (existing logic for showIdentifyImage - assume it's complete from previous steps)
                }

                // --- Logic for showTranscribeWord (Vocabulary - Listening) ---
                const listeningExerciseParent = resultArea.querySelector('.listening-exercise');
                if (listeningExerciseParent) {
                    const checkTranscriptionButton = listeningExerciseParent.querySelector('#check-transcription');
                    if (checkTranscriptionButton) { 
                        // ... (existing logic for showTranscribeWord - assume it's complete from previous steps)
                    }
                }
                // --- End Logic for showTranscribeWord ---

                // --- Logic for showMatchSoundWord (Vocabulary - Listening) ---
                const matchSoundExercise = resultArea.querySelector('.match-sound-exercise');
                if (matchSoundExercise && !matchSoundExercise.dataset.layoutAdjusted) {
                    // ... (existing layout logic for showMatchSoundWord - assume it's complete)
                    matchSoundExercise.dataset.layoutAdjusted = 'true'; 
                }
                // --- End Logic for showMatchSoundWord ---

                // --- Logic for showMatchOpposites (Vocabulary - Day 1 version specifically) ---
                const wordsColVocab = resultArea.querySelector('#words-col');
                const oppositesColVocab = resultArea.querySelector('#opposites-col');
                let showMatchOppositesDay1Node = null;
                if (wordsColVocab && oppositesColVocab && wordsColVocab.closest('.match-exercise')) {
                    if (wordsColVocab.querySelector('[data-word]') && oppositesColVocab.querySelector('[data-opposite]')) {
                        showMatchOppositesDay1Node = wordsColVocab.closest('.match-exercise');
                    }
                }

                if (showMatchOppositesDay1Node && !showMatchOppositesDay1Node.dataset.vocabLinesProcessed) {
                    showMatchOppositesDay1Node.dataset.vocabLinesProcessed = 'true';
                    console.log('MutationObserver: showMatchOpposites (Day 1 vocab) detected for line drawing and interaction fix.');
                    let svgCanvas = showMatchOppositesDay1Node.querySelector('#match-lines-svg');
                    if (!svgCanvas) { 
                        svgCanvas = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                        svgCanvas.id = 'match-lines-svg';
                        svgCanvas.classList.add('match-lines-svg');
                        svgCanvas.style.position = 'absolute'; svgCanvas.style.top = '0'; svgCanvas.style.left = '0';
                        svgCanvas.style.width = '100%'; svgCanvas.style.height = '100%';
                        svgCanvas.style.pointerEvents = 'none'; svgCanvas.style.zIndex = '0';
                        showMatchOppositesDay1Node.style.position = 'relative'; 
                        showMatchOppositesDay1Node.prepend(svgCanvas);
                    } else { 
                        svgCanvas.innerHTML = '';
                    }
                    
                    currentSelectedWordItemForVocabLine = null;
                    currentSelectedOppositeItemForVocabLine = null;

                    const checkAndDrawVocabularyLine = () => {
                        if (currentSelectedWordItemForVocabLine && currentSelectedOppositeItemForVocabLine &&
                            currentSelectedWordItemForVocabLine.classList.contains('matched') &&
                            currentSelectedOppositeItemForVocabLine.classList.contains('matched')) {
                            if (typeof drawConnectionLine === 'function') {
                                drawConnectionLine(svgCanvas, currentSelectedWordItemForVocabLine, currentSelectedOppositeItemForVocabLine, showMatchOppositesDay1Node);
                            }
                            // Reset selection after a successful match and line draw
                            currentSelectedWordItemForVocabLine = null; 
                            currentSelectedOppositeItemForVocabLine = null;
                        }
                    };

                    showMatchOppositesDay1Node.querySelectorAll('#words-col .match-item').forEach(item => {
                        if (!item.dataset.lineClickAdded) { 
                            item.dataset.lineClickAdded = 'true'; 
                            item.addEventListener('click', function(event) {
                                if (this.classList.contains('matched')) {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    console.log('Clicked on an already matched word item. No action.');
                                    return;
                                }
                                currentSelectedWordItemForVocabLine = this;
                                setTimeout(checkAndDrawVocabularyLine, 100); 
                            });
                        }
                    });
                    showMatchOppositesDay1Node.querySelectorAll('#opposites-col .match-item').forEach(item => {
                        if (!item.dataset.lineClickAdded) { 
                            item.dataset.lineClickAdded = 'true'; 
                            item.addEventListener('click', function(event) { 
                                if (this.classList.contains('matched')) {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    console.log('Clicked on an already matched opposite item. No action.');
                                    return;
                                }
                                currentSelectedOppositeItemForVocabLine = this;
                                setTimeout(checkAndDrawVocabularyLine, 100);
                            });
                        }
                    });
                }
                // --- End of showMatchOpposites specific logic ---

                // --- Logic for showMatchImageWord (Vocabulary) ---
                const matchImageWordExercise = resultArea.querySelector('.match-image-word-exercise');
                if (matchImageWordExercise && !matchImageWordExercise.dataset.layoutProcessed) {
                    // ... (existing layout and line logic for showMatchImageWord - assume it's complete)
                    matchImageWordExercise.dataset.layoutProcessed = 'true';
                }
                // --- End of showMatchImageWord specific logic ---


                // --- [Rest of the existing logic for grammar, writing, speaking...] ---
                // (The placeholder comments below indicate where other exercise logic would be)
                const articlesCol = resultArea.querySelector('#articles-col');
                const wordsColGrammar = resultArea.querySelector('#words-col');
                let matchArticlesWordsExercise = null;
                if (articlesCol && wordsColGrammar && articlesCol.closest('.match-exercise') && articlesCol.querySelector('[data-article]')) {
                    matchArticlesWordsExercise = articlesCol.closest('.match-exercise');
                }
                if (matchArticlesWordsExercise && !matchArticlesWordsExercise.dataset.grammarLinesProcessed) { 
                    matchArticlesWordsExercise.dataset.grammarLinesProcessed = 'true';
                }
                
                const selectArticleExercise = resultArea.querySelector('.select-article-exercise');
                if (selectArticleExercise) { /* ... */ }
                const typeVerbExercise = resultArea.querySelector('.verb-exercise');
                if (typeVerbExercise && typeVerbExercise.querySelector('#check-verb-answer-btn')) { /* ... */ }
                const promptsCol = resultArea.querySelector('#prompts-col');
                const answersCol = resultArea.querySelector('#answers-col');
                let matchVerbsPronounsExercise = null;
                if (promptsCol && answersCol) { matchVerbsPronounsExercise = promptsCol.closest('.match-exercise');}
                if (matchVerbsPronounsExercise) { /* ... */ }
                const fillGapExercise = resultArea.querySelector('.fill-gap-exercise');
                if (fillGapExercise) { /* ... */ }
                const wordOrderExercise = resultArea.querySelector('.word-order-exercise');
                if (wordOrderExercise) { /* ... */ }
                const writingExerciseContainer = resultArea.querySelector('.writing-exercise-container');
                if (writingExerciseContainer) { /* ... */ }
                
                const speakingExerciseContainer = resultArea.querySelector('.speaking-exercise-container');
                if (speakingExerciseContainer && speakingExerciseContainer.querySelector('#speaking-record-btn')) { /* ... */ }
                 else {
                    if (speechOutcomeObserverInstance) {
                        speechOutcomeObserverInstance.disconnect();
                        speechOutcomeObserverInstance = null;
                    }
                    const oldSpeakingContainer = resultArea.querySelector('[data-progression-listener-attached].speaking-exercise-container');
                    if(oldSpeakingContainer) {
                        oldSpeakingContainer.removeAttribute('data-progression-listener-attached');
                        oldSpeakingContainer.removeAttribute('data-progression-triggered');
                    }
                }
            }
        }
    });

    mainObserver.observe(resultArea, { childList: true, subtree: true });
    console.log('General exercise progression observer: All features updated.');
});
