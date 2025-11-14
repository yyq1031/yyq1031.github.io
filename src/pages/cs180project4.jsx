import "./cs180proj4.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { MathJaxContext, MathJax } from "better-react-mathjax";

const CS180Proj4 = () => {

  // --- Scroll spy setup ---
  const sectionDefs = useMemo(() => ([
    { id: "0",    label: <b>Part 0</b>},
    { id: "1", label: <b>Part 1</b>},
    { id: "2",    label: <b>Part 2</b>},
    { id: "2.1",    label: "Part 2.1" },
    { id: "2.2",     label: "Part 2.2"},
    { id: "2.3",  label: "Part 2.3"},
    { id: "2.4",  label: "Part 2.4"},
    { id: "2.5",     label: "Part 2.5" },
    { id: "2.6",     label: "Part 2.6" },
    
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
          <h1>Project 4</h1>
          <h2>Neural Radiance Field</h2>
        </header>

        <section id="overview" className="section block">
          <h2>Overview</h2>
          <div className="overview-text">
            <p></p>
          </div>
        </section>

        <section className="section block">
          <div className='section-intro'>
            <h2 id="0">Part 0: Calibrating Your Camera and Capturing a 3D Scan</h2>
            <p>In this section, a dataset will be created by first calibrating the phone camera and taking 30-50 images of the Aruco tags at a fixed zoom but varied viewing angles. This is achieved by detecting the Aruco tag corners using OpenCV and associating them with their respective 3D corner coordinates in the world to compute intrinsics and distortion of the phone camera using <code>cv2.calibrateCamera()</code>.</p>
            
            <p>Using the same camera and zoom with consistent lighting and sharpness, we capture 30-50 images of an object placed beside the same printed Aruco tags used during calibration. For each object image, we will detect the aruco tags, run <code>cv2.solvePnP()</code> with the calibrated camera intrinsics to estimate rotation and translation before inverting the result to obtain camera to world matrices. Lastly, we will undistort all images with <code>cv2.undistort()</code> and then generate the dataset split into training, validation, and test using <code>sklearn.model_selection.train_test_split()</code>. </p>
            <p>I downsampled all images to around 200x200 resoltuion as it speeds up the model training at the later part. I also did not undistort any of my images as there is negligible difference between my original images and undistorted images. </p>
            <h4>Datasets (height x width)</h4>
            <ul>
              <li><b>lego:</b> 200x200</li>
              <li><b>lafufu:</b> downsampled to 150x200</li>
              <li><b>bird:</b> downsampled to 200x150</li>
            </ul>
              <h3>Camera Frustums Visualization</h3>
              <div className="image-row">
                <figure className="image-card">
                  <img src="/cs180proj4/0im1c.png" alt="" className="smallimg" />
                  <figcaption>Camera frustums view 1</figcaption>
                </figure>
                <figure className="image-card">
                  <img src="/cs180proj4/0im2c.png" alt="" className="smallimg" />
                  <figcaption>Camera frustums view 2</figcaption>
                </figure>

            </div>
          </div>
        </section>

        <section className="section block">
          <div className='section-intro'>
            <h2 id="1">Part 1: Fit a Neural Field to a 2D Image</h2>
            <p>This section builds a 2D Neural Field that learns to represent an image by mapping every coordinates to their respective RGB values. To achieve this, we will use a MLP with sinusoidal positional encoding, so that every 2D coordinate is expanded into a high-dimensional feature vector using sine and cosine functions across the range of 0 to max frequencies L, then passed through a fully connected network to produce get the predicted RGB colors of every coordinate in the range of 0 to 1. We also make a dataloader for the dataset, so that we can randomly sample pixels at every iteration for training. </p> 
             <h3>Model Architecture</h3>
             <h4>Parameters</h4>
             <ul>
              <li>Learnable Layers: 4</li>
              <li>Loss: MSE</li>
              <li>Optimizer: Adam (0.01 learning rate)</li>
              <li>Iterations: 2000</li>
              <li>Batch Size: 10000</li>
              <li>Reconstruction Quality Metric: PSNR</li>
              <li>Max Frequency L: 20</li>
             </ul>
              <div className="image-row">
               <figure className="image-card">
                 <img src="/cs180proj4/mlp.png" alt="" className="bigimg" />
                 <figcaption>2D Neural Field Architecture</figcaption>
               </figure>
               <figure className="image-card">
                 <img src="/cs180proj4/mlpmodel.png" alt="" className="bigimg" />
                 <figcaption>MLP</figcaption>
               </figure>
             </div>
            <h3>Training Progression</h3>
            <figure className="image-card">
              <img src="/cs180proj4/fox_reconstructions_row.png" alt="" className="bigimg" />
              <figcaption>Fox Reconstruction</figcaption>
            </figure>
            <figure className="image-card">
              <img src="/cs180proj4/pumpkin_reconstructions_row.png" alt="" className="bigimg" />
              <figcaption>Pumpkin Reconstruction</figcaption>
            </figure>

            <h3>Hyperparameter Tuning</h3>
            <h4>Hyperparameter</h4>
            <ul>
              <li>Max Positional Encoding Frequency L: 10, 20</li>
              <li>Hidden Layer: 128, 256</li>
            </ul>
            <figure className="image-card">
              <img src="/cs180proj4/hyper.png" alt="" className="bigimg" />
              <figcaption>PSNR across different hyperparameter choices</figcaption>
            </figure>

            <p>L = 10 performs better than L = 20 as it can capture the fine details like whiskers and fur color of the fox better. This is because reconstructing the 2D fox is a fairly simple task so setting a very large L (like L = 20) makes the hidden space larger than what is actually needed. L = 20 gives a more expressive network with a much larger first hidden layer size and more parameters, making optimization more tricky and less robust.</p>

            <p>Hidden Layer = 256 performs much better than Hidden Layer = 128 as the fine details on the fox face can be seen clearly. On the other hand, the reconstructed fox face looks slightly blurry when the hidden layer decreases to 128. This is because as hidden layer size decreases, the expressive power of the model drops and it is not able to reconstruct all the fine details of the images.</p>

            <h4>Very Low Values of Hyperparameters </h4>
            <h5>L = 1</h5>
            <figure className="image-card">
              <img src="/cs180proj4/hyperL1.png" alt="" className="smallimg" />
            </figure>

            <h5>Hidden Layer = 16</h5>
            <figure className="image-card">
              <img src="/cs180proj4/hyperH16.png" alt="" className="smallimg" />
            </figure>

            <h3>PSNR Curves (Training) </h3>
            <div className="image-row">
              <figure className="image-card">
                <img src="/cs180proj4/fox_psnr.png" alt="" className="bigimg" />
                <figcaption>Fox PSNR during training</figcaption>
              </figure>
              <figure className="image-card">
                <img src="/cs180proj4/pumpkin_psnr.png" alt="" className="bigimg" />
                <figcaption>Pumpkin PSNR during training</figcaption>
              </figure>
            </div>
          </div>

        </section>

        <section className="section block">
          <div className='section-intro'>
            <h2 id="2">Part 2: Calibrating Your Camera and Capturing a 3D Scan</h2>
          </div>

          <div className='subsection'>
            <h3 id="2.1">2.1: Fit a Neural Radiance Field from Multi-view Images</h3>
            <p>
              For Camera to World Coordinate Conversion, I first convert the points from camera space to world space by 
              making each point into its homogeneous coordinate form, then I multiply using the homogeneous coordinate by the 4x4 camera-to-world matrix (inverse of world-to-camera transformation matrix). I will then normalize the outputs to get the 3D world positions of the points. </p>
            <p>For Pixel to Camera Coordinate Conversion, every pixel (u, v) is is expressed as (u, v, 1). Then I will multiply (u, v, 1) by the inverse of the intrinsic matrix K. I set the depth value to be s = z<sub>c</sub> = 1. </p>
            
            <p>For Pixel to Ray, every ray is defined by an origin vector r<sub>o</sub> and a direction vector r<sub>d</sub>. I can get a ray per pixel by equating the camera origin vector r<sub>o</sub> to the translation vector in camera-to-world (c2w) transformation matrix. Then I compute the ray direction r<sub>d</sub> by choosing a point on along this ray with depth = 1. Afterwards, I can find the ray direction r<sub>d</sub> in terms of world coordinate before normalizing r<sub>d</sub>. </p>
            <p>All the functions I defined can support batched coordinates with batch size B, so that I can generate rays across many pixels. I also made sure the shapes of the matrices match and the outputs are in the desired shapes.</p>
          </div>
          
          <div id="2.2" className="subsection">
            <h3>2.2: Sampling</h3>
            <p>
              To sample rays from images, I do random pixel sampling to many images in one batch. 
              For every image, I will randomly sample some image coordinates, obtain their RGB colors from the image, 
              and translate the pixel coordinates by adding 0.5 to correctly sample at the pixel centers. I used the first approach, where I sample M images, and then sample N // M rays from every image. If N // M has a remainder, then I will sample N // M + 1 rays from every image but only retain N rays to return at the end. </p>
              <p>
                With the intrinsics K matrix and the corresponding c2w matrix, I will convert each sampled pixel into a ray origin r<sub>o</sub> and normalized ray direction r<sub>d</sub> using the <code>pixel_to_ray</code> function. Once rays are generated, I discretize each ray into many different 3D sample points by uniformly sampling <code>t</code> values between the near and far bounds. To avoid learning only a fixed set of points and reduce overfitting during training, I add random perturbations to add some jitters to the sampling intervals during training, so each ray produces slightly varied 3D positions in every training loop. However, no such jitters will be added during the model evaluation phase for the purpose of reconstructing back the images. The 3D sample coordinates are obtained using 
              <code>points = ray_o + ray_d * t</code> where <code>t = np.linspace(near, far, n_samples)</code>, producing a set of sample points suitable for volume rendering.
            </p>
          </div>

          <div id="2.3" className="subsection">
            <h3>2.3: Putting the Dataloading All Together</h3>
            <p>
            I implement a dataloader called the <code>RaysData</code> class that allows me to randomly samples pixel across many views and converts these pixels into rays. The <code>RaysData</code> class stores the input images, intrinsic matrix <code>K</code>, and camera-to-world matrices <code>c2ws</code>. When <code>sample_rays(N)</code> is called, this function uses <code>sample_rays_from_img</code> that I defined earlier to randomly choose <code>N</code> sample points from the training images, convert their coordinates into ray origins and directions using the camera parameters, and get the corresponding RGB colors. I cached them as <code>rays_o</code>, <code>rays_d</code>, and <code>pixels</code>.
          </p>
          <div className="image-row">
              <figure className="image-card">
                <img src="/cs180proj4/pointcloud1.png" alt="" className="bigimg" />
                <figcaption>Point Cloud (All Cameras)</figcaption>
              </figure>
              <figure className="image-card">
                <img src="/cs180proj4/pointcloud2.png" alt="" className="bigimg" />
                <figcaption>Point Cloud (1 Camera)</figcaption>
              </figure>
            </div>
            
          
          </div>

          <div id="2.4" className="subsection">
            <h3>2.4: Neural Radiance Field</h3>
            <p>
            In the 3D radiance field, the model now takes a 3D world coordinates together with its corresponding ray direction r<sub>d</sub>. Both inputs to the model are encoded using sinusoidal positional encoding.  World coordinates are high-frequency encoding (L=10) and view directions are slightly lower-frequency encoding (L=4). </p>

            <p>
              To build the NeRF model, I first construct a main MLP branch with 8 fully connected learnable linear layers. This branch is essential in processing the positional-encoded 3D coordinates and extracts deep features that represent the geometry and appearance of the scene. In the middle of this main branch, I add a residual connection by concatenating the original encoded coordinates back into the network to help the model retain spatial information as the depth of the model increases (for purposes like back-propagation). From the output of this main branch, the neural network branches into two smaller branches. The first branch is a single linear layer that predicts the non-negative density at every 3D coordinate. The second branch predicts the RGB color as it uses the features of the main branch and concatenates them with the positional-encoded ray direction to model view-dependent effects.
            </p>
            <h3>Model Architecture</h3>
             <h4>Parameters</h4>
             <ul>
             
              <li>Loss: MSE</li>
              <li>Optimizer: Adam</li>
              <li>Batch Size: 10000</li>
              <li>Reconstruction Quality Metric: PSNR</li>
              <li>Max Frequency L (3D Coordinates): 10</li>
              <li>Max Frequency L (Ray Direction): 4</li>
             </ul>

             <div className="image-row">
               <figure className="image-card">
                 <img src="/cs180proj4/architecture.png" alt="" className="bigimg" />
                 <figcaption>3D NeRF Architecture</figcaption>
               </figure>
               <figure className="image-card">
                 <img src="/cs180proj4/model.png" alt="" className="bigimg" />
                 <figcaption>NeRF</figcaption>
               </figure>
             </div>
          
          </div>

          <div id="2.5" className="subsection">
            <h3>2.5: Volume Rendering</h3>
            <p>
            Discrete volumetric rendering helps render a pixel from the NeRF. For every sampled point along a ray, the neural network predicts a density <code>σ</code> and color <code>rgb</code>. Firstly, I convert the outputted densities into per-interval opacities <code>α = 1 − exp(−σ Δt)</code>, where <code>Δt</code> is the step size between samples. The cumulative transmittance <code>T</code> is computed with a forward cumulative product, representing the probability that the ray has not terminated before every sample. The final pixel color is the weighted sum over all samples.
            <code>∑ T_i · α_i · color_i</code> matches the rendering formulation from the NeRF slides. Finally, I sum the contributions.
            </p>

            <h4>Training and Validation Loss and PSNR (Lego)</h4>
            <div className="image-row">
              <figure className="image-card">
                <img src="/cs180proj4/psnr_train_lego.png" alt="" className="bigimg" />
                <figcaption>Lego PSNR during training</figcaption>
              </figure>
              <figure className="image-card">
                <img src="/cs180proj4/psnr_val_lego.png" alt="" className="bigimg" />
                <figcaption>Lego PSNR during validation (computed once per 10 iterations)</figcaption>
                <p>Actual iteration = x_axis x 10 </p>
              </figure>
            </div>
            <h4>Intermediate Renders (Lego)</h4>
            <div className="lego-row">
              <figure className="lego-card">
                <img src="/cs180proj4/lego_training_0.png" alt="" className="lego-img" />
                <figcaption>Lego (Training Iteration = 0)</figcaption>
              </figure>

              <figure className="lego-card">
                <img src="/cs180proj4/lego_training_400.jpg" alt="" className="lego-img" />
                <figcaption>Lego (Training Iteration = 400)</figcaption>
              </figure>

              <figure className="lego-card">
                <img src="/cs180proj4/lego_training_800.jpg" alt="" className="lego-img" />
                <figcaption>Lego (Training Iteration = 800)</figcaption>
              </figure>

              <figure className="lego-card">
                <img src="/cs180proj4/lego_training_1200.jpg" alt="" className="lego-img" />
                <figcaption>Lego (Training Iteration = 1200)</figcaption>
              </figure>

              <figure className="lego-card">
                <img src="/cs180proj4/lego_training_1600.jpg" alt="" className="lego-img" />
                <figcaption>Lego (Training Iteration = 1600)</figcaption>
              </figure>

              <figure className="lego-card">
                <img src="/cs180proj4/lego_training_2000.jpg" alt="" className="lego-img" />
                <figcaption>Lego (Training Iteration = 2000)</figcaption>
              </figure>
            </div>
            <h4>Final gif</h4>
            <img src="/cs180proj4/lego_spherical.gif" />
          </div>

          <div id="2.6" className="subsection">
            <h3>2.6: Training with your own data</h3>
            <p>I first use a similar model (with the same model architecture, but slightly different near and far values) as the one in 2.5 to train on the lafufu dataset, which is known for producing good results. This gives me a sense about any subtle bugs that may still exist in my implementation. After achieving a good lafufu result, then I work on my own dataset and adjust the dataset if no amount of training can give me a good result. To calculate a resonable good and far values, I compute the average vector norm of all the translation vectors in the extrinsics matrix c2ws. The average vector norm should lie between the good and far values I choose for my dataset. Then I will visualize the sample points after choosing the near and far values using viser to make sure that no sample points lie behind the images and no sample points lie too far away from the image.</p>
            <h4>Hyperparameters (Lafufu)</h4>
            <ul>
              <li>Near = 0.02</li>
              <li>Far = 0.5</li>
              <li>Number of samples per ray = 32</li>
              <li>Model Architecture: no change </li>
            </ul>
            <p>As training with 64 samples per ray does not give a difference in the final gif and the psnr curves from the 32 samples per ray, I used 32 samples to increase the speed of my training process. The same reasoning applied for choosing 32 samples per ray for my own dataset.</p>
            <h4>Training and Validation Loss and PSNR (Lafufu)</h4>
            <div className="image-row">
              <figure className="image-card">
                <img src="/cs180proj4/lafufu_psnr_train.jpg" alt="" className="bigimg" />
                <figcaption>Lafufu PSNR during training</figcaption>
              </figure>
              <figure className="image-card">
                <img src="/cs180proj4/lafufu_psnr_val.jpg" alt="" className="bigimg" />
                <figcaption>Lafufu PSNR during validation (computed once per 100 iterations)</figcaption>
                <p>Actual iteration = x_axis x 100 </p>
              </figure>
            </div>
            <h4>Intermediate Renders (Lafufu)</h4>
            <div className="lego-row">
              <figure className="lego-card">
                <img src="/cs180proj4/lafufu_training_2k.jpg" alt="" className="lego-img" />
                <figcaption>Lafufu (Training Iteration = 2000)</figcaption>
              </figure>

              <figure className="lego-card">
                <img src="/cs180proj4/lafufu_training_4k.jpg" alt="" className="lego-img" />
                <figcaption>Lafufu (Training Iteration = 4000)</figcaption>
              </figure>

              <figure className="lego-card">
                <img src="/cs180proj4/lafufu_training_6k.jpg" alt="" className="lego-img" />
                <figcaption>Lafufu (Training Iteration = 6000)</figcaption>
              </figure>

              <figure className="lego-card">
                <img src="/cs180proj4/lafufu_training_8k.jpg" alt="" className="lego-img" />
                <figcaption>Lafufu (Training Iteration = 8000)</figcaption>
              </figure>

              <figure className="lego-card">
                <img src="/cs180proj4/lafufu_training_10k.jpg" alt="" className="lego-img" />
                <figcaption>Lafufu (Training Iteration = 10,000)</figcaption>
              </figure>
            </div>
            <h4>Final gif</h4>
            <img src="/cs180proj4/lafufu_spherical.gif" />

            <h4>Hyperparameters (Bird)</h4>
            <ul>
              <li>Near = 0.05</li>
              <li>Far = 0.6</li>
              <li>Number of samples per ray = 32</li>
              <li>Model Architecture: no change </li>
            </ul>
            <h4>Training and Validation Loss and PSNR (Bird)</h4>
            <div className="image-row">
              <figure className="image-card">
                <img src="/cs180proj4/psnr_train_bird.jpg" alt="" className="bigimg" />
                <figcaption>Bird PSNR during training</figcaption>
              </figure>
              <figure className="image-card">
                <img src="/cs180proj4/psnr_val_bird.jpg" alt="" className="bigimg" />
                <figcaption>Bird PSNR during validation (computed once per 100 iterations)</figcaption>
                <p>Actual iteration = x_axis x 100 </p>
              </figure>
            </div>

            <h4>Intermediate Renders (Bird)</h4>
            <div className="lego-row">
              <figure className="lego-card">
                <img src="/cs180proj4/bird_training_2k.jpg" alt="" className="lego-img" />
                <figcaption>Bird (Training Iteration = 2000)</figcaption>
              </figure>

              <figure className="lego-card">
                <img src="/cs180proj4/bird_training_4k.jpg" alt="" className="lego-img" />
                <figcaption>Bird (Training Iteration = 4000)</figcaption>
              </figure>

              <figure className="lego-card">
                <img src="/cs180proj4/bird_training_6k.jpg" alt="" className="lego-img" />
                <figcaption>Bird (Training Iteration = 6000)</figcaption>
              </figure>

              <figure className="lego-card">
                <img src="/cs180proj4/bird_training_8k.jpg" alt="" className="lego-img" />
                <figcaption>Bird (Training Iteration = 8000)</figcaption>
              </figure>

              <figure className="lego-card">
                <img src="/cs180proj4/bird_training_10k.jpg" alt="" className="lego-img" />
                <figcaption>Bird (Training Iteration = 10,000)</figcaption>
              </figure>
            </div>
            <h4>Final gif</h4>
            <img src="/cs180proj4/bird_spherical.gif" />
          
          </div>

        </section>
        
      </main>
    </div>
  );
};

export default CS180Proj4;
