/**
 * Open Game Protocol Utilities
 * Helper functions for OGP integration
 */

// Global OGP utility functions
window.OGPUtils = {
    
    /**
     * Get user's total points from OGP
     * @returns {Promise} Promise that resolves with points data
     */
    getUserPoints: function() {
        return ogp.getPoints().then(response => {
            console.log('User total points:', response.data.points);
            return response.data.points;
        }).catch(error => {
            console.error('Error getting user points:', error);
            return 0;
        });
    },

    /**
     * Save points with better error handling and user feedback
     * @param {number} points - Points to save
     * @param {boolean} showSuccess - Whether to show success message
     * @returns {Promise} Promise that resolves when points are saved
     */
    savePointsWithFeedback: function(points, showSuccess = false) {
        if (points <= 0) {
            console.warn('Attempted to save invalid points:', points);
            return Promise.resolve();
        }

        return ogp.savePoints(points).then(() => {
            console.log('Points saved successfully:', points);
            if (showSuccess) {
                // You could add a visual feedback here
                console.log(`+${points} points saved!`);
            }
            return true;
        }).catch(error => {
            console.error('Error saving points:', error);
            ogp.showError({
                title: 'Connection Error',
                message: 'Unable to save your progress. Please check your connection and try again.'
            });
            return false;
        });
    },

    /**
     * Check if user can claim rewards
     * @returns {Promise} Promise that resolves with reward status
     */
    checkRewardStatus: function() {
        return ogp.getTimeUntilNextClaim().then(response => {
            console.log('Time until next claim:', response);
            return response;
        }).catch(error => {
            console.error('Error checking reward status:', error);
            return null;
        });
    },

    /**
     * List available rewards for the user
     * @returns {Promise} Promise that resolves with user rewards
     */
    getUserRewards: function() {
        return ogp.listUserRewards().then(response => {
            console.log('User rewards:', response);
            return response;
        }).catch(error => {
            console.error('Error getting user rewards:', error);
            return [];
        });
    },

    /**
     * Claim rewards for the user
     * @param {boolean} useBuiltInModal - Whether to use OGP's built-in modal
     * @returns {Promise} Promise that resolves when rewards are claimed
     */
    claimRewards: function(useBuiltInModal = true) {
        return ogp.claimRewards(useBuiltInModal).then(response => {
            console.log('Rewards claimed:', response);
            return response;
        }).catch(error => {
            console.error('Error claiming rewards:', error);
            ogp.showError({
                title: 'Reward Error',
                message: 'Unable to claim rewards at this time. Please try again later.'
            });
            return null;
        });
    },

    /**
     * Initialize OGP with enhanced error handling
     * @param {string} gameId - Your game ID
     * @returns {Promise} Promise that resolves when OGP is initialized
     */
    initializeOGP: function(gameId) {
        return new Promise((resolve, reject) => {
            ogp.on('OnReady', () => {
                console.log('OGP SDK is ready');
                ogp.init({ gameId: gameId }).then(() => {
                    console.log('Open Game Protocol SDK initialized successfully');
                    ogp.gameReadyToPlay();
                    resolve();
                }).catch(error => {
                    console.error('Failed to initialize OGP SDK:', error);
                    reject(error);
                });
            });

            ogp.on('LoginSuccess', () => {
                console.log('User logged in successfully to OGP');
            });

            ogp.on('LoginError', (error) => {
                console.error('OGP login error:', error);
            });
        });
    },

    /**
     * Show custom error message using OGP's error display
     * @param {string} title - Error title
     * @param {string} message - Error message
     */
    showError: function(title, message) {
        ogp.showError({
            title: title,
            message: message
        });
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OGPUtils;
} 