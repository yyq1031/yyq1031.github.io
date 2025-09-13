import "./cs180proj1.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { MathJaxContext, MathJax } from "better-react-mathjax";

const CS180Proj1 = () => {
  const images = [
    { file: 'cathedral.jpg', offsets: { green: { dx: 2, dy: 5 },  red: { dx: 3,  dy: 12 } } },
    { file: 'church.tif',    offsets: { green: { dx: 4, dy: 25 }, red: { dx: -4, dy: 58 } } },
    { file: 'emir.tif',      offsets: { green: { dx: 24, dy: 49 }, red: { dx: 40, dy: 107 } } },
    { file: 'harvesters.tif',offsets: { green: { dx: 17, dy: 60 }, red: { dx: 14, dy: 124 } } },
    { file: 'icon.tif',      offsets: { green: { dx: 17, dy: 42 }, red: { dx: 23, dy: 90 } } },
    { file: 'italil.tif',    offsets: { green: { dx: 22, dy: 38 }, red: { dx: 36, dy: 77 } } },
    { file: 'lastochikino.tif', offsets:{ green:{ dx:-2, dy:-3 },  red:{ dx:-8, dy: 76 } } },
    { file: 'lugano.tif',    offsets: { green: { dx:-17, dy: 41 }, red: { dx:-29, dy: 92 } } },
    { file: 'melons.tif',    offsets: { green: { dx: 10, dy: 80 }, red: { dx: 13, dy: 177 } } },
    { file: 'monastery.jpg', offsets: { green: { dx: 2, dy: -3 },  red: { dx: 2,  dy: 3 } } },
    { file: 'self_portrait.tif', offsets:{ green:{ dx:29, dy:78 }, red:{ dx:37, dy:176 } } },
    { file: 'siren.tif',     offsets: { green: { dx:-6, dy: 49 },  red: { dx:-24, dy: 96 } } },
    { file: 'three_generations.tif', offsets:{ green:{ dx:12, dy:54 }, red:{ dx:9, dy:111 } } },
    { file: 'tobolsk.jpg',   offsets: { green: { dx: 3, dy: 3 },   red: { dx: 3,  dy: 6 } } },
    { file: '1.tif',         offsets: { green: { dx: 0, dy: 32 },  red: { dx: -1, dy: 134 } } },
    { file: '2.tif',         offsets: { green: { dx:-17, dy: 28 }, red: { dx:-34, dy: 64 } } },
    { file: '3.tif',         offsets: { green: { dx:-16, dy: 33 }, red: { dx:-25, dy: 78 } } },
    { file: '4.tif',         offsets: { green: { dx: 12, dy: 58 }, red: { dx: 24, dy: 125 } } },
    { file: '5.tif',         offsets: { green: { dx: 3, dy: 44 },  red: { dx: 2,  dy: 164 } } },
    { file: '6.tif',         offsets: { green: { dx:-11, dy: 33 }, red: { dx:-26, dy: 139 } } },
  ];

  const params = {
    "no sobel": { downsampling_scale: 2, search_window: "[-5, 5]",  search_window_coarse: "[-15, 15]" },
    "sobel":    { downsampling_scale: 2, search_window: "[-5, 5]", search_window_coarse: "[-15, 15]" }
  };

  const outPath = (file) => {
    const stem = file.replace(/\.[^.]+$/, '');
    return `/cs180proj1/out/${stem}_aligned.jpg`;
  };

  const jpgs = images.filter(({ file }) => /\.jpg$/i.test(file));
  const numberedTifs = images.filter(({ file }) => /^[1-6]\.tif$/i.test(file));
  const tifs = images.filter(({ file }) => /\.tif$/i.test(file) && !/^[1-6]\.tif$/i.test(file));
  const tiffsNoEmir = images.filter(({ file }) => /\.tif(f)?$/i.test(file) && file.toLowerCase() !== "emir.tif");
  const emirComparisons = [
    { src: "/cs180proj1/out/emir_aligned_without_sobel.jpg", label: "emir_aligned.jpg (NCC)",
      offsets: { green: { dx: 24, dy: 49 }, red: { dx: -249, dy: 95 } }, },
    { src: "/cs180proj1/out/emir_aligned.jpg", label: "emir_aligned.jpg (Sobel)",
      offsets: { green: { dx: 23, dy: 49 }, red: { dx: 40, dy: 107 } }, }
  ];

  // --- Scroll spy setup ---
  const sectionDefs = useMemo(() => ([
    { id: "overview",  label: "Overview" },
    { id: "preprocess", label: "Image Preprocess" },
    { id: "simple",    label: "Simple Alignment" },
    { id: "pyramids",  label: "Image Pyramids" },
    { id: "problems",  label: "Problems Encountered" },
    { id: "sobel",     label: "Sobel Derivatives" },
    { id: "final",     label: "Final Alignment" },
    { id: "other",     label: "Aligning Other Images" },
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

  const ImageGrid = ({ list }) => (
    <div className="photo-row">
      {list.map(({ file, offsets }) => (
        <div className="photo card" key={file}>
          <div className="thumb">
            <img src={outPath(file)} alt={`aligned-${file}`} loading="lazy" />
          </div>
          <div className="meta">
            <p className="filename">{file}</p>
            <div className="chips">
              <span className="chip chip--green"><b>Green</b> dx {offsets.green.dx}, dy {offsets.green.dy}</span>
              <span className="chip chip--red"><b>Red</b> dx {offsets.red.dx}, dy {offsets.red.dy}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const ImageGridWithOffsets = ({ items }) => (
    <div className="photo-row">
      {items.map(({ src, label, offsets }) => (
        <div className="photo card" key={src}>
          <div className="thumb">
            <img src={src} alt={label} loading="lazy" />
          </div>
          <div className="meta">
            <p className="filename">{label}</p>
            {offsets && (
              <div className="chips">
                <span className="chip chip--green"><b>Green</b> dx = {offsets.green.dx}, dy = {offsets.green.dy}</span>
                <span className="chip chip--red"><b>Red</b> dx = {offsets.red.dx}, dy = {offsets.red.dy}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

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
          <h1>Project 1</h1>
          <h2>Prokudin-Gorskii Color Image Reconstruction</h2>
        </header>

        <section id="overview" className="section block">
          <h2>Overview</h2>
          <div className="overview-text">
            <p>Sergei Mikhailovich Prokudin-Gorskii (1863–1944) pioneered early color photography. Starting in 1907, he traveled the Russian Empire with the Tzar’s approval, shooting three-filter glass-plate exposures and captured the only color portrait of Leo Tolstoy. His RGB negatives were retained and acquired by the Library of Congress in 1948, which has since digitized and shared them online.
            </p>
            <p>
            This project aims to reconstruct color images from the Prokudin-Gorskii glass plate negatives by extracting the three color channels (B, G, R) and aligning them into a single RGB image that is sharp and true to original with minimal artifacts.</p>
          </div>
        </section>

        <section id="approach" className="section block">
          <h2>Approach</h2>

          <div id="preprocess" className="subsection">
            <h3>Image Preprocess</h3>
            <p>The approach for this project is to align green and red channels to the blue channel (base channel) to form the final colorized image. Each image is read as floating point numbers to scale pixels to the [0, 1] range, avoiding integer rounding and overflow during arithmetic operations in the later steps. Each image is then separated into blue, green, and red channels by slicing the image height evenly into the three color channels. However, some borders of the three color channels can be noisy and interfere with the alignment. To reduce the effect of noisy borders, the outer 10% of each channel is cropped before applying any alignment algorithm, returning the centered interior regions only.</p>
          </div>

          <div id="simple" className="subsection">
            <h3>Simple Alignment with Exhaustive Search</h3>
            <p>To test the correctness of the alignment algorithm, the smaller JPG images are used. A simple alignment algorithm performs an exhaustive search within a fixed window size of 30 pixels, starting from an initial offset guess of (0, 0) by assuming all color channels are aligned perfectly at the beginning of each exhaustive search. Exhaustive search evaluates every integer shift (x, y) in the search window centered around the initial guess (0, 0) by shifting the other image with <code>np.roll</code> and computes a similarity score using the chosen metric, and keeps the shift that outputs the best score. Exhaustive search will then returns the best shift (dx, dy). At the end, both red and green channels are then aligned to the blue channel using <code>np.roll</code> based on the final offsets outputted by the simple exhaustive search algorithm.
            </p>

            <p>To evaluate the similarities of two channel images based on the pixel values, metrics such as Sum of Squared Differences (SSD) and Normalized Cross Correlation (NCC) are used. Comparing the two metrics for scoring the pixel alignment, NCC is chosen as it gives more robust and accurate alignment results compared to SSD.</p>
            <h4>Parameters </h4>
            <ul>
              <li>Search Window: [-30, 30] pixels</li>
            </ul>

            <MathJaxContext version={3} className="math" config={config}>
              <div>
                <h4>Sum of Squared Differences (SSD)</h4>
                <MathJax>
                  {"\\( \\text{SSD}(I_1, I_2) = \\sum_{x,y} ( I_1(x,y) - I_2(x,y) )^2 \\)"}
                </MathJax>
                <p>SSD measures the degree of similarity between pixel intensities as it assumes that the pixel intensities of the two images being compared are directly comparable, which is an assumption that often fails. In the case when one of the three color channels have very different intensity distributions, then SSD will penalizes these brightness differences heavily even under perfect alignment. Similarly, if one of the color channels is consistently brighter or darker throughout, then SSD will also result in an inaccurate alignment. SSD is also sensitive to outliers.</p>

                <h4>Normalized Cross Correlation (NCC)</h4>
                <MathJax>
                  {"\\( \\text{NCC}(I_1, I_2) = \\dfrac{ \\sum_{x,y} ( I_1(x,y) - \\mu_{I_1} )( I_2(x,y) - \\mu_{I_2} ) }{ \\sqrt{ \\sum_{x,y} ( I_1(x,y) - \\mu_{I_1} )^2 } \\; \\sqrt{ \\sum_{x,y} ( I_2(x,y) - \\mu_{I_2} )^2 } } \\)"}
                </MathJax>
                <p>
                NCC is a better metric as it measures how two images correlate to each other in terms of pixel intensities. NCC rescales intensities in order to compare the pattern of variation across the two images rather than absolute brightness between them. NCC also focuses on these shared structures and patterns across images, ignoring global brightness and contrast differences that might be present due to the technology at the time when these glass plates are created.
                </p>
              </div>
            </MathJaxContext>

            <ImageGrid list={jpgs} />
          </div>

          <div id="pyramids" className="subsection">
            <h3>Alignment with Image Pyramids</h3>
            <p>Exhaustive search works well on small images like JPG files, but is too slow and computationally expensive for the alignment of large TIFF files. Image pyramids are introduced to increase the speed of alignment for large images. The pyramid is built by repeatedly blurring and downsampling the previous higher resolution image by a factor of 2 (repeatedly halving the width and height of the image) using <code>cv2.resize</code> until the smallest and coarsest image in the pyramid drops below 300 pixels. The returned list of images will contain the original resolution at index 0 followed by progressively coarser image. Alignment begins at the coarsest level, where a larger search window of 15 pixels is used. The estimated best guess alignment from the previous coarser image is then scaled up by a factor of 2 and refined at each higher resolution level with a smaller window of 5 pixels. This alignment algorithm fundamentally uses the exhaustive search defined earlier, but with different search window sizes and alignment at each level of the image pyramid. This approach is much faster and still finds accurate alignments for the TIFF images.</p>

            <h4>Parameters (NCC)</h4>
            <ul>
              <li>Downsampling scale: {params["no sobel"].downsampling_scale}</li>
              <li>Search window (fine levels): {params["no sobel"].search_window} pixels</li>
              <li>Search window (coarse level): {params["no sobel"].search_window_coarse} pixels</li>
            </ul>
            <ImageGrid list={tiffsNoEmir} />
          </div>

          <div id="problems" className="subsection">
            <h3>Problems Encountered</h3>
            <p>Using the original color channels without cropping the borders results in very poor alignment. However, cropping the borders equally by 10% improves the accuracy of the alignment significantly. Moreover, emir.tif is the most challenging image to align accurately as the brightness of each color channel is very different. Brightness differences hence cause poor alignment when using pixel intensities alone. This is solved by introducing sobel derivatives.</p>
            <ImageGridWithOffsets items={emirComparisons} />
          </div>

          <div id="sobel" className="subsection">
            <h3>Sobel Derivatives for Edge Detection</h3>
            <p>Sobel derivatives are used to approximate the image gradient, which highlights the regions of rapid intensity change that represent true edges in an image. Edges are much less sensitive to absolute brightness differences than raw pixel values, making them extremely useful when the three Prokudin-Gorskii channels have very different intensity distributions. By working with gradients instead of intensities, alignment focuses on structural features like outlines of faces, windows, and buildings. This approach addresses the issue where color channels with different exposures or filter responses cannot be aligned accurately using intensity-based metrics only. The downsampling factor in the image pyramid remains at 2 to have a balance between speed and accuracy for high-resolution TIFF images.</p>

            <h4>Parameters (Sobel)</h4>
            <ul>
              <li>Downsampling scale: {params["sobel"].downsampling_scale}</li>
              <li>Search window (fine levels): {params["sobel"].search_window} pixels</li>
              <li>Search window (coarse level): {params["sobel"].search_window_coarse} pixels</li>
            </ul>

            <MathJaxContext version={3} config={config}>
              <div className="math">
                <p><b>Sobel derivatives are given by:</b></p>

                <p><b>Horizontal changes:</b></p>
                <MathJax>
                  {"\\( G_x = \\begin{bmatrix} -1 & 0 & 1 \\\\ -2 & 0 & 2 \\\\ -1 & 0 & 1 \\end{bmatrix} * I \\)"}
                </MathJax>

                <p><b>Vertical changes:</b></p>
                <MathJax>
                  {"\\( G_y = \\begin{bmatrix} -1 & -2 & -1 \\\\ 0 & 0 & 0 \\\\ 1 & 2 & 1 \\end{bmatrix} * I \\)"}
                </MathJax>

                <p><b>Gradient magnitude:</b></p>
                <MathJax>
                  {"\\( G = \\sqrt{ G_x^2 + G_y^2 } \\)"}
                </MathJax>
                <p>
                After applying Sobel derivatives, which approximate the gradient of intensity with horizontal filter G<sub>x</sub> and vertical filter G<sub>y</sub>, the gradient magnitude <code>G = sqrt(G<sub>x</sub>² + G<sub>y</sub>²)</code> highlights the edges of the images. NCC is then performed on these edge maps to find the best alignment.
                </p>
              </div>
            </MathJaxContext>
          </div>

          <div id="final" className="subsection">
            <h3>Final Alignment</h3>
            <ImageGrid list={tifs} />
          </div>

          <div id="other" className="subsection">
            <h3>Aligning Other Images</h3>
            <p>Using the alignment algorithm, more TIFF images from the <a href="https://www.loc.gov/collections/prokudin-gorskii/?st=grid">Prokudin-Gorskii</a> collection are processed.</p>
            <ImageGrid list={numberedTifs} />
          </div>

          <div id="notes" className="subsection">
            <h3>Notes for Running Jupyter Notebook</h3>
            <p>Run NCC only:</p>
            <pre><code>run_alignment(sobel_enabled=False, "ncc")</code></pre>  
            <p>Run NCC with Sobel:</p>
            <pre><code>run_alignment(sobel_enabled=True, "sobel")</code></pre>  
          </div>
        </section>
      </main>
    </div>
  );
};

export default CS180Proj1;
