export default function About() {
  return (
    <section className="static-page">
      <div className="container static-page-inner">
        <span className="eyebrow">Our Story</span>
        <h1>About NOIR &amp; CO</h1>
        <p>
          NOIR &amp; CO started in 2019 with a simple idea: build the pieces
          people actually reach for every day — clothing, footwear, and
          makeup that feel considered, not disposable. No noise, no
          gimmicks, just honest materials and cuts that last.
        </p>
        <p>
          Every collection is designed in small batches, favoring quality
          fabrics and finishes over chasing every passing trend. From our
          wool outerwear to our everyday makeup essentials, the goal is the
          same across every category: fewer, better things.
        </p>

        <div className="about-grid">
          <div className="about-block">
            <span className="eyebrow">01 — Considered Design</span>
            <p>Every piece is designed to be worn on repeat, not once.</p>
          </div>
          <div className="about-block">
            <span className="eyebrow">02 — Honest Materials</span>
            <p>Real wool, full-grain leather, and formulas that perform.</p>
          </div>
          <div className="about-block">
            <span className="eyebrow">03 — Built to Last</span>
            <p>We'd rather you buy less and keep it longer.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
