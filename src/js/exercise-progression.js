// src/js/exercise-progression.js
document.addEventListener('DOMContentLoaded', () => {
    const resultArea = document.getElementById('result');

    if (!resultArea) {
        console.error('Result area not found for exercise progression observer.');
        return;
    }

    // To keep track of the inner observer for speaking exercises, if active
    let speechOutcomeObserverInstance = null;

    const mainObserver = new MutationObserver((mutationsList, obs) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {

                // --- Logic for showMatchArticlesWords (Grammar - Gender) ---
                const articlesCol = resultArea.querySelector('#articles-col');
                const wordsCol = resultArea.querySelector('#words-col');
                let matchArticlesWordsExercise = null;
                if (articlesCol && wordsCol) {
                    matchArticlesWordsExercise = articlesCol.closest('.match-exercise');
                }

                if (matchArticlesWordsExercise) {
                    console.log('MutationObserver: showMatchArticlesWords detected.');
                    const newMatchButton = matchArticlesWordsExercise.querySelector('#new-match');
                    if (newMatchButton) newMatchButton.style.display = 'none';

                    const checkMatchesButton = matchArticlesWordsExercise.querySelector('#check-matches');
                    if (checkMatchesButton && !checkMatchesButton.dataset.progressionAdded) {
                        checkMatchesButton.dataset.progressionAdded = 'true';
                        checkMatchesButton.addEventListener('click', () => {
                            setTimeout(() => {
                                if (document.querySelector('.match-exercise #articles-col')) {
                                    console.log('Auto-progressing from showMatchArticlesWords (check all)');
                                    if (typeof startGenderPractice === 'function') startGenderPractice();
                                    else console.error('startGenderPractice is not defined.');
                                }
                            }, 3000);
                        });
                    }

                    const itemsToMatch = matchArticlesWordsExercise.querySelectorAll('.match-item');
                    const allCurrentlyMatchedGender = itemsToMatch.length > 0 && Array.from(itemsToMatch).every(item => item.classList.contains('matched'));
                    if (allCurrentlyMatchedGender && !matchArticlesWordsExercise.dataset.allMatchedProgression) {
                         matchArticlesWordsExercise.dataset.allMatchedProgression = 'true';
                         setTimeout(() => {
                             if (document.querySelector('.match-exercise #articles-col')) {
                                 console.log('Auto-progressing from showMatchArticlesWords (all matched)');
                                 if (typeof startGenderPractice === 'function') startGenderPractice();
                                 else console.error('startGenderPractice is not defined.');
                             }
                         }, 2000);
                    }
                }

                // --- Logic for showSelectArticleExercise (Grammar - Gender) ---
                const selectArticleExercise = resultArea.querySelector('.select-article-exercise');
                if (selectArticleExercise) {
                    console.log('MutationObserver: showSelectArticleExercise detected.');
                    const newSelectArticleButton = selectArticleExercise.querySelector('#new-select-article-exercise');
                    if (newSelectArticleButton) newSelectArticleButton.style.display = 'none';

                    const articleOptionButtons = selectArticleExercise.querySelectorAll('.article-option-btn');
                    articleOptionButtons.forEach(button => {
                        if (!button.dataset.progressionAdded) {
                            button.dataset.progressionAdded = 'true';
                            button.addEventListener('click', () => {
                                setTimeout(() => {
                                    if (document.querySelector('.select-article-exercise')) {
                                        console.log('Auto-progressing from showSelectArticleExercise');
                                        if (typeof startGenderPractice === 'function') startGenderPractice();
                                        else console.error('startGenderPractice is not defined.');
                                    }
                                }, 1500);
                            });
                        }
                    });
                }

                // --- Logic for showTypeVerb (Grammar - Verbs) ---
                const typeVerbExercise = resultArea.querySelector('.verb-exercise');
                if (typeVerbExercise && typeVerbExercise.querySelector('#check-verb-answer-btn')) {
                    console.log('MutationObserver: showTypeVerb detected.');
                    const newVerbExerciseButton = typeVerbExercise.querySelector('#new-verb-exercise');
                    if (newVerbExerciseButton) newVerbExerciseButton.style.display = 'none';

                    const checkVerbButton = typeVerbExercise.querySelector('#check-verb-answer-btn');
                    if (checkVerbButton && !checkVerbButton.dataset.progressionAdded) {
                        checkVerbButton.dataset.progressionAdded = 'true';
                        checkVerbButton.addEventListener('click', () => {
                            setTimeout(() => {
                                if (document.querySelector('.verb-exercise #check-verb-answer-btn')) {
                                    console.log('Auto-progressing from showTypeVerb');
                                    if (typeof startVerbsPractice === 'function') startVerbsPractice();
                                    else console.error('startVerbsPractice is not defined.');
                                }
                            }, 2000);
                        });
                    }
                }

                // --- Logic for showMatchVerbsPronouns (Grammar - Verbs) ---
                const promptsCol = resultArea.querySelector('#prompts-col');
                const answersCol = resultArea.querySelector('#answers-col');
                let matchVerbsPronounsExercise = null;
                if (promptsCol && answersCol) {
                    matchVerbsPronounsExercise = promptsCol.closest('.match-exercise');
                }

                if (matchVerbsPronounsExercise) {
                    console.log('MutationObserver: showMatchVerbsPronouns detected.');
                    const newMatchButtonVerb = matchVerbsPronounsExercise.querySelector('#new-match');
                    if (newMatchButtonVerb) newMatchButtonVerb.style.display = 'none';

                    const checkMatchesButtonVerb = matchVerbsPronounsExercise.querySelector('#check-matches');
                    if (checkMatchesButtonVerb && !checkMatchesButtonVerb.dataset.progressionAdded) {
                        checkMatchesButtonVerb.dataset.progressionAdded = 'true';
                        checkMatchesButtonVerb.addEventListener('click', () => {
                            setTimeout(() => {
                                if (document.querySelector('.match-exercise #prompts-col')) {
                                    console.log('Auto-progressing from showMatchVerbsPronouns (check all)');
                                     if (typeof startVerbsPractice === 'function') startVerbsPractice();
                                     else console.error('startVerbsPractice is not defined.');
                                }
                            }, 3000);
                        });
                    }

                    const itemsToMatchVerbs = matchVerbsPronounsExercise.querySelectorAll('.match-item');
                    const allCurrentlyMatchedVerbs = itemsToMatchVerbs.length > 0 && Array.from(itemsToMatchVerbs).every(item => item.classList.contains('matched'));
                    if (allCurrentlyMatchedVerbs && !matchVerbsPronounsExercise.dataset.allMatchedProgression) {
                         matchVerbsPronounsExercise.dataset.allMatchedProgression = 'true';
                         setTimeout(() => {
                             if (document.querySelector('.match-exercise #prompts-col')) {
                                 console.log('Auto-progressing from showMatchVerbsPronouns (all matched)');
                                 if (typeof startVerbsPractice === 'function') startVerbsPractice();
                                 else console.error('startVerbsPractice is not defined.');
                             }
                         }, 2000);
                    }
                }

                // --- Logic for showFillGaps (Grammar - Verbs) ---
                const fillGapExercise = resultArea.querySelector('.fill-gap-exercise');
                if (fillGapExercise) {
                    console.log('MutationObserver: showFillGaps detected.');
                    const newGapButton = fillGapExercise.querySelector('#new-gap');
                    if (newGapButton) newGapButton.style.display = 'none';

                    const checkGapButton = fillGapExercise.querySelector('#check-gap');
                    if (checkGapButton && !checkGapButton.dataset.progressionAdded) {
                        checkGapButton.dataset.progressionAdded = 'true';
                        checkGapButton.addEventListener('click', () => {
                            setTimeout(() => {
                                if (document.querySelector('.fill-gap-exercise')) {
                                    console.log('Auto-progressing from showFillGaps');
                                    if (typeof startVerbsPractice === 'function') startVerbsPractice();
                                    else console.error('startVerbsPractice is not defined.');
                                }
                            }, 2000);
                        });
                    }
                }

                // --- Logic for showWordOrder (Grammar - Verbs) ---
                const wordOrderExercise = resultArea.querySelector('.word-order-exercise');
                if (wordOrderExercise) {
                    console.log('MutationObserver: showWordOrder detected.');
                    const newOrderButton = wordOrderExercise.querySelector('#new-order');
                    if (newOrderButton) newOrderButton.style.display = 'none';

                    const checkOrderButton = wordOrderExercise.querySelector('#check-order');
                    if (checkOrderButton && !checkOrderButton.dataset.progressionAdded) {
                        checkOrderButton.dataset.progressionAdded = 'true';
                        checkOrderButton.addEventListener('click', () => {
                            setTimeout(() => {
                                if (document.querySelector('.word-order-exercise')) {
                                    console.log('Auto-progressing from showWordOrder');
                                    if (typeof startVerbsPractice === 'function') startVerbsPractice();
                                    else console.error('startVerbsPractice is not defined.');
                                }
                            }, 3000);
                        });
                    }
                }

                // --- Logic for showQuestionWriting (Writing) ---
                const writingExerciseContainer = resultArea.querySelector('.writing-exercise-container');
                if (writingExerciseContainer) {
                    const submitWritingAnswerButton = writingExerciseContainer.querySelector('#submit-writing-answer-btn');
                    if (submitWritingAnswerButton) {
                        console.log('MutationObserver: showQuestionWriting detected.');
                        // Progression listener (already added in previous step)
                        if (!submitWritingAnswerButton.dataset.progressionAdded) {
                            submitWritingAnswerButton.dataset.progressionAdded = 'true';
                            submitWritingAnswerButton.addEventListener('click', () => {
                                setTimeout(() => {
                                    if (document.querySelector('.writing-exercise-container #submit-writing-answer-btn')) {
                                        console.log('Auto-progressing from showQuestionWriting');
                                        if (typeof startRandomWritingPractice === 'function') startRandomWritingPractice();
                                        else console.error('startRandomWritingPractice is not defined.');
                                    }
                                }, 2500);
                            });
                        }
                        // Enter key support for textarea
                        const writingAnswerArea = writingExerciseContainer.querySelector('#writing-answer-area');
                        if (writingAnswerArea && !writingAnswerArea.dataset.enterKeyAdded) {
                            writingAnswerArea.dataset.enterKeyAdded = 'true';
                            writingAnswerArea.addEventListener('keydown', function(e) {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    submitWritingAnswerButton.click();
                                }
                            });
                            console.log('Enter key support added for writing answer area.');
                        }
                    }
                }
                // --- End Logic for showQuestionWriting ---

                // --- Logic for showTranscribeWord (Vocabulary - Listening) ---
                const listeningExerciseParent = resultArea.querySelector('.listening-exercise');
                if (listeningExerciseParent) {
                    const checkTranscriptionButton = listeningExerciseParent.querySelector('#check-transcription');
                    // This check helps differentiate showTranscribeWord from showMatchSoundWord if it also uses .listening-exercise
                    if (checkTranscriptionButton) {
                        console.log('MutationObserver: showTranscribeWord detected.');
                        // Enter key support for input
                        const transcriptionInput = listeningExerciseParent.querySelector('#transcription');
                        if (transcriptionInput && !transcriptionInput.dataset.enterKeyAdded) {
                            transcriptionInput.dataset.enterKeyAdded = 'true';
                            transcriptionInput.addEventListener('keydown', function(e) {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    checkTranscriptionButton.click();
                                }
                            });
                            console.log('Enter key support added for transcription input.');
                        }
                    }
                }
                // --- End Logic for showTranscribeWord ---

                // --- Logic for showQuestionPractice (Speaking) ---
                const speakingExerciseContainer = resultArea.querySelector('.speaking-exercise-container');
                if (speakingExerciseContainer && speakingExerciseContainer.querySelector('#speaking-record-btn')) {
                    console.log('MutationObserver: showQuestionPractice detected.');
                    if (!speakingExerciseContainer.dataset.progressionListenerAttached) {
                        speakingExerciseContainer.dataset.progressionListenerAttached = 'true';

                        const feedbackDiv = speakingExerciseContainer.querySelector('#speaking-feedback');
                        const transcriptDiv = speakingExerciseContainer.querySelector('#speaking-transcript');
                        let progressionTimeoutId = null;

                        const triggerProgression = () => {
                            if (progressionTimeoutId) clearTimeout(progressionTimeoutId);
                            progressionTimeoutId = setTimeout(() => {
                                if (document.querySelector('.speaking-exercise-container #speaking-record-btn') &&
                                    !speakingExerciseContainer.dataset.progressionTriggered) {

                                    speakingExerciseContainer.dataset.progressionTriggered = 'true';
                                    console.log('Auto-progressing from showQuestionPractice');
                                    if (typeof startRandomSpeakingPractice === 'function') startRandomSpeakingPractice();
                                    else console.error('startRandomSpeakingPractice is not defined.');
                                }
                            }, 3000);
                        };

                        if (speechOutcomeObserverInstance) {
                            speechOutcomeObserverInstance.disconnect();
                        }

                        speechOutcomeObserverInstance = new MutationObserver(() => {
                            if ((feedbackDiv && feedbackDiv.textContent.trim() !== "") || (transcriptDiv && transcriptDiv.textContent.trim() !== "")) {
                                triggerProgression();
                            }
                        });

                        if (feedbackDiv) {
                            speechOutcomeObserverInstance.observe(feedbackDiv, { childList: true, characterData: true, subtree: true });
                        }
                        if (transcriptDiv) {
                            speechOutcomeObserverInstance.observe(transcriptDiv, { childList: true, characterData: true, subtree: true });
                        }

                        const prevQuestionBtn = speakingExerciseContainer.querySelector('#prev-speaking-question-btn');
                        const nextQuestionBtn = speakingExerciseContainer.querySelector('#next-speaking-question-btn');
                        const resetProgressionFlags = () => {
                            console.log('Resetting speaking progression flags due to question navigation.');
                            speakingExerciseContainer.removeAttribute('data-progression-triggered');
                            if (progressionTimeoutId) clearTimeout(progressionTimeoutId);
                        };
                        if(prevQuestionBtn) prevQuestionBtn.addEventListener('click', resetProgressionFlags);
                        if(nextQuestionBtn) nextQuestionBtn.addEventListener('click', resetProgressionFlags);
                    }
                } else {
                    if (speechOutcomeObserverInstance) {
                        console.log('Disconnecting speechOutcomeObserverInstance as speaking exercise is no longer detected.');
                        speechOutcomeObserverInstance.disconnect();
                        speechOutcomeObserverInstance = null;
                    }
                    const oldSpeakingContainer = resultArea.querySelector('[data-progression-listener-attached].speaking-exercise-container');
                    if(oldSpeakingContainer) {
                        oldSpeakingContainer.removeAttribute('data-progression-listener-attached');
                        oldSpeakingContainer.removeAttribute('data-progression-triggered');
                    }
                }
                // --- End Logic for showQuestionPractice ---
            }
        }
    });

    mainObserver.observe(resultArea, { childList: true, subtree: true });
    console.log('General exercise progression observer initialized and updated for verbs, writing, speaking and enter key support.');
});
