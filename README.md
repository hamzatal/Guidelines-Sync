# 📚 Guidelines Sync

![Guidelines Sync Logo](public/images/icon.png)

**Guidelines Sync** is a cutting-edge platform designed to simplify academic publishing for graduate students and researchers. It automates the formatting of research papers to meet the specific requirements of local and international journals, saving time and ensuring precision. 🚀

---

## ✨ Features

- **User Authentication**: Secure registration and login system. 🔐
- **Journal Database**: Browse a comprehensive list of journals with detailed formatting guidelines. 📖
- **Automated Formatting**: Upload your research paper (PDF/DOCX) and get it instantly formatted for your target journal. 📄
- **Intuitive Interface**: Modern UI built with React.js and styled with Tailwind CSS, featuring smooth animations powered by Framer Motion. 🎨
- **Real-Time Support**: Contact us via email or live chat for 24/7 assistance. 💬
- **Future AI Integration**: Plans to integrate GPT-4 for intelligent reference and section formatting. 🤖

---

## 🎥 Animations

Guidelines Sync leverages **Framer Motion** for a seamless and engaging user experience. Key animations include:

- **Fade-In Effects**: Used in `About.jsx` and `Contact.jsx` for smooth section transitions (e.g., `opacity: 0` to `1`, `y: 20` to `0`).
- **Spring Animations**: Applied in `LegalPopup` for modal popups with `type: "spring"`, `stiffness: 200`, and `damping: 25`.
- **Hover & Tap Effects**: Buttons in `Contact.jsx` and `Footer.jsx` scale on hover (`scale: 1.03`) and tap (`scale: 0.97`).
- **Notification Animations**: Success/error messages in `Contact.jsx` slide in/out with `y: -20` to `0`.

> **Example**: Check out the Hero Section in `Contact.jsx` for a fading title animation:

<motion.h1
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.7 }}
>
  Contact <span className="text-green-400">Us</span>
</motion.h1>

---

## 🖼️ Icons

The platform uses **Lucide React** for consistent and modern icons, enhancing visual clarity. Key icons include:

| Icon | Usage | Component |
|------|-------|-----------|
| 📖 `BookOpen` | Represents academic focus in About section | `About.jsx`, `Footer.jsx` |
| 🔗 `Link` | Denotes Quick Links section | `Footer.jsx` |
| 🏠 `Home` | Navigation to homepage | `Contact.jsx`, `Footer.jsx` |
| 📚 `Book` | Represents Journals section | `Footer.jsx` |
| ⬆️ `Upload` | Upload paper functionality | `Footer.jsx` |
| ✉️ `Mail` | Email contact | `Contact.jsx`, `Footer.jsx` |
| ℹ️ `Info` | About Us link | `Footer.jsx` |
| 🛡️ `Shield` | Privacy Policy link | `Footer.jsx` |
| 📄 `FileText` | Terms of Service link | `Footer.jsx` |
| 📞 `Contact` | Contact Us section | `Footer.jsx` |
| 📍 `MapPin` | Address in Contact Info | `Footer.jsx` |
| © `Copyright` | Copyright notice | `Footer.jsx` |
| 💬 `MessageSquare` | Message form and live chat | `Contact.jsx` |
| 👤 `User` | Social media section | `Contact.jsx` |
| 🚀 `Send` | Submit button in contact form | `Contact.jsx` |

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | React.js, Inertia.js, Tailwind CSS, Framer Motion, Lucide React |
| **Backend** | Laravel 10, Python (for file processing) |
| **Future AI** | Planned integration with GPT-4 for smart formatting |
| **Database** | MySQL (assumed, configurable in Laravel) |
| **API** | Laravel routes for form submissions (`/contacts`) |

---

## 📂 Project Structure

guidelines-sync/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── HomeController.php
│   │   │   ├── JournalsController.php
│   │   │   ├── UploadController.php
│   │   │   ├── ContactController.php
│   │   │   ├── AboutController.php
│   ├── Models/
│   ├── ...
├── public/
│   ├── images/
│   │   ├── icon.png
│   │   ├── academic-bg.svg
│   │   ├── world.svg
├── resources/
│   ├── js/
│   │   ├── Components/
│   │   │   ├── Nav.jsx
│   │   │   ├── Footer.jsx
│   │   ├── Pages/
│   │   │   ├── About.jsx
│   │   │   ├── Contact.jsx
│   │   ├── ...
├── routes/
│   ├── web.php
├── scripts/
│   ├── python/
│   │   ├── formatter.py (for file processing)
├── ...

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- PHP (v8.1 or higher)
- Composer
- Laravel 10
- Python (v3.8 or higher)
- MySQL (or any supported database)

### Installation

1. **Clone the Repository**:
   
   git clone https://github.com/your-username/guidelines-sync.git
   cd guidelines-sync

2. **Install Backend Dependencies**:

   composer install
   cp .env.example .env
   php artisan key:generate

3. **Configure Environment**:
   - Update `.env` with your database credentials and mail settings.
   - Example:
   - 
     .env
     
     DB_CONNECTION=mysql
     DB_HOST=127.0.0.1
     DB_PORT=3306
     DB_DATABASE=guidelines_sync
     DB_USERNAME=root
     DB_PASSWORD=

4. **Run Migrations**:
   
   php artisan migrate
   

6. **Install Frontend Dependencies**:

   npm install

7. **Build Frontend**:
   ```bash
   npm run dev
   ```

8. **Start the Server**:

   php artisan serve

9. **Link Storage** (for images like `icon.png`, `world.svg`):

   php artisan storage:link


11. **Access the Application**:
    - Open `http://localhost:8000` in your browser.

---

## 🌐 Routes

| Route | Description | Component |
|-------|-------------|-----------|
| `/home` | Homepage | `Home.jsx` |
| `/journals` | Browse journals | `Journals.jsx` |
| `/upload` | Upload research paper | `Upload.jsx` |
| `/ContactPage` | Contact form | `Contact.jsx` |
| `/about-us` | About page | `About.jsx` |
| `/contacts` | Form submission (POST) | `ContactController@store` |

---

## 📬 Contact

For support or inquiries:
- **Email**: [support@guidelinessync.com](mailto:support@guidelinessync.com) ✉️
- **Phone**: +1 (123) 456-7890 📞
- **Address**: 123 Research Lane, Academic City 📍

---

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details. © 2025 Guidelines Sync.

---

## 🎯 Future Enhancements

- Integrate GPT-4 for intelligent reference and section formatting. 🤖
- Add multilingual support for global accessibility. 🌍
- Enhance journal database with real-time updates. 📚
- Implement advanced file processing with Python scripts. ⚙️


<p align="center">
  <img src="public/images/icon.png" alt="Guidelines Sync Logo" width="50">
  <br>
  <strong>Guidelines Sync</strong> - Empowering researchers, one paper at a time.
</p>




   git add README.md
   git commit -m "Add modern README with animations and icons"
   git push origin main


     Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');
     Route::get('/journals', [App\Http\Controllers\JournalsController::class, 'index'])->name('journals');
     Route::get('/upload', [App\Http\Controllers\UploadController::class, 'index'])->name('upload');
     Route::get('/ContactPage', [App\Http\Controllers\ContactController::class, 'index'])->name('ContactPage');
     Route::get('/about-us', [App\Http\Controllers\AboutController::class, 'index'])->name('about-us');
     Route::post('/contacts', [App\Http\Controllers\ContactController::class, 'store'])->name('contacts.store');


  MIT License

  Copyright (c) 2025 Guidelines Sync

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.

  git add LICENSE
  git commit -m "Add MIT License"
  git push origin main
