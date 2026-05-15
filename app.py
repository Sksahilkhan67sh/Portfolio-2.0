import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import Flask, render_template, request, jsonify
from data import portfolio

app = Flask(__name__)

# ─────────────────────────────────────────────────────────
#  EMAIL CONFIG  ← put your Gmail + App Password here
# ─────────────────────────────────────────────────────────
GMAIL_USER     = os.environ.get("GMAIL_USER",     "sahilkhan67sh@gmail.com")  # your Gmail
GMAIL_PASSWORD = os.environ.get("GMAIL_PASSWORD", "hfvv nwne lcnj einc")   # 16-char App Password
NOTIFY_EMAIL   = os.environ.get("NOTIFY_EMAIL",   "sahilkhan67sh@gmail.com")  # where to receive enquiries
# ─────────────────────────────────────────────────────────


def send_email(sender_name, sender_email, message):
    """Send a nicely formatted enquiry email to Sahil."""

    subject = f"📬 Portfolio Enquiry from {sender_name}"

    # ── HTML body ──
    html_body = f"""
    <html>
    <body style="font-family:Arial,sans-serif;background:#f4f4f4;padding:30px;">
      <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1);">

        <!-- Header -->
        <div style="background:linear-gradient(135deg,#030510,#0a0e23);padding:32px;text-align:center;">
          <h1 style="color:#00f0ff;margin:0;font-size:26px;letter-spacing:2px;">SK.</h1>
          <p style="color:#7080b0;margin:8px 0 0;font-size:13px;">New Portfolio Enquiry</p>
        </div>

        <!-- Body -->
        <div style="padding:32px;">
          <p style="color:#333;font-size:15px;margin:0 0 24px;">
            Hey Sahil! Someone reached out through your portfolio. Here are the details:
          </p>

          <!-- Sender Info -->
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
            <tr>
              <td style="padding:12px 16px;background:#f9f9f9;border-radius:8px 8px 0 0;border-bottom:1px solid #eee;">
                <span style="font-size:11px;color:#999;text-transform:uppercase;letter-spacing:1px;">Name</span><br>
                <strong style="color:#111;font-size:15px;">{sender_name}</strong>
              </td>
            </tr>
            <tr>
              <td style="padding:12px 16px;background:#f9f9f9;border-bottom:1px solid #eee;">
                <span style="font-size:11px;color:#999;text-transform:uppercase;letter-spacing:1px;">Email</span><br>
                <a href="mailto:{sender_email}" style="color:#0088ff;font-size:15px;text-decoration:none;">{sender_email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:12px 16px;background:#f9f9f9;border-radius:0 0 8px 8px;">
                <span style="font-size:11px;color:#999;text-transform:uppercase;letter-spacing:1px;">Message</span><br>
                <p style="color:#111;font-size:15px;margin:8px 0 0;line-height:1.6;">{message}</p>
              </td>
            </tr>
          </table>

          <!-- Reply Button -->
          <div style="text-align:center;margin-top:28px;">
            <a href="mailto:{sender_email}?subject=Re: Your enquiry"
               style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#00f0ff,#0088ff);
                      color:#000;text-decoration:none;border-radius:8px;font-weight:bold;font-size:14px;letter-spacing:0.5px;">
              Reply to {sender_name}
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="padding:20px 32px;background:#f9f9f9;border-top:1px solid #eee;text-align:center;">
          <p style="color:#aaa;font-size:12px;margin:0;">
            Sent from your portfolio at
            <a href="https://portfolio-2-0-plum.vercel.app/" style="color:#00f0ff;text-decoration:none;">portfolio-sahil-chi.vercel.app</a>
          </p>
        </div>

      </div>
    </body>
    </html>
    """

    # ── Plain text fallback ──
    plain_body = f"""
New Portfolio Enquiry
─────────────────────
Name    : {sender_name}
Email   : {sender_email}
Message :
{message}

Reply directly to: {sender_email}
    """

    # ── Build MIME message ──
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"]    = f"Sahil Khan Portfolio <{GMAIL_USER}>"
    msg["To"]      = NOTIFY_EMAIL
    msg["Reply-To"] = sender_email   # clicking Reply goes to the enquirer

    msg.attach(MIMEText(plain_body, "plain"))
    msg.attach(MIMEText(html_body,  "html"))

    # ── Send via Gmail SMTP ──
    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(GMAIL_USER, GMAIL_PASSWORD)
        server.sendmail(GMAIL_USER, NOTIFY_EMAIL, msg.as_string())


def send_auto_reply(sender_name, sender_email):
    """Send a polite auto-reply to the person who filled the form."""

    subject = "Thanks for reaching out — Sahil Khan"

    html_body = f"""
    <html>
    <body style="font-family:Arial,sans-serif;background:#f4f4f4;padding:30px;">
      <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1);">

        <div style="background:linear-gradient(135deg,#030510,#0a0e23);padding:32px;text-align:center;">
          <h1 style="color:#00f0ff;margin:0;font-size:26px;letter-spacing:2px;">SK.</h1>
          <p style="color:#7080b0;margin:8px 0 0;font-size:13px;">Sahil Khan · Python Full Stack Developer</p>
        </div>

        <div style="padding:32px;">
          <p style="color:#333;font-size:16px;margin:0 0 16px;">Hey {sender_name} 👋,</p>
          <p style="color:#555;font-size:15px;line-height:1.7;margin:0 0 16px;">
            Thanks for reaching out through my portfolio! I've received your message and will
            get back to you as soon as possible — usually within <strong>24–48 hours</strong>.
          </p>
          <p style="color:#555;font-size:15px;line-height:1.7;margin:0 0 24px;">
            In the meantime, feel free to connect with me on LinkedIn or check out my latest projects on GitHub.
          </p>

          <div style="text-align:center;margin:28px 0;display:flex;gap:16px;justify-content:center;">
            <a href="https://www.linkedin.com/in/sahil--devop/"
               style="display:inline-block;padding:12px 24px;background:linear-gradient(135deg,#00f0ff,#0088ff);
                      color:#000;text-decoration:none;border-radius:8px;font-weight:bold;font-size:13px;">
              LinkedIn
            </a>
            <a href="https://github.com/sksahilkhan67sh"
               style="display:inline-block;padding:12px 24px;background:#0a0e23;
                      color:#00f0ff;border:1px solid #00f0ff;text-decoration:none;border-radius:8px;font-weight:bold;font-size:13px;">
              GitHub
            </a>
          </div>

          <p style="color:#888;font-size:13px;margin:24px 0 0;">
            Best regards,<br>
            <strong style="color:#111;">Sahil Khan</strong><br>
            Python Full Stack Developer · Bangalore, India
          </p>
        </div>

        <div style="padding:20px 32px;background:#f9f9f9;border-top:1px solid #eee;text-align:center;">
          <p style="color:#aaa;font-size:12px;margin:0;">
            This is an automated reply from
            <a href="https://portfolio-sahil-chi.vercel.app/" style="color:#00f0ff;text-decoration:none;">Sahil's Portfolio</a>
          </p>
        </div>
      </div>
    </body>
    </html>
    """

    plain_body = f"""
Hey {sender_name},

Thanks for reaching out! I've received your message and will reply within 24–48 hours.

Best regards,
Sahil Khan
Python Full Stack Developer
    """

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"]    = f"Sahil Khan <{GMAIL_USER}>"
    msg["To"]      = sender_email

    msg.attach(MIMEText(plain_body, "plain"))
    msg.attach(MIMEText(html_body,  "html"))

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(GMAIL_USER, GMAIL_PASSWORD)
        server.sendmail(GMAIL_USER, sender_email, msg.as_string())


# ─────────────────────────────────────────────────────────
#  ROUTES
# ─────────────────────────────────────────────────────────

@app.route("/")
def index():
    return render_template("index.html", p=portfolio)


@app.route("/contact", methods=["POST"])
def contact():
    name    = request.form.get("name",    "").strip()
    email   = request.form.get("email",   "").strip()
    message = request.form.get("message", "").strip()

    if not name or not email or not message:
        return jsonify({"success": False, "error": "All fields are required."}), 400

    try:
        send_email(name, email, message)        # notify Sahil
        send_auto_reply(name, email)            # auto-reply to enquirer
        return jsonify({
            "success": True,
            "message": "✅ Message sent! I'll get back to you within 24–48 hours."
        })
    except smtplib.SMTPAuthenticationError:
        return jsonify({
            "success": False,
            "error": "Email config error. Please contact me directly at sahilkhan67sh@gmail.com"
        }), 500
    except Exception as e:
        print(f"Email error: {e}")
        return jsonify({
            "success": False,
            "error": "Something went wrong. Please try again or email me directly."
        }), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
