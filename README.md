# Pulse Wellness — Developer Setup Guide

Welcome to the Pulse Wellness repository! This app uses a highly customized native camera integration. **Standard `Expo Go` will NOT work.** You must follow these instructions carefully.

---

## 1. Prerequisites
Ensure you have the following installed on your machine:
* **Node.js (LTS)**
* **Git**
* **Java Development Kit (JDK 17)** — Required for building the Android native code.
* **EAS CLI** — Install globally via `npm install -g eas-cli`

---

## 2. Backend Setup (`pulse-backend`)
The backend is an Express server acting as an AI proxy. It must be running for the app to generate insights.

1. Open a terminal and navigate to the backend folder:
   `cd pulse-backend`
2. Install dependencies:
   `npm install`
3. Start the server:
   `node index.js` (or `npm start` if configured)

---

## 3. Frontend Setup (`pulse-clean`)

### Step 3A: Network Configuration (CRITICAL)
The frontend needs to know where the backend is.
1. Find your computer's local IPv4 address (e.g., `192.168.1.5`).
2. Open `pulse-clean/SRC/API/aiService.ts`.
3. Update the `BACKEND_URL` variable to match your IP:
   `const BACKEND_URL = 'http://YOUR_IP_ADDRESS:3000';`

### Step 3B: Building the Custom Native App
Because we wrote custom Kotlin code for the camera sensor, you cannot use Expo Go. You must build a "Development Client".

1. Navigate to the frontend folder:
   `cd pulse-clean`
2. Install dependencies:
   `npm install`
3. Log into Expo Application Services (EAS):
   `eas login`
4. Trigger the cloud build for Android:
   `eas build --profile development --platform android --clear-cache`
5. Once the build finishes, download the `.apk` file and install it on your physical Android phone.

### Step 3C: Running the Development Server
1. With the `.apk` installed on your phone, start the local server:
   `npx expo start --dev-client --clear`
2. Open the newly installed app on your phone.
3. Scan the QR code in the terminal to connect.

---

## 4. Architectural Guardrails (DO NOT TOUCH)
If you are working on the codebase, be aware of these hard constraints:

1. **The Native Bridge (Kotlin Mega-File):** The custom camera plugin (`RednessPlugin`) is explicitly merged into `android/app/src/main/java/com/xirc/pulseclean/MainApplication.kt`. **Do not attempt to extract it into a separate file.** It is structured this way to prevent compiler reference errors.
2. **Hardware Constraint:** The camera samples **Plane 0 (Luma/Brightness)**. Do NOT attempt to read RGB or color planes, as they cause catastrophic hardware crashes on target Android devices.
3. **The Math:** The pulse is detected via a falling-edge crossing on a Dynamic Rolling Average inside a React Native Worklet (`HeartScanner.tsx`).
