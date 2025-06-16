// Audio feedback module
const AudioFeedback = {
    sounds: {
        success: new Audio('assets/sounds/success.mp3'),
        error: new Audio('assets/sounds/error.mp3')
        // Click and select sounds can be added here if not handled by a previous version
        // click: new Audio('assets/sounds/click.mp3'),
        // select: new Audio('assets/sounds/select.mp3')
    },

    play(soundName) {
        const sound = this.sounds[soundName];
        if (sound) {
            sound.currentTime = 0; // Rewind to the start
            sound.play().catch(error => console.error(`Error playing sound ${soundName}:`, error));
        } else {
            console.warn(`Sound not found: ${soundName}`);
        }
    },

    playSuccessSound() {
        this.play('success');
    },

    playErrorSound() {
        this.play('error');
    }

    // playClickSound() {
    //     this.play('click');
    // },

    // playSelectSound() {
    //     this.play('select');
    // }
};

export default AudioFeedback;
