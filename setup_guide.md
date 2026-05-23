# Mensah Setup Guide: Credentials and Models

This guide will help you gather the necessary keys for your `.env.local` file and set up your 3D garment library.

## 1. Credentials Guide

### **Turso (Database)**
Turso is used for storing your listings and orders.
1.  **Install Turso CLI**: Run `brew install tursodatabase/tap/turso` (since you have Homebrew).
2.  **Login**: Run `turso auth login`.
3.  **Create DB**: Run `turso db create mensah`.
4.  **Get URL**: Run `turso db show mensah --url`. This goes to `TURSO_DATABASE_URL`.
5.  **Get Token**: Run `turso db tokens create mensah`. This goes to `TURSO_AUTH_TOKEN`.

### **Cloudinary (Image Hosting)**
Cloudinary stores your fabric photos and listing images.
1.  **Sign Up**: Go to [cloudinary.com](https://cloudinary.com/signup).
2.  **Dashboard**: Once logged in, you'll see your **Cloud Name**, **API Key**, and **API Secret** on the main dashboard.
3.  **Settings**: Ensure your account allows "unsigned" or "signed" uploads (the app uses signed uploads for security, which is already configured in the backend).

### **Paystack (Payments)**
Paystack handles guest payments for orders.
1.  **Sign Up**: Go to [paystack.com](https://paystack.com/).
2.  **Test Mode**: While in "Test Mode", go to **Settings > API Keys & Webhooks**.
3.  **Keys**: Copy the **Test Public Key** (`pk_test_...`) and **Test Secret Key** (`sk_test_...`).

### **Resend (Emails)**
Resend sends order notifications to the tailor.
1.  **Sign Up**: Go to [resend.com](https://resend.com/).
2.  **API Keys**: Create a new API Key in the dashboard.
3.  **Tailor Email**: Set `TAILOR_EMAIL` to the email address where you want to receive order notifications.

---

## 2. Garment Models (.glb)

The application is a "viewer" that wraps textures onto 3D models. As an AI, I don't have a built-in library of proprietary 3D garment files, but I have set up the system to use them.

### **How to get the 25 models:**
1.  **Source the Files**: Download free clothing models from sites like [Sketchfab](https://sketchfab.com/) or [Quaternius](https://quaternius.com/).
2.  **Format**: Ensure they are in `.glb` format.
3.  **Naming**: Rename the files to match the IDs in `src/config/garmentConfig.json` (e.g., `kaftan.glb`, `shirt_formal.glb`).
4.  **Placement**: Move them into `public/models/garments/`.

### **Starter Placeholder**
To see the system work without real models, the app currently uses a "Box" placeholder if a model is missing. However, to see the "Kaftan" rise in the hero sequence, you need a file at `public/models/garments/kaftan.glb`.

> [!TIP]
> If you have a `.obj` or `.fbx` model, you can use an online converter like [Aspose](https://products.aspose.app/3d/conversion/obj-to-glb) to turn it into a `.glb` file.
