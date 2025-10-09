import "./cs180proj3.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { MathJaxContext, MathJax } from "better-react-mathjax";

const CS180Proj3 = () => {

  // --- Scroll spy setup ---
  const sectionDefs = useMemo(() => ([
    { id: "A",    label: <b>Part A</b> },
    { id: "A1",  label: "Shoot the Pictures" },
    { id: "A2", label: "Recover Homographies" },
    { id: "A3",    label: "Warp the Images" },
    { id: "A4",    label: "Blend the Images into a Mosaic" },
    { id: "B",     label: <b>Part B</b> },
    { id: "B1",  label: "Harris Corner Detection" },
    { id: "B2",  label: "Feature Descriptor Extraction" },
    { id: "B3",     label: "Feature Matching" },
    { id: "B4",     label: "RANSAC for Robust Homography" },
    
  ]), []);

  const [active, setActive] = useState(sectionDefs[0].id);
  const [progress, setProgress] = useState(0);
  const pageRef = useRef(null);

  useEffect(() => {
    const sections = sectionDefs.map(s => document.getElementById(s.id)).filter(Boolean);

    // intersection observer for active section
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { root: null, rootMargin: "0px 0px -60% 0px", threshold: 0.2 }
    );
    sections.forEach(sec => obs.observe(sec));

    // scroll progress
    const onScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(Math.min(100, Math.max(0, (scrollTop / docH) * 100)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      obs.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [sectionDefs]);

 

 

  const config = { loader: { load: ["input/tex", "output/chtml"] } };





  return (
    <div className="cs180" ref={pageRef}>
      {/* top progress bar */}
      <div className="progress-wrap" aria-hidden="true">
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>

      {/* sticky left nav */}
      <aside className="toc">
        <nav>
          <div className="toc-title">On this page</div>
          <ul>
            {sectionDefs.map(s => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className={active === s.id ? "active" : ""}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* main content */}
      <main className="hero">
        <header className="page-header">
          <h1>Project 3</h1>
          <h2>[Auto]Stitching Photo Mosaics</h2>
        </header>

        <section id="overview" className="section block">
          <h2>Overview</h2>
          <div className="overview-text">
            <p>Project 3 aims to create seamless panoramas by capturing multiple images, estimating homographies from the correspondences of these images, projectively warping and resampling them, then feather-blending into a single mosaic.</p>
          </div>
        </section>

        <section className="section block">
          <div className='section-intro'>
            <h2 id="A">Part A</h2>
          </div>

          <div className='subsection'>
            <h3 id="A1">A.1: Shoot the Pictures</h3>
            <p>Below are 2 sets of images with projective transformations between them. These images are taken with a fixed center of projection and rotating camera around that fixed center of projection.</p>
            <div className="image-sets">
              <section className="image-set">
                <p className="set-title">Set 1</p>
                <div className="pair">
                  <img src="/cs180proj3/set5/5.jpg" alt="" className="mediumimg" />
                  <img src="/cs180proj3/set5/6.jpg" alt="" className="mediumimg" />
                </div>
              </section>

              <section className="image-set">
                <p className="set-title">Set 2</p>
                <div className="pair">
                  <img src="/cs180proj3/set6/5.jpg" alt="" className="mediumimg" />
                  <img src="/cs180proj3/set6/7.jpg" alt="" className="mediumimg" />
                </div>
              </section>
            </div>
          </div>
          
          <div id="A2" className="subsection">
            <h3>A.2: Recover Homographies</h3>
            <MathJaxContext>
      <div className="homography-notes">
        <p>
          To warp one image into alignment with another, estimate a planar
          homography <MathJax inline>{String.raw`\(H\)`}</MathJax> mapping points from the
          source image to the reference. Using homogeneous coordinates{" "}
          <MathJax inline>{String.raw`\(\mathbf{x}=[x,y,1]^\top\)`}</MathJax> and{" "}
          <MathJax inline>{String.raw`\(\mathbf{x}'=[u,v,1]^\top\)`}</MathJax>, we apply the equation
          <MathJax inline>{String.raw` \(\lambda\mathbf{x}'= H\,\mathbf{x}\)`}</MathJax> with{" "}
          <MathJax inline>{String.raw`\(H\in\mathbb{R}^{3\times 3}\)`}</MathJax> having 8 degrees of
          freedom with the last degree being <MathJax inline>{String.raw`\(h_{9}=1\)`}</MathJax>. We reshape the matrix H into <MathJax inline>{String.raw`\(\mathbf{h} = [h_1, h_2, h_3, h_4, h_5, h_6, h_7, h_8]^\top\)`}</MathJax>.
        </p>
      


        <MathJax>{String.raw`
          \[
          \begin{aligned}
          u &= \frac{h_{1}x + h_{2}y + h_{3}}{h_{7}x + h_{8}y + 1},\qquad
          v = \frac{h_{4}x + h_{5}y + h_{6}}{h_{7}x + h_{8}y + 1},
          \end{aligned}
          \]
          `}</MathJax>

        <p>
          We cross–multiplying each
          correspondence <MathJax inline>{String.raw`\((x,y)\mapsto(\lambda u,\lambda v)\)`}</MathJax>{" "}
          gives two linear equations in the 8 unknowns{" "}
          <MathJax inline>{String.raw`\(\mathbf{h}=[h_{1},h_{2},h_{3},h_{4},h_{5},h_{6},h_{7},h_{8}]^\top\)`}</MathJax>:
        </p>

        <MathJax>{String.raw`
        \[
        \begin{aligned}
        h_{1} x + h_{2} y + h_{3} - u h_{7} x - u h_{8} y &= u,\\
        h_{4} x + h_{5} y + h_{6} - v h_{7} x - v h_{8} y &= v.
        \end{aligned}
        \]
        `}</MathJax>

        <p>
          Stacking all pairs gives us a linear system{" "}
          <MathJax inline>{String.raw`\(A\mathbf{h}= \mathbf{b}\)`}</MathJax> with{" "}
          <MathJax inline>{String.raw`\(A\in\mathbb{R}^{2n\times 8}\)`}</MathJax> and{" "}
          <MathJax inline>{String.raw` \(\mathbf{b}\in\mathbb{R}^{2n}\)`}</MathJax>:
        </p>

        <MathJax>{String.raw`
        \[
        \underbrace{\begin{bmatrix}
        x_1 & y_1 & 1 & 0 & 0 & 0 & -x_1 u_1 & -y_1 u_1\\
        0 & 0 & 0 & x_1 & y_1 & 1 & -x_1 v_1 & -y_1 v_1\\
        \vdots & & & & & & & \vdots\\
        x_n & y_n & 1 & 0 & 0 & 0 & -x_n u_n & -y_n u_n\\
        0 & 0 & 0 & x_n & y_n & 1 & -x_n v_n & -y_n v_n
        \end{bmatrix}}_{A}
        \underbrace{\begin{bmatrix}
        h_{1}\\h_{2}\\h_{3}\\h_{4}\\h_{5}\\h_{6}\\h_{7}\\h_{8}
        \end{bmatrix}}_{\mathbf{h}}
        =
        \underbrace{\begin{bmatrix}
        u_1\\v_1\\ \vdots \\ u_n\\v_n
        \end{bmatrix}}_{\mathbf{b}}.
        \]
        `}</MathJax>

        <p>
          Solve in least squares (for <MathJax inline>{String.raw`\(n\ge 4\)`}</MathJax>):
        </p>

        <MathJax>{String.raw`
        \[
        {\mathbf{h}^\star} \;=\; \arg\min_{\mathbf{h}}\|A\mathbf{h}-\mathbf{b}\|_2^2
        \;
        \]
        `}</MathJax>

        <p>
          Finally, we reshape{" "}
          <MathJax inline>{String.raw`\({\mathbf{h}}^\star\)`}</MathJax> into{" "}
          <MathJax inline>{String.raw`\(H\)`}</MathJax> with{" "}
          <MathJax inline>{String.raw`\(h_{9}=1\)`}</MathJax>.
        </p>

        <MathJax>{String.raw`
          \[
          H_{\text{im}\to\text{ref}} \;=\;
          \begin{bmatrix}
          h_{1} & h_{2} & h_{3}\\
          h_{4} & h_{5} & h_{6}\\
          h_{7} & h_{8} & 1
          \end{bmatrix}.
          \]
        `}</MathJax>
          </div>
        </MathJaxContext>
          <img src="/cs180proj3/a2.png" className="mediumimg" alt="" loading="lazy" decoding="async" />
          <MathJaxContext>
            <MathJax>{String.raw`\[
            H =
            \begin{bmatrix}
            1.74892766 & 2.21452031\times 10^{-2} & -2.97648822\times 10^{3} \\
            2.88647655\times 10^{-1} & 1.50634520 & -1.10380006\times 10^{3} \\
            1.28402473\times 10^{-4} & 1.38496925\times 10^{-5} & 1
            \end{bmatrix}
            \]`}</MathJax>
          </MathJaxContext>
          </div>

          <div id="A3" className="subsection">
            <h3>A.3: Warp the Images</h3>

            {/* Outlet row */}
            <div className="rectify-section">
              <h4 className="set-title">Outlet</h4>
              <div className="rectify-grid">
                <figure className="rectify-card">
                  <img src="/cs180proj3/outlet.jpg" alt="Outlet original" loading="lazy" decoding="async" />
                  <figcaption>Original</figcaption>
                </figure>
                <figure className="rectify-card">
                  <img src="/cs180proj3/outlet_rectified_nn.jpg" alt="Outlet rectified (nearest neighbor)" loading="lazy" decoding="async" />
                  <figcaption>Nearest Neighbor</figcaption>
                </figure>
                <figure className="rectify-card">
                  <img src="/cs180proj3/outlet_rectified_bil.jpg" alt="Outlet rectified (bilinear)" loading="lazy" decoding="async" />
                  <figcaption>Bilinear</figcaption>
                </figure>
              </div>
            </div>

            {/* Wardrobe row */}
            <div className="rectify-section">
              <h4 className="set-title">Wardrobe</h4>
              <div className="rectify-grid">
                <figure className="rectify-card">
                  <img src="/cs180proj3/wardrobe.jpg" alt="Wardrobe original" loading="lazy" decoding="async" />
                  <figcaption>Original</figcaption>
                </figure>
                <figure className="rectify-card">
                  <img src="/cs180proj3/wardrobe_rectified_nn.jpg" alt="Wardrobe rectified (nearest neighbor)" loading="lazy" decoding="async" />
                  <figcaption>Nearest Neighbor</figcaption>
                </figure>
                <figure className="rectify-card">
                  <img src="/cs180proj3/wardrobe_rectified_bil.jpg" alt="Wardrobe rectified (bilinear)" loading="lazy" decoding="async" />
                  <figcaption>Bilinear</figcaption>
                </figure>
              </div>
            </div>
          </div>


          <div id="A4" className="subsection">
            <h3>A.4: Blend the Images into a Mosaic</h3>
            <h4>Procedure</h4>
            <ul>
              <ol>1. Compute homography from image to reference</ol>
              <MathJaxContext>
                <MathJax>{String.raw`\[
                H_{\text{im}\to\text{ref}} =
                \begin{bmatrix}
                h_{11} & h_{12} & h_{13} \\
                h_{21} & h_{22} & h_{23} \\
                h_{31} & h_{32} & h_{33}
                \end{bmatrix}
                \]`}
                </MathJax>
              </MathJaxContext>
              
              <ol>2. Create a global canvas to fit both reference image and other images to warp</ol>
              <ol>3. Compute homographies from reference and the other images into the canvas</ol>
               <MathJaxContext>
                <MathJax>{String.raw`\[
                T_{\text{ref}\to\text{canvas}}=
                \begin{bmatrix}
                1 & 0 & -\text{offset}_x \\
                0 & 1 & -\text{offset}_y \\
                0 & 0 & 1
                \end{bmatrix}
                \]`}

                {String.raw`\[
                  H_{\text{im}\to\text{canvas}} =
                  T_{\text{ref}\to\text{canvas}} \cdot H_{\text{im}\to\text{ref}}
                  \]`}            
                </MathJax>
              </MathJaxContext>
              <ol>4. Create smooth alpha masks for blending</ol>
              <ol>5. Warp all images and their corresponding masks into the canvas</ol>
              <ol>6. Use a weighted average for a feathered blending</ol>
              
              
            </ul>
            {/* Mosaic 1 */}
            <div className="mosaic-block">
              <h4 className="mosaic-title">Mosaic 1</h4>
              <div className="mosaic-grid">
                <figure className="orig">
                  <img src="/cs180proj3/set5/5.jpg" alt="Set 1 - left original" loading="lazy" decoding="async" />
                  <figcaption>Original (Set 1 - Left)</figcaption>
                </figure>
                <figure className="orig">
                  <img src="/cs180proj3/set5/6.jpg" alt="Set 1 - right original" loading="lazy" decoding="async" />
                  <figcaption>Original (Set 1 - Right)</figcaption>
                </figure>

                <figure className="mosaic-result">
                  <img src="/cs180proj3/mosaic2.jpg" alt="Mosaic 1 result" loading="lazy" decoding="async" />
                  <figcaption>Mosaic 1 Result</figcaption>
                </figure>
              </div>
            </div>

            {/* Mosaic 2 */}
            <div className="mosaic-block">
              <h4 className="mosaic-title">Mosaic 2</h4>
              <div className="mosaic-grid">
                <figure className="orig">
                  <img src="/cs180proj3/set6/5.jpg" alt="Set 2 - left original" loading="lazy" decoding="async" />
                  <figcaption>Original (Set 2 - Left)</figcaption>
                </figure>
                <figure className="orig">
                  <img src="/cs180proj3/set6/7.jpg" alt="Set 2 - right original" loading="lazy" decoding="async" />
                  <figcaption>Original (Set 2 - Right)</figcaption>
                </figure>

                <figure className="mosaic-result">
                  <img src="/cs180proj3/mosaic1.jpg" alt="Mosaic 2 result" loading="lazy" decoding="async" />
                  <figcaption>Mosaic 2 Result</figcaption>
                </figure>
              </div>
            </div>

            {/* Mosaic 3 */}
            <div className="mosaic-block">
              <h4 className="mosaic-title">Mosaic 3</h4>
              <div className="mosaic-grid">
                <figure className="orig">
                  <img src="/cs180proj3/set7/1.jpg" alt="Set 3 - left original" loading="lazy" decoding="async" />
                  <figcaption>Original (Set 3 - Left)</figcaption>
                </figure>
                <figure className="orig">
                  <img src="/cs180proj3/set7/2.jpg" alt="Set 3 - right original" loading="lazy" decoding="async" />
                  <figcaption>Original (Set 3 - Right)</figcaption>
                </figure>

                <figure className="mosaic-result">
                  <img src="/cs180proj3/mosaic3.jpg" alt="Mosaic 3 result" loading="lazy" decoding="async" />
                  <figcaption>Mosaic 3 Result</figcaption>
                </figure>
              </div>
            </div>
          </div>


        </section>

      </main>
    </div>
  );
};

export default CS180Proj3;
