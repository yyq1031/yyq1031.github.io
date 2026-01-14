import "./cs180proj5.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { MathJaxContext, MathJax } from "better-react-mathjax";

const CS180Proj5 = () => {

  // --- Scroll spy setup ---
  const sectionDefs = useMemo(() => ([
    { id: "A",    label: <b>A: Diffusion Models</b>},
    { id: "A0",    label: "0: Setup"},
    { id: "A1",    label: "1: Sampling Loops"},
    { id: "A1.1",    label: "Implementing the Forward Process"},
    { id: "A1.2",    label: "Classical Denoising"},
    { id: "A1.3",    label: "One-Step Denoising"},
    { id: "A1.4",    label: "Iterative Denoising"},
    { id: "A1.5",    label: "Diffusion Model Sampling"},
    { id: "A1.6",    label: "Classifier-Free Guidance"},
    { id: "A1.7",    label: "Image-to-image Translation"},
    { id: "A1.8",    label: "Visual Anagrams"},
    { id: "A1.9",    label: "Hybrid Images"},
    { id: "B",    label: <b>B: Flow Matching</b>},
    { id: "B1",    label: "1: Training a Single-Step Denoising UNet"},
    { id: "B1.1",    label: "Implementing the UNet"},
    { id: "B1.2",    label: "Using the UNet to Train a Denoiser"},
    { id: "B2",    label: "2: Training a Flow Matching Model"},
    { id: "B2.1",    label: "Adding Time Conditioning to UNet"},
    { id: "B2.2",    label: "Training the UNet"},
    { id: "B2.3",    label: "Sampling from the UNet"},
    { id: "B2.4",    label: "Adding Class-Conditioning to UNet"},
    { id: "B2.5",    label: "Training the UNet"},
    { id: "B2.6",    label: "Sampling from the UNet"},
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
          <h1>Project 5</h1>
          <h2>Fun with Diffusion Models</h2>
        </header>

        <section id="overview" className="section block">
          <h2>Overview</h2>
          <div className="overview-text">
            <p></p>
          </div>
        </section>

        <section className="section block">
          <div className='section-intro'>
            <h2 id="A">Part A: The Power of Diffusion Models</h2>
            <p>This part works with pre-trained diffusion models.</p>
          </div>
        </section>

         <section className="section block">
          <div className='section-intro'>
            <h2 id="A0">A.0: Setup</h2>
            <p></p>

            <h4>Text Prompts</h4>
            <ul>
                <li>'a cat software developer'</li>
                <li> 'a hybrid of a fox and a bunny'</li>
                <li>'an underwater world with dragons made of clouds'</li>
                <li>'a chair made of raspberries and blueberries'</li>
                <li>'a pumpkin monster in halloween city'</li>
                <li>'a lithograph of a saxophone'</li>
                <li> 'a lithograph of a sunflower'</li>
                <li>'an oil painting of a sunset'</li>
                <li>'an oil painting of a woman'</li>
                <li>'a photo of a houseplant'</li>
                <li>'a photo of a puppy'</li>
               <li>'an oil painting of a panda'</li>
               <li>'an oil painting of an old woman'</li>
               <li>'a painting of a deer'</li>
               <li>'a painting of a software developer'</li>
                <li>'a lithograph of a pig'</li>
            </ul>
            <h4>Seed: 180</h4>
            <h4>Text Prompt Generation</h4>
            <h5>Prompt 1: 'a lithograph of a sunflower'</h5>
            <div className="image-row">
                <figure className="image-card">
                  <img src="/cs180proj5/part0/sunflower20.png" alt="" className="smallimg" />
                  <figcaption>num_inference_steps = 20</figcaption>
                </figure>
                <figure className="image-card">
                  <img src="/cs180proj5/part0/sunflower50.png" alt="" className="smallimg" />
                  <figcaption>num_inference_steps = 50</figcaption>
                </figure>
            </div>
            <h5>Prompt 2: 'an oil painting of a sunset'</h5>
             <div className="image-row">
                <figure className="image-card">
                  <img src="/cs180proj5/part0/sunset20.png" alt="" className="smallimg" />
                  <figcaption>num_inference_steps = 20</figcaption>
                </figure>
                <figure className="image-card">
                  <img src="/cs180proj5/part0/sunset50.png" alt="" className="smallimg" />
                  <figcaption>num_inference_steps = 50</figcaption>
                </figure>
            </div>
            <h5>Prompt 3: 'a photo of a houseplant'</h5>
             <div className="image-row">
                <figure className="image-card">
                  <img src="/cs180proj5/part0/houseplant20.png" alt="" className="smallimg" />
                  <figcaption>num_inference_steps = 20</figcaption>
                </figure>
                <figure className="image-card">
                  <img src="/cs180proj5/part0/houseplant50.png" alt="" className="smallimg" />
                  <figcaption>num_inference_steps = 50</figcaption>
                </figure>
            </div>
            <h4>Reflection</h4>
            <p>All the text prompts generally can reflect the objects described in the text prompts, but the quality of the images generated tends to be better when the text prompts are more specific (highlighting the details of the object and the art form/style). When the text prompts are too complicated (text prompts have more than 2 objects or involve very abstract ideas), the model sometimes only generates part of the text prompts and miss the details the other parts of the prompts.</p>
            <p>When the number of inference steps increases, the quality of the images generated is better when simple text prompts are used.</p>
          </div>
        </section>

        <section className="section block">
          <div className='section-intro'>
            <h2 id="A1">A.1: Sampling Loops</h2>
            <p>This part involves writing our own sampling loops that use the pretrained DeepFloyd denoisers to generate high quality images like the ones above.</p>

          </div>
        </section>

         <section className="section block">
          <div className='section-intro'>
            <h2 id="A1.1">1.1: Implementing the Forward Process</h2>
            <p>Diffusion models generate images by reversing a gradual noising process. We start with a clean image and repeatedly add noise until the image becomes almost pure Gaussian noise at a large timestep t. A diffusion model learns to denoise. Given a noisy image x<sub>t</sub> and the timestep t, it predicts the noise inside the image. During sampling, we begin from random noise x<sub>t</sub> and iteratively remove predicted noise using the model's outputs and predefined noise coefficients, eventually reaching a clean generated image x<sub>0</sub>. DeepFloyd follows this during training.</p>
             <img src="/cs180proj5/a1.1/forward.png" alt="" className="smallimg" />
            <p>When t increases, there is more noise added to the image of the campanile.</p>
            <div className="image-row">
                <figure className="image-card">
                  <img src="/cs180proj5/a1.1/campanile_noise0.png" alt="" className="smallimg" />
                  <figcaption>campanile</figcaption>
                </figure>
                <figure className="image-card">
                  <img src="/cs180proj5/a1.1/campanile_noise250.png" alt="" className="smallimg" />
                  <figcaption>campanile_t=250</figcaption>
                </figure>
                 <figure className="image-card">
                  <img src="/cs180proj5/a1.1/campanile_noise500.png" alt="" className="smallimg" />
                  <figcaption>campanile_t=500</figcaption>
                </figure>
                 <figure className="image-card">
                  <img src="/cs180proj5/a1.1/campanile_noise750.png" alt="" className="smallimg" />
                  <figcaption>campanile_t=750</figcaption>
                </figure>
            </div>
          </div>
        </section>

        <section className="section block">
          <div className='section-intro'>
            <h2 id="A1.2">1.2: Classical Denoising</h2>
            <h5>Timesteps = [250, 500, 750]</h5>
            <p>This step we work with classical denoising using Gaussian blur filtering with <code>torchvision.transforms.functional.gaussian_blur</code> to remove the noise, which does not produce a very nice denoised results. This is because gaussian blur works by averaging pixel values inside a local kernel, which smooths out high-frequency noise. As it only does local smoothing within the kernel, it cannot truly recover the original campanile structure. As noise increases at larger timesteps t, gaussian blur produces very smooth but blurry images of the campanile that lose important details.</p>
            <div className="image-row">
                <figure className="image-card">
                  <img src="/cs180proj5/a1.1/campanile_noise250.png" alt="" className="smallimg" />
                  <figcaption>campanile_noise250</figcaption>
                </figure>
                <figure className="image-card">
                  <img src="/cs180proj5/a1.2/250.png" alt="" className="smallimg" />
                  <figcaption>gaussian_blur250</figcaption>
                </figure>

                <figure className="image-card">
                  <img src="/cs180proj5/a1.1/campanile_noise500.png" alt="" className="smallimg" />
                  <figcaption>campanile_noise500</figcaption>
                </figure>
                <figure className="image-card">
                  <img src="/cs180proj5/a1.2/500.png" alt="" className="smallimg" />
                  <figcaption>gaussian_blur500</figcaption>
                </figure>

                 <figure className="image-card">
                  <img src="/cs180proj5/a1.1/campanile_noise750.png" alt="" className="smallimg" />
                  <figcaption>campanile_noise750</figcaption>
                </figure>
                <figure className="image-card">
                  <img src="/cs180proj5/a1.2/750.png" alt="" className="smallimg" />
                  <figcaption>gaussian_blur750</figcaption>
                </figure>
            
            </div>
            
          </div>
        </section>

        <section className="section block">
          <div className='section-intro'>
            <h2 id="A1.3">1.3: One-Step Denoising</h2>
            <p>In this step, we use a pretrained diffusion model for denoising. We take our noisy campanile images at timesteps t = 250, 500, 750 and then pass them through stage_1.unet that has learned to predict the Gaussian noise, and then remove this predicted noise from the images. The UNet is conditioned on both the timestep and a text embedding so we used the prompt “a high quality photo”, allowing it to reconstruct images that are much closer to the original than simple Gaussian blur.</p>
            <p>However, the images that have their noise removed all look very blurry especially when timestep t increases. This is because one-step denoising will cause the sample x<sub>0</sub> to converge to the average of the population instead of one specific data point.</p>
                <div className="three-row">
                   <figure className="image-card">
                        <img src="/cs180proj5/a1.1/campanile_noise0.png" alt="" className="smallimg" />
                        <figcaption>campanile</figcaption>
                    </figure>

                    <figure className="image-card">
                        <img src="/cs180proj5/a1.1/campanile_noise250.png" alt="" className="smallimg" />
                        <figcaption>campanile_noise250</figcaption>
                    </figure>

                    <figure className="image-card">
                        <img src="/cs180proj5/a1.3/250.png" alt="" className="smallimg" />
                        <figcaption>one-step_denoised250</figcaption>
                    </figure>
                </div>
                <div className="three-row">
                    <figure className="image-card">
                        <img src="/cs180proj5/a1.1/campanile_noise0.png" alt="" className="smallimg" />
                        <figcaption>campanile</figcaption>
                    </figure>

                    <figure className="image-card">
                        <img src="/cs180proj5/a1.1/campanile_noise500.png" alt="" className="smallimg" />
                        <figcaption>campanile_noise500</figcaption>
                    </figure>

                    <figure className="image-card">
                        <img src="/cs180proj5/a1.3/500.png" alt="" className="smallimg" />
                        <figcaption>one-step_denoised500</figcaption>
                    </figure>
                </div>
                <div className="three-row">
                    <figure className="image-card">
                        <img src="/cs180proj5/a1.1/campanile_noise0.png" alt="" className="smallimg" />
                        <figcaption>campanile</figcaption>
                    </figure>

                    <figure className="image-card">
                        <img src="/cs180proj5/a1.1/campanile_noise750.png" alt="" className="smallimg" />
                        <figcaption>campanile_noise750</figcaption>
                    </figure>

                    <figure className="image-card">
                        <img src="/cs180proj5/a1.3/750.png" alt="" className="smallimg" />
                        <figcaption>one-step_denoised750</figcaption>
                    </figure>
                </div>
          </div>
        </section>

        <section className="section block">
          <div className='section-intro'>
            <h2 id="A1.4">1.4: Iterative Denoising</h2>
            <p>We implement iterative denoising in this part, where the diffusion model will gradually remove noise by stepping through a set of timesteps from 990 to 0 with a stride of 30 instead of running all 1000 steps. At each step, the UNet predicts both the cleaner image component and the noise component, so that we can update the image using the given formula and progressively recover the campanile. </p>
             <img src="/cs180proj5/a1.4/formula.png" alt="" className="smallimg" />
            <p>Compared to one-step denoising or Gaussian blur, this approach produces a much cleaner and more realistic reconstruction even when starting from heavily noised images. This is because we are trying to iteratively push x<sub>0</sub> closer to one spcific data point in the entire population as illustrated in discussion, which also makes the result from iterative denoising less blurry.</p>
            <h5>Parameters</h5>
            <ul>
              <li>i_start = 10</li>
            </ul>

            <p>Below is the noisy campanile at every 5th loop of denoising:</p>
            <div className="five-row">
                 <figure className="image-card">
                    <img src="/cs180proj5/a1.4/690.png" alt="" className="smallimg" />
                    <figcaption>690</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.4/540.png" alt="" className="smallimg" />
                    <figcaption>540</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.4/390.png" alt="" className="smallimg" />
                    <figcaption>390</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.4/240.png" alt="" className="smallimg" />
                    <figcaption>240</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.4/90.png" alt="" className="smallimg" />
                    <figcaption>90</figcaption>
                </figure>
            </div>

            <p>Final output:</p>

            <div className="four-row">
                <figure className="image-card">
                  <img src="/cs180proj5/a1.1/campanile_noise0.png" alt="" className="smallimg" />
                  <figcaption>campanile</figcaption>
                </figure>

                 <figure className="image-card">
                    <img src="/cs180proj5/a1.4/iterative_final.png" alt="" className="smallimg" />
                    <figcaption>iterative_denoising_final</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.4/one_step_final.png" alt="" className="smallimg" />
                    <figcaption>one_step_denoising_final</figcaption>
                </figure>

                 <figure className="image-card">
                    <img src="/cs180proj5/a1.4/gaussian_final.png" alt="" className="smallimg" />
                    <figcaption>gaussian_denoising_final</figcaption>
                </figure>
            </div>

          </div>
        </section>

         <section className="section block">
          <div className='section-intro'>
            <h2 id="A1.5">1.5 Diffusion Model Sampling</h2>
            <p>Now we use the diffusion model to denoise an image. We will iteratively denoise pure noise and generate images from scratch. </p>
            <h5>Prompt and Parameters</h5>
            <ul>
              <li>prompt: "a high quality photo"</li>
              <li>i_start = 0</li>
            </ul>
            <div className="five-row">
                <figure className="image-card">
                    <img src="/cs180proj5/a1.5/sample_0.png" alt="" className="smallimg" />
                    <figcaption>sample_1</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.5/sample_1.png" alt="" className="smallimg" />
                    <figcaption>sample_2</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.5/sample_2.png" alt="" className="smallimg" />
                    <figcaption>sample_3</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.5/sample_3.png" alt="" className="smallimg" />
                    <figcaption>sample_4</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.5/sample_4.png" alt="" className="smallimg" />
                    <figcaption>sample_5</figcaption>
                </figure>
            </div>
          </div>
        </section>

         <section className="section block">
          <div className='section-intro'>
            <h2 id="A1.6">1.6: Classifier-Free Guidance (CFG)</h2>
            <p>We will improve image quality using Classifier-Free Guidance, where the UNet predicts two noise estimates (one being conditioned on a text prompt and one being unconditional). By combining them with a guidance scale = 7 , we can amplify the influence of the prompt to produce sharper, more realistic images than what are produced in the previous part. The iterative denoising process will now use both predictions, giving a much higher quality image generations compared to unguided and one-step denoising.</p>
            <p>The noise that we use follow the below formula:</p>
            <img src="/cs180proj5/a1.6/formula.png" alt="" className="smallimg" />
            <h4>Prompts and Parameters</h4>
            <ul>
                <li>prompt (conditional): "a high quality photo"</li>
                <li>prompt (unconditional): ""</li>
                <li>scale = 7</li>
            </ul>
             <div className="five-row">
                <figure className="image-card">
                    <img src="/cs180proj5/a1.6/sample_0.png" alt="" className="smallimg" />
                    <figcaption>sample_1</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.6/sample_1.png" alt="" className="smallimg" />
                    <figcaption>sample_2</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.6/sample_2.png" alt="" className="smallimg" />
                    <figcaption>sample_3</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.6/sample_3.png" alt="" className="smallimg" />
                    <figcaption>sample_4</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.6/sample_4.png" alt="" className="smallimg" />
                    <figcaption>sample_5</figcaption>
                </figure>
            </div>
          </div>
        </section>
        
         <section className="section block">
          <div className='section-intro'>
            <h2 id="A1.7">1.7: Image-to-image Translation</h2>
            <p>We will noise the original campanile image lightly and then iteratively denoise it using CFG as demonstarted in the previous parts to project it back onto the natural image manifold. Different starting noise levels (1, 3, 5, 7, 10, 20) can produce different edits. Applying the same procedure shows noising and CFG denoising can generate smooth and realistic edits while also preserving the overall structure of the input images.</p>
             <h4>Prompts and Parameters</h4>
            <ul>
                <li>prompt (conditional): "a high quality photo"</li>
                <li>scale = 7</li>
            </ul>
            <h4>Campanile</h4>
            <div className="seven-row">
                <figure className="image-card">
                    <img src="/cs180proj5/a1.1/campanile_noise0.png" alt="" className="smallimg" />
                    <figcaption>campanile_original</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7/campanile_noise_level_1.png" alt="" className="smallimg" />
                    <figcaption>campanile_i_start=1</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7/campanile_noise_level_3.png" alt="" className="smallimg" />
                    <figcaption>campanile_i_start=3</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7/campanile_noise_level_5.png" alt="" className="smallimg" />
                    <figcaption>campanile_i_start=5</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7/campanile_noise_level_7.png" alt="" className="smallimg" />
                    <figcaption>campanile_i_start=7</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7/campanile_noise_level_10.png" alt="" className="smallimg" />
                    <figcaption>campanile_i_start=10</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7/campanile_noise_level_20.png" alt="" className="smallimg" />
                    <figcaption>campanile_i_start=20</figcaption>
                </figure>
            </div>
            <h4>Tissue Box</h4>
            <div className="seven-row">
                <figure className="image-card">
                    <img src="/cs180proj5/a1.7/tissue_box.jpg" alt="" className="smallimg" />
                    <figcaption>tissue_box_original</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7/tissue_noise_level_1.png" alt="" className="smallimg" />
                    <figcaption>tissue_box_i_start=1</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7/tissue_noise_level_3.png" alt="" className="smallimg" />
                    <figcaption>tissue_box_i_start=3</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7/tissue_noise_level_5.png" alt="" className="smallimg" />
                    <figcaption>tissue_box_i_start=5</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7/tissue_noise_level_7.png" alt="" className="smallimg" />
                    <figcaption>tissue_box_i_start=7</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7/tissue_noise_level_10.png" alt="" className="smallimg" />
                    <figcaption>tissue_box_i_start=10</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7/tissue_noise_level_20.png" alt="" className="smallimg" />
                    <figcaption>tissue_box_i_start=20</figcaption>
                </figure>
            </div>
            <h4>Pumpkin</h4>
            <div className="seven-row">
                <figure className="image-card">
                    <img src="/cs180proj5/a1.7/pumpkin.jpg" alt="" className="smallimg" />
                    <figcaption>pumpkin_original</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7/pumpkin_noise_level_1.png" alt="" className="smallimg" />
                    <figcaption>pumpkin_i_start=1</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7/pumpkin_noise_level_3.png" alt="" className="smallimg" />
                    <figcaption>pumpkin_i_start=3</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7/pumpkin_noise_level_5.png" alt="" className="smallimg" />
                    <figcaption>pumpkin_i_start=5</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7/pumpkin_noise_level_7.png" alt="" className="smallimg" />
                    <figcaption>pumpkin_i_start=7</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7/pumpkin_noise_level_10.png" alt="" className="smallimg" />
                    <figcaption>pumpkin_i_start=10</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7/pumpkin_noise_level_20.png" alt="" className="smallimg" />
                    <figcaption>pumpkin_i_start=20</figcaption>
                </figure>
            </div>
            <p>From the outputs, we can see that the more noise we add, the larger the edit there will be to the output images. When the edits are greater, the model produces creative images that may not look like the original input images. However, when the noise added is little, it will produce edits that have structures that are very similar to the  original input images.</p>
            
          </div>
        </section>

         <section className="section block">
          <div className='section-intro'>
            <h2>1.7.1: Editing Hand-Drawn and Web Images</h2>
            <p>This section is to show the same procedure works particularly well if we start with a nonrealistic image and project it onto the natural image manifold.</p>
            <h4>Web Image (Avocado)</h4>
            <div className="seven-row">
                <figure className="image-card">
                    <img src="/cs180proj5/a1.7.1/web_im.jpg" alt="" className="smallimg" />
                    <figcaption>avocado_original</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7.1/web_im_1.png" alt="" className="smallimg" />
                    <figcaption>avocado_i_start=1</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7.1/web_im_3.png" alt="" className="smallimg" />
                    <figcaption>avocado_i_start=3</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7.1/web_im_5.png" alt="" className="smallimg" />
                    <figcaption>avocado_i_start=5</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7.1/web_im_7.png" alt="" className="smallimg" />
                    <figcaption>avocado_i_start=7</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7.1/web_im_10.png" alt="" className="smallimg" />
                    <figcaption>avocado_i_start=10</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7.1/web_im_20.png" alt="" className="smallimg" />
                    <figcaption>avocado_i_start=20</figcaption>
                </figure>
            </div>
            <h4>Web Image (White Cat)</h4>
            <div className="seven-row">
                <figure className="image-card">
                    <img src="/cs180proj5/a1.7.1/cat.png" alt="" className="smallimg" />
                    <figcaption>cat_original</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7.1/cat1.png" alt="" className="smallimg" />
                    <figcaption>cat_i_start=1</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7.1/cat3.png" alt="" className="smallimg" />
                    <figcaption>cat_i_start=3</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7.1/cat5.png" alt="" className="smallimg" />
                    <figcaption>cat_i_start=5</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7.1/cat7.png" alt="" className="smallimg" />
                    <figcaption>cat_i_start=7</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7.1/cat10.png" alt="" className="smallimg" />
                    <figcaption>cat_i_start=10</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7.1/cat20.png" alt="" className="smallimg" />
                    <figcaption>cat_i_start=20</figcaption>
                </figure>
            </div>
            <h4>Drawing 1</h4>
            <div className="seven-row">
                <figure className="image-card">
                    <img src="/cs180proj5/a1.7.1/drawing1.jpg" alt="" className="smallimg" />
                    <figcaption>drawing1_original</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7.1/drawing1_1.png" alt="" className="smallimg" />
                    <figcaption>drawing1_i_start=1</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7.1/drawing1_3.png" alt="" className="smallimg" />
                    <figcaption>drawing1_i_start=3</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7.1/drawing1_5.png" alt="" className="smallimg" />
                    <figcaption>drawing1_i_start=5</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7.1/drawing1_7.png" alt="" className="smallimg" />
                    <figcaption>drawing1_i_start=7</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7.1/drawing1_10.png" alt="" className="smallimg" />
                    <figcaption>drawing1_i_start=10</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7.1/drawing1_20.png" alt="" className="smallimg" />
                    <figcaption>drawing1_i_start=20</figcaption>
                </figure>
            </div>
            <h4>Drawing 2</h4>
            <div className="seven-row">
                <figure className="image-card">
                    <img src="/cs180proj5/a1.7.1/drawing2.jpg" alt="" className="smallimg" />
                    <figcaption>drawing2_original</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7.1/drawing2_1.png" alt="" className="smallimg" />
                    <figcaption>drawing2_i_start=1</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7.1/drawing2_3.png" alt="" className="smallimg" />
                    <figcaption>drawing2_i_start=3</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7.1/drawing2_5.png" alt="" className="smallimg" />
                    <figcaption>drawing2_i_start=5</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7.1/drawing2_7.png" alt="" className="smallimg" />
                    <figcaption>drawing2_i_start=7</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7.1/drawing2_10.png" alt="" className="smallimg" />
                    <figcaption>drawing2_i_start=10</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7.1/drawing2_20.png" alt="" className="smallimg" />
                    <figcaption>drawing2_i_start=20</figcaption>
                </figure>
            </div>
            
          </div>
        </section>

         <section className="section block">
          <div className='section-intro'>
            <h2>1.7.2: Inpainting</h2>
            <p>We will use the same iterative CFG denoising procedure to perform inpainting of input images, where a binary mask indicates which regions should be regenerated and which regions should remain unchanged. During each denoising step, the model updates the entire image, but we force the unmasked region to look like the original input image to ensure that only the masked area is filled in. Using this method, we will inpaint the top of the campanile and apply the same technique using custom masks to produce edits on other images.</p>
            <p>The equation:</p>
            <img src="/cs180proj5/a1.7.2/formula.png" alt="" className="smallimg" />
            <h4>Campanile</h4>
            <div className="four-row">
                <figure className="image-card">
                    <img src="/cs180proj5/a1.7.2/camp.png" alt="" className="smallimg" />
                    <figcaption>Campanile</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7.2/camp_mask.png" alt="" className="smallimg" />
                    <figcaption>Mask</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7.2/camp_to_replace.png" alt="" className="smallimg" />
                    <figcaption>Hole to Fill</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7.2/camp_inpainted.png" alt="" className="smallimg" />
                    <figcaption>Campanile Inpainted</figcaption>
                </figure>
            </div>

            <h4>Pumpkin</h4>
            <div className="four-row">
                <figure className="image-card">
                    <img src="/cs180proj5/a1.7.2/pump.png" alt="" className="smallimg" />
                    <figcaption>Pumpkin</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7.2/pump_mask.png" alt="" className="smallimg" />
                    <figcaption>Mask</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7.2/pump_to_replace.png" alt="" className="smallimg" />
                    <figcaption>Hole to Fill</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7.2/pump_inpainted.png" alt="" className="smallimg" />
                    <figcaption>Pumpkin Inpainted</figcaption>
                </figure>
            </div>

            <h4>Calculator</h4>
            <div className="four-row">
                <figure className="image-card">
                    <img src="/cs180proj5/a1.7.2/calculator.png" alt="" className="smallimg" />
                    <figcaption>Calculator</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7.2/calculator_mask.png" alt="" className="smallimg" />
                    <figcaption>Mask</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7.2/calculator_to_replace.png" alt="" className="smallimg" />
                    <figcaption>Hole to Fill</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7.2/calculator_inpainted.png" alt="" className="smallimg" />
                    <figcaption>Calculator Inpainted</figcaption>
                </figure>
            </div>
            
          </div>
        </section>

        <section className="section block">
          <div className='section-intro'>
            <h2>1.7.3: Text-Conditional Image-to-image Translation</h2>
            <p>We use the same method with text prompts so that we can guide the projection with a text prompt by adding control using language.</p>
            <h4>Campanile</h4>
            <ul>
                <li>prompt: "a rocket ship"</li>
            </ul>
            <div className="seven-row">
                <figure className="image-card">
                    <img src="/cs180proj5/a1.7.3/rocket_ship_1.png" alt="" className="smallimg" />
                    <figcaption>i_start=1</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7.3/rocket_ship_3.png" alt="" className="smallimg" />
                    <figcaption>i_start=3</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7.3/rocket_ship_5.png" alt="" className="smallimg" />
                    <figcaption>i_start=5</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7.3/rocket_ship_7.png" alt="" className="smallimg" />
                    <figcaption>i_start=7</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7.3/rocket_ship_10.png" alt="" className="smallimg" />
                    <figcaption>i_start=10</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7.3/rocket_ship_20.png" alt="" className="smallimg" />
                    <figcaption>i_start=20</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7.3/camp.png" alt="" className="smallimg" />
                    <figcaption>Campanile</figcaption>
                </figure>
            </div>

            <h4>Pumpkin</h4>
             <ul>
                <li>prompt: "a pumpkin monster in halloween city"</li>
            </ul>
            <div className="seven-row">
                <figure className="image-card">
                    <img src="/cs180proj5/a1.7.3/halloween_1.png" alt="" className="smallimg" />
                    <figcaption>i_start=1</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7.3/halloween_3.png" alt="" className="smallimg" />
                    <figcaption>i_start=3</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7.3/halloween_5.png" alt="" className="smallimg" />
                    <figcaption>i_start=5</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7.3/halloween_7.png" alt="" className="smallimg" />
                    <figcaption>i_start=7</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7.3/halloween_10.png" alt="" className="smallimg" />
                    <figcaption>i_start=10</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7.3/halloween_20.png" alt="" className="smallimg" />
                    <figcaption>i_start=20</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7.3/pump.png" alt="" className="smallimg" />
                    <figcaption>Pumpkin</figcaption>
                </figure>
            </div>

            <h4>Calculator</h4>
             <ul>
                <li>prompt: "calculator with an image displayed on its screen"</li>
            </ul>
            <div className="seven-row">
                <figure className="image-card">
                    <img src="/cs180proj5/a1.7.3/calculator_1.png" alt="" className="smallimg" />
                    <figcaption>i_start=1</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7.3/calculator_3.png" alt="" className="smallimg" />
                    <figcaption>i_start=3</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7.3/calculator_5.png" alt="" className="smallimg" />
                    <figcaption>i_start=5</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7.3/calculator_7.png" alt="" className="smallimg" />
                    <figcaption>i_start=7</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7.3/calculator_10.png" alt="" className="smallimg" />
                    <figcaption>i_start=10</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7.3/calculator_20.png" alt="" className="smallimg" />
                    <figcaption>i_start=20</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/a1.7.3/calculator.png" alt="" className="smallimg" />
                    <figcaption>Calculator</figcaption>
                </figure>
            </div>
          </div>
        </section>

         <section className="section block">
          <div className='section-intro'>
            <h2 id="A1.8">1.8: Visual Anagrams</h2>
            <p>In this part, we want to use diffusion model to create optical illusions that look like one image upright and a different image upside down. At each denoising step, we will first denoise the current image with prompt 1, flip the image vertically and denoise with prompt 2, then flip that result back and average the two noise estimates before applying the update. By repeating this process over many timesteps, the model learns produce a single image that satisfies prompt 1 in one orientation and prompt 2 when flipped to produce visual anagrams.</p>
            <p>Noise estimate is calculated as follows:</p>
            <img src="/cs180proj5/a1.8/formula.png" alt="" className="smallimg" />
            <h4>Sample Anagram</h4>
            <ul>
                <li>prompt 1: "an oil painting of an old man"</li>
                <li>prompt 2: "an oil painting of people around a campfire"</li>
            </ul>
            <img src="/cs180proj5/a1.8/sample_anagram.png" alt="" className="smallimg" />

            <h4>Anagram 1</h4>
            <ul>
                <li>prompt 1: "an oil painting of a snowy mountain village"</li>
                <li>prompt 2: "a man wearing a hat"</li>
            </ul>
            <img src="/cs180proj5/a1.8/custom_anagram1.png" alt="" className="smallimg" />

            <h4>Anagram 2</h4>
            <ul>
                <li>prompt 1: "an oil painting of a panda"</li>
                <li>prompt 2: "an oil painting of an old woman"</li>
            </ul>
            <img src="/cs180proj5/a1.8/custom_anagram2.png" alt="" className="smallimg" />

          </div>
        </section>

         <section className="section block">
          <div className='section-intro'>
            <h2 id="A1.9">1.9: Hybrid Images</h2>
            <p>We will merge the low-frequency content from one prompt with the high frequency details from another prompt. At each denoising step, we generate two noise estimates (one being conditioned on prompt 1 and one being conditioned on prompt 2). We apply a Gaussian blur (low pass filter) to extract low frequencies from the first image and a high pass filter to extract high frequency details from the second image, then combine them into a composite noise estimate used for the update. Repeating this process produces hybrid images.</p>
            <p>Noise estimate is calculated as follows:</p>
            <img src="/cs180proj5/a1.9/formula.png" alt="" className="smallimg" />
            <h4>Sample Hybrid</h4>
            <ul>
                <li>prompt 1: "a lithograph of a skull"</li>
                <li>prompt 2: "a lithograph of waterfalls"</li>
            </ul>
            <img src="/cs180proj5/a1.9/skull_waterfall.png" alt="" className="smallimg" />

            <h4>Hybrid 1</h4>
            <ul>
                <li>prompt 1: "a lithograph of waterfalls"</li>
                <li>prompt 2: "a lithograph of a pig"</li>
            </ul>
            <img src="/cs180proj5/a1.9/waterfall_pig.png" alt="" className="smallimg" />

            <h4>Hybrid 2</h4>
            <ul>
                <li>prompt 1: "a lithograph of a skull"</li>
                <li>prompt 2: "a painting of a deer"</li>
            </ul>
            <img src="/cs180proj5/a1.9/skull_deer.png" alt="" className="smallimg" />

            <h4>Hybrid 3</h4>
            <ul>
                <li>prompt 1: "a photo of a puppy"</li>
                <li>prompt 2: "a painting of a deer"</li>
            </ul>
            <img src="/cs180proj5/a1.9/puppy_deer.png" alt="" className="smallimg" />

          </div>
        </section>

         <section className="section block">
          <div className='section-intro'>
            <h2 id="B">Part B: Flow Matching from Scratch</h2>
            <p>This part works with training our own flow matching models on MNIST.</p>
          </div>
        </section>

        <section className="section block">
          <div className='section-intro'>
            <h2 id="B1">Part 1: Training a Single-Step Denoising UNet</h2>
            <p>This part works with training our own flow matching models on MNIST.</p>
          </div>
        </section>

        <section className="section block">
          <div className='section-intro'>
            <h2 id="B1.1">1.1: Implementing the UNet</h2>
            <p>The denoiser is implemeted with a UNet (unconditional) with the following model architecture. This model takes in a noisy input image (shape: 1x28x28) and output a denoised image (shape: 1x28x28) that has a digit like those in the MNIST dataset.</p>
            <img src="/cs180proj5/b/1.1_unconditional.png" alt="" className="bigimg" />
            <img src="/cs180proj5/b/1.1_standard.png" alt="" className="bigimg" />
          </div>
        </section>

        <section className="section block">
          <div className='section-intro'>
            <h2 id="B1.2">1.2: Using the UNet to Train a Denoiser</h2>
            <p>We want to learn a denoiser that maps a noisy MNIST digit back to its clean version by minimizing the L2 loss. We will start from clean images and then add noise to these clean images using the following noising process with different noise value σ.</p>
            <img src="/cs180proj5/b/1.2_formula.png" alt="" className="smallimg" />
            
            <p>A visualization of the noising process with σ = [0.0, 0.2, 0.4, 0.5, 0.6, 0.8, 1.0]:</p>
            <img src="/cs180proj5/b/1.2_noisy_minist_with_titles.jpg" alt="" className="bigimg" />
          </div>
        </section>


        <section className="section block">
          <div className='section-intro'>
            <h2>1.2.1: Training</h2>
            <ul>
                <li>noise level = 0.5</li>
                <li>dataset: torchvision.datasets.MNIST</li>
                <li>batch size: 256</li>
                <li>shuffle: True</li>
                <li>epochs: 5</li>
                <li>hidden dimension: D = 128</li>
                <li>learning rate: 1e-4</li>
                <li>Loss: L2</li>
                 <img src="/cs180proj5/b/1.2_l2loss.png" alt="" className="smallimg" />
            </ul>
            <h4>Training Loss Curve</h4>
            <div className="two-row">
              <figure className="image-card">
                <img src="/cs180proj5/b/1.2.1_training_loss.jpg" alt="" className="mediumimg" />
              </figure>

              <figure className="image-card">
                <img src="/cs180proj5/b/1.2.1_training_loss_iter.jpg" alt="" className="mediumimg" />
              </figure>
            </div>

            <h4>Samples</h4>
            <div className="two-row">
                <figure className="image-card">
                    <img src="/cs180proj5/b/1.2.1_training_outputs_epoch1.jpg" alt="" className="bigimg" />
                    <figcaption>sample1_epoch1</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/b/1.2.1_training_outputs_epoch5.jpg" alt="" className="bigimg" />
                    <figcaption>sample1_epoch5</figcaption>
                </figure>
            </div>

            <div className="two-row">
                <figure className="image-card">
                    <img src="/cs180proj5/b/1.2.1_training_outputs_epoch1_sample1.jpg" alt="" className="bigimg" />
                    <figcaption>sample2_epoch1</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/b/1.2.1_training_outputs_epoch5_sample1.jpg" alt="" className="bigimg" />
                    <figcaption>sample2_epoch5</figcaption>
                </figure>
            </div>

            <div className="two-row">
                <figure className="image-card">
                    <img src="/cs180proj5/b/1.2.1_training_outputs_epoch1_sample2.jpg" alt="" className="bigimg" />
                    <figcaption>sample3_epoch1</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/b/1.2.1_training_outputs_epoch5_sample2.jpg" alt="" className="bigimg" />
                    <figcaption>sample3_epoch5</figcaption>
                </figure>
            </div>
            <p>The model works very well and the samples at both epoch 1 and epoch 5 look very clear.</p>
    
          </div>
        </section>

        <section className="section block">
          <div className='section-intro'>
            <h2>1.2.2: Out-of-Distribution Testing</h2>
            <p>Now we look at the denoiser output when different noise levels are applied to the clean input images.</p>
            <img src="/cs180proj5/b/1.2.2_Out-of-Distribution_Testing_sigma_0.0.jpg" alt="" className="bigimg" />
            <img src="/cs180proj5/b/1.2.2_Out-of-Distribution_Testing_sigma_0.2.jpg" alt="" className="bigimg" />
            <img src="/cs180proj5/b/1.2.2_Out-of-Distribution_Testing_sigma_0.4.jpg" alt="" className="bigimg" />
            <img src="/cs180proj5/b/1.2.2_Out-of-Distribution_Testing_sigma_0.5.jpg" alt="" className="bigimg" />
            <img src="/cs180proj5/b/1.2.2_Out-of-Distribution_Testing_sigma_0.6.jpg" alt="" className="bigimg" />
            <img src="/cs180proj5/b/1.2.2_Out-of-Distribution_Testing_sigma_0.8.jpg" alt="" className="bigimg" />
            <img src="/cs180proj5/b/1.2.2_Out-of-Distribution_Testing_sigma_1.0.jpg" alt="" className="bigimg" />
            <p>It is expected that as the noise level increases, the denoiser will output digits that have less distinct structures with blurry outlines.</p>
          </div>
        </section>
        
         <section className="section block">
          <div className='section-intro'>
            <h2>1.2.3 Denoising Pure Noise</h2>
            <p>We will train the denoiser using pure Gaussian noise as input images so the model learns to map noise directly to MNIST digits.</p>
            <h4>Training Loss Curve</h4>
            <div className="two-row">
                <figure className="image-card">
                  <img src="/cs180proj5/b/1.2.3_pure_noise_training_loss.jpg" alt="" className="mediumimg" />
                </figure>
                <figure className="image-card">
                  <img src="/cs180proj5/b/1.2.3_pure_noise_training_loss_iter.jpg" alt="" className="mediumimg" /> 
                </figure>
            </div>
            <h4>Samples</h4>
            <div className="two-row">
                <figure className="image-card">
                    <img src="/cs180proj5/b/1.2.3_training_pure_noise_epoch1.jpg" alt="" className="bigimg" />
                    <figcaption>sample1_epoch1</figcaption>
                </figure>

                <figure className="image-card">
                    <img src="/cs180proj5/b/1.2.3_training_pure_noise_epoch5.jpg" alt="" className="bigimg" />
                    <figcaption>sample1_epoch5</figcaption>
                </figure>
            </div>
            <h4>Observed Patterns</h4>
            <p>As the number of epochs increases, the predicted output digit looks clearer. The denoiser trained on pure noise learns to output blurry, faint digit-like structures but without any clear digit patterns. This happens because the training pairs map random noise to real MNIST digits and the network only minimizes MSE by learning the average structure of the dataset rather than reconstructing a specific digit. Consequently, the outputs will look like smoothed out mixtures of digits 0-9 with very faint loops and curves rather than clean reconstructions. The model only captures the global statistics of MNIST datasets and does not act like a true denoiser that can denoise to output clear digits.</p>
          </div>
        </section>

         <section className="section block">
          <div className='section-intro'>
            <h2 id="B2">Part 2: Training a Flow Matching Model</h2>
            <p>We will do iterative denoising using flow matching, where the model learns the velocity field that moves a noisy sample image towards a clean image over a continuous time parameter t. We do so by generating intermediate samples by linearly interpolating between pure noise x<sub>0</sub> and clean data x<sub>1</sub> to get x<sub>t</sub>, then we will compute the true flow that is the derivative of this interpolation with respect to time. The UNet is trained to approximate this flow field in order for us to iteratively update a noisy image along the flow towards the clean data distribution.</p>
          </div>
        </section>

        <section className="section block">
          <div className='section-intro'>
            <h2 id="B2.1">2.1: Adding Time Conditioning to UNet</h2>
            <p>With almost the same model architecture, we will now inject a scalar t through 2 FCB blocks into the UNet.</p>
           <img src="/cs180proj5/b/2.1_unconditional.png" alt="" className="bigimg" />
            <img src="/cs180proj5/b/2.1fcb.png" alt="" className="bigimg" />
          </div>
        </section>

         <section className="section block">
          <div className='section-intro'>
            <h2 id="B2.2">2.2: Training the UNet</h2>
            <p>We want the UNet to predict the flow that moves a noisy image towards a clean image. At each step, the UNet samples a clean image x<sub>1</sub>, a noisy image x<sub>0</sub>, and an interpolated image x<sub>t</sub>. We then update the model by minimizing the L2 loss between the true flow and the model's predicted flow.</p>
            <p>We use the following algorithm:</p>
            <img src="/cs180proj5/b/2.2algo.png" alt="" className="mediumimg" />
            <ul>
                <li>noise level = 0.5</li>
                <li>dataset: torchvision.datasets.MNIST</li>
                <li>batch size: 64</li>
                <li>shuffle: True</li>
                <li>epochs: 5</li>
                <li>hidden dimension: D = 64</li>
                <li>learning rate: 1e-4</li>
                <li>scheduler gamme: 0.1 ** (1.0 / num_epochs)</li>
                <li>Loss:</li>
                <img src="/cs180proj5/b/2_l2loss.png" alt="" className="mediumimg" />
            </ul>
            <h4>Training Loss Curve</h4>
            <div className="two-row">
              <figure className="image-card">
                  <img src="/cs180proj5/b/2.2_tcunet_training_loss.jpg" alt="" className="mediumimg" />
                </figure>
                <figure className="image-card">
                  <img src="/cs180proj5/b/2.2_tcunet_training_loss_iter.jpg" alt="" className="mediumimg" />
              </figure>
            </div>
          </div>
        </section>

        <section className="section block">
          <div className='section-intro'>
            <h2 id="B2.3">2.3: Sampling from the UNet</h2>
            <p>We use the following algorithm to do sampling:</p>
            <img src="/cs180proj5/b/2.3_algo.png" alt="" className="mediumimg" />
            <h4>Epoch 1</h4>
           <img src="/cs180proj5/b/2.3_x_epoch1.jpg" alt="" className="mediumimg" />
           <h4>Epoch 5</h4>
           <img src="/cs180proj5/b/2.3_x_epoch5.jpg" alt="" className="mediumimg" />
           <h4>Epoch 10</h4>
           <img src="/cs180proj5/b/2.3_x_epoch10.jpg" alt="" className="mediumimg" />
            <p>As number of epochs increases, the predicted digits look clearer and more structurelly distinct. However, it is still hard to tell what digits they are in the final samples at epoch 5.</p>
          </div>
        </section>

         <section className="section block">
          <div className='section-intro'>
            <h2 id="B2.4">2.4: Adding Class-Conditioning to UNet</h2>
           <p>We want to have more class-controlled generation, so the UNet will need to be additionally conditioned on a one-hot class vector for digits 0-9 on top of the time embedding. This is doen by adding 2 extra FCBlocks into the UNet's intermediate features in a way similar to how time conditioning is added. To ensure the model still works without class conditioning and allow for classifier-free guidance, the class vector is randomly dropped by setting it to zero for 10% of the time during training.</p>
          </div>
        </section>

         <section className="section block">
          <div className='section-intro'>
            <h2 id="B2.5">2.5: Training the UNet</h2>
            <p>We use the following algorithm for training (similar to before but with slight modifications):</p>
            <img src="/cs180proj5/b/2.5_algo.png" alt="" className="mediumimg" />
           <h4>Training Loss Curve</h4>
           <div className="two-row">
            <img src="/cs180proj5/b/2.5_class_cunet_training_loss.jpg" alt="" className="mediumimg" />
            <img src="/cs180proj5/b/2.5_class_cunet_training_loss_iter.jpg" alt="" className="mediumimg" />
           </div>
           
          </div>
        </section>

        <section className="section block">
          <div className='section-intro'>
            <h2 id="B2.6">2.6: Sampling from the UNet</h2>
            <h3>Parameters</h3>
            <ul>
              <li>γ = 5.0</li>
            </ul>
            <p>We use the following algorithm for sampling:</p>
            <img src="/cs180proj5/b/2.6_algo.png" alt="" className="mediumimg" />
            <h3>With scheduler</h3>
            <h4>Epoch 1</h4>
            <img src="/cs180proj5/b/2.6_x_epoch1.jpg" alt="" className="mediumimg" />
            <h4>Epoch 5</h4>
            <img src="/cs180proj5/b/2.6_x_epoch5.jpg" alt="" className="mediumimg" />
            <h4>Epoch 10</h4>
            <img src="/cs180proj5/b/2.6_x_epoch10.jpg" alt="" className="mediumimg" />
            <h3>No scheduler</h3>
            <h4>Epoch 1</h4>
            <img src="/cs180proj5/b/2.6_x_epoch1_no_scheduler.jpg" alt="" className="mediumimg" />
            <h4>Epoch 5</h4>
            <img src="/cs180proj5/b/2.6_x_epoch5_no_scheduler.jpg" alt="" className="mediumimg" />
            <h4>Epoch 10</h4>
            <img src="/cs180proj5/b/2.6_x_epoch10_no_scheduler.jpg" alt="" className="mediumimg" />
            <p>I did not do anything extra to compensate the removal of the learning rate scheduler and the final output still look very good without the scheduler. However, throughout all epochs, the digits for no scheduler tend to look slightly thicker in their strokes than those digits with scheduler.</p>

            <p>The learning rate scheduler is used to make sure early training has a high learning rate and later training iterations have a lower learning rate to avoid big oscillations during gradient descent. The model should hence converge to cleaner digits with a scheduler. But for my outputs, there is no distict quality difference. It may be because the task of predicting digits is not very complex and the original learning rate is not extremely high that can cause oscillations during gradient descent.</p>
          </div>
        </section>
       
        
      </main>
    </div>
  );
};

export default CS180Proj5;
