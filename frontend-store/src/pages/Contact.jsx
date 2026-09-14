import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // No backend endpoint for contact messages yet — this just confirms
    // receipt in the UI. Wire this up to POST /api/contact (or an email
    // service) if you want messages delivered somewhere.
    setSent(true);
  };

  return (
    <section className="static-page">
      <div className="container static-page-inner">
        <span className="eyebrow">Get In Touch</span>
        <h1>Contact Us</h1>
        <p>
          Questions about an order, a product, or just want to say hello?
          Send us a message and we'll get back to you.
        </p>

        <div className="contact-grid">
          <div>
            {sent ? (
              <div className="alert-success">
                Thanks, {form.name.split(" ")[0] || "there"}! Your message has
                been received.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <label>Name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Jane Doe"
                />
                <label>Email</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="jane@example.com"
                />
                <label>Message</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  placeholder="How can we help?"
                />
                <button className="btn btn-block" type="submit">
                  Send Message
                </button>
              </form>
            )}
          </div>

          <div className="contact-info">
            <div>
              <span className="eyebrow">Email</span>
              <p>support@noirco.com</p>
            </div>
            <div>
              <span className="eyebrow">Phone</span>
              <p>+1 (555) 010-2030</p>
            </div>
            <div>
              <span className="eyebrow">Hours</span>
              <p>Mon–Fri, 9am–6pm</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
