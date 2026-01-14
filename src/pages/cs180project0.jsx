const CS180Proj0 = () => {
  const styles = {
    cs180: {
      minHeight: "100vh",
      // if you already have CSS variables from your global theme, this will still work:
      background: "linear-gradient(180deg, var(--bg), #0a0c10)",
      color: "var(--text)",
      fontFamily:
        'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"',
      lineHeight: 1.6,
    },

    hero: {
      maxWidth: 1100,
      margin: "0 auto",
      padding: 24,
    },

    h1: {
      fontSize: "clamp(28px, 3.2vw, 44px)",
      margin: "16px 0 8px",
    },

    h2: {
      fontSize: "clamp(16px, 2vw, 22px)",
      margin: "28px 0 14px",
      color: "var(--text)",
      letterSpacing: ".2px",
    },

    // CENTERED 2-column row, responsive
    photoRow: {
      display: "grid",
      gridTemplateColumns: "repeat(2, minmax(260px, 420px))",
      justifyContent: "center",
      gap: 20,
      margin: "14px 0 18px",
    },

    photo: {
      textAlign: "center",
    },

    img: {
      width: "100%",
      height: "auto",
      display: "block",
      borderRadius: 6,
    },

    figcaption: {
      marginTop: 8,
      fontSize: 13,
      fontStyle: "italic",
      color: "var(--muted, rgba(255,255,255,0.65))",
    },

    explain: {
      maxWidth: 860,
      margin: "0 auto 30px",
      color: "black",
      lineHeight: 1.65,
    },

    single: {
      maxWidth: 420,
      margin: "16px auto 32px",
      textAlign: "center",
    },

    // a lightweight responsive tweak using inline media-query alternative:
    // We'll do it by switching the grid template at runtime.
  };

  // basic responsive behavior without CSS media queries:
  const isNarrow =
    typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia("(max-width: 720px)").matches
      : false;

  const photoRowStyle = isNarrow
    ? {
        ...styles.photoRow,
        gridTemplateColumns: "minmax(0, 520px)",
      }
    : styles.photoRow;

  return (
    <div style={styles.cs180}>
      <main style={styles.hero}>
        <h1 style={styles.h1}>Project 0</h1>

        <h2 style={styles.h2}>Part 1: Selfie: The Wrong Way vs. The Right Way</h2>

        <div style={photoRowStyle}>
          <figure style={styles.photo}>
            <img style={styles.img} src="/cs180proj0/nozoom.png" alt="No zoom, close up" />
            <figcaption style={styles.figcaption}>No zoom, close up</figcaption>
          </figure>

          <figure style={styles.photo}>
            <img style={styles.img} src="/cs180proj0/zoomedin.png" alt="Zoomed in, far away" />
            <figcaption style={styles.figcaption}>Zoomed in, far away</figcaption>
          </figure>
        </div>

        <p style={styles.explain}>
          Placing camera very close to the face with no zoom makes the facial features closer to
          camera appear much larger and features further away appear smaller as phone camera
          exaggerates the depth of different facial features.
        </p>

        <h2 style={styles.h2}>Part 2: Architectural Perspective Compression</h2>

        <div style={photoRowStyle}>
          <figure style={styles.photo}>
            <img
              style={styles.img}
              src="/cs180proj0/buildingnozoom.jpg"
              alt="No zoom, close up"
            />
            <figcaption style={styles.figcaption}>No zoom, close up</figcaption>
          </figure>

          <figure style={styles.photo}>
            <img
              style={styles.img}
              src="/cs180proj0/buildingzoomedin.jpg"
              alt="Zoomed in, far away"
            />
            <figcaption style={styles.figcaption}>Zoomed in, far away</figcaption>
          </figure>
        </div>

        <h2 style={styles.h2}>Part 3: The Dolly Zoom</h2>

        <figure style={styles.single}>
          <img style={styles.img} src="/cs180proj0/lamppost.gif" alt="Dolly zoom lamppost" />
          <figcaption style={styles.figcaption}>Lamppost dolly zoom</figcaption>
        </figure>
      </main>
    </div>
  );
};

export default CS180Proj0;
