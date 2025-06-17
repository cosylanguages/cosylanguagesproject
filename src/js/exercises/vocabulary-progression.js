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
                            setTimeout(() => {
                                if (document.querySelector('.build-word-exercise')) {
                                    console.log('Auto-progressing from showBuildWord');
                                    if (typeof startRandomWordPractice === 'function') {
                                        startRandomWordPractice();
                                    } else {
                                        console.error('startRandomWordPractice function not found.');
                                    }
                                }
                            }, 2500); 
                        });
                    }
                }
                // --- End Logic for showBuildWord ---

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
                            setTimeout(() => {
                                if (document.querySelector('.image-exercise')) {
                                    console.log('Auto-progressing from showIdentifyImage');
                                    if (typeof startRandomImagePractice === 'function') {
                                        startRandomImagePractice();
                                    } else {
                                        console.error('startRandomImagePractice function not found.');
                                    }
                                }
                            }, 2500);
                        });
                    }
                }
                // --- End Logic for showIdentifyImage ---

                // --- Logic for showTranscribeWord ---
                const listeningExerciseParent = resultArea.querySelector('.listening-exercise');
                if (listeningExerciseParent) {
                    const checkTranscriptionButton = document.getElementById('check-transcription');
                    // Check if it's actually the transcribe word exercise by presence of check-transcription button
                    if (checkTranscriptionButton) {
                        const newTranscriptionButton = document.getElementById('new-transcription');
                        if (newTranscriptionButton) {
                            newTranscriptionButton.style.display = 'none';
                        }

                        if (!checkTranscriptionButton.dataset.progressionAdded) {
                            checkTranscriptionButton.dataset.progressionAdded = 'true';
                            checkTranscriptionButton.addEventListener('click', () => {
                                setTimeout(() => {
                                    // Ensure the specific button/exercise is still there
                                    if (document.querySelector('.listening-exercise #check-transcription')) {
                                        console.log('Auto-progressing from showTranscribeWord');
                                        if (typeof startListeningPractice === 'function') {
                                            startListeningPractice();
                                        } else {
                                            console.error('startListeningPractice function not found.');
                                        }
                                    }
                                }, 2500);
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
                            button.addEventListener('click', () => {
                                setTimeout(() => {
                                    if (document.querySelector('.match-sound-exercise')) {
                                        console.log('Auto-progressing from showMatchSoundWord');
                                        if (typeof startListeningPractice === 'function') {
                                            startListeningPractice();
                                        } else {
                                            console.error('startListeningPractice function not found.');
                                        }
                                    }
                                }, 2500);
                            });
                        }
                    });
                }
                // --- End Logic for showMatchSoundWord ---
            }
        }
    });

    observer.observe(resultArea, { childList: true, subtree: true });
    console.log('Vocabulary progression observer updated for more exercises.');
});
