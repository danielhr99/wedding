// יצירת אפקט זיקוקים
window.onload = function() {
    const fireworks = new Fireworks({
        selector: '.container', // המיכל שבו יופיעו הזיקוקים
        hue: { min: 0, max: 360 }, // צבעים משתנים
        delay: { min: 10, max: 30 }, // עיכוב בין זיקוקים
        speed: 3, // מהירות הזיקוקים
        acceleration: 2, // קצב התפשטות הזיקוקים
        friction: 0.95, // חיכוך
        gravity: 1, // כוח המשיכה
        particles: 100, // כמות הזיקוקים בכל פעם
    });
    fireworks.start(); // הפעלת הזיקוקים

    // שליחת נתונים מהטופס לאחר אישור
    document.getElementById('rsvp-form').addEventListener('submit', function (event) {
        event.preventDefault(); // מונע רענון של הדף

        const phone = document.getElementById('phone').value.trim();
        const guests = document.getElementById('guests').value.trim();
        const responseMessage = document.getElementById('response-message');

        // איפוס הודעה קיימת
        responseMessage.style.display = 'none';
        responseMessage.textContent = "";

        // בדיקת שדות
        if (!phone) {
            responseMessage.style.color = 'red';
            responseMessage.textContent = "יש להזין מספר פלאפון.";
            responseMessage.style.display = 'block';
            return;
        }

        // בדיקת אם מספר פלאפון כולל בדיוק 10 ספרות
        const phonePattern = /^[0-9]{10}$/;
        if (!phonePattern.test(phone)) {
            responseMessage.style.color = 'red';
            responseMessage.textContent = "מספר הפלאפון לא תקין. יש להזין בדיוק 10 ספרות.";
            responseMessage.style.display = 'block';
            return;
        }

        if (!guests) {
            responseMessage.style.color = 'red';
            responseMessage.textContent = "יש להזין כמות מגיעים.";
            responseMessage.style.display = 'block';
            return;
        }

        // בדיקת אם כמות המגיעים היא מספר חיובי
        if (guests < 0) {
            responseMessage.style.color = 'red';
            responseMessage.textContent = "כמות המגיעים לא יכולה להיות מספר שלילי.";
            responseMessage.style.display = 'block';
            return;
        }

        // שליחת הנתונים ל-Google Sheets דרך ה-Web App
        fetch("https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `phone=${encodeURIComponent(phone)}&guests=${encodeURIComponent(guests)}`,
        })
        .then((response) => response.text())
        .then((data) => {
            if (data === "Success") {
                responseMessage.style.color = 'green';
                responseMessage.textContent = "תודה על המענה, נפגש על הרחבה!";
                responseMessage.style.display = 'block';
                // ניקוי השדות
                document.getElementById('rsvp-form').reset();
            } else {
                responseMessage.style.color = 'red';
                responseMessage.textContent = "אירעה שגיאה. נסה שוב.";
                responseMessage.style.display = 'block';
            }
        })
        .catch((error) => {
            responseMessage.style.color = 'red';
            responseMessage.textContent = "אירעה שגיאה. נסה שוב.";
            responseMessage.style.display = 'block';
            console.error('Error:', error);
        });
    });
};
