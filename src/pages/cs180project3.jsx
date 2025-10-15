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
            <p>System of linear equations: </p>
              <MathJax>{String.raw`
\[
A\,
\underbrace{\begin{bmatrix}
h_1\\ h_2\\ h_3\\ h_4\\ h_5\\ h_6\\ h_7\\ h_8
\end{bmatrix}}_{\mathbf{h}}
\;=\;
\mathbf{b}
\]
`}</MathJax>

<MathJax>{String.raw`
\[
A =
\begin{bmatrix}
3120 & 805 & 1 & 0 & 0 & 0 & -5519280 & -1424045 \\
0 & 0 & 0 & 3120 & 805 & 1 & -2224560 & -573965 \\
4364 & 718 & 1 & 0 & 0 & 0 & -12978536 & -2135332 \\
0 & 0 & 0 & 4364 & 718 & 1 & -3430104 & -564348 \\
3116 & 2320 & 1 & 0 & 0 & 0 & -5490392 & -4087840 \\
0 & 0 & 0 & 3116 & 2320 & 1 & -7157452 & -5329040 \\
3984 & 1328 & 1 & 0 & 0 & 0 & -10493856 & -3497952 \\
0 & 0 & 0 & 3984 & 1328 & 1 & -5326608 & -1775536 \\
4837 & 1278 & 1 & 0 & 0 & 0 & -16266831 & -4297914 \\
0 & 0 & 0 & 4837 & 1278 & 1 & -6534787 & -1726578 \\
3706 & 749 & 1 & 0 & 0 & 0 & -8779514 & -1774381 \\
0 & 0 & 0 & 3706 & 749 & 1 & -2731322 & -552013 \\
3757 & 741 & 1 & 0 & 0 & 0 & -9084426 & -1791738 \\
0 & 0 & 0 & 3757 & 741 & 1 & -2765152 & -545376 \\
3772 & 731 & 1 & 0 & 0 & 0 & -9173504 & -1777792 \\
0 & 0 & 0 & 3772 & 731 & 1 & -2742244 & -531437 \\
3823 & 726 & 1 & 0 & 0 & 0 & -9496332 & -1803384 \\
0 & 0 & 0 & 3823 & 726 & 1 & -2790790 & -529980 \\
4319 & 1286 & 1 & 0 & 0 & 0 & -12637394 & -3762836 \\
0 & 0 & 0 & 4319 & 1286 & 1 & -5726994 & -1705236 \\
4537 & 1272 & 1 & 0 & 0 & 0 & -14155440 & -3968640 \\
0 & 0 & 0 & 4537 & 1272 & 1 & -6011525 & -1685400 \\
4327 & 1566 & 1 & 0 & 0 & 0 & -12686764 & -4591512 \\
0 & 0 & 0 & 4327 & 1566 & 1 & -6862622 & -2483676 \\
4556 & 1547 & 1 & 0 & 0 & 0 & -14242056 & -4835922 \\
0 & 0 & 0 & 4556 & 1547 & 1 & -7221260 & -2451995
\end{bmatrix}
\qquad
\mathbf{b} =
\begin{bmatrix}
1769 \\ 713 \\ 2974 \\ 786 \\ 1762 \\ 2297 \\ 2634 \\ 1337 \\ 3363 \\ 1351 \\
2369 \\ 737 \\ 2418 \\ 736 \\ 2432 \\ 727 \\ 2484 \\ 730 \\ 2926 \\ 1326 \\
3120 \\ 1325 \\ 2932 \\ 1586 \\ 3126 \\ 1585
\end{bmatrix}
\]
`}</MathJax>
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

          <div className='subsection'>
            <h3 id="B1">B.1: Harris Corner Detection</h3>
            <MathJaxContext>
            <p>
              The Harris corner detector finds interest points that are stable under small window and illumination changes. 
              A corner is a location where image intensity changes strongly in two perpendicular directions. 
              We compute the image gradients{" "}
              <MathJax inline>{String.raw`\(I_x\)`}</MathJax> and{" "}
              <MathJax inline>{String.raw`\(I_y\)`}</MathJax>, and for each pixel build the second-moment matrix:
            </p>

            <MathJax>{String.raw`
            \[
            M = \begin{bmatrix}
            I_x^2 &  I_x I_y  \\
            I_x I_y & I_y^2 
            \end{bmatrix}
            \]
            `}</MathJax>

            <p>
              The Harris response represents how corner-like a small window in the image is. We will keep local maxima of this response and drop a small border around every image so the window is fully inside the image. The result is many clustered corners in textured areas, so we will need to use Adaptive Non-Maximal Suppression (ANMS) 
              to select a subset of corners that is both strong and well-distributed. For each corner, we define a suppression radius, which is the distance to the nearest stronger corner. 
              Points with large radii are either global maximum or the strongest in a very large neighborhood of pixel values. We will then sort the points by radius and keep the top 500 points as 500 points provides a good spatial coverage of the image without losing many distinctive structure.
            </p>

            <p>
             For each identified point{" "}
              <MathJax inline>{String.raw`\(x_i, y_i \in I\)`}</MathJax> with corner strength{" "}
              <MathJax inline>{String.raw`\(h(x_i, y_i)\)`}</MathJax>, the suppression radius{" "}
              <MathJax inline>{String.raw`\(r_i\)`}</MathJax> is the distance to the nearest {" "}
              significantly stronger neighbor with strength larger by a robustness factor{" "}
              <MathJax inline>{String.raw`\(c_{\mathrm{robust}} = 0.9\)`}</MathJax>. Distances are computed as:
            </p>

            <MathJax>{String.raw`
            \[
            r_i \;=\; \min_{x_j \in I} \;\bigl\lVert x_i - x_j \bigr\rVert
            \quad \text{s.t.} \quad f(x_i) \;<\; c_{\mathrm{robust}} \, f(x_j).
            \]
            `}</MathJax>
            </MathJaxContext>

            <div className="image-sets1">
              <section className="harris">

                <article className="image-card">
                  <img src="/cs180proj3/hnoanms.png" alt="Detected corners without ANMS (min_dist = 1)" />
                  <p className="set-title">Detected Corners without ANMS (min_dist = 1)</p>
                </article>

                <article className="image-card">
                  <img src="/cs180proj3/hnoanmsfilter5.png" alt="Detected corners without ANMS (min_dist = 5)" />
                  <p className="set-title">Detected Corners without ANMS (min_dist = 5)</p>
                </article>

                <article className="image-card">
                  <img src="/cs180proj3/hnoanmsfilter10.png" alt="Detected corners without ANMS (min_dist = 10)" />
                  <p className="set-title">Detected Corners without ANMS (min_dist = 10)</p>
                </article>

                <article className="image-card">
                  <img src="/cs180proj3/hanms500.png" alt="Detected corners with ANMS" />
                  <p className="set-title">Detected Corners with ANMS</p>
                </article>

              </section>      
            </div>

          </div>
          <div className="subsection" id="B2">
            <h3>B.2: Feature Descriptor Extraction</h3>
            <p>
              After performing ANMS to get the strong and well-spread-out corners, we will next identify which of these points correspond to overlapping regions between the two images. To achieve this, we extract a feature descriptor of size 40x40 pixels for each croner found in the previous step. This descriptor compares features between two images
              in a robust way. Before resizing, the (40x40) descriptor is first blurred to reduce alising during the sampling process. Then the (40x40) descriptor will be resized to (8x8). Lastly, the pixel values in the descriptor patch are normalized to make the descriptor invariant to brightness or contrast changes globally and then flattened into a one-dimensional vector containing all three RGB channels.
            </p>
            {/* --- Set 1 --- */}
            <section className="rectify-section">
              <p className="set-title">Set 1</p>
              <div className="rectify-grid">
                <figure className="rectify-card">
                  <img src="/cs180proj3/f1_40x40.png" alt="Set 1 — Feature 1 (40x40)" />
                  <figcaption>Feature 1 (40x40)</figcaption>
                </figure>
                <figure className="rectify-card">
                  <img src="/cs180proj3/f1_40x40_blurred.png" alt="Set 1 — Blurred Feature 1 (40x40)" />
                  <figcaption>Blurred Feature 1 (40x40)</figcaption>
                </figure>
                <figure className="rectify-card">
                  <img src="/cs180proj3/f1_8x8.png" alt="Set 1 — Feature 1 (8x8)" />
                  <figcaption>Feature 1 (8x8)</figcaption>
                </figure>
              </div>
            </section>

            {/* --- Set 2 --- */}
            <section className="rectify-section">
              <p className="set-title">Set 2</p>
              <div className="rectify-grid">
                <figure className="rectify-card">
                  <img src="/cs180proj3/f2_40x40.png" alt="Set 2 — Feature 1" />
                  <figcaption>Feature 2 (40x40)</figcaption>
                </figure>
                <figure className="rectify-card">
                  <img src="/cs180proj3/f2_40x40_blurred.png" alt="Set 2 — Feature 2" />
                  <figcaption>Blurred Feature 2 (40x40)</figcaption>
                </figure>
                <figure className="rectify-card">
                  <img src="/cs180proj3/f2_8x8.png" alt="Set 2 — Feature 3" />
                  <figcaption>Feature 2 (8x8)</figcaption>
                </figure>
              </div>
            </section>

            {/* --- Set 3 --- */}
            <section className="rectify-section">
              <p className="set-title">Set 3</p>
              <div className="rectify-grid">
                <figure className="rectify-card">
                  <img src="/cs180proj3/f3_40x40.png" alt="Set 3 — Feature 1" />
                  <figcaption>Feature 3 (40x40)</figcaption>
                </figure>
                <figure className="rectify-card">
                  <img src="/cs180proj3/f3_40x40_blurred.png" alt="Set 3 — Feature 2" />
                  <figcaption>Blurred Feature 3 (40x40)</figcaption>
                </figure>
                <figure className="rectify-card">
                  <img src="/cs180proj3/f3_8x8.png" alt="Set 3 — Feature 3" />
                  <figcaption>Feature 3 (8x8)</figcaption>
                </figure>
              </div>
            </section>

            {/* --- Set 4 --- */}
            <section className="rectify-section">
              <p className="set-title">Set 4</p>
              <div className="rectify-grid">
                <figure className="rectify-card">
                  <img src="/cs180proj3/f4_40x40.png" alt="Set 4 — Feature 1" />
                  <figcaption>Feature 4 (40x40)</figcaption>
                </figure>
                <figure className="rectify-card">
                  <img src="/cs180proj3/f4_40x40_blurred.png" alt="Set 4 — Feature 2" />
                  <figcaption>Blurred Feature 4 (40x40)</figcaption>
                </figure>
                <figure className="rectify-card">
                  <img src="/cs180proj3/f4_8x8.png" alt="Set 4 — Feature 3" />
                  <figcaption>Feature 4 (8x8)</figcaption>
                </figure>
              </div>
            </section>

            {/* --- Set 5 --- */}
            <section className="rectify-section">
              <p className="set-title">Set 5</p>
              <div className="rectify-grid">
                <figure className="rectify-card">
                  <img src="/cs180proj3/f5_40x40.png" alt="Set 5 — Feature 1" />
                  <figcaption>Feature 5 (40x40)</figcaption>
                </figure>
                <figure className="rectify-card">
                  <img src="/cs180proj3/f5_40x40_blurred.png" alt="Set 5 — Feature 2" />
                  <figcaption>Blurred Feature 5 (40x40)</figcaption>
                </figure>
                <figure className="rectify-card">
                  <img src="/cs180proj3/f5_8x8.png" alt="Set 5 — Feature 3" />
                  <figcaption>Feature 5 (8x8)</figcaption>
                </figure>
              </div>
            </section>
          </div>

          <div className="subsection" id="B3">
            <h3>B.3: Feature Matching</h3>
            <MathJaxContext>
            <p>Feature matching matches correspondences across two images. For each feature descriptor in image 1, we will search all available feature descriptors in image 2 and choose the one with the smallest dissimilarity. This is the pair of features that have the smallest L2 distance between their descriptors. 
            </p>
            <p>However, this may not always be accuarate. Hence, during matching, we first identify the two nearest neighbors for each descriptor (first nearest neighbor and second nearest neighbor that have the lowest and second-lowest L2 distances respectively, denoted by <code>dist1</code> and <code>dist2</code>). To ensure reliable matches,
              we apply Lowe’s ratio to check whether the best match is significantly better than
              the next best match. The ratio <MathJax inline>{String.raw`\( \frac{dist1}{dist2} \)`}</MathJax> must
              be less than a chosen threshold (chosen to be 0.68) to be accepted as a valid match of correspondences. If not, both points are rejected and discarded to prevent false correspondences. Finally, this matching process is repeated for all features in both images and only keeping mutual matches to ensure consistent and robust correspondences.
            </p>
            </MathJaxContext>

            {/* --- Row 1 --- */}
            <section className="rectify-section">
              <div className="rectify-grid" style={{ gridTemplateColumns: '1fr' }}>
                <figure className="rectify-card">
                  <img src="/cs180proj3/match1.png" alt="Feature Matching — Row 1" />
                  <figcaption>match1.png</figcaption>
                </figure>
              </div>
            </section>

            {/* --- Row 2 --- */}
            <section className="rectify-section">
              <div className="rectify-grid" style={{ gridTemplateColumns: '1fr' }}>
                <figure className="rectify-card">
                  <img src="/cs180proj3/match2.png" alt="Feature Matching — Row 2" />
                  <figcaption>match2.png</figcaption>
                </figure>
              </div>
            </section>

            {/* --- Row 3 --- */}
            <section className="rectify-section">
              <div className="rectify-grid" style={{ gridTemplateColumns: '1fr' }}>
                <figure className="rectify-card">
                  <img src="/cs180proj3/match3.png" alt="Feature Matching — Row 3" />
                  <figcaption>match3.png</figcaption>
                </figure>
              </div>
            </section>
          </div>


          <div className="subsection" id="B4">
            <h3>B.4: RANSAC for Robust Homography</h3>
            <MathJaxContext>
            <h4>Procedure</h4>
            <ol style={{ lineHeight: 1.7 }}>
              <li>
                Select four feature pairs at random without replacement to form a minimal set needed for homography estimation
              </li>
              <li>
                Compute the exact homography{" "}
                <MathJax inline>{String.raw`\(H\)`}</MathJax> 
              </li>
              <li>
                Count inliers for every computed homography{" "}
                <MathJax inline>{String.raw`\(H\)`}</MathJax> 
              </li>
              <li>
                Keep the homography {" "}
                <MathJax inline>{String.raw`\(H\)`}</MathJax>  with the most inliers and store this set of best inliers
              </li>
              <li>
                Find the best {" "}
                <MathJax inline>{String.raw`\(H\)`}</MathJax> using all inliers by performing least squares estimation to obtain the most robust homography  {" "}
                <MathJax inline>{String.raw`\(H\)`}</MathJax> 
              </li>
            </ol>
            <h4>Parameters</h4>
            <ul>
              <li>Iterations: 1000</li>
              <li>Threshold: 1 pixel</li>
            </ul>
            </MathJaxContext>

            {/* --- Set 1 --- */}
            <section className="rectify-section">
              <p className="set-title">Set 1</p>
              <div className="rectify-grid" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                <figure className="rectify-card">
                  <img src="/cs180proj3/mosaic1.jpg" alt="Set 1 — Manual Stitching" />
                  <figcaption>Set 1 — Manual Stitching (mosaic1.jpg)</figcaption>
                </figure>
                <figure className="rectify-card">
                  <img src="/cs180proj3/auto3.jpg" alt="Set 1 — Auto Stitching" />
                  <figcaption>Set 1 — Auto Stitching (auto1.jpg)</figcaption>
                </figure>
              </div>
            </section>

            {/* --- Set 2 --- */}
            <section className="rectify-section">
              <p className="set-title">Set 2</p>
              <div className="rectify-grid" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                <figure className="rectify-card">
                  <img src="/cs180proj3/mosaic2.jpg" alt="Set 2 — Manual Stitching" />
                  <figcaption>Set 2 — Manual Stitching (mosaic2.jpg)</figcaption>
                </figure>
                <figure className="rectify-card">
                  <img src="/cs180proj3/auto2.jpg" alt="Set 2 — Auto Stitching" />
                  <figcaption>Set 2 — Auto Stitching (auto2.jpg)</figcaption>
                </figure>
              </div>
            </section>

            {/* --- Set 3 --- */}
            <section className="rectify-section">
              <p className="set-title">Set 3</p>
              <div className="rectify-grid" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                <figure className="rectify-card">
                  <img src="/cs180proj3/mosaic3.jpg" alt="Set 3 — Manual Stitching" />
                  <figcaption>Set 3 — Manual Stitching (mosaic1.jpg)</figcaption>
                </figure>
                <figure className="rectify-card">
                  <img src="/cs180proj3/auto1.jpg" alt="Set 3 — Auto Stitching" />
                  <figcaption>Set 3 — Auto Stitching (auto3.jpg)</figcaption>
                </figure>
              </div>
            </section>
          </div>

        </section>
        
      </main>
    </div>
  );
};

export default CS180Proj3;
