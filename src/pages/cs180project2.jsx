import "./cs180proj2.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { MathJaxContext, MathJax } from "better-react-mathjax";

const CS180Proj2 = () => {
  

  const params = {
    "no sobel": { downsampling_scale: 2, search_window: "[-5, 5]",  search_window_coarse: "[-15, 15]" },
    "sobel":    { downsampling_scale: 2, search_window: "[-5, 5]", search_window_coarse: "[-15, 15]" }
  };

  const outPath = (file) => {
    const stem = file.replace(/\.[^.]+$/, '');
    return `/cs180proj1/out/${stem}_aligned.jpg`;
  };


  // --- Scroll spy setup ---
  const sectionDefs = useMemo(() => ([
    { id: "1",    label: <b>Part 1</b> },
    { id: "1.1",  label: "Convolutions from Scratch" },
    { id: "1.2", label: "Finite Difference Operator" },
    { id: "1.3",    label: "Derivative of Gaussian (DoG) Filter" },
    { id: "2",     label: <b>Part 2</b> },
    { id: "2.1",  label: "Image Sharpening" },
    { id: "2.2",  label: "Hybrid Images" },
    { id: "2.3",     label: "Gaussian and Laplacian Stacks" },
    { id: "2.4",     label: "Multiresolution Blending" },
    
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

 

  const config = { loader: { load: ["input/tex", "output/chtml"] } };

  function ConvolutionCode() {
    const snippet = `import numpy as np

    # 2D convolution with four for loops
    def convolve_2d_4(image, kernel):
        height, width = image.shape
        output = np.zeros((height, width))
        kernel_flipped = kernel[::-1, ::-1].astype(np.float64)
        kernel_height, kernel_width = kernel_flipped.shape
        padding_height, padding_width = kernel_height // 2, kernel_width // 2
        img = np.pad(image, pad_width=((kernel_height, padding_height), (kernel_width, padding_width)), mode='edge')
        for i in range(height):
            for j in range(width):
                total = 0
                for k in range(kernel_flipped.shape[0]):
                    for l in range(kernel_flipped.shape[1]):
                        total += img[i + k, j + l] * kernel_flipped[k, l]
                output[i, j] = total
        return output

    # 2D convolution with two for loops    
    def convolve_2d_2(image, kernel):
        height, width = image.shape
        output = np.zeros((height, width))
        kernel_flipped = kernel[::-1, ::-1].astype(np.float64)
        kernel_height, kernel_width = kernel_flipped.shape
        padding_height, padding_width = kernel_height // 2, kernel_width // 2
        img = np.pad(image, pad_width=((kernel_height, padding_height), (kernel_width, padding_width)), mode='edge')
        for i in range(height):
            for j in range(width):
                output[i, j] = np.sum(img[i: i + kernel_height, j: j + kernel_width] * kernel_flipped)
        return output`;

    return (
      <pre style={{ background: "#f4f4f4", padding: "1rem", borderRadius: "8px", overflowX: "auto" }}>
        <code>{snippet}</code>
      </pre>
    );
  }

  function RuntimeTable() {
    const data = [
      { name: "convolve_2d_4 (4 loops)", runtime: "0.9271 s" },
      { name: "convolve_2d_2 (2 loops)", runtime: "0.1266 s" },
      { name: "scipy.signal.convolve2d", runtime: "0.0049 s" },
    ];

    return (
      <div className="overflow-x-auto">
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
            marginTop: "1rem",
          }}
        >
          <thead>
            <tr style={{ background: "#f4f4f4" }}>
              <th style={{ padding: "0.5rem", borderBottom: "1px solid #ddd" }}>
                Function
              </th>
              <th style={{ padding: "0.5rem", borderBottom: "1px solid #ddd" }}>
                Runtime
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                <td style={{ padding: "0.5rem", borderBottom: "1px solid #eee" }}>
                  {row.name}
                </td>
                <td style={{ padding: "0.5rem", borderBottom: "1px solid #eee" }}>
                  {row.runtime}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }



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
          <h1>Project 2</h1>
          <h2>Fun with Filters and Frequencies!</h2>
        </header>

        <section id="overview" className="section block">
          <h2>Overview</h2>
          <div className="overview-text">
            <p>Project 2 aims to explore many fundamental concepts in image processing and computational photography. The goal of this project is to build intuition about filtering, convolution, and frequency-based techniques, applying them to produce meaningful and interesting visual results.
            </p>
          </div>
        </section>

        <section className="section block">
          <div className='section-intro'>
            <h2 id="1">Part 1</h2>
            <p>This section aims to investigate 2D convolution and filtering techniques by examining the finite difference operator D<sub>x</sub> and D<sub>y</sub>. This process of applying filters in the x and y directions to various grayscale images is displayed below to demonstrate how local intensity changes of pixels can be detected using filters.</p>
            <MathJaxContext version={3} className="math" config={config}>
              <MathJax>
              {"$$ D_x = \\begin{bmatrix} 1 & 0 & -1 \\end{bmatrix}, \\quad D_y = \\begin{bmatrix} 1 \\\\ 0 \\\\ -1 \\end{bmatrix} $$"}
              </MathJax>
            </MathJaxContext>
          
          </div>
          


          <div id="1.1" className="subsection">
            <h3>1.1 Convolutions from Scratch</h3>
            <MathJaxContext version={3} className="math" config={config}>
              <p>Convolution is an operation that describes how a signal is modified by another signal by combining both signals to form a new function. As convolution is a commutative operation (i.e. I * K = K * I), it is an extremely powerful tool to be used in image processing when multiple transformations are involved. Convolution is used to combine an image with a kernel to produce a new image. For each output pixel, the horizontally and vertically flipped kernel's center will placed over the corresponding input pixel before multiplying the overlapping values between the input image and kernel, and eventually summing them. This allows blurring, edge detection, and image sharpening to be expressed as simple and fast operations.</p>

              <p>To build a 2D convolution from scratch, we will first flip the kernel both horizontally and vertically and pad the input image with half of the kernel's height and half of the kernel's width with 0s. Using the grayscale image and this kernel, 2D convolution will produce a new image where each pixel in this new image is the weighted sum of its neighborhood in the original image.</p>
              <MathJax>
                {"$$ (I * K)(i, j) = \\sum_{m=0}^{M-1} \\sum_{n=0}^{N-1} I(i+m, \\, j+n) \\, K(-m, \\, -n) $$"}
              </MathJax>
              <p>The following code snippets show the naive convolution using four for loops and two for loops respectively.</p>
            </MathJaxContext>
            
            <ConvolutionCode />
            <h4>Runtime Comparison</h4>
            <p>Runtime comparison is done through running <code>convolve_2d_4</code>, <code>convolve_2d_2</code>, and <code>scipy.signal.convolve2d</code> with a grayscale image of myself and a 9x9 box filter as the kernel. It is expected that convolve2d implemented using four nested for loops takes the longest to run, followed by two nested for loops. This is because the two nested for loop implementation makes use of vectorized operations, which  take significantly shorter time to run.</p>
            <RuntimeTable />

            <h4>Boundary Comparison</h4>
            <p>In the naive implementation of convolve2d, I handle the boundaries by padding the image with 0s. The boundaries in signal.convolve2d is handled using <code>boundary='fill'</code> and <code> fillvalue=0</code> in a similar way.</p>

            <p>The following displays the output images of applying a 9x9 box filter, the finite difference operators D<sub>x</sub> and D<sub>y</sub> to my grayscale image. </p>
            <img src="/cs180proj2/1.1.png" alt="" />
          </div>

          <div id="1.2" className="subsection">
            <h3>1.2 Finite Difference Operator</h3>
            <MathJaxContext version={3} className="math" config={config}>
              <p>This section will show the partial derivative in x and y of the cameraman image by convolving the cameraman image with the finite difference operators D<sub>x</sub> and D<sub>y</sub>. After computing these partial derivatives, we will compute the gradient magnitude image. The gardient magnitude is given by:</p>
              <MathJax>{"$$ |\\nabla I(x,y)| = \\sqrt{ I_x(x,y)^2 + I_y(x,y)^2 } $$"}</MathJax> where <MathJax>{"$$ I_x(x,y) = D_x * I(x,y), \\quad I_y(x,y) = D_y * I(x,y) $$"}</MathJax>

              <p>To generate an edge map, we will need to choose a threshold, so that for each pixel position (x, y) we can check whether the gradient magnitude at pixel position (x, y) is greater than the threshold chosen. This will produce a binary image output of the same size as the original image. All the pixels are set to 1 if edges are present and 0 if no edges are present. Thresholding is very useful for suppressing noise in the image as the original gradient magnitude image has many small nonzero values that most likely represent noise rather than an edge. Choosing an appropriate threshold will be useful in only keeping strong edges and removing most noise. Choosing a small threshold cannot remove much noise, while choosing a large threhold will remove meaningful edges present in the image. After a trying a few thresholds, 0.2 is the best threshold that keeps strong edges in the image and removing much of the unwanted noise.</p>
              <MathJax>{"$$ \\| \\nabla I(x, y) \\| > Threshold $$"}</MathJax>
              
              <h4>Parameters </h4>
              <ul>
                <li>Threshold: 0.2</li>
              </ul>
            </MathJaxContext>
            <img src="cs180proj2/1.2.png" alt="" />

          </div>

          <div id="1.3" className="subsection">
            <h3>1.3 Derivative of Gaussian (DoG) Filter</h3>
            <p>In this section, we will first create a 2D Gaussian filter <code>G</code> that will be the smoothing operator we need to use. Convolving the original cameraman image with <code>G</code> produces a blurred version of the original cameraman image. The partial derivatives in x and y of the blurred cameraman image are now less noisy, as seen from the texture of the grass being not as obvious as the unblurred orginal image. This is the kind of noise that we want to remove. The gradient magnitude is only displaying the higher magnitudes and omitting the lower magnitudes. This is again seen from the grass in the gradient magnitude image being less obvious. To get a similar edge image as above, we only need to set the threshold to be 0.05. This is much lower than 0.2 in the previous part as we have already filtered out some of the noise before computing gradient magnitude of the cameraman image.</p>
            <h4>Parameters </h4>
              <ul>
                <li>Gaussian Filter Kernel Size: 15</li>
                <li>Gaussian Filter Sigma: 3.0</li>
                <li>Threshold: 0.05</li>
              </ul>
            <img src="cs180proj2/1.3part1.png" alt="" />

            <p>Now we will do a single convolution instead of two convolutions shown above by creating a derivative of the Gaussian filter <code>G</code>. This operation is going to be eqivalent to the above approach as convolution is both commutative and associative for linear filters like Gaussian filters. </p>
            <MathJaxContext version={3} className="math" config={config}>

              <MathJax>{"$$\\quad \\frac{\\partial}{\\partial x}\\,(G * I) = \\left(\\frac{\\partial G}{\\partial x}\\right) * I = G * \\left(\\frac{\\partial I}{\\partial x}\\right).$$"}
              </MathJax>
              <MathJax>{"$$\\quad \\frac{\\partial}{\\partial y}\\,(G * I) = \\left(\\frac{\\partial G}{\\partial y}\\right) * I = G * \\left(\\frac{\\partial I}{\\partial y}\\right).$$"}
              </MathJax>

            </MathJaxContext>
            <h4>Parameters </h4>
              <ul>
                <li>Gaussian Filter Kernel Size: 15</li>
                <li>Gaussian Filter Sigma: 3.0</li>
                <li>Threshold: 0.05</li>
              </ul>
              <p>As seen from the gradient magnitude and edge images derived using DoG, we can be sure that both approaches are the same. Using the same threshold of 0.05, we can see that both edge images, when placed side by side, look identical when identical threshold is used in edge image computation.</p>
            <img src="cs180proj2/1.3part2.png" alt="" id="bigimg"/>
          </div>

        </section>

        <section className="section block">
          <h2 id="2">Part 2</h2>

          <div id="2.1" className="subsection">
            <h3>2.1: Image Sharpening</h3>
            <MathJaxContext version={3} className="math" config={config}>
              <p>The unsharp mask filter enhances the high frequency details of an image, with the degree of enhancement being determined by the magnitude of alpha. In the unsharp mask filter, we will first need to blur the original image using a Gaussian filter, producing an image that only contains the low frequency details of the original image. We will then subtract the blurred image from the original image to get the high frequency details of the original image. This high frquency details include the edges and other delicate details. In order to sharpen the image, we will add back the the high frequency details to the original image subjected to alpha. The magnitude of alpha determines how much high frequency details like edges are amplified in the sharpened image. An alpha that is too small may not amplify the high frequency details enough to see an obvious change in the sharpened image, but when alpha becomes too large then it is also likely to see that the unsharp mask filter will introduce artifacts like ringing that are previously absent in the original image.
              <MathJax>{"$$ I_{\\text{sharp}} = I + \\alpha (I - G * I) = I * ((1 + \\alpha) \\delta - \\alpha G)$$"}</MathJax> 
              <MathJax>{"$$ Kernel = (1 + \\alpha) \\delta - \\alpha G$$"}</MathJax>
              where 
              <code> G * I</code> = low frequency component, <code> (I - G * I)</code> = high frequency component, and <code>delta</code> = identity kernel
              </p>
            </MathJaxContext>
            <h4>Parameters </h4>
              <ul>
                <li>Gaussian Filter Kernel Size: 15</li>
                <li>Gaussian Filter Sigma: 3.0</li>
                <li>Alpha: 1.0 - 5.0</li>
              </ul>
            <img src="cs180proj2/2.1part3.png" alt="" id="bigimg"/>
            <p>The following are the sharpened images produced using different magnitudes of alpha:</p>
            <img src="cs180proj2/2.1part1.png" alt="" />
            <p>The original photo is very sharp. To evaluate the sharpening process, we will first blur it and then try to sharpen it again. </p>

            <img src="cs180proj2/2.1part2.png" alt="" />
            <p>It is observed that the sharpened image with alpha = 1 looks the most identical to the original sharp image. As alpha grows beyond 1, the sharpened images start to look unreal as the high frequency details are amplified too much by the unsharp mask to the point that artifacts like ringing start appearing. Another observation is that even when we blur and sharpen using the same magnitude of sigma and alpha respectively, we can still see very significant differences from the original image. This is because blurring removes much high frequency details and this process is irreversible. Sharpening can only exaggerate whatever high frquency details are left, but it cannot restore the original detail that is lost during blurring. </p>
          </div>

          <div id="2.2" className="subsection">
            <h3>2.2: Hybrid Images</h3>
            <p>Hybrid images are made by combining the high frequency details of one image with the low frequency content of another image. If you are standing close to the image, the sharp high frequency details will dominate perception. If you are standing far away, the blurred and low frequency image will be much more visible. </p>
            <p>The section is showing the original and aligned images, Fourier transforms, filtered results, and the final hybrid images. The first two columns are the original images with their Fourier transforms and the next two columns are the aligned images filtered with their Fourier transforms. </p>

            <p>For a low pass filter, I chose a sigma = 10 as I want to blur the image a lot to get the low frequency component of the image. Since a larger sigma represents stronger blurring, it is favorable for this task. For the high frquency component, sigma = 20 preserves the high frquency details really well.</p>
            <h4>Parameters </h4>
              <ul>
                <li>Sigma for Low Frequency: 10.0</li>
                <li>Sigma for High Frequency: 20.0</li>
                
              </ul>
            <p>Derek and Nutmeg:</p>
            <img src="cs180proj2/2.2dereknutmeg.png" alt="" id="bigimg"/>
            <p>My favorite hyrbid image of Nick and Judy from Zootopia:</p>
            <img src="cs180proj2/2.2nickjudy.png" alt="" id="bigimg"/>
            <h4>Gallery</h4>
            <img src="cs180proj2/2.2gallery.png" alt="" />
            
          </div>

          <div id="2.3" className="subsection">
            <h3>2.3: Gaussian and Laplacian Stacks</h3>
            <img src="cs180proj2/2.3stacks.png" alt="" id="bigimg"/>
            <p>The recreation of the outcomes of Figure 3.42 (a) through (l).</p>
            <img src="cs180proj2/2.3oraplestack.png" alt="" id="verybigimg"/>
            
            
          </div>


          <div id="2.4" className="subsection">
            <h3>2.4: Multiresolution Blending</h3>
            <h4>Gallery</h4>
            <img src="cs180proj2/2.4gallery.png"/>
            <p>To produce the above output, I created a background, an object (on a white background), and the corresponding object mask. Following the same process, I created a Gaussian stack and Laplacian stack for the background image and object. I also created a Gaussian stack for object mask. Blending is then done at each level to produce the blended images. </p>
            <img src="cs180proj2/2.4detailedgallery.png" />
            <h4>Favorite blended image: Ragdoll Sleeping on Marina Bay Sands</h4>
            <p>The follwoing images are the same size (I made the below in a rush so the images seem to have different sizes but they actually are the same size.)</p>
            <img src="cs180proj2/2.4final.png" alt=""/>
            
          </div>

        </section>

      </main>
    </div>
  );
};

export default CS180Proj2;
