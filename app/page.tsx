import Game from "./Game";
import { SITE } from "./site";

const FAQ = [
  {
    q: ["यो खेल के हो?", "What is this game?"],
    a: [
      "हर्क साम्पाङको श्रमदान भावनाबाट प्रेरित निःशुल्क फ्यान-मेड खेल। ढुङ्गा फोड्नुस्, गाउँलेसँग मिलेर पुल बनाउनुस्।",
      "A free fan-made game inspired by Harka Sampang's Shramdaan spirit. Break rocks and build bridges with villagers.",
    ],
  },
  {
    q: ["के यो आधिकारिक हो?", "Is it official?"],
    a: [
      "होइन। यो श्रम संस्कृति पार्टी वा हर्क साम्पाङसँग सम्बन्धित छैन, प्रशंसकले बनाएको हो।",
      "No. It is not affiliated with Harka Sampang or the Shram Sanskriti Party. It is made by a fan.",
    ],
  },
  {
    q: ["प्रगति सेभ हुन्छ?", "Is progress saved?"],
    a: [
      "हो, तपाईंको ब्राउजरमै सेभ हुन्छ। कुनै खाता चाहिँदैन।",
      "Yes, in your browser. No account needed.",
    ],
  },
];

export default function Page() {
  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.flatMap((f) =>
      [0, 1].map((i) => ({
        "@type": "Question",
        name: f.q[i],
        inLanguage: i ? "en" : "ne",
        acceptedAnswer: { "@type": "Answer", text: f.a[i] },
      }))
    ),
  };
  return (
    <main>
      <h1 className="sr-only">
        श्रमदान – Shramdaan: हर्क साम्पाङ फ्यान गेम / Harka Sampang fan game
      </h1>
      <Game />

      <section
        className="contribute"
        style={{ marginTop: "12px" }}
        aria-labelledby="contribute-h"
      >
        <h2
          style={{
            textAlign: "center",
          }}
          id="contribute-h"
        >
          श्रमदानमा योगदान · Contribute to Shramdaan
        </h2>

        <div
          className="qr-container"
          style={{
            width: "fit-content",

            margin: "auto",
          }}
        >
          <img
            src="/qr.png"
            alt="QR code to share the game"
            width="200"
            height="200"
          />
        </div>
      </section>

      <section className="about" aria-labelledby="about-h">
        <h2 id="about-h">खेलबारे · About the game</h2>
        <p lang="ne">
          श्रमदान एक नेपाली ब्राउजर खेल हो। हर्क साम्पाङले धरानमा खानेपानीका
          लागि चलाएको श्रमदान र दार्चुलामा झोलुङ्गे पुल निर्माणको भावनाबाट
          प्रेरित भई बनाइएको हो। ढुङ्गा फोड्नुस्, स्वयंसेवक जोड्नुस् र गाउँ
          गाउँमा पुल, पानी र बाटो बनाउनुस्।
        </p>
        <p lang="en">
          Shramdaan is a Nepali browser game inspired by the volunteer labour
          (Shramdaan) drives Harka Sampang led for drinking water in Dharan and
          for a suspension bridge in Darchula. Tap to break rocks, rally
          volunteers, and build water pipes, bridges and roads.
        </p>
        <h2>प्रश्नोत्तर · FAQ</h2>
        {FAQ.map((f) => (
          <details key={f.q[1]}>
            <summary>
              <span lang="ne">{f.q[0]}</span> / <span lang="en">{f.q[1]}</span>
            </summary>
            <p lang="ne">{f.a[0]}</p>
            <p lang="en">{f.a[1]}</p>
          </details>
        ))}
      </section>
      <footer className="foot">
        <p lang="ne">
          <strong>सूचना:</strong> यो प्रशंसकले बनाएको अनौपचारिक खेल हो। हर्क
          साम्पाङ वा श्रम संस्कृति पार्टीसँग सम्बन्धित वा अनुमोदित छैन।
        </p>
        <p lang="en">
          <strong>Disclaimer:</strong> This is an unofficial fan-made game. It
          is not affiliated with or endorsed by Harka Sampang or the Shram
          Sanskriti Party.
        </p>
      </footer>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
      <link rel="canonical" href={SITE} />
    </main>
  );
}
