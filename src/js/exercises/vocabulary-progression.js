// src/js/exercises/vocabulary-progression.js
document.addEventListener('DOMContentLoaded', () => {
    const resultArea = document.getElementById('result');

    if (!resultArea) {
        console.error('Result area not found for vocabulary progression observer.');
        return;
    }

    const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {

                // --- Logic for showOppositesExercise ---
                const oppositesExercise = resultArea.querySelector('.opposites-exercise');
                if (oppositesExercise) {
                    const checkOppositeButton = document.getElementById('check-opposite');
                    const newOppositeButton = document.getElementById('new-opposite');

                    if (newOppositeButton) {
                        newOppositeButton.style.display = 'none';
                    }

                    if (checkOppositeButton && !checkOppositeButton.dataset.progressionAdded) {
                        checkOppositeButton.dataset.progressionAdded = 'true'; // Mark as processed
                        checkOppositeButton.addEventListener('click', () => {
                            // Determine if feedback is correct to adjust delay slightly (optional)
                            const feedbackElement = document.getElementById('opposite-feedback');
                            const isCorrect = feedbackElement && feedbackElement.querySelector('.correct');

                            setTimeout(() => {
                                // Check if the exercise is still present before progressing
                                if (document.querySelector('.opposites-exercise')) {
                                    console.log('Auto-progressing from showOppositesExercise');
                                    if (typeof startRandomWordPractice === 'function') {
                                        startRandomWordPractice();
                                    } else {
                                        console.error('startRandomWordPractice function not found for opposites progression.');
                                    }
                                }
                            }, isCorrect ? 1500 : 2500);
                        });
                    }
                }
                // --- End Logic for showOppositesExercise ---

                // --- Logic for showBuildWord ---
                const buildWordExercise = resultArea.querySelector('.build-word-exercise');
                if (buildWordExercise) {
                    const checkBuildButton = document.getElementById('check-build');
                    const newBuildButton = document.getElementById('new-build');

                    if (newBuildButton) {
                        newBuildButton.style.display = 'none';
                    }

                    if (checkBuildButton && !checkBuildButton.dataset.progressionAdded) {
                        checkBuildButton.dataset.progressionAdded = 'true'; // Mark as processed
                        checkBuildButton.addEventListener('click', () => {
                            const feedbackElement = document.getElementById('build-feedback'); // Assuming feedback ID
                            const isCorrect = feedbackElement && feedbackElement.querySelector('.correct');
                            setTimeout(() => {
                                if (document.querySelector('.build-word-exercise')) {
                                    console.log('Auto-progressing from showBuildWord');
                                    if (typeof startRandomWordPractice === 'function') {
                                        startRandomWordPractice();
                                    } else {
                                        console.error('startRandomWordPractice function not found for build-word.');
                                    }
                                }
                            }, isCorrect ? 1500 : 2500);
                        });
                    }
                }
                // --- End Logic for showBuildWord ---

                // --- Logic for showRandomWord (word-display-container) ---
                const wordDisplayContainer = resultArea.querySelector('.word-display-container');
                if (wordDisplayContainer && !wordDisplayContainer.dataset.autoProgressionScheduled) {
                    wordDisplayContainer.dataset.autoProgressionScheduled = 'true'; // Prevent multiple timers

                    const nextWordButton = document.getElementById('next-word'); // ID from vocabulary.js
                    if (nextWordButton) {
                        nextWordButton.style.display = 'none';
                    }

                    setTimeout(() => {
                        // Check if the word display is still the primary content in resultArea
                        // This simple check assumes that if another exercise took over,
                        // .word-display-container might be removed or no longer the direct relevant child.
                        if (resultArea.contains(wordDisplayContainer) && resultArea.querySelector('.word-display-container')) {
                             // More specific check: ensure no other exercise container has replaced it
                            const otherExerciseActive = resultArea.querySelector('.opposites-exercise, .build-word-exercise, .match-exercise');
                            if (!otherExerciseActive || !resultArea.contains(otherExerciseActive)) {
                                console.log('Auto-progressing from showRandomWord (word-display-container)');
                                if (typeof startRandomWordPractice === 'function') {
                                    startRandomWordPractice();
                                } else {
                                    console.error('startRandomWordPractice function not found for show-word progression.');
                                }
                            }
                        }
                    }, 3000); // 3-second delay
                }
                // --- End Logic for showRandomWord ---


                // --- Logic for showIdentifyImage ---
                const imageExercise = resultArea.querySelector('.image-exercise');
                if (imageExercise) {
                    const checkImageButton = document.getElementById('check-image');
                    const newImageButton = document.getElementById('new-image');

                    if (newImageButton) {
                        newImageButton.style.display = 'none';
                    }

                    if (checkImageButton && !checkImageButton.dataset.progressionAdded) {
                        checkImageButton.dataset.progressionAdded = 'true';
                        checkImageButton.addEventListener('click', () => {
                             const feedbackElement = document.getElementById('image-feedback');
                             const isCorrect = feedbackElement && feedbackElement.querySelector('.correct');
                            setTimeout(() => {
                                if (document.querySelector('.image-exercise')) {
                                    console.log('Auto-progressing from showIdentifyImage');
                                    if (typeof startRandomImagePractice === 'function') {
                                        startRandomImagePractice();
                                    } else {
                                        console.error('startRandomImagePractice function not found.');
                                    }
                                }
                            }, isCorrect ? 1500 : 2500);
                        });
                    }
                }
                // --- End Logic for showIdentifyImage ---

                // --- Logic for showTranscribeWord ---
                const listeningExerciseParent = resultArea.querySelector('.listening-exercise');
                if (listeningExerciseParent) {
                    const checkTranscriptionButton = document.getElementById('check-transcription');
                    if (checkTranscriptionButton) {
                        const newTranscriptionButton = document.getElementById('new-transcription');
                        if (newTranscriptionButton) {
                            newTranscriptionButton.style.display = 'none';
                        }

                        if (!checkTranscriptionButton.dataset.progressionAdded) {
                            checkTranscriptionButton.dataset.progressionAdded = 'true';
                            checkTranscriptionButton.addEventListener('click', () => {
                                const feedbackElement = document.getElementById('transcription-feedback');
                                const isCorrect = feedbackElement && feedbackElement.querySelector('.correct');
                                setTimeout(() => {
                                    if (document.querySelector('.listening-exercise #check-transcription')) {
                                        console.log('Auto-progressing from showTranscribeWord');
                                        if (typeof startListeningPractice === 'function') {
                                            startListeningPractice();
                                        } else {
                                            console.error('startListeningPractice function not found.');
                                        }
                                    }
                                }, isCorrect ? 1500 : 2500);
                            });
                        }
                    }
                }
                // --- End Logic for showTranscribeWord ---

                // --- Logic for showMatchSoundWord ---
                const matchSoundExercise = resultArea.querySelector('.match-sound-exercise');
                if (matchSoundExercise) {
                    const newSoundMatchButton = document.getElementById('new-sound-match');
                    if (newSoundMatchButton) {
                        newSoundMatchButton.style.display = 'none';
                    }

                    const wordOptionButtons = matchSoundExercise.querySelectorAll('.word-option');
                    wordOptionButtons.forEach(button => {
                        if (!button.dataset.progressionAdded) {
                            button.dataset.progressionAdded = 'true';
                            button.addEventListener('click', () => { // Progression on click of any option
                                const feedbackElement = document.getElementById('sound-match-feedback');
                                const isCorrect = feedbackElement && feedbackElement.querySelector('.correct');
                                setTimeout(() => {
                                    if (document.querySelector('.match-sound-exercise')) {
                                        console.log('Auto-progressing from showMatchSoundWord');
                                        if (typeof startListeningPractice === 'function') {
                                            startListeningPractice();
                                        } else {
                                            console.error('startListeningPractice function not found.');
                                        }
                                    }
                                }, isCorrect ? 1500 : 2500); // Delay depends on correctness
                            });
                        }
                    });
                }
                // --- End Logic for showMatchSoundWord ---
            }
        }
    });

    observer.observe(resultArea, { childList: true, subtree: true });
    console.log('Vocabulary progression observer enhanced for random word types.');
});
