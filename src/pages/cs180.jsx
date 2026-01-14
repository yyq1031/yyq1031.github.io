import { Link } from "react-router-dom";


const projects = [
  {
    id: "project0",
    title: "Project 0: Becoming Friends with Your Camera",
    subtitle: "Basics of imaging, exposure, and camera fundamentals.",
    to: "/cs180/project0",
    img: "cs180/proj0.png",
    tag: "Photography",
  },
  {
    id: "project1",
    title: "Project 1: Colorizing the Prokudin-Gorskii Photo Collection",
    subtitle: "Image alignment and reconstruction for historical colorization.",
    to: "/cs180/project1",
    img: "cs180/proj1.png",
    tag: "Alignment",
  },
  {
    id: "project2",
    title: "Project 2: Filters and Frequencies",
    subtitle: "Convolutions, hybrid images, and frequencies.",
    to: "/cs180/project2",
    img: "cs180/proj2.jpg",
    tag: "Signal Processing",
  },
  {
    id: "project3",
    title: "Project 3: (Auto)Stitching Photo Mosaics",
    subtitle: "Homographies, warping, blending, panorama stitching.",
    to: "/cs180/project3",
    img: "cs180/proj3.png",
    tag: "Panorama",
  },
  {
    id: "project4",
    title: "Project 4: Neural Radiance Field",
    subtitle: "NeRF training and rendering for 3D novel view synthesis.",
    to: "/cs180/project4",
    img: "cs180/proj4.mp4",
    tag: "NeRF",
  },
  {
    id: "project5",
    title: "Project 5: Diffusion Models",
    subtitle: "Denoising, sampling, and generative modeling workflows.",
    to: "/cs180/project5",
    img: "cs180/proj5.mp4",
    tag: "Diffusion Models",
  },
];
const isVideo = (src) => src?.toLowerCase().endsWith(".mp4");

const CS180 = () => {
  return (
    <div style={styles.page}>
      {/* Top gradient / header */}
      <div style={styles.hero}>
        <div style={styles.heroInner}>
          <div style={styles.badge}>CS 180 • Project Gallery</div>
          <h1 style={styles.title}>Welcome to my CS180 Project Gallery</h1>
        </div>
      </div>

      {/* Content */}
      <div style={styles.container}>
        <div style={styles.grid}>
          {projects.map((p) => (
            <Link key={p.id} to={p.to} style={styles.cardLink} aria-label={p.title}>
              <div style={styles.card}>
                <div style={styles.imgWrap}>
                    {isVideo(p.img) ? (
                        <video
                        src={p.img}
                        style={styles.media}
                        muted
                        loop
                        autoPlay
                        playsInline
                        preload="metadata"
                        />
                    ) : (
                        <img
                        src={p.img}
                        alt={`${p.title} preview`}
                        style={styles.media}
                        loading="lazy"
                        />
                    )}
                    <div style={styles.imgOverlay} />
                    <div style={styles.tag}>{p.tag}</div>
                </div>

                <div style={styles.cardBody}>
                  <h2 style={styles.cardTitle}>{p.title}</h2>
                  <p style={styles.cardSubtitle}>{p.subtitle}</p>

                  <div style={styles.cardFooter}>
                    <span style={styles.openText}>Open project</span>
                    <span style={styles.arrow} aria-hidden>
                      →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        
      </div>

      {/* Tiny CSS for hover/active states */}
      <style>{`
        .cs180-card {
          transform: translateY(0);
          transition: transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease;
        }
        .cs180-link:hover .cs180-card {
          transform: translateY(-4px);
          box-shadow: 0 18px 50px rgba(0,0,0,0.35);
          border-color: rgba(255,255,255,0.18);
        }
        .cs180-link:active .cs180-card {
          transform: translateY(-1px);
        }
        .cs180-link:focus-visible {
          outline: 3px solid rgba(99, 102, 241, 0.7);
          outline-offset: 4px;
          border-radius: 18px;
        }
        @media (max-width: 520px) {
          .cs180-title { font-size: 32px !important; }
        }
      `}</style>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(1200px 600px at 10% -10%, rgba(99,102,241,0.35), transparent 60%)," +
      "radial-gradient(1000px 600px at 90% 0%, rgba(34,197,94,0.18), transparent 55%)," +
      "linear-gradient(180deg, #0b1020 0%, #070a12 60%, #06070d 100%)",
    color: "rgba(255,255,255,0.92)",
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"',
  },

  hero: {
    padding: "64px 20px 28px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.0) 100%)",
  },
  heroInner: { maxWidth: 1100, margin: "0 auto" },

  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 12px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.06)",
    fontSize: 13,
    letterSpacing: 0.2,
  },

  title: {
    margin: "14px 0 10px",
    fontSize: 44,
    lineHeight: 1.05,
    letterSpacing: -0.8,
  },

  lede: {
    margin: 0,
    maxWidth: 740,
    fontSize: 16,
    lineHeight: 1.6,
    color: "rgba(255,255,255,0.72)",
  },

  container: { maxWidth: 1100, margin: "0 auto", padding: "28px 20px 60px" },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 18,
  },

  cardLink: {
    textDecoration: "none",
    color: "inherit",
    display: "block",
  },

  card: {
    borderRadius: 18,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.05)",
    boxShadow: "0 10px 24px rgba(0,0,0,0.25)",
  },

  imgWrap: {
    position: "relative",
    height: 160,
    overflow: "hidden",
    background: "rgba(255,255,255,0.05)",
  },

  media: {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
  transform: "scale(1.03)",
},

  imgOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.65) 100%)",
  },

  tag: {
    position: "absolute",
    left: 12,
    bottom: 12,
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(0,0,0,0.35)",
    backdropFilter: "blur(10px)",
    fontSize: 12,
    color: "rgba(255,255,255,0.86)",
  },

  cardBody: { padding: "14px 14px 12px" },

  cardTitle: {
    margin: "2px 0 6px",
    fontSize: 16,
    lineHeight: 1.25,
    letterSpacing: -0.2,
  },

  cardSubtitle: {
    margin: 0,
    fontSize: 13.5,
    lineHeight: 1.5,
    color: "rgba(255,255,255,0.68)",
    minHeight: 40,
  },

  cardFooter: {
    marginTop: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
    borderTop: "1px solid rgba(255,255,255,0.10)",
  },

  openText: {
    fontSize: 13,
    color: "rgba(255,255,255,0.82)",
  },

  arrow: {
    fontSize: 18,
    color: "rgba(255,255,255,0.85)",
  },

  footer: {
    marginTop: 26,
    paddingTop: 18,
    borderTop: "1px solid rgba(255,255,255,0.08)",
  },
  footerText: { fontSize: 13, color: "rgba(255,255,255,0.60)" },
};

// Add the hover class hooks to avoid inline hover limitations.
export default function CS180WithHover() {
  return (
    <div className="cs180-root">
      <CS180 />
      <style>{`
        a[aria-label] { }
        /* attach classes to link/card via query */
        a[href^="/cs180/"] { }
      `}</style>
    </div>
  );
}

/**
 * NOTE:
 * If you want the hover effect to work as written, change the Link like this:
 * <Link ... className="cs180-link" ...>
 *   <div className="cs180-card"> ... </div>
 * </Link>
 *
 * Quick patch:
 * - add className="cs180-link" to Link
 * - add className="cs180-card" to card div
 */
