# Open Game Protocol Setup Instructions

## 🚀 Complete Your OGP Integration

Your Troll Face Flip game is almost ready for Open Game Protocol! Follow these steps to complete the setup:

### ✅ Step 1: Get Your API Key

1. Visit the [OGP Onboarding App](https://onboarding.opengameprotocol.com/)
2. Register as a developer
3. You'll receive:
   - **Public API Key** (required)
   - **Secret Key** (for server-side requests, shown only once)

### ✅ Step 2: Update Your API Key

Replace `YOUR_ACTUAL_API_KEY_HERE` in `index.html` with your actual API key:

```html
<meta name="x-ogp-key" content="your_actual_api_key_here">
```

### ✅ Step 3: Register Your Game

In the onboarding app:
- Set your **gameId** to: `troll-flip2` (already configured in the code)
- Provide your game URL for verification

### 🎮 What's Already Implemented

Your game now includes:

#### ✅ Core Features
- **SDK Initialization**: Automatic setup with error handling
- **Points Saving**: Points are saved after each successful bottle flip
- **Final Score**: Session score is saved when the game ends
- **Error Handling**: User-friendly error messages for connection issues

#### ✅ Advanced Features
- **Event Listeners**: Login success/error, points saved/error events
- **Utility Functions**: Helper functions for rewards and points management
- **Game Icon**: Uses your game's 200x200.png icon for the OGP widget

### 🔧 Configuration Options

#### Default UI (Recommended)
Your game is configured to use OGP's built-in UI widget:
- Automatic login handling
- Built-in reward modals
- No additional UI development needed

#### Custom Authentication (Optional)
To use your own auth system, modify `js/CMain.js`:
```javascript
const ogp = new OpenGameSDK({
    ui: {
        gameIcon: 'sprites/200x200.png'
    },
    useCustomAuth: true  // Add this line
});
```

### 🎁 Rewards Integration (Optional)

Your game includes utility functions for rewards:

```javascript
// Check if user can claim rewards
OGPUtils.checkRewardStatus();

// Get user's available rewards
OGPUtils.getUserRewards();

// Claim rewards (uses built-in modal)
OGPUtils.claimRewards();
```

### 🧪 Testing Your Integration

1. **Replace the API key** in `index.html`
2. **Host your game** on a web server (required for OGP verification)
3. **Register your game** in the onboarding app
4. **Test the integration**:
   - Play the game and flip bottles successfully
   - Check browser console for OGP logs
   - Verify points are being saved

### 📊 Points System

Your game awards points as follows:
- **Per successful flip**: 1 point (configurable in `settings.js` as `LAUNCH_POINTS`)
- **Final session score**: Total flips achieved in the session

### 🔍 Debugging

Check the browser console for these messages:
- `"OGP SDK is ready"`
- `"Open Game Protocol SDK initialized"`
- `"Points saved successfully: X"`
- `"User logged in successfully to OGP"`

### 🆘 Troubleshooting

#### Common Issues:
1. **"Failed to initialize OGP SDK"**
   - Check your API key is correct
   - Ensure your game is registered in the onboarding app

2. **"Error saving points"**
   - Check internet connection
   - Verify user is logged in

3. **OGP widget not appearing**
   - Ensure the meta tag is in the HTML `<head>`
   - Check the API key format

### 📞 Support

If you need help:
- Check the [OGP Documentation](https://docs.opengameprotocol.com/)
- Review the browser console for error messages
- Ensure your game is properly hosted and accessible

---

## 🎉 You're Ready!

Once you've completed these steps, your Troll Face Flip game will be fully integrated with Open Game Protocol, allowing players to earn and manage points across the OGP ecosystem! 